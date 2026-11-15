import { Icon } from './Icons';
import { useLivData } from '../context/LivDataContext';

export default function LivApp() {
  const { profileData, reportsData, carePlanData, assistantMessage, loading } = useLivData();

  const patientName = profileData.fullName || (loading ? 'Loading...' : 'Member');
  const score = loading ? '...' : (reportsData.awisScore !== null ? reportsData.awisScore : '--');
  const deltaText = reportsData.deltaText || (reportsData.awisScore !== null ? 'Latest assessment' : (loading ? 'Loading...' : 'No assessment on record'));

  const taskTitle = carePlanData.dailyTaskTitle || (loading ? 'Loading plan...' : 'No active plan task');
  const planTimeline = carePlanData.programmeDayText || (loading ? 'Fetching care plan...' : 'Care plan pending');
  const messageText = assistantMessage || (loading ? 'Connecting with Liv...' : 'Liv is ready to guide your wellness journey.');

  return (
    <section className="sec" id="liv">
      <div className="wrap liv">
        <div>
          <p className="k">The Liv app</p>
          <h2>The visit ends.<br /><em>Liv does not.</em></h2>
          <p className="lede">
            Liv is the same voice you met in the pod. On your phone she explains your report, sets the day's priorities and keeps your plan moving until you are back.
          </p>
          <ul className="pts">
            <li>
              <Icon name="score" />
              <div>
                <h3>Your score, explained</h3>
                <p>See where you stand today, and where you could be.</p>
              </div>
            </li>
            <li>
              <Icon name="plan" />
              <div>
                <h3>A plan that moves with you</h3>
                <p>Set by your doctor. Broken into small wins, with milestones worth reaching.</p>
              </div>
            </li>
            <li>
              <Icon name="chat" />
              <div>
                <h3>Liv, a message away</h3>
                <p>Ask anything about your report and plan without leaving the app.</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="phone" role="img" aria-label="The Liv app home screen with score, plan card and message from Liv">
          <div className="bar">
            <span>Liv</span>
            <span>{patientName}</span>
          </div>
          <div className="card w">
            <div className="row">
              <b className="num">{score}</b>
              <span className="k" style={{ margin: 0, color: '#55554F' }}>AWIS</span>
            </div>
            <p className="sub" style={{ marginTop: '10px' }}>{deltaText}</p>
          </div>
          <div className="card">
            <p className="k" style={{ marginBottom: '10px' }}>Today</p>
            <h3>{taskTitle}</h3>
            <p className="sub" style={{ marginTop: '4px' }}>{planTimeline}</p>
          </div>
          <div className="card msg">
            <b>LIV</b>
            <span id="livText">{messageText}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
