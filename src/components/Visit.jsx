import { Icon } from './Icons';

export default function Visit() {
  return (
    <section className="sec" id="visit">
      <div className="wrap">
        <div className="head">
          <p className="k">The visit</p>
          <h2>Sit. Stand. Lie.<br /><em>That is all we ask.</em></h2>
          <p className="lede">Liv, the voice of the pod, guides every moment in the language you are most comfortable in. There is nothing to prepare and nothing to remember.</p>
        </div>
        <ol className="steps">
          <li className="step">
            <div className="top">
              <span className="n">01</span>
              <Icon name="consent" />
            </div>
            <h3>Step in</h3>
            <p className="sub">The glass turns private and Liv says hello. You decide what you share before anything begins.</p>
          </li>
          <li className="step">
            <div className="top">
              <span className="n">02</span>
              <span className="tag">Sit</span>
            </div>
            <h3>Talk</h3>
            <p className="sub">A conversation, not a questionnaire. While you speak, the pod takes its first readings.</p>
          </li>
          <li className="step">
            <div className="top">
              <span className="n">03</span>
              <span className="tag">Stand</span>
            </div>
            <h3>Be seen</h3>
            <p className="sub">A few seconds standing still. The pod reads how you stand, how you are built, your skin and your hair.</p>
          </li>
          <li className="step last">
            <div className="top">
              <span className="n">04</span>
              <span className="tag">Lie</span>
            </div>
            <h3>Let go</h3>
            <p className="sub">Lie back and recover while the pod finishes its work. Most people ask for five more minutes.</p>
          </li>
        </ol>
        <p className="swipe">Swipe to follow the visit →</p>
      </div>
    </section>
  );
}
