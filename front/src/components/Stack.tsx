const stack = [
  'React',
  'TypeScript',
  'JavsScript',
  'Next.js',
  'Node.js',
  'Express',
  'PostgreSQL',
  'Tailwind CSS',
  'Redux Toolkit',
  'Zustand',
  'TanStack Query',
  'Docker',
  'Git',
  'REST API',
  'Axios',
  'Solidity',
  'Ethers.js',
];

export const Stack = () => {
  return (
    <section className="section" >
      <div className="section__header">
        <p className="eyebrow">Стек</p>

        <h2 id="stack-title">
          Технологии и инструменты
        </h2>
      </div>

      <div className="tags" aria-label="Технологии">
        {stack.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </div>
    </section>
  );
};