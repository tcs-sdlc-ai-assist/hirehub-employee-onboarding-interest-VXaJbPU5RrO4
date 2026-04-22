import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { validateForm, isDuplicateEmail, ALLOWED_DEPARTMENTS } from '../utils/validators.js';
import { updateSubmission, getSubmissions } from '../utils/storage.js';

export function EditModal({ submission, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    department: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    mobile: '',
    department: '',
  });

  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (submission) {
      setFormData({
        fullName: submission.fullName || '',
        email: submission.email || '',
        mobile: submission.mobile || '',
        department: submission.department || '',
      });
      setErrors({ fullName: '', email: '', mobile: '', department: '' });
      setSubmitError('');
    }
  }, [submission]);

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

    const allSubmissions = getSubmissions();
    if (isDuplicateEmail(formData.email, allSubmissions, submission.id)) {
      setErrors((prev) => ({ ...prev, email: 'This email address is already in use.' }));
      return;
    }

    const result = updateSubmission(submission.id, {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
      department: formData.department,
    });

    if (result.success) {
      onSaved();
    } else if (result.error === 'DUPLICATE_EMAIL') {
      setErrors((prev) => ({ ...prev, email: 'This email address is already in use.' }));
    } else if (result.error === 'NOT_FOUND') {
      setSubmitError('Submission not found. It may have been deleted.');
    } else if (result.error === 'INVALID_DATA') {
      setSubmitError('Invalid data. Please check your inputs and try again.');
    } else {
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  if (!submission) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Edit Submission</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {submitError && (
              <div className="alert alert-danger">
                {submitError}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="edit-fullName">
                Full Name <span className="required">*</span>
              </label>
              <input
                id="edit-fullName"
                type="text"
                name="fullName"
                className={`form-input${errors.fullName ? ' error' : ''}`}
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
              />
              {errors.fullName && (
                <p className="form-error">{errors.fullName}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-email">
                Email <span className="required">*</span>
              </label>
              <input
                id="edit-email"
                type="email"
                name="email"
                className={`form-input${errors.email ? ' error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="form-error">{errors.email}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-mobile">
                Mobile Number <span className="required">*</span>
              </label>
              <input
                id="edit-mobile"
                type="text"
                name="mobile"
                className={`form-input${errors.mobile ? ' error' : ''}`}
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
              />
              {errors.mobile && (
                <p className="form-error">{errors.mobile}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-department">
                Department <span className="required">*</span>
              </label>
              <select
                id="edit-department"
                name="department"
                className={`form-select${errors.department ? ' error' : ''}`}
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select a department</option>
                {ALLOWED_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="form-error">{errors.department}</p>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditModal.propTypes = {
  submission: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    submittedAt: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};

EditModal.defaultProps = {
  submission: null,
};

export default EditModal;