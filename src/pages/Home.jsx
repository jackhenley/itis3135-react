import { Link } from 'react-router-dom';
import '../styles/root.css';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="root-layout">
      <header>
        <h1>Jack Henley</h1>
        <nav>
          <Link to="/">Home Page</Link>
          <Link to="/itis3135/contract">Contract Page</Link>
          <Link to="/itis3135/introduction">My introduction page</Link>
          <Link to="/games">Games page</Link>
        </nav>
      </header>
      <main>
        <h2>Personal Home Page</h2>
        <p>
          My name is Jack Henley. I&apos;m a student at UNC Charlotte studying computer
          science with a concentration in AI and gaming. When I&apos;m not working with
          computers, I enjoy spending time in nature. This is my personal home
          page.
        </p>
      </main>
      <Footer />
    </div>
  );
}
