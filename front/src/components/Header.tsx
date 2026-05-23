interface HeaderProps {
  className?: string
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={`topbar ${className ?? ''}`}>
      <a href="#hero" className="logo" aria-label="На главную">
        MA
      </a>

      <nav aria-label="Основная навигация">
        <a href="#work">Подход</a>
        <a href="#cases">Проекты</a>
        <a href="#contact">Контакты</a>
      </nav>
    </header>
  );
};