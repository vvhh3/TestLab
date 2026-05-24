import cors from 'cors'
import express from 'express'
import { Resend } from 'resend'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const resend = new Resend(process.env.RESEND_API_KEY)
const API = process.env.AI_API_BASE ?? 'https://openrouter.ai/api/v1'
const KEY = () => process.env.AI_API_KEY ?? ''

app.use(cors({ origin: '*' }), express.json())

const esc = (s: string) =>
  s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]!))

const PROMPT = `Ты — AI-ассистент на портфолио Матвея Александрова.
Отвечай кратко на русском. Не придумывай факты.
Имя: Матвей Александров, 18 лет. Город: Новокуйбышевск, готов к переезду в Самару/удалёнке.
Контакты: matveialex2007@gmail.com, tg: @ia_botik, github: github.com/vvhh3
Опыт: 1 год — Frontend-разработчик в Самарском колледже (React, TS, Tailwind, MUI, REST API, Node.js).
Стек: React, TypeScript, Next.js, Node.js, Express, PostgreSQL, Redux Toolkit, Zustand, Docker, Solidity.
Проекты: DeFi Dashboard (github.com/vvhh3/Credit), Telegram Dating Bot (github.com/vvhh3/DatingTgBot).
Достижения: 2-е место "Профессионалы" (блокчейн), топ-5 хакатон "Tender Hack".`

type Msg = { role: 'system' | 'user' | 'assistant'; content: string }

async function askAi(messages: Msg[]): Promise<string | null> {
  const key = KEY()
  if (!key) return null

  const { data } = await fetch(`${API}/models`, {
    headers: { Authorization: `Bearer ${key}` },
  }).then(r => r.json()) as { data: { id: string; pricing: { prompt: string } }[] }

  const models = data
    ?.filter(m => m.id.endsWith(':free') && parseFloat(m.pricing?.prompt) === 0)
    .map(m => m.id)
    .slice(0, 10) ?? []

  for (const model of models) {
    try {
      const r = await fetch(`${API}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
          'HTTP-Referer': process.env.FRONTEND_URL ?? 'http://localhost:5173',
        },
        body: JSON.stringify({ model, messages, max_tokens: 300 }),
      })
      if (!r.ok) continue
      const json = await r.json() as { choices: { message: { content: string } }[] }
      const text = json.choices?.[0]?.message?.content?.trim()
      if (text) return text
    } catch { continue }
  }
  return null
}

app.post('/api/contact', async (req, res) => {
  console.log("🔥 ROUTE HIT /api/contact")
  const vals = ['name', 'phone', 'email', 'comment'].map(k => String(req.body?.[k] ?? '').trim())
  if (vals.some(v => !v)) return res.status(400).json({ message: 'Заполните все поля' })

  const [n, p, e, c] = vals.map(esc)

  try {

    const { data, error } = await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: 'matveialex2007@gmail.com',
      replyTo: e,
      subject: `Новая заявка от ${n}`,
      html: `<div style="font-family:Arial;padding:20px">
        <h2>Новая заявка</h2>
        <p><b>Имя:</b> ${n}</p><p><b>Телефон:</b> ${p}</p>
        <p><b>Email:</b> ${e}</p><p><b>Комментарий:</b><br>${c.replaceAll('\n', '<br>')}</p>
      </div>`,
    })

    if (error) {
      return res.status(500).json({
        message: 'Ошибка отправки'
      })
    }
    console.error({ data, error })
    return res.json({
      id: data.id,
      message: 'Сообщение отправлено'
    })

  } catch (e) {
    console.log("Ошибка отправки письма:", e)
    return res.status(500).json({ message: 'Ошибка отправки' })
  }
})

app.post('/api/ai-chat', async (req, res) => {
  const message = String(req.body?.message ?? '').trim()
  if (!message) return res.status(400).json({ message: 'Сообщение пустое' })

  const reply = await askAi([
    { role: 'system', content: PROMPT },
    { role: 'user', content: message },
  ])

  return reply
    ? res.json({ reply })
    : res.status(502).json({ message: 'AI недоступен, попробуй позже' })
})

app.listen(4000, () =>
  console.log(`Server: http://localhost:4000`))