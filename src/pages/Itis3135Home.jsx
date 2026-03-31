import { useEffect } from 'react';
import '../styles/itis3135.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Itis3135Home() {
  useEffect(() => {
    document.title = 'Jack Henley | Course Home';
  }, []);
  return (
    <div className="itis3135-layout">
      <Header />
      <br />
      <main>
        <h2>Jack&apos;s Landing Page</h2>
        <p>
          My name is Jack Henley and I&apos;m a student at UNC Charlotte studying
          computer science. This is my main landing page for course work. To see
          my personal landing page, please click &apos;home&apos;, found above.
        </p>
        <br />
      </main>
      <Footer />
    </div>
  );
}
