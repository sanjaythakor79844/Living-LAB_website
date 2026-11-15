import { Icon } from './Icons';

export default function HumanOS() {
  return (
    <section className="sec" id="humanos" style={{ paddingTop: 0 }}>
      <div className="wrap os">
        <div className="flow" aria-label="How a visit becomes one picture">
          <p className="cap">Inside the pod</p>
          <div className="row"><span>Your voice</span><span>Heard</span></div>
          <div className="row"><span>Your body</span><span>Read</span></div>
          <div className="row"><span>Your blood</span><span>Measured</span></div>
          <div className="row"><span>Your skin and hair</span><span>Seen</span></div>
          <div className="arrow">↓ brought together</div>
          <div className="core">HUMANOS</div>
          <div className="arrow">↓ reviewed by a doctor</div>
          <div className="row"><span>One clear picture</span><span>In the pod</span></div>
          <div className="row"><span>One score, one plan</span><span>On your phone</span></div>
        </div>
        <div>
          <p className="k">The platform</p>
          <h2>HumanOS.<br /><em>The mind of the pod.</em></h2>
          <p className="lede">HumanOS is the intelligence behind everything. It takes what the pod learns in one visit and turns it into one clear picture of you.</p>
          <div className="vals">
            <div className="val">
              <h3><Icon name="mic" className="ic" />Voice first</h3>
              <p>You talk. Liv listens.</p>
            </div>
            <div className="val">
              <h3><Icon name="pen" className="ic" />Nothing to fill in</h3>
              <p>No forms, no typing, no desk.</p>
            </div>
            <div className="val">
              <h3><Icon name="check" className="ic" />Checked by doctors</h3>
              <p>A doctor reviews every report.</p>
            </div>
            <div className="val">
              <h3><Icon name="lock" className="ic" />Private by design</h3>
              <p>You choose what you share.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
