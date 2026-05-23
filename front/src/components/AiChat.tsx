import { useState, useRef } from 'react'

type Message = {
  id: number
  role: 'user' | 'assistant'
  text: string
}

type ChatState = 'idle' | 'loading' | 'error'

const SUGGESTIONS = [
  'Какой у тебя стек?',
  'Расскажи про проекты',
  'Есть ли опыт с Web3?',
  'Как с тобой связаться?',
]

export const AiChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      text: 'Привет! Я AI-ассистент Матвея. Спроси меня что угодно о его опыте, стеке или проектах.',
    },
  ])

  const [input, setInput] = useState('')
  const [state, setState] = useState<ChatState>('idle')
  const bottomRef = useRef<HTMLDivElement>(null)
  let nextId = useRef(1)


  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || state === 'loading') return

    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, role: 'user', text: trimmed },
    ])
    setInput('')
    setState('loading')

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      })
      const data = await res.json() as { reply: string }

      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, role: 'assistant', text: data.reply },
      ])
      setState('idle')
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId.current++,
          role: 'assistant',
          text: 'Что-то пошло не так. Попробуй ещё раз.',
        },
      ])
      setState('error')
    }
  }

  return (
    <section className="section ai-chat">
      <div className="container">
        <p className="eyebrow">AI-интеграция</p>
        <h2>Спроси меня что угодно</h2>
        <p className="ai-chat__subtitle">
          Ассистент знает мой стек, опыт и проекты. Работает на OpenRouter.
        </p>

        <div className="ai-chat__window">
          <div className="ai-chat__messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`ai-chat__message ai-chat__message--${msg.role}`}
              >
                <span className="ai-chat__bubble">{msg.text}</span>
              </div>
            ))}

            {state === 'loading' && (
              <div className="ai-chat__message ai-chat__message--assistant">
                <span className="ai-chat__bubble ai-chat__bubble--typing">
                  <span /><span /><span />
                </span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="ai-chat__suggestions">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="ai-chat__chip"
                onClick={() => send(s)}
                disabled={state === 'loading'}
              >
                {s}
              </button>
            ))}
          </div>

          <form
            className="ai-chat__form"
            onSubmit={(e) => { e.preventDefault(); send(input) }}
          >
            <input
              className="ai-chat__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Напиши вопрос..."
              disabled={state === 'loading'}
            />
            <button
              className="button button--primary"
              type="submit"
              disabled={!input.trim() || state === 'loading'}
            >
              →
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}