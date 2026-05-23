import cors from 'cors'
import express, { Request, Response } from 'express'
import { Resend } from 'resend'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 4000

const resend = new Resend(process.env.RESEND_API_KEY)
const OWNER_EMAIL = 'matveialex2007@gmail.com'
const AI_API_BASE = process.env.AI_API_BASE ?? 'https://openrouter.ai/api/v1'

app.use(cors({ origin: '*' }))
app.use(express.json())

type ContactPayload = {
  name?: unknown
  phone?: unknown
  email?: unknown
  comment?: unknown
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}



const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const FALLBACK_MODELS = [
  'nousresearch/hermes-3-llama-3.1-405b:free',
  'liquid/lfm-7b:free',
  'nvidia/llama-3.1-nemotron-nano-8b-v1:free',
]

const fetchFreeModels = async (apiKey: string): Promise<string[]> => {
  try {
    const res = await fetch(`${AI_API_BASE}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!res.ok) return []

    const data = (await res.json()) as {
      data: { id: string; pricing: { prompt: string } }[]
    }

    return data.data
      .filter(
        (m) =>
          m.id.endsWith(':free') &&
          (parseFloat(m.pricing?.prompt) === 0 || m.pricing?.prompt === '0'),
      )
      .map((m) => m.id)
      .slice(0, 10)
  } catch {
    return []
  }
}

const callAiWithFallback = async (
  messages: ChatMessage[],
  maxTokens: number = 300,
): Promise<string | null> => {
  const apiKey = process.env.AI_API_KEY
  if (!apiKey) {
    console.error('[AI] AI_API_KEY не задан в .env')
    return null
  }

  let models = await fetchFreeModels(apiKey)
  if (models.length === 0) models = FALLBACK_MODELS

  console.log(`[AI] доступно ${models.length} бесплатных моделей`)

  for (const model of models) {
    try {
      const response = await fetch(`${AI_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'Developer Portfolio',
        },
        body: JSON.stringify({ model, messages, max_tokens: maxTokens }),
      })

      if (!response.ok) {
        const err = await response.text()
        console.error(`[AI] ${model} → ${response.status}`, err)
        continue
      }

      const data = (await response.json()) as {
        choices: { message: { content: string } }[]
      }

      const text = data.choices?.[0]?.message?.content?.trim()
      if (text) {
        console.log(`[AI] ответил: ${model}`)
        return text
      }
    } catch (err) {
      console.error(`[AI] ${model} → исключение:`, err)
    }
  }

  return null
}

app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const body = req.body as ContactPayload

    const name = String(body.name ?? '').trim()
    const phone = String(body.phone ?? '').trim()
    const email = String(body.email ?? '').trim()
    const comment = String(body.comment ?? '').trim()

    if (!name || !phone || !email || !comment) {
      return res.status(400).json({ message: 'Заполните все поля' })
    }

    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: OWNER_EMAIL,
      replyTo: email,
      subject: `Новая заявка от ${name}`,
      html: `
        <div style="font-family:Arial;padding:20px;">
          <h1>Новая заявка с сайта</h1>
          <p><b>Имя:</b> ${escapeHtml(name)}</p>
          <p><b>Телефон:</b> ${escapeHtml(phone)}</p>
          <p><b>Email:</b> ${escapeHtml(email)}</p>
          <p><b>Комментарий:</b></p>
          <p>${escapeHtml(comment).replaceAll('\n', '<br>')}</p>
        </div>
      `,
    })

    return res.status(200).json({ message: 'Сообщение успешно отправлено' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Ошибка отправки письма' })
  }
})

app.post('/api/ai-chat', async (req: Request, res: Response) => {
  const userMessage = String(req.body?.message ?? '').trim()

  if (!userMessage) {
    return res.status(400).json({ message: 'Сообщение пустое' })
  }

  const reply = await callAiWithFallback([
    {
      role: 'system',
      content: `Ты — AI-ассистент на портфолио разработчика Матвея Александрова.
Отвечай кратко и по делу на русском языке. Не придумывай факты сверх того что написано.

=== ЛИЧНОЕ ===
Имя: Матвей Александров
Возраст: 18 лет (31 июля 2007)
Город: Новокуйбышевск, готов к переезду в Самару, готов к удалённой работе
Email: matveialex2007@gmail.com
Телефон: +7 (987) 9452048
Telegram: @ia_botik
GitHub: https://github.com/vvhh3

=== ОПЫТ ===
1 год 1 месяц — Frontend-разработчик в ГАПОУ СО Самарский государственный колледж (май 2025 — май 2026):
- Адаптивная и кроссбраузерная вёрстка (Tailwind CSS, MUI, HTML, CSS)
- Личные кабинеты, формы, таблицы, фильтрация, пагинация
- Внутренние веб-приложения для автоматизации процессов колледжа
- Интеграция frontend с backend через REST API (Axios)
- Рефакторинг кода, отладка API
- Участие в разработке backend на Node.js и Express

=== ОБРАЗОВАНИЕ ===
Самарский Государственный Колледж — информационные системы и программирование (до 2027)

=== СТЕК ===
Frontend: React, TypeScript, JavaScript, HTML, CSS, Tailwind, MUI, Redux Toolkit, Zustand, TanStack Query, Axios, Next.js, anime.js, Bootstrap, Jest, Mocha
Backend: Node.js, Express, PostgreSQL, SQLite, Sequelize
Web3: Solidity, Hardhat, Ethers.js
Tools: Docker, Git, Figma, Docker Compose, .NET Core, C#

=== ПРОЕКТЫ ===
1. DeFi Protocol Dashboard (React, JavaScript, Solidity, Hardhat, Ethers.js, Ethereum)
   - Интерфейс для взаимодействия со смарт-контрактами
   - Отображение данных блокчейна в реальном времени
   - Dashboard для DeFi-протокола
   - GitHub: https://github.com/vvhh3/Credit

2. Telegram Bot для знакомств (TypeScript, Node.js, PostgreSQL, Railway)
   - Telegram-бот развёрнут на Railway
   - Хранение данных пользователей в PostgreSQL
   - Обработка медиафайлов
   - GitHub: https://github.com/vvhh3/DatingTgBot

=== ДОСТИЖЕНИЯ ===
- 2-е место на всероссийском чемпионате "Профессионалы" по компетенции "Разработка решений с использованием блокчейн технологий" (Ethereum, Hardhat, Ethers.js, Docker, Waves Enterprise, Solidity, real-time интерфейсы, dashboard)
- Топ-5 на хакатоне "Tender Hack" — умная поисковая строка для "Портал поставщиков"
- Свыше 10 проектов на React в портфолио
`
    },
    { role: 'user', content: userMessage },
  ])

  if (!reply) {
    return res.status(502).json({ message: 'Все AI-модели сейчас недоступны, попробуй позже' })
  }

  return res.status(200).json({ reply })
})

app.post('/api/ai-summary', async (req: Request, res: Response) => {
  const text = String(req.body?.text ?? '').trim()

  if (!text || text.length < 6) {
    return res.status(400).json({ message: 'Текст слишком короткий' })
  }

  const summary = await callAiWithFallback(
    [
      {
        role: 'system',
        content:
          'Сделай краткое summary (2-3 предложения) на русском языке. Только summary, без предисловий.',
      },
      { role: 'user', content: text },
    ],
    150,
  )

  if (!summary) {
    return res.status(502).json({ message: 'AI недоступен' })
  }

  return res.status(200).json({ summary })
})

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Маршрут не найден' })
})

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`)
})