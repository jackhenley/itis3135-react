import { useState, useEffect, useRef } from 'react';
import './Hobby.css';

document.title = 'Jack Henley | Hobby';

const SECTIONS = ['who', 'what', 'when', 'where', 'how', 'why', 'ai-prompts'];

// ASCII Snowboard renderer (ported from original)
const W = 120, H = 48;
const SHADING = '.,:;i+olt#@';

function buildBoard() {
  const verts = [];
  const HALF_L = 2.2, HALF_W = 0.55, THICK = 0.07, CURVE = 0.32, CURVE_START = 0.6;
  const uSteps = 60, vSteps = 18;

  for (let ui = 0; ui <= uSteps; ui++) {
    for (let vi = 0; vi <= vSteps; vi++) {
      const u = (ui / uSteps) * 2 - 1;
      const v = (vi / vSteps) * 2 - 1;
      const absU = Math.abs(u);
      let wScale = 1.0;
      if (absU > 0.8) {
        const t = (absU - 0.8) / 0.2;
        wScale = Math.sqrt(1 - t * t);
      }
      const px = u * HALF_L;
      const pz = v * HALF_W * wScale;
      let lift = 0;
      if (absU > CURVE_START) {
        const t = (absU - CURVE_START) / (1.0 - CURVE_START);
        lift = CURVE * t * t;
      }
      const stripeV = (v + 1) / 2;
      const isStripe = ((stripeV > 0.3 && stripeV < 0.38) || (stripeV > 0.48 && stripeV < 0.52) || (stripeV > 0.62 && stripeV < 0.7)) && absU < 0.75;
      verts.push({ x: px, y: THICK + lift, z: pz, nx: 0, ny: 1, nz: 0, stripe: isStripe });
      verts.push({ x: px, y: -THICK + lift, z: pz, nx: 0, ny: -1, nz: 0, stripe: false });
    }
  }
  const edgeSteps = 80;
  for (let ei = 0; ei <= edgeSteps; ei++) {
    const u = (ei / edgeSteps) * 2 - 1;
    const absU = Math.abs(u);
    let wScale = 1.0;
    if (absU > 0.8) {
      const t = (absU - 0.8) / 0.2;
      wScale = Math.sqrt(Math.max(0, 1 - t * t));
    }
    const px = u * HALF_L;
    let lift = 0;
    if (absU > CURVE_START) {
      const t = (absU - CURVE_START) / (1.0 - CURVE_START);
      lift = CURVE * t * t;
    }
    verts.push({ x: px, y: lift, z: -HALF_W * wScale, nx: 0, ny: 0, nz: -1, stripe: false });
    verts.push({ x: px, y: lift, z: HALF_W * wScale, nx: 0, ny: 0, nz: 1, stripe: false });
  }
  return verts;
}

const boardVerts = buildBoard();

function rotX(p, a) { const c = Math.cos(a), s = Math.sin(a); return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c }; }
function rotY(p, a) { const c = Math.cos(a), s = Math.sin(a); return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c }; }
function rotZ(p, a) { const c = Math.cos(a), s = Math.sin(a); return { x: p.x * c - p.y * s, y: p.x * s + p.y * c, z: p.z }; }

