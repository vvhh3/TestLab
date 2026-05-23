# Developer Portfolio — Александров Матвей

Лендинг-презентация разработчика с формой обратной связи и AI-чатом.

**Деплой:** _(ссылка)_

---

## Стек

**Frontend:** React, TypeScript, Vite, CSS  
**Backend:** Node.js, Express, TypeScript  
**Email:** Resend  
**AI:** OpenRouter API (бесплатные модели, автовыбор через `/models`)

---

## Запуск

### Backend

```bash
cd backend
cp .env.example .env   # заполни переменные
npm install
npm run dev            # http://localhost:4000
```

`.env`:
```
RESEND_API_KEY=re_xxxxxxxxxxxx
AI_API_KEY=sk-or-v1-xxxxxxxxxxxx
AI_API_BASE=https://openrouter.ai/api/v1
```

### Frontend

```bash
cd front
cp .env.example .env
npm install
npm run dev            # http://localhost:5173
```


## AI-интеграция

**Чат-ассистент** (`POST /api/ai-chat`) — знает резюме , отвечает на вопросы о стеке, опыте и проектах.

Сервер сам получает актуальный список бесплатных моделей через `GET /models` OpenRouter и перебирает их по очереди до первого успешного ответа.

---

## Что делалось с помощью ИИ

- Системный промпт для AI-ассистента
- Тексты секций лендинга
- Отладка логики fallback-моделей

## Что делалось вручную

- Логика фронта и бека
- Структура компонентов и API
- Дизайн
- Модели OpenRouter перебирал вручную какие реально бесплатные и рабочие
- сделал перебор моделей через `/models`
- Стили подгонял под свой дизайн
