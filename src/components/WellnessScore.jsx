import { useLivData } from '../context/LivDataContext';

export default function WellnessScore() {
  const { reportsData, loading } = useLivData();
  const awisScore = reportsData?.awisScore ?? 78;
  const scoreDisplay = loading ? '...' : awisScore;

  const displayCategories = reportsData?.categories && Array.isArray(reportsData.categories) && reportsData.categories.length > 0
    ? reportsData.categories
    : [
        { name: 'Hormonal and metabolic', status: 'On track', percentage: 82 },
        { name: 'Inflammation', status: 'Keep an eye', percentage: 58 },
        { name: 'Skin and hair', status: 'On track', percentage: 74 },
      ];

  const finePrint = reportsData?.finePrint || (reportsData?.categories ? 'Sample member · illustrative values' : 'Sample member · illustrative values');

  return (
    <section className="sec inv" id="score">
      <div className="wrap score">
        <div className="bigring" role="img" aria-label={`Sample Active Integrated Wellness Score of ${awisScore}`}>
          <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="92" fill="none" stroke="#DCDCD5" strokeWidth="2"/>
            <circle
              id="bigArc"
              cx="100" cy="100" r="92"
              fill="none" stroke="#0A0A0B" strokeWidth="2.5"
              strokeLinecap="round" strokeDasharray="450.9 578.1"
            />
          </svg>
          <div>
            <b className="num" id="bigNum" data-target={awisScore}>{scoreDisplay}</b>
            <span>AWIS</span>
          </div>
        </div>
        <div>
          <p className="k">Your score</p>
          <h2>One number.<br /><em>Everything behind it.</em></h2>
          <p className="lede">AWIS is your Active Integrated Wellness Score. It gathers everything the pod learns into a single number you can understand at a glance, and follow over time.</p>
          <div className="tracks">
            {displayCategories.map((cat, i) => (
              <div className="track" key={cat.name || i}>
                <h3>{cat.name}</h3>
                <span className="state">{cat.status}</span>
                <div className="bar">
                  <i style={{ '--w': `${cat.percentage ?? 0}%` }}></i>
                </div>
              </div>
            ))}
          </div>
          <p className="fine">{finePrint}</p>
        </div>
      </div>
    </section>
  );
}
