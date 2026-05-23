const cases = [
  {
    type: 'Frontend / Internal system',
    title: 'Внутренние web-приложения для колледжа',
    text: 'Разрабатывал интерфейсы, формы, таблицы, фильтрацию и пагинацию для автоматизации учебных и административных процессов. Интегрировал frontend с backend через REST API и участвовал в доработке серверной части.',
  },
  {
    type: 'Web3 / Dashboard',
    title: 'DeFi Protocol Dashboard',
    text: 'Создал dashboard для взаимодействия со smart-contracts. Реализовал real-time отображение blockchain данных, подключение кошельков и интерфейсы для работы с DeFi-протоколом.',
  },
  {
    type: 'Backend / Telegram Bot',
    title: 'Telegram bot для знакомств',
    text: 'Разработал backend и логику Telegram-бота на Node.js и TypeScript. Настроил PostgreSQL, деплой на Railway, обработку медиафайлов и хранение пользовательских данных.',
  },
  {
    type: 'Hackathon',
    title: 'Tender Hack — топ 5',
    text: 'Участвовал в разработке умной поисковой строки для “Портала поставщиков”. Работал над frontend частью, UX и обработкой пользовательских запросов.',
  },
];

export const CasesSection = () => {
  return (
    <section
      className="section"
      id="cases"
      
    >
      <div className="section__header">
        <p className="eyebrow">Проекты</p>

        <h2 id="cases-title">
          Опыт и личные проекты
        </h2>
      </div>

      <div className="case-list">
        {cases.map((item) => (
          <article className="case-card" key={item.title}>
            <span>{item.type}</span>

            <h3>{item.title}</h3>

            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
};