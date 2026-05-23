export const WorkSection = () => {
  return (
    <section
      className="section grid-section"
      id="work"
      
    >
      <div className="section__header">
        <p className="eyebrow">Как работаю</p>

        <h2 id="work-title">
          Сначала логика и UX — потом эффекты
        </h2>
      </div>

      <div className="columns">
        <article>
          <h3>Frontend</h3>

          <p>
            Разрабатываю адаптивные интерфейсы на React и TypeScript,
            проектирую структуру компонентов, подключаю API, работаю
            с состоянием приложения и оптимизирую UX.
          </p>
        </article>

        <article>
          <h3>Backend и API</h3>

          <p>
            Использую Node.js, Express и PostgreSQL для backend-логики,
            валидации данных, авторизации, обработки форм и интеграции
            frontend ↔ backend.
          </p>
        </article>

        <article>
          <h3>Подход к разработке</h3>

          <p>
            Стараюсь писать понятный и поддерживаемый код, уделяю внимание
            структуре проекта, стабильной работе
            интерфейсов.
          </p>
        </article>
      </div>
    </section>
  );
};