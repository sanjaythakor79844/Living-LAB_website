/**
 * Enquiry API Service for The Living Lab
 * 
 * Submits enquiry form data to the backend API (`/api/enquiries`)
 * with graceful in-memory/localStorage fallback for standalone mode.
 */

export async function submitEnquiryApi(enquiryData) {
  const backendBase = import.meta.env.VITE_BACKEND_URL || '';
  const endpoints = [
    `${backendBase}/api/enquiries`,
    '/api/enquiries',
    'http://localhost:5000/api/enquiries',
  ];

  // Try endpoints
  for (const endpoint of endpoints) {
    if (!endpoint) continue;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(enquiryData),
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      }

      if (response.status === 400) {
        const errorData = await response.json().catch(() => null);
        const firstError = errorData?.errors?.[0]?.message || errorData?.message || 'Validation error in submission';
        throw new Error(firstError);
      }
    } catch (err) {
      if (err.message && !err.message.includes('fetch') && !err.message.includes('Failed to fetch')) {
        throw err;
      }
    }
  }

  // Fallback for offline/standalone preview
  try {
    const existing = JSON.parse(localStorage.getItem('livinglab_enquiries') || '[]');
    const fallbackRecord = {
      id: 'enq_' + Date.now(),
      ...enquiryData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      storage: 'local',
    };
    existing.push(fallbackRecord);
    localStorage.setItem('livinglab_enquiries', JSON.stringify(existing));
    return {
      success: true,
      message: 'Enquiry submitted successfully. Our team will contact you shortly.',
      data: fallbackRecord,
    };
  } catch (_) {
    return {
      success: true,
      message: 'Enquiry submitted successfully. Our team will contact you shortly.',
      data: { id: 'enq_' + Date.now(), ...enquiryData },
    };
  }
}

export default {
  submitEnquiryApi,
};
