import { useState, useEffect, useRef } from 'react';

const defaultValues = {
  'first-name': 'Jack',
  'middle-name': '',
  nickname: '',
  'last-name': 'Henley',
  'mascot-adjective': 'Jolly',
  'mascot-animal': 'hawk',
  divider: '♣',
  'picture-caption': 'One of my favorite camping memories',
  'personal-statement':
    "I'm a junior studying computer science with a concentration in AI, robotics, and gaming. I transferred from WCU for the fall semester and have so far been enjoying my time here at UNCC. I enjoy hiking, playing violin and mandolin, and playing video games in my free time.",
  'personal-background':
    "I grew up in Louisiana and moved to Asheville, NC about four years ago. I'm pursuing a degree in computer science because I enjoy problem solving and the challenge of figuring things out.",
  'professional-background':
    'I have yet to work a role in the software industry, however I have taught coding classes for the company I work for.',
  'academic-background':
    'I started pursuing computer science at WCU, and decided that UNCC would be a better fit for me.',
  'subject-background': '',
  'primary-computer':
    'I use an Asus G14 laptop as my "desktop" at home, and dual boot Windows 11 and EndeavourOS on it.',
  quote:
    "It's the greatest gig in the world, being alive. You get to eat Denny's, wear a hat, whatever you want to do.",
  'quote-author': 'Norm Macdonald',
  'funny-thing': '',
  share: '',
  'link-1-url': 'https://www.linkedin.com/in/jack-henley-230565380',
  'link-1-name': 'LinkedIn',
  'link-2-url': 'https://github.com/jackhenley',
  'link-2-name': 'GitHub',
  'link-3-url': 'https://webpages.charlotte.edu/jhenley8/',
  'link-3-name': 'CLT Web',
  'link-4-url': 'https://jackhenley.github.io/',
  'link-4-name': 'Github.io',
  'link-5-url': 'https://jackhenley.github.io/itis3135/',
  'link-5-name': 'ITIS3135',
};

const defaultCourses = [
  { number: '3155', name: 'Software Engineering', reason: '', department: 'ITSC' },
  { number: '2181', name: 'Intro to Computer Systems', reason: '', department: 'ITSC' },
  { number: '3688', name: 'Computers and Their Impact on Society', reason: '', department: 'ITSC' },
  { number: '3135', name: 'Front-End Web Application Development', reason: '', department: 'ITIS' },
  { number: '2122', name: 'Intro. to Probability and Statistics', reason: '', department: 'STAT' },
];

const requiredFields = [
  'first-name', 'last-name',
  'mascot-adjective', 'mascot-animal', 'divider', 'picture-caption',
  'personal-statement', 'personal-background',
  'professional-background', 'academic-background', 'primary-computer',
  'quote', 'quote-author',
  'link-1-url', 'link-1-name', 'link-2-url', 'link-2-name',
  'link-3-url', 'link-3-name', 'link-4-url', 'link-4-name',
  'link-5-url', 'link-5-name',
];

const styles = {
  root: {
    '--prussian-blue': '#031d44ff',
    '--pale-slate': '#cacfd6ff',
    '--chartreuse': '#baff29ff',
    '--blue-slate': '#4d6a6dff',
    '--dim-grey': '#646E68ff',
  },
};

