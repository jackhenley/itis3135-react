export default function JackHenleyDesigns() {
  return (
    <div style={{ backgroundColor: '#F1FFFA', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#F1FFFA', padding: '20px', textAlign: 'left' }}>
        <h1 style={{ color: '#785964', fontFamily: "'lato', sans-serif" }}>Jack Henley Designs</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: '#785964', fontFamily: "'Lato', sans-serif" }}>Home</h2>
          </div>
          <figure>
            <img src="/jackhenleydesigns/JHDLogoNobg.png" id="company-logo" alt="My company logo" style={{ width: '250px', height: 'auto', backgroundColor: '#F1FFFA' }} />
          </figure>
        </div>
      </header>
      <main style={{ backgroundColor: '#93B7BE', padding: '20px' }}>
        <p style={{ color: '#454545', fontFamily: 'frutiger, sans-serif' }}>
          At Jack Henley Designs, our goal is to design your website to
          look as good as possible. We will work with you to create and design your
          website to your exact specifications. As we all know, they way your
          website looks can make the difference between making a sale or
          making a customer for life.
        </p>
        <ul style={{ color: '#454545', fontFamily: 'frutiger, sans-serif', listStyleType: 'upper-roman' }}>
          <li>We care about customer satisfaction</li>
          <li>We follow the CRAP principals</li>
          <li>We are committed to quality</li>
          <li>We deliver our products on time</li>
          <li>We are responsive to customer needs</li>
        </ul>
        <section id="contact-info" style={{ backgroundColor: '#D5C7BC', padding: '20px', marginTop: '20px' }}>
          <h3 style={{ color: '#785964', fontFamily: "'Lato', sans-serif" }}>Contact Us</h3>
          <p style={{ color: '#454545', fontFamily: 'frutiger, sans-serif' }}>Phone: 555-555-5555</p>
          <p style={{ color: '#454545', fontFamily: 'frutiger, sans-serif' }}>Email: jackhenleydesigns@yoohoo.co</p>
          <p style={{ color: '#454545', fontFamily: 'frutiger, sans-serif' }}>Address: 246 Mane Street, Shreveport, USA</p>
        </section>
      </main>
      <footer style={{ backgroundColor: '#785964', padding: '20px', textAlign: 'center', fontFamily: 'frutiger, sans-serif', color: '#93B7BE' }}>
        <p>&copy; 2024 Jack Henley Designs</p>
      </footer>
    </div>
  );
}
