import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  fetchPatientReports, 
  fetchPatientProfile, 
  fetchPatientCarePlan, 
  getAuthToken 
} from '../services/livAppApi';
import {
  SAMPLE_PROFILE,
  SAMPLE_REPORTS,
  SAMPLE_CARE_PLAN
} from '../services/sampleData';

const LivDataContext = createContext(null);

export function LivDataProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportsData, setReportsData] = useState(SAMPLE_REPORTS);
  const [profileData, setProfileData] = useState(SAMPLE_PROFILE);
  const [carePlanData, setCarePlanData] = useState(SAMPLE_CARE_PLAN);

  const loadData = useCallback(async () => {
    const token = getAuthToken();

    // If backend is not connected or no auth token is provided, use sample data directly
    if (!token) {
      setReportsData(SAMPLE_REPORTS);
      setProfileData(SAMPLE_PROFILE);
      setCarePlanData(SAMPLE_CARE_PLAN);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Run all three requests in parallel; handle individual failures gracefully so one failure doesn't break the whole page
      const [reportsRes, profileRes, carePlanRes] = await Promise.allSettled([
        fetchPatientReports(),
        fetchPatientProfile(),
        fetchPatientCarePlan(),
      ]);

      let anyError = null;

      if (reportsRes.status === 'fulfilled' && reportsRes.value) {
        setReportsData(reportsRes.value);
      } else {
        console.warn('Reports API failed, using sample data:', reportsRes.reason);
        setReportsData(SAMPLE_REPORTS);
        anyError = reportsRes.reason;
      }

      if (profileRes.status === 'fulfilled' && profileRes.value) {
        setProfileData(profileRes.value);
      } else {
        console.warn('Patient Profile API failed, using sample data:', profileRes.reason);
        setProfileData(SAMPLE_PROFILE);
        if (!anyError) anyError = profileRes.reason;
      }

      if (carePlanRes.status === 'fulfilled' && carePlanRes.value) {
        setCarePlanData(carePlanRes.value);
      } else {
        console.warn('Care Plan API failed, using sample data:', carePlanRes.reason);
        setCarePlanData(SAMPLE_CARE_PLAN);
        if (!anyError) anyError = carePlanRes.reason;
      }

      setError(anyError);
    } catch (err) {
      console.warn('Backend connection error, falling back to sample data:', err);
      setReportsData(SAMPLE_REPORTS);
      setProfileData(SAMPLE_PROFILE);
      setCarePlanData(SAMPLE_CARE_PLAN);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Unified assistant message priority: Report assistant message -> Care plan message -> Sample message
  const assistantMessage = reportsData.assistantMessage || 
                           carePlanData.activePlan?.assistant_message || 
                           SAMPLE_REPORTS.assistantMessage;

  const value = {
    loading,
    error,
    reportsData,
    profileData,
    carePlanData,
    assistantMessage,
    refreshData: loadData,
    hasToken: Boolean(getAuthToken()),
    isSampleData: !getAuthToken(),
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
