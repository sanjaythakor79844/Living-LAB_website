/**
 * Liv App Backend API Service
 * 
 * Replaces the custom Living Lab backend with the three existing APIs from Liv App:
 * 1. GET {VITE_API_BASE_URL}/reports/me
 * 2. GET {VITE_API_BASE_URL}/patients/me
 * 3. GET {VITE_FEATURE_API_BASE_URL}/care-plan
 * 
 * Authentication: Firebase ID Token via Authorization: Bearer <token>
 */

const getApiBaseUrl = () => {
  const url = import.meta.env.VITE_API_BASE_URL || '';
  // Route through proxy to eliminate browser CORS on both Vercel and local dev
  if (!url || url.includes('aaha-api-405281288207') || url.startsWith('/api-proxy')) {
    return '/api-proxy-main';
  }
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const getFeatureApiBaseUrl = () => {
  const url = import.meta.env.VITE_FEATURE_API_BASE_URL || '';
  // Route through proxy to eliminate browser CORS on both Vercel and local dev
  if (!url || url.includes('aaha-feature-backend') || url.startsWith('/api-proxy')) {
    return '/api-proxy-feature';
  }
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

/**
 * Retrieve Firebase ID Token from standard storage or window session
 */
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;

  // 1. Check URL query parameters (e.g. from embedded pod links or auth redirect)
  const urlParams = new URLSearchParams(window.location.search);
  const paramToken = urlParams.get('token') || urlParams.get('idToken') || urlParams.get('auth');
  if (paramToken) {
    try {
      sessionStorage.setItem('firebase_id_token', paramToken);
    } catch (_) {}
    return paramToken;
  }

  // 2. Check window-level auth provider or Firebase Auth user instance
  if (window.__FIREBASE_ID_TOKEN__) {
    return window.__FIREBASE_ID_TOKEN__;
  }

  // 3. Check sessionStorage or localStorage
  try {
    const sessionToken = sessionStorage.getItem('firebase_id_token');
    if (sessionToken) return sessionToken;

    const localToken = localStorage.getItem('firebase_id_token') || 
                       localStorage.getItem('firebase_token') ||
                       localStorage.getItem('liv_token');
    if (localToken) return localToken;
  } catch (_) {}

  return null;
};

/**
 * Authenticated HTTP Request Wrapper
 */
const requestWithAuth = async (url, options = {}) => {
  const token = getAuthToken();

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    const error = new Error('Unauthorized or expired session');
    error.status = 401;
    // Clear expired token if present
    try {
      sessionStorage.removeItem('firebase_id_token');
    } catch (_) {}
    throw error;
  }

  if (!response.ok) {
    const error = new Error(`API error: ${response.status} ${response.statusText}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
};

/**
 * API 1: Reports
 * GET {VITE_API_BASE_URL}/reports/me
 * Expected envelope: { "reports": [...] }
 */
export const fetchPatientReports = async () => {
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  // If no base URL or no token provided, return clean unauthenticated state
  if (!baseUrl || !token) {
    return { reports: [], latestReport: null, previousReport: null, awisScore: null, previousScore: null, delta: null, deltaText: null, riskLabel: null, categories: null, assistantMessage: null };
  }

  const data = await requestWithAuth(`${baseUrl}/reports/me`);
  const reportsList = Array.isArray(data) ? data : (data?.reports || []);

  if (!reportsList.length) {
    return { reports: [], latestReport: null, previousReport: null, awisScore: null, previousScore: null, delta: null, deltaText: null, riskLabel: null, categories: null, assistantMessage: null };
  }

  // Sort by created_at or assessment_date if present, otherwise maintain order
  const sortedReports = [...reportsList].sort((a, b) => {
    const dateA = new Date(a.created_at || a.assessment_date || a.date || 0).getTime();
    const dateB = new Date(b.created_at || b.assessment_date || b.date || 0).getTime();
    return dateB - dateA;
  });

  const latest = sortedReports[0] || null;
  const previous = sortedReports[1] || null;

  // Extract AWIS score with fallbacks per specification
  const extractScore = (rep) => {
    if (!rep) return null;
    const scoreVal = rep.awis_score ?? rep.overall_score ?? rep.score ?? rep.aiws_score;
    const num = Number(scoreVal);
    return !isNaN(num) && num >= 0 ? Math.round(num) : null;
  };

  const latestScore = extractScore(latest);
  const previousScore = extractScore(previous);

  let delta = null;
  let deltaText = null;

  if (latestScore !== null && previousScore !== null) {
    delta = latestScore - previousScore;
    if (delta > 0) {
      deltaText = `Up ${delta} since your last visit.`;
    } else if (delta < 0) {
      deltaText = `Down ${Math.abs(delta)} since your last visit.`;
    } else {
      deltaText = 'No change since your last visit.';
    }
  } else if (latestScore !== null) {
    deltaText = 'First assessment.';
  }

  const riskLabel = latest?.risk_label || latest?.score_label || latest?.risk_band || latest?.status || null;

  return {
    reports: sortedReports,
    latestReport: latest,
    previousReport: previous,
    awisScore: latestScore,
    previousScore,
    delta,
    deltaText,
    riskLabel,
    // Do not fabricate category scores - preserve what the API actually returned if present
    categories: latest?.categories || latest?.category_scores || null,
    assistantMessage: latest?.assistant_message || latest?.liv_message || latest?.summary_prompt || null,
  };
};

/**
 * API 2: Patient Profile
 * GET {VITE_API_BASE_URL}/patients/me
 * Expected envelope: { "patient": {...} }
 */
export const fetchPatientProfile = async () => {
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  if (!baseUrl || !token) {
    return { patient: null, fullName: null };
  }

  const data = await requestWithAuth(`${baseUrl}/patients/me`);
  const patient = data?.patient || data || null;

  if (!patient) {
    return { patient: null, fullName: null };
  }

  const fullName = patient.full_name || 
                   patient.name || 
                   [patient.first_name, patient.last_name].filter(Boolean).join(' ') || 
                   null;

  return {
    patient,
    fullName,
  };
};

/**
 * API 3: Care Plan
 * GET {VITE_FEATURE_API_BASE_URL}/care-plan
 * Expected envelope: { "carePlans": [...] }
 * Selection logic:
 *   1. First approved plan (status === 'approved')
 *   2. Otherwise first available plan
 *   3. Otherwise fallback state
 */
export const fetchPatientCarePlan = async () => {
  const baseUrl = getFeatureApiBaseUrl();
  const token = getAuthToken();

  if (!baseUrl || !token) {
    return { carePlans: [], activePlan: null, dailyTaskTitle: null, planSummary: null, duration: null, programmeDayText: null, assistantMessage: null };
  }

  const data = await requestWithAuth(`${baseUrl}/care-plan`);
  const plans = Array.isArray(data) ? data : (data?.carePlans || (data?.carePlan ? [data.carePlan] : []));

  if (!plans.length) {
    return { carePlans: [], activePlan: null, dailyTaskTitle: null, planSummary: null, duration: null, programmeDayText: null, assistantMessage: null };
  }

  // Active plan selection: 1. First approved, 2. First available
  const activePlan = plans.find(p => String(p?.status || '').toLowerCase() === 'approved') || plans[0] || null;

  if (!activePlan) {
    return { carePlans: [], activePlan: null, dailyTaskTitle: null, planSummary: null, duration: null, programmeDayText: null, assistantMessage: null };
  }

  // Field mapping
  const planSummary = activePlan.consultation_summary || activePlan.summary || activePlan.title || null;
  const lifestyle = Array.isArray(activePlan.lifestyle_management) ? activePlan.lifestyle_management : [];
  const dailyTaskTitle = lifestyle[0]?.title || lifestyle[0]?.recommendation || activePlan.daily_task || planSummary || null;

  // Duration
  const duration = activePlan.follow_up?.timeline || 
                   (activePlan.follow_up?.duration_days ? `${activePlan.follow_up.duration_days} days` : null) || 
                   null;

  // Programme day: Use programme_start_date ONLY if backend provides it (no hardcoded date)
  let programmeDayText = null;
  const startDateStr = activePlan.programme_start_date || activePlan.start_date || null;
  if (startDateStr) {
    const startMs = new Date(startDateStr).getTime();
    if (!isNaN(startMs) && startMs > 0) {
      const nowMs = Date.now();
      const elapsedDays = Math.floor((nowMs - startMs) / (1000 * 60 * 60 * 24)) + 1;
      if (elapsedDays > 0) {
        programmeDayText = `Day ${elapsedDays} of your plan`;
      }
    }
  }

  // If no valid start date, do not invent day number; show duration or active status
  if (!programmeDayText) {
    programmeDayText = duration ? `${duration} plan` : 'Active plan';
  }

  return {
    carePlans: plans,
    activePlan,
    dailyTaskTitle,
    planSummary,
    duration,
    programmeDayText,
    assistantMessage: activePlan.assistant_message || activePlan.message || null,
  };
};
