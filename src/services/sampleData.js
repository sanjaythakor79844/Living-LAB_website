/**
 * Sample / Mock Data for The Living Lab Frontend
 * 
 * Provides complete illustrative data for the UI when the backend is not connected.
 * Values correspond to the Living Lab showcase specification.
 */

export const SAMPLE_PROFILE = {
  patient: {
    id: 'sample_patient_001',
    full_name: 'Sample member',
    name: 'Sample member',
    first_name: 'Sample',
    last_name: 'member',
    email: 'member@thelivinglab.ai',
    membership_tier: 'Pro',
    joined_date: '2026-09-01T00:00:00Z',
  },
  fullName: 'Sample member',
};

export const SAMPLE_REPORTS = {
  reports: [
    {
      id: 'rep_sample_002',
      awis_score: 78,
      previous_score: 74,
      risk_label: 'On track',
      created_at: '2026-11-14T10:00:00Z',
      categories: [
        { name: 'Hormonal and metabolic', status: 'On track', percentage: 82 },
        { name: 'Inflammation', status: 'Keep an eye', percentage: 58 },
        { name: 'Skin and hair', status: 'On track', percentage: 74 },
      ],
      assistant_message: 'Your report is ready. Shall I walk you through it?',
    },
    {
      id: 'rep_sample_001',
      awis_score: 74,
      risk_label: 'Moderate',
      created_at: '2026-10-14T10:00:00Z',
    },
  ],
  latestReport: {
    id: 'rep_sample_002',
    awis_score: 78,
    previous_score: 74,
    risk_label: 'On track',
    created_at: '2026-11-14T10:00:00Z',
    categories: [
      { name: 'Hormonal and metabolic', status: 'On track', percentage: 82 },
      { name: 'Inflammation', status: 'Keep an eye', percentage: 58 },
      { name: 'Skin and hair', status: 'On track', percentage: 74 },
    ],
    assistant_message: 'Your report is ready. Shall I walk you through it?',
  },
  previousReport: {
    id: 'rep_sample_001',
    awis_score: 74,
    risk_label: 'Moderate',
    created_at: '2026-10-14T10:00:00Z',
  },
  awisScore: 78,
  previousScore: 74,
  delta: 4,
  deltaText: 'Up 4 since your last visit.',
  riskLabel: 'On track',
  categories: [
    { name: 'Hormonal and metabolic', status: 'On track', percentage: 82 },
    { name: 'Inflammation', status: 'Keep an eye', percentage: 58 },
    { name: 'Skin and hair', status: 'On track', percentage: 74 },
  ],
  finePrint: 'Sample member · illustrative values',
  assistantMessage: 'Your report is ready. Shall I walk you through it?',
};

export const SAMPLE_CARE_PLAN = {
  carePlans: [
    {
      id: 'cp_sample_001',
      status: 'approved',
      title: 'Circadian and metabolic reset',
      consultation_summary: 'Focus on sleep consistency, circadian rhythm reset, and morning light exposure.',
      daily_task: 'Morning light, ten minutes',
      lifestyle_management: [
        {
          title: 'Morning light, ten minutes',
          recommendation: 'Get 10 minutes of direct morning sunlight within 30 minutes of waking.',
        },
      ],
      follow_up: { timeline: '30 days', duration_days: 30 },
      programme_start_date: '2026-11-04T00:00:00Z',
      assistant_message: 'Your report is ready. Shall I walk you through it?',
    },
  ],
  activePlan: {
    id: 'cp_sample_001',
    status: 'approved',
    title: 'Circadian and metabolic reset',
    consultation_summary: 'Focus on sleep consistency, circadian rhythm reset, and morning light exposure.',
    daily_task: 'Morning light, ten minutes',
    lifestyle_management: [
      {
        title: 'Morning light, ten minutes',
        recommendation: 'Get 10 minutes of direct morning sunlight within 30 minutes of waking.',
      },
    ],
    follow_up: { timeline: '30 days', duration_days: 30 },
    programme_start_date: '2026-11-04T00:00:00Z',
    assistant_message: 'Your report is ready. Shall I walk you through it?',
  },
  dailyTaskTitle: 'Morning light, ten minutes',
  planSummary: 'Circadian and metabolic reset',
  duration: '30 days',
  programmeDayText: 'Day 12 of your plan',
  assistantMessage: 'Your report is ready. Shall I walk you through it?',
};
