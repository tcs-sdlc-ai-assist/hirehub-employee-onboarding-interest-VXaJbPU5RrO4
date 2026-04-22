const STORAGE_KEY = 'hirehub_submissions';

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
  'Support'
];

/**
 * Generates a UUID v4 string.
 * @returns {string} A UUID string.
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Validates an email address format.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validates a mobile number (10 digits, numeric only).
 * @param {string} mobile
 * @returns {boolean}
 */
function isValidMobile(mobile) {
  if (typeof mobile !== 'string') return false;
  return /^\d{10}$/.test(mobile);
}

/**
 * Validates a single submission object's shape and field constraints.
 * @param {object} submission
 * @returns {boolean}
 */
function isValidSubmission(submission) {
  if (!submission || typeof submission !== 'object') return false;

  const { fullName, email, mobile, department } = submission;

  if (typeof fullName !== 'string' || fullName.trim().length === 0 || fullName.length > 64) {
    return false;
  }
  if (!isValidEmail(email)) return false;
  if (!isValidMobile(mobile)) return false;
  if (typeof department !== 'string' || !ALLOWED_DEPARTMENTS.includes(department)) return false;

  return true;
}

/**
 * Validates that a stored entry has the required schema fields.
 * @param {object} entry
 * @returns {boolean}
 */
function isValidStoredEntry(entry) {
  if (!entry || typeof entry !== 'object') return false;
  if (typeof entry.id !== 'string') return false;
  if (typeof entry.fullName !== 'string') return false;
  if (typeof entry.email !== 'string') return false;
  if (typeof entry.mobile !== 'string') return false;
  if (typeof entry.department !== 'string') return false;
  if (typeof entry.submittedAt !== 'string') return false;
  return true;
}

/**
 * Reads and parses the submissions array from localStorage.
 * Resets to empty array on parse error or corrupted data.
 * @returns {Array<object>} Array of submission objects.
 */
export function getSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.error('StorageManager: Data is not an array. Resetting to empty.');
      resetSubmissions();
      return [];
    }
    const valid = parsed.filter((entry) => {
      if (!isValidStoredEntry(entry)) {
        console.warn('StorageManager: Skipping invalid entry during read.', entry);
        return false;
      }
      return true;
    });
    if (valid.length !== parsed.length) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
      } catch (e) {
        console.error('StorageManager: Failed to persist cleaned data.', e);
      }
    }
    return valid;
  } catch (e) {
    console.error('StorageManager: Corrupted localStorage data. Resetting.', e);
    resetSubmissions();
    return [];
  }
}

/**
 * Adds a new submission to localStorage.
 * Generates a UUID and submittedAt timestamp automatically.
 * Checks for duplicate email addresses.
 * @param {object} submission - Object with fullName, email, mobile, department.
 * @returns {{ success: boolean, error?: string, id?: string }}
 */
export function addSubmission(submission) {
  if (!isValidSubmission(submission)) {
    return { success: false, error: 'INVALID_DATA' };
  }

  const submissions = getSubmissions();

  const normalizedEmail = submission.email.trim().toLowerCase();
  const duplicate = submissions.find(
    (s) => s.email.trim().toLowerCase() === normalizedEmail
  );
  if (duplicate) {
    return { success: false, error: 'DUPLICATE_EMAIL' };
  }

  const newEntry = {
    id: generateUUID(),
    fullName: submission.fullName.trim(),
    email: submission.email.trim(),
    mobile: submission.mobile.trim(),
    department: submission.department,
    submittedAt: new Date().toISOString()
  };

  submissions.push(newEntry);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    return { success: true, id: newEntry.id };
  } catch (e) {
    console.error('StorageManager: Failed to write to localStorage.', e);
    return { success: false, error: 'CORRUPT_STORAGE' };
  }
}

/**
 * Updates an existing submission by id, merging the provided patch data.
 * Only allows updating fullName, email, mobile, department fields.
 * @param {string} id - The UUID of the submission to update.
 * @param {object} updates - Partial submission data to merge.
 * @returns {{ success: boolean, error?: string }}
 */
export function updateSubmission(id, updates) {
  if (typeof id !== 'string' || !id) {
    return { success: false, error: 'INVALID_DATA' };
  }
  if (!updates || typeof updates !== 'object') {
    return { success: false, error: 'INVALID_DATA' };
  }

  const submissions = getSubmissions();
  const index = submissions.findIndex((s) => s.id === id);

  if (index === -1) {
    return { success: false, error: 'NOT_FOUND' };
  }

  const allowedFields = ['fullName', 'email', 'mobile', 'department'];
  const patch = {};

  for (const key of allowedFields) {
    if (key in updates) {
      patch[key] = updates[key];
    }
  }

  const merged = { ...submissions[index], ...patch };

  if (typeof merged.fullName !== 'string' || merged.fullName.trim().length === 0 || merged.fullName.length > 64) {
    return { success: false, error: 'INVALID_DATA' };
  }
  if (!isValidEmail(merged.email)) {
    return { success: false, error: 'INVALID_DATA' };
  }
  if (!isValidMobile(merged.mobile)) {
    return { success: false, error: 'INVALID_DATA' };
  }
  if (!ALLOWED_DEPARTMENTS.includes(merged.department)) {
    return { success: false, error: 'INVALID_DATA' };
  }

  if (patch.email) {
    const normalizedEmail = merged.email.trim().toLowerCase();
    const duplicate = submissions.find(
      (s) => s.id !== id && s.email.trim().toLowerCase() === normalizedEmail
    );
    if (duplicate) {
      return { success: false, error: 'DUPLICATE_EMAIL' };
    }
  }

  merged.fullName = merged.fullName.trim();
  merged.email = merged.email.trim();
  merged.mobile = merged.mobile.trim();

  submissions[index] = merged;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    return { success: true };
  } catch (e) {
    console.error('StorageManager: Failed to write to localStorage.', e);
    return { success: false, error: 'CORRUPT_STORAGE' };
  }
}

/**
 * Deletes a submission by id.
 * @param {string} id - The UUID of the submission to delete.
 * @returns {{ success: boolean, error?: string }}
 */
export function deleteSubmission(id) {
  if (typeof id !== 'string' || !id) {
    return { success: false, error: 'INVALID_DATA' };
  }

  const submissions = getSubmissions();
  const filtered = submissions.filter((s) => s.id !== id);

  if (filtered.length === submissions.length) {
    return { success: false, error: 'NOT_FOUND' };
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return { success: true };
  } catch (e) {
    console.error('StorageManager: Failed to write to localStorage.', e);
    return { success: false, error: 'CORRUPT_STORAGE' };
  }
}

/**
 * Resets the submissions store to an empty array.
 */
export function resetSubmissions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (e) {
    console.error('StorageManager: Failed to reset localStorage.', e);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (removeErr) {
      console.error('StorageManager: Failed to remove localStorage key.', removeErr);
    }
  }
}

export const StorageManager = {
  getSubmissions,
  addSubmission,
  updateSubmission,
  deleteSubmission,
  resetSubmissions
};