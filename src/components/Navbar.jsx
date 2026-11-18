export default function Navbar() {
  return (
    <header className="nav">
      <div className="wrap">
        <a className="brand" href="#top" aria-label="The Living Lab, home">
          <svg viewBox="0 0 22 34" aria-hidden="true">
            <rect x=".6" y=".6" width="20.8" height="32.8" rx="10.4" fill="none" stroke="#F5F5F1" strokeWidth="1.1"/>
            <rect x="6.5" y="8" width="9" height="15" rx="4.5" fill="none" stroke="#F5F5F1" strokeWidth="1.1"/>
            <circle cx="11" cy="27.5" r="1.5" fill="#F5F5F1"/>
          </svg>
          THE LIVING LAB
        </a>
        <nav className="links" aria-label="Sections">
          <a href="#visit">The visit</a>
          <a href="#pod">The pod</a>
          <a href="#score">Your score</a>
          <a href="#liv">Liv</a>
          <a href="#centres">For centres</a>
          <a href="#faq">Questions</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
