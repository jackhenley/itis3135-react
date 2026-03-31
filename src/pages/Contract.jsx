import { useEffect } from 'react';
import '../styles/itis3135.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contract() {
  useEffect(() => {
    document.title = 'Jack Henley | Contract';
  }, []);
  return (
    <div className="itis3135-layout">
      <Header />
      <p>
        I, Jack B. Henley agree to abide by the terms of the course contract in my
        Spring 2026, ITIS3135, Front-end Web App Development with my instructor,
        Professor D.I. von Briesen. I understand that all work that I do on
        publicly available online tools will be available to the world, and will
        not put information there that is inappropriate for schoolwork, or that I
        wish to keep private. I also understand that it is my work that counts for
        attendance, not logins or showing up for class. As such, failure to turn
        in assignments may show as absences. I also understand that given the
        structure and content of this class it&apos;s possible to find many examples
        online or even view my classmates&apos; code directly. I swear that I will only
        use these resources to learn, and will not cut and paste code except where
        I have properly given credit (i.e. external libraries) and never from my
        classmates. Signed: <em>Jack B. Henley</em>, 01/25/2026
      </p>
      <Footer />
    </div>
  );
}