function renderBoard(A, B, C) {
  const output = new Array(W * H).fill(' ');
  const zbuf = new Array(W * H).fill(-Infinity);
  const lx = 0.6, ly = 0.8, lz = -0.3;
  const llen = Math.sqrt(lx * lx + ly * ly + lz * lz);
  const Lx = lx / llen, Ly = ly / llen, Lz = lz / llen;

  for (const v of boardVerts) {
    let p = { x: v.x, y: v.y, z: v.z };
    p = rotX(p, A); p = rotY(p, B); p = rotZ(p, C);
    let n = { x: v.nx, y: v.ny, z: v.nz };
    n = rotX(n, A); n = rotY(n, B); n = rotZ(n, C);
    const dist = 5.5;
    const fov = 1.0 / (p.z + dist);
    const sx = Math.round(p.x * fov * (W * 0.38) + W / 2);
    const sy = Math.round(-p.y * fov * (H * 0.72) + H / 2);
    if (sx < 0 || sx >= W || sy < 0 || sy >= H) continue;
    const idx = sy * W + sx;
    if (p.z + dist <= 0) continue;
    const z = fov;
    if (z > zbuf[idx]) {
      zbuf[idx] = z;
      const lum = n.x * Lx + n.y * Ly + n.z * Lz;
      const clamped = Math.max(0, lum);
      let charIdx;
      if (v.stripe) charIdx = Math.floor(clamped * (SHADING.length - 3)) + 3;
      else charIdx = Math.floor(clamped * (SHADING.length - 1));
      charIdx = Math.max(0, Math.min(SHADING.length - 1, charIdx));
      output[idx] = SHADING[charIdx];
    }
  }
  let out = '';
  for (let row = 0; row < H; row++) {
    out += output.slice(row * W, row * W + W).join('') + '\n';
  }
  return out;
}

