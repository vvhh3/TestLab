import cors from 'cors'
import express, { Request, Response } from 'express'
import { Resend } from 'resend'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 4000
const resend = new Resend(process.env.RESEND_API_KEY)
const AI_API_BASE = process.env.AI_API_BASE ?? 'https://openrouter.ai/api/v1'

app.use(cors({ origin: '*' }))
app.use(express.json())

const escapeHtml = (s: string) =>
  s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
   .replaceAll('"','&quot;').replaceAll("'",'&#039;')

interface Message { role: 'system' | 'user' | 'assistant'; content: string }

const getFreeModels = async (apiKey: string): Promise<string[]> => {
  const res = await fetch(`${AI_API_BASE}/models`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  if (!res.ok) return []
  const { data } = await res.json() as { data: { id: string; pricing: { prompt: string } }[] }
  return data
    .filter(m => m.id.endsWith(':free') && parseFloat(m.pricing?.prompt) === 0)
    .map(m => m.id)
    .slice(0, 10)
}

const askAi = async (messages: Message[], maxTokens = 300): Promise<string | null> => {
  const apiKey = process.env.AI_API_KEY
  if (!apiKey) return null

  const models = await getFreeModels(apiKey).catch(() => [])
  if (!models.length) return null

  for (const model of models) {
    try {
      const res = await fetch(`${AI_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.FRONTEND_URL ?? 'http://localhost:5173',
        },
        body: JSON.stringify({ model, messages, max_tokens: maxTokens }),
      })
      if (!res.ok) { console.error(`[AI] ${model} → ${res.status}`); continue }
      const text = ((await res.json()) as any).choices?.[0]?.message?.content?.trim()
      if (text) { console.log(`[AI] ответил: ${model}`); return text }
    } catch { continue }
  }
  return null
}

const SYSTEM_PROMPT = `Ты — AI-ассистент на портфолио Матвея Александрова.
Отвечай кратко на русском. Не придумывай факты.
Имя: Матвей Александров, 18 лет. Город: Новокуйбышевск, готов к переезду в Самару/удалёнке.
Контакты: matveialex2007@gmail.com, tg: @ia_botik, github: github.com/vvhh3
Опыт: 1 год — Frontend-разработчик в Самарском колледже (React, TS, Tailwind, MUI, REST API, Node.js).
Стек: React, TypeScript, Next.js, Node.js, Express, PostgreSQL, Redux Toolkit, Zustand, Docker, Solidity.
Проекты: DeFi Dashboard (github.com/vvhh3/Credit), Telegram Dating Bot (github.com/vvhh3/DatingTgBot).
Достижения: 2-е место "Профессионалы" (блокчейн), топ-5 хакатон "Tender Hack".`

app.post('/api/contact', async (req: Request, res: Response) => {
  const { name, phone, email, comment } = req.body as Record<string, unknown>
  const fields = [name, phone, email, comment].map(v => String(v ?? '').trim())

  if (fields.some(f => !f))
    return res.status(400).json({ message: 'Заполните все поля' })

  const [n, p, e, c] = fields.map(escapeHtml)

  try {
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: 'matveialex2007@gmail.com',
      replyTo: e,
      subject: `Новая заявка от ${n}`,
      html: `<div style="font-family:Arial;padding:20px">
        <h2>Новая заявка</h2>
        <p><b>Имя:</b> ${n}</p><p><b>Телефон:</b> ${p}</p>
        <p><b>Email:</b> ${e}</p><p><b>Комментарий:</b><br>${c.replaceAll('\n','<br>')}</p>
      </div>`,
    })
    return res.json({ message: 'Сообщение отправлено' })
  } catch {
    return res.status(500).json({ message: 'Ошибка отправки' })
  }
})

app.post('/api/ai-chat', async (req: Request, res: Response) => {
  const message = String(req.body?.message ?? '').trim()
  if (!message) return res.status(400).json({ message: 'Сообщение пустое' })

  const reply = await askAi([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: message },
  ])

  return reply
    ? res.json({ reply })
    : res.status(502).json({ message: 'AI недоступен, попробуй позже' })
})

app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`))