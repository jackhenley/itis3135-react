import { useEffect } from 'react';
import '../styles/itis3135.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Introduction() {
  useEffect(() => {
    document.title = 'Jack Henley | Introduction';
  }, []);
  return (
    <div className="itis3135-layout">
      <Header />
      <main>
        <h2>Jack Henley</h2>
        <figure>
          <img
            src="/images/introPhoto.jpg"
            alt="Picture of me in early morning fog"
            width="500"
            height="300"
          />
          <figcaption><em>One of my favorite camping memories</em></figcaption>
        </figure>
        <p>
          I&apos;m a junior studying computer science with a concentration in AI,
          robotics, and gaming. I transferred from WCU for the fall semester and
          have so far been enjoying my time here at UNCC. I enjoy hiking, playing
          violin and mandolin, and playing video games in my free time.
        </p>
        <ul>
          <li>
            <b>Personal Background: </b>I grew up in Louisiana and moved to
            Asheville, NC about four years ago. I&apos;m pursuing a degree in computer
            science because I enjoy problb solving and the challenge of figuring
            things out.
          </li>
          <li>
            <b>Professional Background: </b>I have yet to work a role in the
            software industry, however I have taught coding classes for the
            company I work for.
          </li>
          <li>
            <b>Acadbic Background: </b>I started pursuing computer science at WCU,
            and decided that UNCC would be a better fit for me.
          </li>
          <li>
            <b>Primary work computer &amp; location</b>I use an Asus G14 laptop as my
            &quot;desktop&quot; at home, and dual boot Windows 11 and EndeavourOS on it.
          </li>
          <li>
            <b>Backup work computer &amp; location: </b>I carry an M2 Macbook air with
            me to class because it has a much better battery life than my g14 and
            is able to handle most of the tasks I need it to while on campus.
          </li>
          <li>
            <b>Current courses:</b>
            <ol>
              <li><b>ITSC3155 - Software Engineering</b></li>
              <li><b>ITSC2181 - Intro to Computer Systems</b></li>
              <li><b>ITSC3688 - Computers and Their Impact on Society</b></li>
              <li><b>ITIS3135 - Front-End Web Application Development</b></li>
              <li>
                <b><s>STAT2122 - Intro. to Probability and Statistics</s></b>
              </li>
            </ol>
          </li>
        </ul>
        <blockquote>
          <p>
            &quot;It&apos;s the greatest gig in the world, being alive. You get to eat
            Denny&apos;s, wear a hat, whatever you want to do.&quot;
          </p>
          <cite>- Norm Macdonald</cite>
        </blockquote>
      </main>
      <Footer />
    </div>
  );
}
