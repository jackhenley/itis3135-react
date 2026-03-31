import '../styles/itis3135.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function WebsiteEvaluations() {
  return (
    <div className="itis3135-layout">
      <Header />
      <main>
        <h2>Website Evaluations</h2>
        <section>
          <a href="https://theclimatedictionary.com/" target="_blank" rel="noreferrer">
            <h3>The Climate Dictionary</h3>
          </a>
          <ul>
            <li>
              Contrast: This site manages contrast exceptionally well. The site
              offers both a light and dark mode, both of which are pleasant on the
              eyes. In light mode, sections use light grey for the background,
              which is more pleasant than the solid white background for reading.
              In dark mode, sections use a dark grey background, which makes text
              more readable than if it were on the solid black background.
            </li>
            <li>
              Repetition: Once again, I feel that this site utilizes repetition
              very well. Each definition gets its own section, which includes
              pronunciations, a descriptive definition, and links to sources. As
              mentioned before, sections are also given a slightly different
              background than the main backgroun of the webpage, which helps
              distinguish between different sections.
            </li>
            <li>
              Alignment: As mentioned in the previous item, sections are easily
              distinguised because each definition gets its own background. This
              site also utilizes very light borders around each definition to
              further distinguish elements.
            </li>
            <li>
              Proximity: Different elements are easily distinguishable due to the
              style of the site. Furthermore, related items are grouped together
              within the different sections. Whitespace is used effectively to
              definitively separate unrelated items.
            </li>
          </ul>
        </section>

        <section>
          <a href="https://www.berkshirehathaway.com/" target="_blank" rel="noreferrer">
            <h3>Berkshire Hathaway</h3>
          </a>
          <ul>
            <li>
              Contrast: This site uses a plain white background wtih dark blue
              colored text. White the use of dark blue over black might be
              slightly easier on the eyes, it is nonetheless very unpleasant to
              view.
            </li>
            <li>
              Repetition: The main content of this site is links directing to news
              and information regarding the company. The links are contained in an
              unordered list, so each one is associated with a bullet point. I
              would consider this design to be pretty unremarkable.
            </li>
            <li>
              Alignment: The sections of the site itself are separated by
              horizontal rules. Although this is a simple way to do so, it does
              work adequately.
            </li>
            <li>
              Proximity: While the separation between distinct sections on this
              site is adequate, the separation between distinct elements in the
              same section is virtually nonexistent aside from whitespace in
              between different elements.
            </li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
