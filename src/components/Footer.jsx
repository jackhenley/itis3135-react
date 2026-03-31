import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <Link to="/itis3135">ITIS3135<span> ♣ </span></Link>
      <a href="https://github.com/jackhenley" target="_blank" rel="noreferrer">GitHub <span>♣</span></a>
      <a href="https://webpages.charlotte.edu/jhenley8/" target="_blank" rel="noreferrer">CLT Web<span>♣</span></a>
      <a href="https://jackhenley.github.io/" target="_blank" rel="noreferrer">Github.io<span>♣</span></a>
      <a href="https://www.linkedin.com/in/jack-henley-230565380" target="_blank" rel="noreferrer">LinkedIn<span>♣</span></a>
    </footer>
  );
}
