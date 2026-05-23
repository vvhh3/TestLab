# Developer Landing

Небольшой лендинг-презентация разработчика с рабочей формой обратной связи, Node.js API и опциональным AI helper.

## Стек

- Frontend: React, TypeScript, Vite, HTML, CSS
- Backend: Node.js, Express, TypeScript, CORS, Fetch API
- Email: Resend HTTP API или локальный dry-run режим
- AI: OpenAI Responses API через отдельный backend endpoint

## Как запустить

### Backend

```bash
cd backend
cp .env.example .env
npm run dev
```

Backend запускается на статичном порту `4000`. Почта владельца сайта зафиксирована в коде: `matveialex2007@gmail.com`.


```env

RESEND_API_KEY=your_resend_key

```

### Frontend

```bash
cd front
cp .env.example .env
npm install
npm run dev
```

Vite проксирует запросы `/api` на `http://localhost:4000`. Если backend задеплоен отдельно, укажите `VITE_API_URL` в `front/.env`.

## Как реализована форма

Форма содержит поля `name`, `phone`, `email`, `comment`. На клиенте есть базовая проверка заполнения и состояния:

- `loading`: кнопка показывает процесс отправки
- `success`: пользователь видит подтверждение
- `error`: показывается понятная ошибка от API

Backend endpoint `POST /api/contact` повторно валидирует данные, формирует два письма и отправляет:

- письмо владельцу сайта
- копию письма пользователю


## AI-интеграция

Endpoint `POST /api/ai-summary` принимает текст комментария и возвращает короткое summary. Если задан `OPENAI_API_KEY`, используется OpenAI Responses API. Если ключа нет, endpoint возвращает локальный fallback summary, чтобы интерфейс оставался рабочим при локальной проверке.

```env
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4.1-mini
```

## Что делалось с помощью ИИ

- Быстро собрана структура лендинга и API.
- Сформулированы тексты секций и кейсов.
- Добавлены валидация и обработка ошибок.
- Подготовлен README.

## Что исправлялось вручную

- Упрощен дизайн: без декоративных блоков, с обычной сеткой и понятными акцентами.
- API сделан на Express с CORS и TypeScript.
- Добавлен dry-run режим почты для локальной проверки без внешних ключей.
- AI helper вынесен на backend, чтобы не раскрывать API ключ в браузере.

## Деплой

Frontend можно развернуть на Vercel, Netlify или любом static hosting. Backend можно развернуть на Render, Railway, Fly.io или как serverless function после переноса handler-логики. В переменных окружения деплоя нужно указать почтовые настройки и, при необходимости, `OPENAI_API_KEY`.