export default function IntroForm() {
  const [fields, setFields] = useState({ ...defaultValues });
  const [courses, setCourses] = useState(defaultCourses.map(c => ({ ...c, id: Math.random() })));
  const [view, setView] = useState('form'); // 'form' | 'preview' | 'json'
  const [previewData, setPreviewData] = useState(null);
  const [jsonText, setJsonText] = useState('');
  const [copyLabel, setCopyLabel] = useState('Copy to Clipboard');
  const fileRef = useRef(null);

  useEffect(() => {
    document.title = 'Jack Henley | Intro Form';
  }, []);

  function setField(key, val) {
    setFields(prev => ({ ...prev, [key]: val }));
  }

  function validate() {
    const missing = requiredFields.filter(id => !fields[id]?.trim());
    const emptyCourse = courses.some(c => !c.number.trim() || !c.name.trim() || !c.department.trim());
    if (emptyCourse) missing.push('course (number, name, and department required for each)');
    if (missing.length > 0) {
      alert(`Please fill in the following required fields:\n${missing.join(', ')}`);
      return false;
    }
    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const file = fileRef.current?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = evt => showPreview(evt.target.result);
      reader.readAsDataURL(file);
    } else {
      showPreview('/images/introPhoto.jpg');
    }
  }

  function showPreview(imgSrc) {
    setPreviewData({ ...fields, courses: courses.filter(c => c.name), imgSrc });
    setView('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleReset() {
    setFields({ ...defaultValues });
    setCourses(defaultCourses.map(c => ({ ...c, id: Math.random() })));
    if (fileRef.current) fileRef.current.value = '';
  }

  function handleClear() {
    setFields(Object.fromEntries(Object.keys(defaultValues).map(k => [k, ''])));
    setCourses(defaultCourses.map(() => ({ number: '', name: '', reason: '', department: '', id: Math.random() })));
  }

  function handleGenerateJson() {
    if (!validate()) return;
    const file = fileRef.current?.files[0];
    const imagePath = file ? `images/${file.name}` : 'images/introPhoto.jpg';
    const json = {
      first_name: fields['first-name'],
      preferred_name: fields['nickname'] || undefined,
      middle_initial: fields['middle-name'] || undefined,
      last_name: fields['last-name'],
      divider: fields['divider'],
      mascot_adjective: fields['mascot-adjective'],
      mascot_animal: fields['mascot-animal'],
      image: imagePath,
      image_caption: fields['picture-caption'],
      personal_statement: fields['personal-statement'],
      personal_background: fields['personal-background'],
      professional_background: fields['professional-background'],
      academic_background: fields['academic-background'],
      subject_background: fields['subject-background'] || undefined,
      primary_computer: fields['primary-computer'],
      courses: courses.filter(c => c.name).map(({ number, name, reason, department }) => ({ department, number, name, reason })),
      links: [1, 2, 3, 4, 5]
        .map(n => ({ name: fields[`link-${n}-name`], href: fields[`link-${n}-url`] }))
        .filter(l => l.href),
    };
    setJsonText(JSON.stringify(json, null, 2));
    setView('json');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCopyJson() {
    navigator.clipboard.writeText(jsonText).then(() => {
      setCopyLabel('Copied!');
      setTimeout(() => setCopyLabel('Copy to Clipboard'), 2000);
    });
  }

  function updateCourse(id, key, val) {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [key]: val } : c));
  }

  function addCourse() {
    setCourses(prev => [...prev, { number: '', name: '', reason: '', department: '', id: Math.random() }]);
  }

  function removeCourse(id) {
    setCourses(prev => prev.filter(c => c.id !== id));
  }

  const inputStyle = {
    width: '100%', padding: '0.5rem', marginTop: '0.25rem', marginBottom: '1rem',
    border: '1px solid #031d44ff', borderRadius: '4px', boxSizing: 'border-box',
    backgroundColor: '#031d44ff', color: '#baff29ff',
  };
  const textareaStyle = { ...inputStyle };
  const fieldsetStyle = {
    border: '1px solid #031d44ff', padding: '1rem', marginBottom: '1rem',
    backgroundColor: '#4d6a6dff',
  };
  const btnStyle = {
    backgroundColor: '#baff29ff', color: '#031d44ff', border: 'none',
    padding: '0.5rem 1rem', marginRight: '0.5rem', borderRadius: '4px', cursor: 'pointer',
  };

  if (view === 'preview' && previewData) {
    const d = previewData;
    const middleDisplay = d['middle-name'] ? ` ${d['middle-name']}` : '';
    const nicknameDisplay = d['nickname'] ? ` (${d['nickname']})` : '';
    const displayName = `${d['first-name']}${middleDisplay}${nicknameDisplay} ${d['last-name']}`;

    return (
      <div id="preview-panel" style={{ backgroundColor: 'hsla(253, 51%, 39%, 1)', padding: '1rem 0' }}>
        <header>
          <h1 style={{ color: 'hsla(47, 100%, 50%, 1)', fontFamily: 'archivo-black', maxWidth: 'fit-content', margin: 'auto' }}>
            {d['first-name']} {d['last-name']}&apos;s {d['mascot-adjective']} {d['mascot-animal']} ♣ ITIS3135
          </h1>
        </header>
        <main>
          <h2 style={{ color: 'hsla(275, 18%, 79%, 1)', fontFamily: 'Frutiger, sans-serif' }}>{displayName}</h2>
          <figure>
            <img src={d.imgSrc} alt={d['picture-caption']} width="500" height="300" />
            <figcaption><em>{d['picture-caption']}</em></figcaption>
          </figure>
          <p style={{ fontFamily: 'Frutiger, sans-serif', color: 'hsla(108, 100%, 89%, 1)', fontSize: '18px', maxWidth: '800px', margin: '10px 20px' }}>
            {d['personal-statement']}
          </p>
          <ul style={{ fontFamily: 'Frutiger, sans-serif', color: 'hsla(47, 100%, 50%, 1)', fontSize: '18px', maxWidth: '800px', margin: '10px 20px 10px 40px' }}>
            <li><b>Personal Background: </b>{d['personal-background']}</li>
            <li><b>Professional Background: </b>{d['professional-background']}</li>
            <li><b>Academic Background: </b>{d['academic-background']}</li>
            {d['subject-background'] && <li><b>Subject Background: </b>{d['subject-background']}</li>}
            <li><b>Primary Computer: </b>{d['primary-computer']}</li>
            <li>
              <b>Current Courses:</b>
              <ol>
                {d.courses.map((c, i) => (
                  <li key={i}><b>{c.department} {c.number} — {c.name}</b>{c.reason && <><br /><em>{c.reason}</em></>}</li>
                ))}
              </ol>
            </li>
          </ul>
          <blockquote>
            <p style={{ fontFamily: 'Frutiger, sans-serif', color: 'hsla(108, 100%, 89%, 1)', fontSize: '18px', maxWidth: '800px', margin: '10px 20px' }}>
              &ldquo;{d['quote']}&rdquo;
            </p>
            <cite>- {d['quote-author']}</cite>
          </blockquote>
          {d['funny-thing'] && <p style={{ fontFamily: 'Frutiger, sans-serif', color: 'hsla(108, 100%, 89%, 1)', fontSize: '18px', maxWidth: '800px', margin: '10px 20px' }}><b>Something Funny: </b>{d['funny-thing']}</p>}
          {d['share'] && <p style={{ fontFamily: 'Frutiger, sans-serif', color: 'hsla(108, 100%, 89%, 1)', fontSize: '18px', maxWidth: '800px', margin: '10px 20px' }}><b>Something I&apos;d Like to Share: </b>{d['share']}</p>}
          <h3 style={{ color: 'hsla(275, 18%, 79%, 1)', fontFamily: 'Frutiger, sans-serif' }}>Links</h3>
          <ul style={{ fontFamily: 'Frutiger, sans-serif', color: 'hsla(47, 100%, 50%, 1)', fontSize: '18px', maxWidth: '800px', margin: '10px 20px 10px 40px' }}>
            {[1, 2, 3, 4, 5].map(n => d[`link-${n}-url`] && (
              <li key={n}><a href={d[`link-${n}-url`]} style={{ color: 'hsla(108, 100%, 89%, 1)' }}>{d[`link-${n}-name`]}</a></li>
            ))}
          </ul>
        </main>
        <button type="button" onClick={() => setView('form')} style={btnStyle}>Reset</button>
      </div>
    );
  }

  if (view === 'json') {
    return (
      <div id="json-view" style={{ fontFamily: 'frutiger, sans-serif', backgroundColor: '#646E68ff', margin: 0, padding: '20px', color: '#cacfd6ff' }}>
        <h2>Generated JSON</h2>
        <button type="button" onClick={handleCopyJson} style={btnStyle}>{copyLabel}</button>
        <button type="button" onClick={() => setView('form')} style={btnStyle}>Back to Form</button>
        <br /><br />
        <textarea
          readOnly
          value={jsonText}
          style={{
            display: 'block', width: '100%', boxSizing: 'border-box', padding: '1rem',
            fontFamily: 'monospace', fontSize: '0.9rem', background: '#031d44ff',
            color: '#baff29ff', border: '1px solid #ccc', borderRadius: '4px',
            whiteSpace: 'pre', resize: 'none', minHeight: '400px',
          }}
        />
      </div>
    );
  }

  return (
    <div id="form-view" style={{ fontFamily: 'frutiger, sans-serif', backgroundColor: '#646E68ff', margin: 0, padding: '20px', color: '#cacfd6ff' }}>
      <h2>Intro Form</h2>
      <h3>Please Submit the Form Below</h3>
      <form id="form" onSubmit={handleSubmit}>

        <fieldset style={fieldsetStyle}>
          <legend>Personal Information</legend>
          <label>First Name (required):</label><br />
          <input style={inputStyle} value={fields['first-name']} onChange={e => setField('first-name', e.target.value)} placeholder="Jack" required /><br /><br />
          <label>Middle Name or Initial (optional):</label><br />
          <input style={inputStyle} value={fields['middle-name']} onChange={e => setField('middle-name', e.target.value)} placeholder="B" /><br /><br />
          <label>Nickname / Preferred Name (optional):</label><br />
          <input style={inputStyle} value={fields['nickname']} onChange={e => setField('nickname', e.target.value)} placeholder="Jack" /><br /><br />
          <label>Last Name (required):</label><br />
          <input style={inputStyle} value={fields['last-name']} onChange={e => setField('last-name', e.target.value)} placeholder="Henley" required /><br /><br />
        </fieldset>

        <br />

        <fieldset style={fieldsetStyle}>
          <legend>Mascot</legend>
          <label>Mascot Adjective (required):</label><br />
          <input style={inputStyle} value={fields['mascot-adjective']} onChange={e => setField('mascot-adjective', e.target.value)} placeholder="Jolly" required /><br /><br />
          <label>Mascot Animal (required):</label><br />
          <input style={inputStyle} value={fields['mascot-animal']} onChange={e => setField('mascot-animal', e.target.value)} placeholder="hawk" required /><br /><br />
          <label>Divider (required):</label><br />
          <input style={inputStyle} value={fields['divider']} onChange={e => setField('divider', e.target.value)} placeholder="||" required /><br /><br />
        </fieldset>

        <br />

        <fieldset style={fieldsetStyle}>
          <legend>Photo</legend>
          <label>Picture (optional, defaults to introPhoto.jpg):</label><br />
          <input ref={fileRef} type="file" accept="image/*" style={{ marginBottom: '1rem' }} /><br /><br />
          <label>Picture Caption (required):</label><br />
          <textarea style={textareaStyle} rows="4" value={fields['picture-caption']} onChange={e => setField('picture-caption', e.target.value)} placeholder="one of my favorite camping memories" required /><br /><br />
        </fieldset>

        <br />

        <fieldset style={fieldsetStyle}>
          <legend>About Me</legend>
          <label>Personal Statement (required):</label><br />
          <textarea style={textareaStyle} rows="4" cols="50" value={fields['personal-statement']} onChange={e => setField('personal-statement', e.target.value)} required /><br /><br />
          <label>Personal Background (required):</label><br />
          <textarea style={textareaStyle} rows="4" cols="50" value={fields['personal-background']} onChange={e => setField('personal-background', e.target.value)} required /><br /><br />
          <label>Professional Background (required):</label><br />
          <textarea style={textareaStyle} rows="4" cols="50" value={fields['professional-background']} onChange={e => setField('professional-background', e.target.value)} placeholder="e.g. internships, jobs, relevant experience" required /><br /><br />
          <label>Academic Background (required):</label><br />
          <textarea style={textareaStyle} rows="4" cols="50" value={fields['academic-background']} onChange={e => setField('academic-background', e.target.value)} placeholder="e.g. schools attended, major, year" required /><br /><br />
          <label>Subject Background (optional):</label><br />
          <textarea style={textareaStyle} rows="4" cols="50" value={fields['subject-background']} onChange={e => setField('subject-background', e.target.value)} placeholder="e.g. prior experience with web development" /><br /><br />
          <label>Primary Computer (required):</label><br />
          <textarea style={textareaStyle} rows="4" cols="50" value={fields['primary-computer']} onChange={e => setField('primary-computer', e.target.value)} placeholder="e.g. MacBook Pro M2, Windows desktop" required /><br /><br />
        </fieldset>

        <br />

        <fieldset style={fieldsetStyle}>
          <legend>Course</legend>
          <label>Course(s) (required):</label><br /><br />
          <div id="courses-container">
            {courses.map((c) => (
              <div key={c.id} className="course-entry">
                <label>Number:</label><br />
                <input style={inputStyle} value={c.number} onChange={e => updateCourse(c.id, 'number', e.target.value)} placeholder="e.g. 3155" required /><br />
                <label>Name:</label><br />
                <input style={inputStyle} value={c.name} onChange={e => updateCourse(c.id, 'name', e.target.value)} placeholder="e.g. Software Engineering" required /><br />
                <label>Reason (optional):</label><br />
                <textarea style={textareaStyle} rows="2" value={c.reason} onChange={e => updateCourse(c.id, 'reason', e.target.value)} placeholder="Why are you taking this course?" /><br />
                <label>Department:</label><br />
                <input style={inputStyle} value={c.department} onChange={e => updateCourse(c.id, 'department', e.target.value)} placeholder="e.g. ITSC" required /><br />
                <button type="button" style={btnStyle} disabled={courses.length === 1} onClick={() => removeCourse(c.id)}>Remove</button>
                <br /><br />
              </div>
            ))}
          </div>
          <button type="button" style={btnStyle} onClick={addCourse}>+ Add Course</button>
        </fieldset>

        <br />

        <fieldset style={fieldsetStyle}>
          <legend>Quote</legend>
          <label>Quote (required):</label><br />
          <textarea style={textareaStyle} rows="3" cols="50" value={fields['quote']} onChange={e => setField('quote', e.target.value)} required /><br /><br />
          <label>Quote Author (required):</label><br />
          <input style={inputStyle} value={fields['quote-author']} onChange={e => setField('quote-author', e.target.value)} required /><br /><br />
        </fieldset>

        <br />

        <fieldset style={fieldsetStyle}>
          <legend>Fun Extras</legend>
          <label>Something Funny (optional):</label><br />
          <textarea style={textareaStyle} rows="3" cols="50" value={fields['funny-thing']} onChange={e => setField('funny-thing', e.target.value)} /><br /><br />
          <label>Something I Would Like to Share (optional):</label><br />
          <textarea style={textareaStyle} rows="3" cols="50" value={fields['share']} onChange={e => setField('share', e.target.value)} /><br /><br />
        </fieldset>

        <br />

        <fieldset style={fieldsetStyle}>
          <legend>Links</legend>
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n}>
              <label>Link {n} URL (required):</label><br />
              <input type="url" style={inputStyle} value={fields[`link-${n}-url`]} onChange={e => setField(`link-${n}-url`, e.target.value)} placeholder="https://..." required />
              <label>Name:</label>
              <input style={inputStyle} value={fields[`link-${n}-name`]} onChange={e => setField(`link-${n}-name`, e.target.value)} placeholder="Link name" required /><br /><br />
            </div>
          ))}
        </fieldset>

        <br />

        <div>
          <button type="submit" style={btnStyle}>Submit</button>
          <button type="button" style={btnStyle} onClick={handleReset}>Reset</button>
          <button type="button" style={btnStyle} onClick={handleClear}>Clear</button>
          <button type="button" style={btnStyle} onClick={handleGenerateJson}>Generate JSON</button>
        </div>

      </form>
    </div>
  );
}
