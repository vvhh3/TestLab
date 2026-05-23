import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'

const BASE = import.meta.env.VITE_API_URL ?? ''

type FormState = {
  name: string
  phone: string
  email: string
  comment: string
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error'

const initialForm: FormState = {
  name: '',
  phone: '',
  email: '',
  comment: '',
}


export const ContactSection = () => {
  const [form, setForm] = useState<FormState>(initialForm)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const canSubmit = useMemo(
    () =>
      form.name.trim().length > 1 &&
      form.phone.trim().length > 5 &&
      form.email.includes('@') &&
      form.comment.trim().length > 5,
    [form],
  )

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (submitState !== 'idle') {
      setSubmitState('idle')
      setSubmitMessage('')
    }
  }

  const submitForm = async (event: FormEvent) => {
    event.preventDefault()

    try {
      const response = await fetch(`${BASE}/api/contact`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        },
      )
      console.log("response", response)
      const data = await response.json()

      console.log(data)
      setSubmitState('success')
      setSubmitMessage('Сообщение отправлено!')
    } catch (error) {
      console.log(error)
      setSubmitState('error')
      setSubmitMessage('Ошибка отправки сообщения.')
    }
  }

  return (
    <section
      className="section contact"
      id="contact"

    >
      <div className="contact__text">
        <p className="eyebrow">Контакты</p>

        <h2 id="contact-title">
          Готов обсудить проект или работу
        </h2>

        <p>
          Открыт к frontend / fullstack задачам, стажировкам и
          полноценной разработке. Можно написать по поводу проекта,
          сотрудничества или просто связаться для общения.
        </p>

        <ul className="contact-list">
          <li>
            <span>Email</span>

            <a href="mailto:matveialex2007@gmail.com">
              matveialex2007@gmail.com
            </a>
          </li>

          <li>
            <span>Telegram</span>

            <a
              href="https://t.me/ia_botik"
              target="_blank"
              rel="noreferrer"
            >
              @ia_botik
            </a>
          </li>

          <li>
            <span>GitHub</span>

            <a
              href="https://github.com/vvhh3"
              target="_blank"
              rel="noreferrer"
            >
              github.com/vvhh3
            </a>
          </li>
        </ul>
      </div>

      <form className="form" onSubmit={submitForm} noValidate>
        <label>
          Имя

          <input
            autoComplete="name"
            name="name"
            onChange={(event) =>
              updateField('name', event.target.value)
            }
            placeholder="Ваше имя"
            required
            value={form.name}
          />
        </label>

        <label>
          Телефон

          <input
            autoComplete="tel"
            name="phone"
            onChange={(event) =>
              updateField('phone', event.target.value)
            }
            placeholder="+7 999 000-00-00"
            required
            type="tel"
            value={form.phone}
          />
        </label>

        <label>
          Email

          <input
            autoComplete="email"
            name="email"
            onChange={(event) =>
              updateField('email', event.target.value)
            }
            placeholder="mail@example.com"
            required
            type="email"
            value={form.email}
          />
        </label>

        <label>
          Комментарий

          <textarea
            name="comment"
            onChange={(event) =>
              updateField('comment', event.target.value)
            }
            placeholder="Коротко опишите задачу"
            required
            rows={5}
            value={form.comment}
          />
        </label>

        <div className="form__actions">
          <button
            className="button button--primary"
            disabled={!canSubmit}
            type="submit"
          >
            {submitState === 'loading'
              ? 'Отправка...'
              : 'Отправить'}
          </button>
        </div>

        {submitMessage && (
          <p className={`status status--${submitState}`} role="status">
            {submitMessage}
          </p>
        )}
      </form>
    </section>
  );
};