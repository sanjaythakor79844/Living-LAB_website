import { Icon } from './Icons';

export default function Centres() {
  return (
    <section className="sec inv" id="centres">
      <div className="wrap">
        <div className="head">
          <p className="k">For wellness centres and clinics</p>
          <h2>Give your members<br /><em>a reason to return.</em></h2>
          <p className="lede">The Living Lab arrives as one complete experience inside the space you already have. We set it up. You run your centre.</p>
        </div>

        <div className="why">
          <article>
            <Icon name="heart" />
            <h3>A first visit they remember</h3>
            <p>The pod turns a routine check-in into the moment members tell their friends about.</p>
          </article>
          <article>
            <Icon name="loop" />
            <h3>A reason to come back</h3>
            <p>Liv keeps every member connected to your centre between visits.</p>
          </article>
          <article>
            <Icon name="link" />
            <h3>Your therapies, connected</h3>
            <p>What you already offer becomes part of one story for each member.</p>
          </article>
          <article>
            <Icon name="key" />
            <h3>Ready to run</h3>
            <p>We build it, train your team and keep it running. You open the door.</p>
          </article>
        </div>

        <p className="subhead">Three pods</p>
        <div className="tiers">
          <article className="tier">
            <p className="k">Tier 01</p>
            <h3>Basic</h3>
            <p>The fastest way to make a centre AI-native.</p>
            <ul>
              <li>Private pod with the Living Lab Kiosk</li>
              <li>A voice-led visit with Liv</li>
              <li>Core wellness readings</li>
              <li>The body scan</li>
              <li>AIWS score and the Liv app</li>
            </ul>
          </article>
          <article className="tier">
            <p className="k">Tier 02</p>
            <h3>Pro</h3>
            <p>Reading and recovery in one visit.</p>
            <ul>
              <li>Everything in Basic</li>
              <li>A wider set of wellness readings</li>
              <li>The recliner experience</li>
              <li>Photobiomodulation, integrated with the pod</li>
              <li>Recovery built into the visit</li>
            </ul>
          </article>
          <article className="tier top">
            <p className="k">Tier 03</p>
            <h3>Elite</h3>
            <p>The whole pod as one connected experience.</p>
            <ul>
              <li>Everything in Pro</li>
              <li>Experiences for the mind and the face</li>
              <li>Face, skin and hair reading</li>
              <li>Your existing therapies, connected</li>
              <li>A pod tailored to your centre</li>
            </ul>
          </article>
        </div>

        <p className="subhead" style={{ marginTop: 'clamp(40px, 5vw, 64px)' }}>Two ways to work with us</p>
        <div className="models">
          <article className="model">
            <h3>Base</h3>
            <p>The Living Lab Kiosk and HumanOS at your centre, for your members only, with privacy and consent protection built in.</p>
          </article>
          <article className="model">
            <h3>Premium</h3>
            <p>Everything in Base, plus a premium app, kiosk and pod, onboarding for your team and your existing therapies connected.</p>
          </article>
        </div>
        <p className="note">Commercials are shared on request and depend on your space and what you already have.</p>
      </div>
    </section>
  );
}
