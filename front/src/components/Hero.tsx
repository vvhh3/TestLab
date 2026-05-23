export const Hero = () => {
  return (
    <section className="hero" id="hero">
      <div className="hero__content">
        <p className="eyebrow">Frontend / Fullstack developer</p>

        <h1>
          Матвей Александров — React / Fullstack разработчик
        </h1>

        <p className="lead">
          Разрабатываю современные web-приложения на React и TypeScript:
          от адаптивного интерфейса до backend-логики и интеграции API.
          Люблю понятные интерфейсы, чистую архитектуру и реальные задачи,
          которыми будут пользоваться люди.
        </p>

        <div className="hero__actions">
          <a className="button button--primary" href="#contact">
            Связаться
          </a>

          <a className="button" href="#cases">
            Смотреть проекты
          </a>
        </div>
      </div>

      <aside className="summary" aria-label="Краткая информация">
        <dl>
          <div>
            <dt>Опыт</dt>
            <dd>
              1+ год коммерческой и проектной разработки
            </dd>
          </div>

          <div>
            <dt>Основной стек</dt>
            <dd>
              React, TypeScript, Node.js, PostgreSQL
            </dd>
          </div>

          <div>
            <dt>Дополнительно</dt>
            <dd>
              Web3, dashboards, Telegram bot, REST API
            </dd>
          </div>
        </dl>
      </aside>
    </section>
  );
};