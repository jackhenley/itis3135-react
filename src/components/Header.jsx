import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header>
      <h1>Jack Henley&apos;s Jolly Hawk ♣ ITIS3135</h1>
      <br />
      <nav id="main-menu">
        <Link to="/">Home Page</Link>
        <Link to="/itis3135/contract">Contract Page</Link>
        <Link to="/itis3135/introduction">My introduction page</Link>
        <Link to="/itis3135/website-evaluations">Website Evaluations</Link>
        <Link to="/itis3135/survey">Survey</Link>
        <Link to="/itis3135/gallery">Gallery</Link>
        <Link to="/itis3135/inventory">Inventory</Link>
        <Link to="/itis3135/instructions">Instructions</Link>
        <Link to="/itis3135/highlight">Highlight</Link>
      </nav>
      <br />
      <nav id="second-menu">
        <Link to="/stuff/crappy-page">Crappy Page</Link>
        <Link to="/itis3135/hobby">Hobby</Link>
        <Link to="/itis3135/intro-form">Intro Form</Link>
      </nav>
    </header>
  );
}
