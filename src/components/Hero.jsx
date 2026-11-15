import { useLivData } from '../context/LivDataContext';

export default function Hero() {
  const { reportsData, loading } = useLivData();
  const { awisScore, riskLabel } = reportsData;

  const scoreDisplay = loading ? '...' : (awisScore !== null ? awisScore : '--');
  const scoreLabel = awisScore !== null ? (riskLabel || 'AWIS') : 'AWIS';
  const statusNote = awisScore !== null ? (riskLabel || 'Active score') : (loading ? 'Loading...' : 'Sample score');

  return (
    <section className="sec hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <p className="k">The Liv Pod · By The Living Lab</p>
            <h1>One visit.<br /><em>The whole you.</em></h1>
            <p className="lede">
              Step into a private pod and simply talk. You walk out with one clear picture of your wellbeing, reviewed by a doctor, and a plan that stays with you on your phone.
            </p>
            <div className="trust">
              <span>Voice-first</span>
              <span>Doctor-reviewed</span>
              <span>Private by design</span>
              <span>Built in India</span>
            </div>
          </div>
          <div className="podwrap">
            <div className="pod" role="img" aria-label="The pod, holding the app, holding you.">
              <div className="app">
                <div className="ring">
                  <svg viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#29292C" strokeWidth="2.5"/>
                    <circle
                      id="heroArc"
                      cx="60" cy="60" r="54"
                      fill="none" stroke="#F5F5F1" strokeWidth="2.5"
                      strokeLinecap="round" strokeDasharray="0 339.3"
                    />
                  </svg>
                  <div>
                    <b className="num" id="heroNum" data-target={awisScore ?? ''}>{scoreDisplay}</b>
                    <span>{scoreLabel}</span>
                  </div>
                </div>
                <small>{statusNote}</small>
              </div>
              <div className="you"></div>
            </div>
            <p className="podcap">The pod · The app · You</p>
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <b className="num" id="stat100">100+</b>
            <p>things the pod learns about you in one conversation</p>
          </div>
          <div className="stat">
            <b className="num">3</b>
            <p>simple moments. Sit, stand, lie</p>
          </div>
          <div className="stat">
            <b className="num">0</b>
            <p>forms to fill in. You just talk</p>
          </div>
          <div className="stat">
            <b className="num">1</b>
            <p>score that brings it all together</p>
          </div>
        </div>
      </div>
    </section>
  );
}
