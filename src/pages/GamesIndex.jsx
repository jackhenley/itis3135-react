import { Link } from 'react-router-dom';

const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: '20px',
    backgroundColor: '#171717',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#333',
    color: 'rgb(9, 185, 0)',
    padding: '10px 20px',
  },
  backLink: {
    color: 'rgb(9, 185, 0)',
    textDecoration: 'none',
    marginRight: '15px',
    float: 'left',
  },
  h1: {
    color: 'rgb(9, 185, 0)',
    fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
  },
  p: {
    color: 'rgba(134, 90, 181, 0.962)',
    fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
    fontSize: '24px',
  },
  section: {
    backgroundColor: '#333',
    padding: '20px',
    borderRadius: '5px',
    fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
  },
  gameLink: {
    color: 'rgb(9, 185, 0)',
    textDecoration: 'none',
    fontSize: '24px',
  },
};

export default function GamesIndex() {
  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <Link to="/" style={styles.backLink}>Back</Link>
      </header>
      <section style={styles.section}>
        <h1 style={styles.h1}>Games</h1>
        <p style={styles.p}>Here are some games that I have made:</p>
        <ul>
          <li>
            <Link to="/games/wallstreet" style={styles.gameLink}>Wall Street Week</Link>
            <p style={styles.p}>AI disclaimer: AI was used to produce this game.</p>
          </li>
          <li>
            <Link to="/games/typing" style={styles.gameLink}>Typing Practice</Link>
            <p style={styles.p}>AI disclaimer: AI was used to produce this game.</p>
          </li>
        </ul>
      </section>
    </div>
  );
}