function SnowboardAnimation() {
  const preRef = useRef(null);
  const BRef = useRef(0);
  const rafRef = useRef(null);
  const TILT_X = 0.42, TILT_Z = 0.18;

  useEffect(() => {
    function frame() {
      BRef.current += 0.022;
      if (preRef.current) {
        preRef.current.textContent = renderBoard(TILT_X, BRef.current, TILT_Z);
      }
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return <pre id="board" ref={preRef}></pre>;
}

export default function Hobby() {
  const [activeSection, setActiveSection] = useState(() => {
    if (window.location.hash) return window.location.hash.substring(1);
    return localStorage.getItem('activeSection') || 'who';
  });

  function goTo(id) {
    setActiveSection(id);
    localStorage.setItem('activeSection', id);
    history.replaceState(null, '', `#${id}`);
  }

  useEffect(() => {
    function onHashChange() {
      const newId = window.location.hash.substring(1);
      if (newId && SECTIONS.includes(newId)) {
        setActiveSection(newId);
        localStorage.setItem('activeSection', newId);
      }
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <div className="hobby-page">
      <nav className="hobby-nav">
        {SECTIONS.map(id => (
          <a
            key={id}
            href={`#${id}`}
            className={`section-link${activeSection === id ? ' active' : ''}`}
            onClick={e => { e.preventDefault(); goTo(id); }}
          >
            {id === 'ai-prompts' ? 'AI Prompts' : id.charAt(0).toUpperCase() + id.slice(1)}
          </a>
        ))}
      </nav>

      <section id="who" className={activeSection === 'who' ? 'active' : ''}>
        <h2>Who</h2>
        <figure>
          <img src="/hobby/snowboardersOnLift.jpg" alt="Snowboarders on a lift together" />
          <figcaption style={{ textAlign: 'center', fontStyle: 'italic', marginTop: '8px' }}>
            <p className="attribution">
              &quot;<a rel="noopener noreferrer" href="https://www.flickr.com/photos/75718896@N00/73358704">Snowboarders At Timberline</a>&quot; by{' '}
              <a rel="noopener noreferrer" href="https://www.flickr.com/photos/75718896@N00">frozenchipmunk</a>{' '}
              is licensed under{' '}
              <a rel="noopener noreferrer" href="https://creativecommons.org/licenses/by/2.0/?ref=openverse">CC BY 2.0</a>
            </p>
          </figcaption>
        </figure>
        <p id="my-paragraph">
          My name is Jack Henley and something I really enjoy doing when it&apos;s cold
          out is snowboarding. Snowboarding is an awesome hobby, because anyone
          can do it. Although it may be intimidating for beginners who&apos;ve only
          seen professionals doing crazy tricks, it&apos;s actually a very approachable
          hobby to anybody interested. I personally grew up in Louisiana, and
          therefore was not able to get into snowboarding until I moved to Western
          North Caronlina about four years ago. However, something that I find
          special about snowboarding, is that it&apos;s fun no matter what stage of
          learning you&apos;re at!
        </p>
        <figure>
          <img src="/hobby/snowboarderInAction.jpg" alt="Snowboarder mid-air" />
          <figcaption>
            <p className="attribution">
              &quot;<a rel="noopener noreferrer" href="https://www.flickr.com/photos/93969271@N03/12504147823">Snowboarding</a>&quot; by{' '}
              <a rel="noopener noreferrer" href="https://www.flickr.com/photos/93969271@N03">MarLeah Joy</a>{' '}
              is licensed under{' '}
              <a rel="noopener noreferrer" href="https://creativecommons.org/licenses/by/2.0/?ref=openverse">CC BY 2.0</a>
            </p>
          </figcaption>
        </figure>
      </section>

      <section id="what" className={activeSection === 'what' ? 'active' : ''}>
        <h2>What</h2>
        <div className="scene">
          {activeSection === 'what' && <SnowboardAnimation />}
        </div>
        <figure>
          <img src="/hobby/snowboardingSunnyDay.jpg" alt="Snowboarding on a sunny day" />
          <figcaption>
            <p className="attribution">
              &quot;<a rel="noopener noreferrer" href="https://www.flickr.com/photos/79105258@N00/337014991">Snowboarding</a>&quot; by{' '}
              <a rel="noopener noreferrer" href="https://www.flickr.com/photos/79105258@N00">_ambrown</a>{' '}
              is licensed under{' '}
              <a rel="noopener noreferrer" href="https://creativecommons.org/licenses/by-nc/2.0/?ref=openverse">CC BY-NC 2.0</a>.
            </p>
          </figcaption>
        </figure>
        <p id="what-text">
          Snowboarding is a hobby that takes advantage of snowfall in mountainous
          areas. While people who snowboard are constantly innovating new ways to
          enjoy the hobby, at its core, snowboarding allows you to feel a way
          that&apos;s incomparable while shredding down your mountain of choice. The
          best way I can describe the sensation of snowboarding is what I imagine
          it feels like to fly. Because the bottom of your board is usually waxed,
          the contact between your board and the snow feels practically
          frictionless, and allows you to descend down mountains with speed.
        </p>
        <a href="https://www.a1k0n.net/2011/07/20/donut-math.html" target="_blank" rel="noreferrer">
          Inspiration for the ASCII snowboard animation.
        </a>
      </section>

      <section id="when" className={activeSection === 'when' ? 'active' : ''}>
        <h2>When</h2>
        <figure>
          <img src="/hobby/winter.jpg" alt="Snowy mountain with ski lifts" />
          <figcaption>
            <p className="attribution">
              &quot;<a rel="noopener noreferrer" href="https://www.flickr.com/photos/29468339@N02/6710161193">Winter</a>&quot; by{' '}
              <a rel="noopener noreferrer" href="https://www.flickr.com/photos/29468339@N02">@Doug88888</a>{' '}
              is licensed under{' '}
              <a rel="noopener noreferrer" href="https://creativecommons.org/licenses/by-nc-sa/2.0/?ref=openverse">CC BY-NC-SA 2.0</a>
            </p>
          </figcaption>
        </figure>
        <iframe
          src="https://www.meteoblue.com/en/weather/maps/widget/?windAnimation=0&gust=0&satellite=0&cloudsAndPrecipitation=1&temperature=1&sunshine=0&extremeForecastIndex=1&geoloc=detect&tempunit=F&lengthunit=imperial&windunit=mph&zoom=8&autowidth=auto&user_key=993029451adfa1a4&embed_key=a19ffb6b1bf5f6ef&sig=9c232a5182a9813e68c0c989270be8e1a318fb592ec10c341d6c05a86909ea6b"
          title="Weather map"
        ></iframe>
        <div>
          <a href="https://www.meteoblue.com/en/weather/week/index" target="_blank" rel="noopener noreferrer">meteoblue</a>
        </div>
        <p>
          Snowboarding is obviously best enjoyed in the winter, assuming you&apos;re in
          North America. However, beyond that, there are actually some times of
          the winter that are better than others for snowboarding. In my opinion,
          the most ideal time to snowboard on the east coast is late January to
          early Febuary. This is because any snow that&apos;s fallen has had time to
          layer on top of previous snowfalls, which makes it much more pleasant to
          snowboard on. While it can be nice to go even later in the season, once
          it starts warming up, it&apos;s much more common to find ice on the
          mountainside, which can lead to pretty gnarly wipeouts if you&apos;re not
          expecting it.
        </p>
      </section>

      <section id="where" className={activeSection === 'where' ? 'active' : ''}>
        <h2>Where</h2>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4049.873115266292!2d-83.08946641932782!3d35.561967843424405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8859654875b3c999%3A0x8d30cc481a511803!2sCataloochee%20Ski%20Area!5e1!3m2!1sen!2sus!4v1773345596250!5m2!1sen!2sus"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          referrerPolicy="no-referrer-when-downgrade"
          title="Cataloochee Ski Area map"
        ></iframe>
        <figure>
          <img src="/hobby/cataloochee.jpeg" alt="A nice sunset at Cataloochee Ski Area with mountains in the background" />
        </figure>
        <p>
          As mentioned previously, I do most of my snowboarding on the east coast.
          Since I live in Western NC, one of my favorite places to go is
          Cataloochee Ski Area. This location offers a vast amount of runs for all
          skill levels, and usually doesn&apos;t get too crowded.
        </p>
      </section>

      <section id="how" className={activeSection === 'how' ? 'active' : ''}>
        <h2>How</h2>
        <p>
          Getting into snowboarding is pretty easy, but it can be a little
          intimidating at first. One of the best ways to get started is to find a
          local ski resort that offers snowboard rentals and lessons. However,
          this approach can be expensive, which can be a barrier, especially if
          you&apos;re not sure if snowboarding is something you want to commit to yet.
          Furtheromre, while it is convienient to rent gear, most of the time,
          rental snowboarding gear is not well maintained, which can make it feel
          more challenging than it should. A more effective option is to find a
          used board and pair of boots. This will allow you to practice on your
          own time, and allow you to get used to the feel of your specific gear.
          Once you have your own gear, the next step is to find somewhere to use
          it. I recommend finding somehwere that offers discounts, which can be
          super helpful, especially if you&apos;re a student.
        </p>
        <ul>
          <li><input type="checkbox" /> Find a board</li>
          <li><input type="checkbox" /> Find some boots</li>
          <li><input type="checkbox" /> Find a slope</li>
          <li><input type="checkbox" /> Strap in and go!</li>
        </ul>
        <figure>
          <img src="/hobby/snowboardGear.jpg" alt="A man standing with snowboarding gear on." />
          <figcaption>
            <p className="attribution">
              &quot;<a rel="noopener noreferrer" href="https://www.flickr.com/photos/32642690@N08/3564124599">D3 Snowboard Boots</a>&quot; by{' '}
              <a rel="noopener noreferrer" href="https://www.flickr.com/photos/32642690@N08">kikfoto</a>{' '}
              is licensed under{' '}
              <a rel="noopener noreferrer" href="https://creativecommons.org/licenses/by-nd/2.0/?ref=openverse">CC BY-ND 2.0</a>
            </p>
          </figcaption>
        </figure>
      </section>

      <section id="why" className={activeSection === 'why' ? 'active' : ''}>
        <h2>Why</h2>
        <figure>
          <img src="/hobby/snowboardGroupJump.jpg" alt="Four snowboarders mid-jump" />
          <figcaption>
            <p className="attribution">
              &quot;<a rel="noopener noreferrer" href="https://www.flickr.com/photos/44217191@N05/4939691102">Getting air off the Wu-Tang in the Men&apos;s Snowboard Boardercross Finals - The Brits, Laax 2010</a>&quot; by{' '}
              <a rel="noopener noreferrer" href="https://www.flickr.com/photos/44217191@N05">bobaliciouslondon</a>{' '}
              is licensed under{' '}
              <a rel="noopener noreferrer" href="https://creativecommons.org/licenses/by/2.0/?ref=openverse">CC BY 2.0</a>.
            </p>
          </figcaption>
        </figure>
        <p>
          Everyone has their own reasons for enjoying snowboarding. Snowboarding
          can serve as a nice way to connect with nature and stay active during
          cold winter months. For others, snowboarding offers a convienient way to
          get an adrenaline rush and have fun with friends. Regardless of your
          reasons, snowboarding is undoubtedly a fun and rewarding hobby that can
          be enjoyed by people of all ages and skill levels. One of the most
          satisfying parts of snowboarding is just how good it feels to realize
          that your skill has improved. When you first start snowboarding, even
          just making it down a beginner slope without falling can feel like a
          huge accomplishment. As you progress, you&apos;ll find that you can take on
          more challenging terrain, and eventually start learning tricks. Each new
          skill you master can give you a great sense of achievement and keep you
          motivated to keep improving.
        </p>
        <figure>
          <img src="/hobby/snowboardRailGrind.jpg" alt="A snowboarder grinding on a rail" />
          <figcaption>
            <p className="attribution">
              &quot;<a rel="noopener noreferrer" href="https://www.flickr.com/photos/46314851@N06/12797847085">Camp of Champions Snowboard Camp 171</a>&quot; by{' '}
              <a rel="noopener noreferrer" href="https://www.flickr.com/photos/46314851@N06">Camp of Champions</a>{' '}
              is licensed under{' '}
              <a rel="noopener noreferrer" href="https://creativecommons.org/licenses/by/2.0/?ref=openverse">CC BY 2.0</a>.
            </p>
          </figcaption>
        </figure>
      </section>

      <section id="ai-prompts" className={activeSection === 'ai-prompts' ? 'active' : ''}>
        <h2>AI Prompts</h2>
        <h3>General Webpage Outline</h3>
        <p>
          Can you make me webpage structured with six disctinct sections such that
          it looks like each section is its own webpage. It should have
          sections called who, what, when, where, how, why, and AI prompts.
          Each section should have an h2 heading. The header/nav should
          contain links to each section that allow us to switch between
          sections quickly. The use of CSS/JS should make it so that only the
          selected section is visible at a time (like a single-page app).
          The &apos;what (home)&apos; page should be the default visible page. - Gemma3:8b local
        </p>
        <h3>Single-page Web App Development</h3>
        <p>
          Can you modify this webpage such that each section takes up the entirety
          of the screen and appears as a single webpage? Can you also modify this
          webpage so that the nav links allow us to switch to different sections.
          -Claude Haiku 4.5 (VS-Code Copilot)
        </p>
        <h3>Snowboard ASCII Animation</h3>
        <p>
          Are you familliar with the famous c-donut program?<br />
          Do you think it would be possible to make a similar program that animates a custom ascii
          which I could embed in my website in a paragraph element? Claude Sonnet 4.6
        </p>
        <h3>Snowboarder Cursor</h3>
        <p>
          Do you think you can make a custom snowboard-themed cursor? Maybe a
          little guy on a snowboard, or just a snowboard itself. Claude Sonnet 4.6
        </p>
        <h3>Summary</h3>
        <p>
          Overall, I found AI models to be helpful in the foundational design of
          my webpage. I also found the use of AI to be helpful when it came to
          creating custom webpage elements, such as the snowboard ASCII animation,
          or the snowboarder cursor.
        </p>
      </section>

      <footer className="hobby-footer">
        <a href="/itis3135/jackhenleydesigns">Design Firm</a>
      </footer>
    </div>
  );
}
