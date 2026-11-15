import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  fetchPatientReports, 
  fetchPatientProfile, 
  fetchPatientCarePlan, 
  getAuthToken 
} from '../services/livAppApi';

const LivDataContext = createContext(null);

export function LivDataProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportsData, setReportsData] = useState({
    reports: [],
    latestReport: null,
    previousReport: null,
    awisScore: null,
    previousScore: null,
    delta: null,
    deltaText: null,
    riskLabel: null,
    categories: null,
    assistantMessage: null,
  });
  const [profileData, setProfileData] = useState({
    patient: null,
    fullName: null,
  });
  const [carePlanData, setCarePlanData] = useState({
    carePlans: [],
    activePlan: null,
    dailyTaskTitle: null,
    planSummary: null,
    duration: null,
    programmeDayText: null,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Run all three requests in parallel; handle individual failures gracefully so one failure doesn't break the whole page
    const [reportsRes, profileRes, carePlanRes] = await Promise.allSettled([
      fetchPatientReports(),
      fetchPatientProfile(),
      fetchPatientCarePlan(),
    ]);

    let anyError = null;

    if (reportsRes.status === 'fulfilled') {
      setReportsData(reportsRes.value);
    } else {
      console.warn('Reports API failed:', reportsRes.reason);
      anyError = reportsRes.reason;
    }

    if (profileRes.status === 'fulfilled') {
      setProfileData(profileRes.value);
    } else {
      console.warn('Patient Profile API failed:', profileRes.reason);
      if (!anyError) anyError = profileRes.reason;
    }

    if (carePlanRes.status === 'fulfilled') {
      setCarePlanData(carePlanRes.value);
    } else {
      console.warn('Care Plan API failed:', carePlanRes.reason);
      if (!anyError) anyError = carePlanRes.reason;
    }

    setError(anyError);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Unified assistant message priority: Report assistant message -> Care plan message -> null
  const assistantMessage = reportsData.assistantMessage || carePlanData.activePlan?.assistant_message || null;

  const value = {
    loading,
    error,
    reportsData,
    profileData,
    carePlanData,
    assistantMessage,
    refreshData: loadData,
    hasToken: Boolean(getAuthToken()),
  };

  return (
    <LivDataContext.Provider value={value}>
      {children}
    </LivDataContext.Provider>
  );
}

export function useLivData() {
  const context = useContext(LivDataContext);
  if (!context) {
    throw new Error('useLivData must be used within a LivDataProvider');
  }
  return context;
}
export default LivDataContext;
