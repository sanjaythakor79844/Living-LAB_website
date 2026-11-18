import { useState } from 'react';
import { submitEnquiryApi } from '../services/enquiryService';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    organization: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Basic frontend validation
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!formData.mobile.trim() || formData.mobile.trim().length < 7) {
      setErrorMessage('Please enter a valid mobile number.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.subject.trim()) {
      setErrorMessage('Please enter a subject for your enquiry.');
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setErrorMessage('Please write a message of at least 10 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitEnquiryApi(formData);
      if (response && response.success) {
        setSuccessData({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          id: response.data?.id || 'ENQ-' + Date.now().toString().slice(-6),
        });
        setFormData({
          name: '',
          mobile: '',
          email: '',
          organization: '',
          subject: '',
          message: '',
        });
      } else {
        setErrorMessage(response?.message || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error sending enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setErrorMessage('');
  };

  return (
    <section className="sec contact-sec" id="contact">
      <div className="wrap">
        <div className="contact-grid">
          {/* Left Column: Contact Us Details */}
          <div className="contact-info">
            <p className="k">Contact Us</p>
            <h2>Connect with<br /><em>The Living Lab.</em></h2>
            <p className="lede">
              Speak with our team to bring the pod to your wellness centre or clinic, or reach out regarding partnerships and research.
            </p>

            <div className="contact-cards">
              <div className="contact-item">
                <span className="contact-label">Phone</span>
                <a href="tel:+919822012345" className="contact-val highlight-val">
                  +91 98220 12345
                </a>
                <span className="contact-sub">Available Mon – Sat, 9:00 AM – 7:00 PM IST</span>
              </div>

              <div className="contact-item">
                <span className="contact-label">Pilot Centre</span>
                <span className="contact-val">The Living Lab Experience Centre</span>
                <span className="contact-sub">Aundh, Pune, Maharashtra 411007, India</span>
              </div>
            </div>

            <p className="where" style={{ marginTop: '36px', textAlign: 'left' }}>
              Built in India · Operational in Pune · Global Wellness Architecture
            </p>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="enquiry-card">
            {successData ? (
              <div className="enquiry-success" role="alert" aria-live="polite">
                <div className="success-icon" aria-hidden="true">✓</div>
                <h3>Enquiry Received</h3>
                <p className="success-desc">
                  Thank you, <strong>{successData.name}</strong>. Your enquiry has been safely submitted.
                </p>
                <p className="success-meta">
                  Our team will review your details and reach out to you at <strong>{successData.email}</strong> or <strong>{successData.mobile}</strong> shortly.
                </p>
                <div className="success-ref">
                  <span>Reference ID:</span> <code>{successData.id}</code>
                </div>
                <button type="button" className="btn sm ghost" onClick={handleReset} style={{ marginTop: '24px' }}>
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
                <div className="enquiry-header">
                  <p className="k" style={{ margin: 0 }}>Enquiry Form</p>
                  <h3>Send an enquiry</h3>
                  <p className="enquiry-sub">Fill in the details below and our team will get in touch with you.</p>
                </div>

                {errorMessage && (
                  <div className="form-error-banner" role="alert">
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="enq-name">
                      Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="enq-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                      autoComplete="name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="enq-mobile">
                      Mobile Number <span className="req">*</span>
                    </label>
                    <input
                      type="tel"
                      id="enq-mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      required
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="enq-email">
                      Email <span className="req">*</span>
                    </label>
                    <input
                      type="email"
                      id="enq-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@organization.com"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="enq-org">
                      Organization / Institution
                    </label>
                    <input
                      type="text"
                      id="enq-org"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="Clinic, centre or institute name"
                      autoComplete="organization"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="enq-subject">
                    Subject <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    id="enq-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g., Pod installation for wellness centre / Partnership"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="enq-msg">
                    Message <span className="req">*</span>
                  </label>
                  <textarea
                    id="enq-msg"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your centre, space, questions or requirements..."
                    required
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn submit-enquiry-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Submitting Enquiry...'
                    ) : (
                      <>
                        Submit Enquiry <span className="arr">→</span>
                      </>
                    )}
                  </button>
                  <span className="privacy-note">
                    Your information is protected by our privacy-first design.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
