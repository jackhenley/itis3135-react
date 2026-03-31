import { useEffect } from 'react';
import '../styles/itis3135.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Instructions() {
  useEffect(() => {
    document.title = 'Jack Henley | Instructions';
  }, []);
  return (
    <div className="itis3135-layout">
      <Header />
      <main>
        <h2>Instructions</h2>
        <p>
          This page will contain the Instructions page which I will make in the
          FCC RWD Course.
        </p>
      </main>
      <Footer />
    </div>
  );
}
