import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './TypingGame.css';

const WORDS = [
  "the","be","to","of","and","a","in","that","have","it","for","not","on","with","he","as","you","do","at","this",
  "but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there","their","what",
  "so","up","out","if","about","who","get","which","go","me","when","make","can","like","time","no","just","him","know",
  "take","people","into","year","your","good","some","could","them","see","other","than","then","now","look","only","come",
  "its","over","think","also","back","after","use","two","how","our","work","first","well","way","even","new","want",
  "because","any","these","give","day","most","us","great","between","need","large","often","hand","high","place","hold",
  "turn","here","why","ask","went","men","read","need","land","different","home","move","try","kind","hand","picture",
  "again","change","off","play","spell","air","away","animal","house","point","page","letter","mother","answer","found",
  "still","learn","should","world","thought","never","last","might","story","tree","cross","farm","hard","start","might",
  "story","saw","far","sea","draw","left","late","run","don","while","press","close","night","real","life","few","open"
];

const SENTENCE_WORD_COUNT = 20;

function generateSentence() {
  const words = [];
  for (let i = 0; i < SENTENCE_WORD_COUNT; i++) {
    words.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

function hasTypo(typed, sentence) {
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] !== sentence[i]) return true;
  }
  return false;
}

export default function TypingGame() {
  const [sentence, setSentence] = useState(() => generateSentence());
  const [typed, setTyped] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [wpm, setWpm] = useState(null);
  const [finished, setFinished] = useState(false);
  const [resultMsg, setResultMsg] = useState('');
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetRound = useCallback(() => {
    stopTimer();
    setSentence(generateSentence());
    setTyped('');
    setStartTime(null);
    setElapsed(0);
    setWpm(null);
    setFinished(false);
    setResultMsg('');
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [stopTimer]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  function handleInput(e) {
    if (finished) return;
    const val = e.target.value;
    if (val.length === 1 && startTime === null) {
      const now = Date.now();
      setStartTime(now);
      timerRef.current = setInterval(() => {
        setElapsed((Date.now() - now) / 1000);
      }, 100);
    }
    setTyped(val);
    if (val === sentence) {
      stopTimer();
      const finalElapsed = (Date.now() - startTime) / 1000;
      const wordCount = sentence.trim().split(/\s+/).length;
      const finalWpm = Math.round((wordCount / finalElapsed) * 60);
      setElapsed(finalElapsed);
      setWpm(finalWpm);
      setFinished(true);
      setResultMsg(`Finished! ${finalWpm} WPM in ${finalElapsed.toFixed(1)}s.`);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') e.preventDefault();
  }

  // WPM during typing
  useEffect(() => {
    if (!startTime || elapsed <= 0 || finished) return;
    let correctLen = 0;
    for (let i = 0; i < typed.length && i < sentence.length; i++) {
      if (typed[i] === sentence[i]) correctLen = i + 1;
      else break;
    }
    const words = correctLen / 5;
    const minutes = elapsed / 60;
    if (minutes > 0) setWpm(Math.round(words / minutes));
  }, [elapsed, typed, sentence, startTime, finished]);

  // Progress calculation
  let correctLen = 0;
  for (let i = 0; i < typed.length && i < sentence.length; i++) {
    if (typed[i] === sentence[i]) correctLen = i + 1;
    else break;
  }
  const progressPct = Math.round((correctLen / sentence.length) * 100);
  const typo = hasTypo(typed, sentence);

  // Render sentence chars
  const chars = sentence.split('').map((ch, i) => {
    let cls = 'char pending';
    if (i < typed.length) cls = typed[i] === ch ? 'char correct' : 'char error';
    else if (i === typed.length) cls = 'char pending cursor';
    return { ch, cls };
  });

  return (
    <div className="typing-bg">
      <header className="typing-header">
        <Link to="/games" className="typing-back-link">Back</Link>
      </header>
      <section className="typing-section">
        <h1 className="typing-h1">Typing Practice</h1>
        <div className="progress-bar-container">
          <div
            className={`progress-bar${typo ? ' has-error' : ''}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div id="sentence-display">
          {chars.map(({ ch, cls }, i) => (
            <span key={i} className={cls}>
              {ch === ' ' ? '\u00a0' : ch}
            </span>
          ))}
        </div>
        <textarea
          ref={inputRef}
          id="input-area"
          className={typo ? 'has-error' : ''}
          value={typed}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Start typing to begin..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          disabled={finished}
        />
        <div id="stats">
          <div className="stat-box">
            <div className="stat-label">WPM</div>
            <div className="stat-value">{wpm !== null ? wpm : '--'}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Time (s)</div>
            <div className="stat-value">{elapsed.toFixed(1)}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Progress</div>
            <div className="stat-value">{progressPct}%</div>
          </div>
        </div>
        <div id="result-message">{resultMsg}</div>
        <button id="new-sentence-btn" onClick={resetRound}>New Sentence</button>
      </section>
    </div>
  );
}
