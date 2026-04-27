import { useEffect, useState, useRef } from 'react';
import '../styles/itis3135.css';
import '../pages/Slideshow.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const INTERVAL_MS = 5000;
const IMAGE_COUNT = 15;

export default function Slideshow() {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    document.title = 'Jack Henley | Dog Slideshow';
    fetch(`https://api.thedogapi.com/v1/images/search?limit=${IMAGE_COUNT}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch images');
        return res.json();
      })
      .then((data) => {
        setImages(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setIndex((prev) => {
          if (prev >= images.length - 1) {
            clearInterval(timerRef.current);
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, INTERVAL_MS);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [playing, images.length]);

  const goFirst = () => { setIndex(0); setPlaying(false); };
  const goPrev = () => { setIndex((i) => Math.max(0, i - 1)); setPlaying(false); };
  const goNext = () => { setIndex((i) => Math.min(images.length - 1, i + 1)); setPlaying(false); };
  const goEnd = () => { setIndex(images.length - 1); setPlaying(false); };
  const handlePlay = () => { if (index < images.length - 1) setPlaying(true); };
  const handleStop = () => setPlaying(false);

  return (
    <div className="itis3135-layout">
      <Header />
      <main className="slideshow-main">
        <h2>Dog Slideshow</h2>

        {loading && <p className="slideshow-status">Loading dogs...</p>}
        {error && <p className="slideshow-status slideshow-error">Error: {error}</p>}

        {!loading && !error && images.length > 0 && (
          <>
            <div className="slideshow-frame">
              <img
                src={images[index].url}
                alt={`Dog ${index + 1}`}
                className="slideshow-image"
              />
              <p className="slideshow-counter">
                {index + 1} / {images.length}
              </p>
            </div>

            <div className="slideshow-controls">
              <button onClick={goFirst} disabled={index === 0}>First</button>
              <button onClick={goPrev} disabled={index === 0}>Previous</button>
              <button onClick={handlePlay} disabled={playing || index === images.length - 1}>Play</button>
              <button onClick={handleStop} disabled={!playing}>Stop</button>
              <button onClick={goNext} disabled={index === images.length - 1}>Next</button>
              <button onClick={goEnd} disabled={index === images.length - 1}>End</button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
