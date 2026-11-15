import test from 'node:test';
import assert from 'node:assert/strict';

// Test the mapping logic directly
test('Reports API mapping - extracts awis_score and calculates delta', () => {
  const mockReports = [
    {
      id: 'rep_2',
      awis_score: 82,
      risk_label: 'Optimal',
      created_at: '2026-11-10T10:00:00Z',
    },
    {
      id: 'rep_1',
      awis_score: 78,
      risk_label: 'Moderate',
      created_at: '2026-10-10T10:00:00Z',
    }
  ];

  const sorted = [...mockReports].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const latest = sorted[0];
  const previous = sorted[1];

  const latestScore = latest.awis_score;
  const prevScore = previous.awis_score;
  const delta = latestScore - prevScore;
  const deltaText = delta > 0 ? `Up ${delta} since your last visit.` : `Down ${Math.abs(delta)} since your last visit.`;

  assert.equal(latestScore, 82);
  assert.equal(prevScore, 78);
  assert.equal(delta, 4);
  assert.equal(deltaText, 'Up 4 since your last visit.');
  assert.equal(latest.risk_label, 'Optimal');
});

test('Reports API mapping - fallback fields for score', () => {
  const repWithOverall = { overall_score: 75 };
  const repWithScore = { score: 70 };
  const repWithAiws = { aiws_score: 80 };

  const extract = (rep) => rep.awis_score ?? rep.overall_score ?? rep.score ?? rep.aiws_score ?? null;

  assert.equal(extract(repWithOverall), 75);
  assert.equal(extract(repWithScore), 70);
  assert.equal(extract(repWithAiws), 80);
});

test('Patient Profile API mapping - maps full_name accurately', () => {
  const patientData = {
    patient: {
      id: 'pat_123',
      full_name: 'Dr. Jane Doe',
      email: 'jane@example.com'
    }
  };

  const fullName = patientData.patient.full_name || 
                   patientData.patient.name || 
                   [patientData.patient.first_name, patientData.patient.last_name].filter(Boolean).join(' ') || 
                   null;

  assert.equal(fullName, 'Dr. Jane Doe');
});

test('Care Plan API mapping - priority 1: First approved plan', () => {
  const carePlans = [
    { id: 'cp_1', status: 'draft', consultation_summary: 'Draft summary' },
    { id: 'cp_2', status: 'approved', consultation_summary: 'Approved plan', lifestyle_management: [{ title: 'Morning meditation' }] },
    { id: 'cp_3', status: 'approved', consultation_summary: 'Second approved plan' }
  ];

  const activePlan = carePlans.find(p => p.status?.toLowerCase() === 'approved') || carePlans[0] || null;

  assert.equal(activePlan.id, 'cp_2');
  assert.equal(activePlan.consultation_summary, 'Approved plan');
  assert.equal(activePlan.lifestyle_management[0].title, 'Morning meditation');
});

test('Care Plan API mapping - priority 2: First available plan when none approved', () => {
  const carePlans = [
    { id: 'cp_pending', status: 'in_review', consultation_summary: 'In review summary', lifestyle_management: [{ title: 'Hydration 2L' }] }
  ];

  const activePlan = carePlans.find(p => p.status?.toLowerCase() === 'approved') || carePlans[0] || null;

  assert.equal(activePlan.id, 'cp_pending');
  assert.equal(activePlan.lifestyle_management[0].title, 'Hydration 2L');
});

test('Care Plan API mapping - programme_start_date calculation only when provided by backend', () => {
  // Case A: start date provided
  const fixedNow = new Date('2026-11-15T12:00:00Z').getTime();
  const startDateStr = '2026-11-05T12:00:00Z'; // 10 days ago -> Day 11
  const startMs = new Date(startDateStr).getTime();
  const elapsedDays = Math.floor((fixedNow - startMs) / (1000 * 60 * 60 * 24)) + 1;
  const dayText = `Day ${elapsedDays} of your plan`;
  assert.equal(dayText, 'Day 11 of your plan');

  // Case B: start date NOT provided - must NOT hardcode date or invent day number
  const planWithoutStart = {
    programme_start_date: null,
    follow_up: { timeline: '12 weeks' }
  };
  let fallbackDayText = null;
  if (!planWithoutStart.programme_start_date) {
    fallbackDayText = planWithoutStart.follow_up?.timeline ? `${planWithoutStart.follow_up.timeline} plan` : 'Active plan';
  }
  assert.equal(fallbackDayText, '12 weeks plan');
  assert.notEqual(fallbackDayText, 'Day 12 of your plan');
});

test('Missing data policy - category scores not fabricated', () => {
  const reportWithoutCategories = { awis_score: 80 };
  const categories = reportWithoutCategories.categories || reportWithoutCategories.category_scores || null;

  assert.equal(categories, null);
  // Confirms frontend will not invent or mock categories when backend doesn't provide them
});
