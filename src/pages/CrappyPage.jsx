export default function CrappyPage() {
  return (
    <div>
      <title>Jack Henley | Crappy Page</title>
      <h1>My Dream Car</h1>


      <img
        src="/images/grRolla"
        alt="A well-parked, bright blue GR Corolla sitting in a parking lot with a bunch of other cars. The car has a sizable spoiler considering that it's a hatchback, and it can immediately be identified as a GR Corolla by the aggressive front bumper and hood vents."
        width="300"
        height="400"
        style={{
          borderTop: '20px solid black',
          borderBottom: '2px purple',
          borderLeft: '10px solid red',
          borderRight: '10px solid orange',
        }}
      />

      <br />
      <h5 style={{ fontFamily: 'Papyrus' }}>
        Although I enjoyed using Endeavouros, I unfortunately had to revert my
        system back to only running Windows 11 because I running out of room on my
        drive while dual-booting.
      </h5>

      <h2>Isn&apos;t it just a corolla?</h2>

      <p style={{ fontFamily: 'Comic Sans MS', fontSize: '16px' }}>
        The GR Corolla is a high-performance version of the extremely well-known
        Toyota Corolla. Although you might assume that since the names are
        similar, the cars must be similar also, this is not the case. The GR
        Corolla is more similar to its rally ancestors than it is to its modern
        day counterparts.
      </p>

      <h3>What makes the GR Corolla so desirable?</h3>
      <p style={{ margin: '20px 40px 20px 150px', textDecoration: 'underline' }}>
        The{' '}
        <span style={{ fontFamily: 'Papyrus', color: 'blueviolet', backgroundColor: 'rgb(167, 231, 5)' }}>
          GR Corolla
        </span>{' '}
        is the greatest modern hot hatchback available today. Not only is it a
        very capable sports car for a variety of motorsports, but because it&apos;s a
        four-door hatchback, it is also practical. Owning a GR Corolla means that
        after you&apos;re done running errands and driving to work during the week, you
        can push your limits at a track day on the weekend. Or if you prefer to
        take it back to its roots, you can find a{' '}
        <span style={{ color: 'rgb(167, 231, 5)' }}>private</span> gravel road to test
        your skills as a rally driver.
      </p>

      <h4>Tech Specs</h4>
      <p>
        The GR Corolla has many features that set it apart from other modern day
        hot hatchbacks. Some of which are:
      </p>
      <ul style={{ margin: '40px 40px 40px 200px' }}>
        <li>
          Its powerful, turbocharged three cylinder engine, cranking out 300
          horsepower
        </li>
        <li>Its adjustable all wheel drive system</li>
        <li>It&apos;s offered in a manual</li>
      </ul>
    </div>
  );
}
