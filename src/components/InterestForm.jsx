import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { validateForm, isDuplicateEmail } from '../utils/validators.js';
import { addSubmission, getSubmissions } from '../utils/storage.js';

const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
];

const initialFormState = {
  fullName: '',
  email: '',
  mobile: '',
  department: '',
};

const initialErrorState = {
  fullName: '',
  email: '',
  mobile: '',
  department: '',
};

function InterestForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrorState);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (submitError) {
      setSubmitError('');
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    setSuccessMessage('');

    const validation = validateForm(formData);

    if (!validation.isValid) {
      setErrors({
        fullName: validation.fullName,
        email: validation.email,
        mobile: validation.mobile,
        department: validation.department,
      });
      return;
    }

    const submissions = getSubmissions();
    if (isDuplicateEmail(formData.email, submissions)) {
      setErrors((prev) => ({
        ...prev,
        email: 'This email address has already been submitted.',
      }));
      return;
    }

    const result = addSubmission({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
      department: formData.department,
    });

    if (result.success) {
      setFormData(initialFormState);
      setErrors(initialErrorState);
      setSuccessMessage('Your interest has been submitted successfully! We will be in touch soon.');
    } else {
      if (result.error === 'DUPLICATE_EMAIL') {
        setErrors((prev) => ({
          ...prev,
          email: 'This email address has already been submitted.',
        }));
      } else if (result.error === 'INVALID_DATA') {
        setSubmitError('Please check your input and try again.');
      } else {
        setSubmitError('An unexpected error occurred. Please try again later.');
      }
    }
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="form-page">
          <h1 className="form-page-title">Express Your Interest</h1>
          <p className="form-page-subtitle">
            Fill out the form below to let us know you are interested in joining HireHub.
          </p>

          {successMessage && (
            <div className="alert alert-success">
              <span>✅</span>
              {successMessage}
            </div>
          )}

          {submitError && (
            <div className="alert alert-danger">
              <span>❌</span>
              {submitError}
            </div>
          )}

          <div className="form-card">
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className={`form-input${errors.fullName ? ' error' : ''}`}
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                />
                {errors.fullName && (
                  <p className="form-error">{errors.fullName}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-input${errors.email ? ' error' : ''}`}
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="form-error">{errors.email}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="mobile">
                  Mobile Number <span className="required">*</span>
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  className={`form-input${errors.mobile ? ' error' : ''}`}
                  placeholder="Enter your 10-digit mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  autoComplete="tel"
                />
                {errors.mobile && (
                  <p className="form-error">{errors.mobile}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="department">
                  Department <span className="required">*</span>
                </label>
                <select
                  id="department"
                  name="department"
                  className={`form-select${errors.department ? ' error' : ''}`}
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="">Select a department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="form-error">{errors.department}</p>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary btn-lg">
                  Submit
                </button>
              </div>
            </form>

            <div className="text-center mt-lg">
              <Link to="/">← Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterestForm;