import { useLivData } from '../context/LivDataContext';

export default function WellnessScore() {
  const { reportsData, loading } = useLivData();
  const { awisScore, riskLabel, categories } = reportsData;

  const scoreDisplay = loading ? '...' : (awisScore !== null ? awisScore : '--');

  // Specific requirement: Do not invent mappings from unrelated categories.
  // If unavailable, preserve UI structure with an appropriate unavailable state.
  const displayCategories = categories && Array.isArray(categories) && categories.length > 0
    ? categories
    : [
        { name: 'Hormonal and metabolic', status: 'Pending assessment', percentage: 0 },
        { name: 'Inflammation', status: 'Pending assessment', percentage: 0 },
        { name: 'Skin and hair', status: 'Pending assessment', percentage: 0 },
      ];

  const finePrint = awisScore !== null
    ? (categories ? 'Based on your latest assessment' : 'Category breakdown pending pod assessment')
    : (loading ? 'Loading assessment...' : 'No assessment data on record');

  return (
    <section className="sec inv" id="score">
      <div className="wrap score">
        <div className="bigring" role="img" aria-label="Active Integrated Wellness Score">
          <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="92" fill="none" stroke="#DCDCD5" strokeWidth="2"/>
            <circle
              id="bigArc"
              cx="100" cy="100" r="92"
              fill="none" stroke="#0A0A0B" strokeWidth="2.5"
              strokeLinecap="round" strokeDasharray="0 578.1"
            />
          </svg>
          <div>
            <b className="num" id="bigNum" data-target={awisScore ?? ''}>{scoreDisplay}</b>
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
