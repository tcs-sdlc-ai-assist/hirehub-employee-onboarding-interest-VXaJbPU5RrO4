/**
 * Form validation utility module for HireHub onboarding portal.
 * Provides field-level validation with descriptive error messages.
 */

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MOBILE_REGEX = /^\d{10}$/;
const MAX_NAME_LENGTH = 64;
const MIN_NAME_LENGTH = 2;

const ALLOWED_DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Legal',
  'Support',
];

/**
 * Validates the full name field.
 * @param {string} fullName - The full name to validate.
 * @returns {string} Error message string, or empty string if valid.
 */
export function validateFullName(fullName) {
  if (fullName === undefined || fullName === null) {
    return 'Full name is required.';
  }

  const trimmed = String(fullName).trim();

  if (trimmed.length === 0) {
    return 'Full name is required.';
  }

  if (trimmed.length < MIN_NAME_LENGTH) {
    return `Full name must be at least ${MIN_NAME_LENGTH} characters.`;
  }

  if (trimmed.length > MAX_NAME_LENGTH) {
    return `Full name must not exceed ${MAX_NAME_LENGTH} characters.`;
  }

  return '';
}

/**
 * Validates the email field.
 * @param {string} email - The email address to validate.
 * @returns {string} Error message string, or empty string if valid.
 */
export function validateEmail(email) {
  if (email === undefined || email === null) {
    return 'Email address is required.';
  }

  const trimmed = String(email).trim();

  if (trimmed.length === 0) {
    return 'Email address is required.';
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Please enter a valid email address.';
  }

  return '';
}

/**
 * Validates the mobile number field.
 * @param {string} mobile - The mobile number to validate.
 * @returns {string} Error message string, or empty string if valid.
 */
export function validateMobile(mobile) {
  if (mobile === undefined || mobile === null) {
    return 'Mobile number is required.';
  }

  const trimmed = String(mobile).trim();

  if (trimmed.length === 0) {
    return 'Mobile number is required.';
  }

  if (!MOBILE_REGEX.test(trimmed)) {
    return 'Mobile number must be exactly 10 digits.';
  }

  return '';
}

/**
 * Validates the department field.
 * @param {string} department - The department selection to validate.
 * @returns {string} Error message string, or empty string if valid.
 */
export function validateDepartment(department) {
  if (department === undefined || department === null) {
    return 'Please select a department.';
  }

  const trimmed = String(department).trim();

  if (trimmed.length === 0) {
    return 'Please select a department.';
  }

  if (!ALLOWED_DEPARTMENTS.includes(trimmed)) {
    return 'Please select a valid department.';
  }

  return '';
}

/**
 * Runs all field validators on a form data object.
 * @param {{ fullName?: string, email?: string, mobile?: string, department?: string }} formData - The form data to validate.
 * @returns {{ fullName: string, email: string, mobile: string, department: string, isValid: boolean }} An object with field-level error messages and an isValid flag.
 */
export function validateForm(formData) {
  const data = formData || {};

  const errors = {
    fullName: validateFullName(data.fullName),
    email: validateEmail(data.email),
    mobile: validateMobile(data.mobile),
    department: validateDepartment(data.department),
  };

  const isValid = Object.keys(errors).every((key) => errors[key] === '');

  return {
    ...errors,
    isValid,
  };
}

/**
 * Checks if an email already exists in the submissions array.
 * @param {string} email - The email to check for duplicates.
 * @param {Array<{ email: string, id?: string }>} submissions - The existing submissions array.
 * @param {string} [excludeId] - Optional submission ID to exclude from the check (for edit scenarios).
 * @returns {boolean} True if the email is a duplicate, false otherwise.
 */
export function isDuplicateEmail(email, submissions, excludeId) {
  if (!email || !Array.isArray(submissions)) {
    return false;
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  return submissions.some((submission) => {
    if (!submission || !submission.email) {
      return false;
    }
    if (excludeId && submission.id === excludeId) {
      return false;
    }
    return String(submission.email).trim().toLowerCase() === normalizedEmail;
  });
}

export { ALLOWED_DEPARTMENTS };