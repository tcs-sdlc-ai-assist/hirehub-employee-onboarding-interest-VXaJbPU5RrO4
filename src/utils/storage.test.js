import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getSubmissions,
  addSubmission,
  updateSubmission,
  deleteSubmission,
  resetSubmissions,
} from './storage.js';

const STORAGE_KEY = 'hirehub_submissions';

function makeValidSubmission(overrides = {}) {
  return {
    fullName: 'John Doe',
    email: 'john@example.com',
    mobile: '9876543210',
    department: 'Engineering',
    ...overrides,
  };
}

function seedSubmissions(submissions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
}

function readRawSubmissions() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

describe('StorageManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ===== getSubmissions =====

  describe('getSubmissions', () => {
    it('returns an empty array when localStorage has no data', () => {
      const result = getSubmissions();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage key is absent', () => {
      localStorage.removeItem(STORAGE_KEY);
      const result = getSubmissions();
      expect(result).toEqual([]);
    });

    it('returns stored submissions when data is valid', () => {
      const submissions = [
        {
          id: 'abc-123',
          fullName: 'Jane Doe',
          email: 'jane@example.com',
          mobile: '1234567890',
          department: 'Marketing',
          submittedAt: '2024-01-15T10:00:00.000Z',
        },
      ];
      seedSubmissions(submissions);

      const result = getSubmissions();
      expect(result).toEqual(submissions);
      expect(result).toHaveLength(1);
    });

    it('returns multiple submissions in order', () => {
      const submissions = [
        {
          id: 'id-1',
          fullName: 'Alice',
          email: 'alice@example.com',
          mobile: '1111111111',
          department: 'Engineering',
          submittedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'id-2',
          fullName: 'Bob',
          email: 'bob@example.com',
          mobile: '2222222222',
          department: 'Sales',
          submittedAt: '2024-01-02T00:00:00.000Z',
        },
      ];
      seedSubmissions(submissions);

      const result = getSubmissions();
      expect(result).toHaveLength(2);
      expect(result[0].fullName).toBe('Alice');
      expect(result[1].fullName).toBe('Bob');
    });

    it('recovers from corrupted JSON by resetting to empty array', () => {
      localStorage.setItem(STORAGE_KEY, '{not valid json!!!');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = getSubmissions();
      expect(result).toEqual([]);

      const stored = readRawSubmissions();
      expect(stored).toEqual([]);

      consoleSpy.mockRestore();
    });

    it('resets to empty array when stored data is not an array', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: 'bar' }));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = getSubmissions();
      expect(result).toEqual([]);

      consoleSpy.mockRestore();
    });

    it('filters out invalid entries and persists cleaned data', () => {
      const data = [
        {
          id: 'valid-1',
          fullName: 'Valid User',
          email: 'valid@example.com',
          mobile: '1234567890',
          department: 'Engineering',
          submittedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 123,
          fullName: 'Invalid ID',
          email: 'invalid@example.com',
          mobile: '0000000000',
          department: 'Sales',
          submittedAt: '2024-01-01T00:00:00.000Z',
        },
        null,
        'not an object',
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = getSubmissions();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('valid-1');

      const persisted = readRawSubmissions();
      expect(persisted).toHaveLength(1);

      consoleSpy.mockRestore();
    });
  });

  // ===== addSubmission =====

  describe('addSubmission', () => {
    it('adds a valid submission with generated UUID and timestamp', () => {
      const submission = makeValidSubmission();
      const result = addSubmission(submission);

      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('string');
      expect(result.id.length).toBeGreaterThan(0);

      const stored = getSubmissions();
      expect(stored).toHaveLength(1);
      expect(stored[0].fullName).toBe('John Doe');
      expect(stored[0].email).toBe('john@example.com');
      expect(stored[0].mobile).toBe('9876543210');
      expect(stored[0].department).toBe('Engineering');
      expect(stored[0].submittedAt).toBeDefined();
      expect(stored[0].id).toBe(result.id);
    });

    it('persists submission to localStorage', () => {
      addSubmission(makeValidSubmission());

      const raw = localStorage.getItem(STORAGE_KEY);
      expect(raw).not.toBeNull();

      const parsed = JSON.parse(raw);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].fullName).toBe('John Doe');
    });

    it('trims whitespace from fullName, email, and mobile', () => {
      const submission = makeValidSubmission({
        fullName: '  Jane Doe  ',
        email: '  jane@example.com  ',
        mobile: '  1234567890  ',
      });
      const result = addSubmission(submission);
      expect(result.success).toBe(true);

      const stored = getSubmissions();
      expect(stored[0].fullName).toBe('Jane Doe');
      expect(stored[0].email).toBe('jane@example.com');
      expect(stored[0].mobile).toBe('1234567890');
    });

    it('generates a valid ISO 8601 timestamp for submittedAt', () => {
      addSubmission(makeValidSubmission());

      const stored = getSubmissions();
      const date = new Date(stored[0].submittedAt);
      expect(date.getTime()).not.toBeNaN();
    });

    it('generates unique UUIDs for multiple submissions', () => {
      addSubmission(makeValidSubmission({ email: 'a@example.com' }));
      addSubmission(makeValidSubmission({ email: 'b@example.com' }));

      const stored = getSubmissions();
      expect(stored).toHaveLength(2);
      expect(stored[0].id).not.toBe(stored[1].id);
    });

    it('returns INVALID_DATA for missing fullName', () => {
      const result = addSubmission({ email: 'a@b.com', mobile: '1234567890', department: 'Engineering' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_DATA');
    });

    it('returns INVALID_DATA for empty fullName', () => {
      const result = addSubmission(makeValidSubmission({ fullName: '' }));
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_DATA');
    });

    it('returns INVALID_DATA for fullName exceeding 64 characters', () => {
      const longName = 'A'.repeat(65);
      const result = addSubmission(makeValidSubmission({ fullName: longName }));
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_DATA');
    });

    it('returns INVALID_DATA for invalid email format', () => {
      const result = addSubmission(makeValidSubmission({ email: 'not-an-email' }));
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_DATA');
    });

    it('returns INVALID_DATA for invalid mobile (non-10-digit)', () => {
      const result = addSubmission(makeValidSubmission({ mobile: '12345' }));
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_DATA');
    });

    it('returns INVALID_DATA for mobile with non-numeric characters', () => {
      const result = addSubmission(makeValidSubmission({ mobile: '12345abcde' }));
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_DATA');
    });

    it('returns INVALID_DATA for invalid department', () => {
      const result = addSubmission(makeValidSubmission({ department: 'Underwater Basket Weaving' }));
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_DATA');
    });

    it('returns INVALID_DATA for null input', () => {
      const result = addSubmission(null);
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_DATA');
    });

    it('returns INVALID_DATA for undefined input', () => {
      const result = addSubmission(undefined);
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_DATA');
    });

    it('returns DUPLICATE_EMAIL when email already exists', () => {
      addSubmission(makeValidSubmission({ email: 'john@example.com' }));
      const result = addSubmission(makeValidSubmission({ email: 'john@example.com', fullName: 'John Two' }));

      expect(result.success).toBe(false);
      expect(result.error).toBe('DUPLICATE_EMAIL');
    });

    it('detects duplicate email case-insensitively', () => {
      addSubmission(makeValidSubmission({ email: 'John@Example.COM' }));
      const result = addSubmission(makeValidSubmission({ email: 'john@example.com', fullName: 'Another John' }));

      expect(result.success).toBe(false);
      expect(result.error).toBe('DUPLICATE_EMAIL');
    });

    it('appends to existing submissions without overwriting', () => {
      addSubmission(makeValidSubmission({ email: 'first@example.com' }));
      addSubmission(makeValidSubmission({ email: 'second@example.com', fullName: 'Second User' }));

      const stored = getSubmissions();
      expect(stored).toHaveLength(2);
      expect(stored[0].email).toBe('first@example.com');
      expect(stored[1].email).toBe('second@example.com');
    });
  });

  // ===== updateSubmission =====

  describe('updateSubmission', () => {
    it('updates the fullName of an existing submission', () => {
      const addResult = addSubmission(makeValidSubmission());
      const id = addResult.id;

      const result = updateSubmission(id, { fullName: 'Jane Smith' });
      expect(result.success).toBe(true);

      const stored = getSubmissions();
      expect(stored[0].fullName).toBe('Jane Smith');
    });

    it('updates the email of an existing submission', () => {
      const addResult = addSubmission(makeValidSubmission());
      const id = addResult.id;

      const result = updateSubmission(id, { email: 'newemail@example.com' });
      expect(result.success).toBe(true);

      const stored = getSubmissions();
      expect(stored[0].email).toBe('newemail@example.com');
    });

    it('updates the mobile of an existing submission', () => {
      const addResult = addSubmission(makeValidSubmission());
      const id = addResult.id;

      const result = updateSubmission(id, { mobile: '5555555555' });
      expect(result.success).toBe(true);

      const stored = getSubmissions();
      expect(stored[0].mobile).toBe('5555555555');
    });

    it('updates the department of an existing submission', () => {
      const addResult = addSubmission(makeValidSubmission());
      const id = addResult.id;

      const result = updateSubmission(id, { department: 'Marketing' });
      expect(result.success).toBe(true);

      const stored = getSubmissions();
      expect(stored[0].department).toBe('Marketing');
    });

    it('updates multiple fields at once', () => {
      const addResult = addSubmission(makeValidSubmission());
      const id = addResult.id;

      const result = updateSubmission(id, {
        fullName: 'Updated Name',
        email: 'updated@example.com',
        mobile: '1111111111',
        department: 'Design',
      });
      expect(result.success).toBe(true);

      const stored = getSubmissions();
      expect(stored[0].fullName).toBe('Updated Name');
      expect(stored[0].email).toBe('updated@example.com');
      expect(stored[0].mobile).toBe('1111111111');
      expect(stored[0].department).toBe('Design');
    });

    it('preserves unchanged fields during update', () => {
      const addResult = addSubmission(makeValidSubmission());
      const id = addResult.id;

      updateSubmission(id, { fullName: 'New Name' });

      const stored = getSubmissions();
      expect(stored[0].fullName).toBe('New Name');
      expect(stored[0].email).toBe('john@example.com');
      expect(stored[0].mobile).toBe('9876543210');
      expect(stored[0].department).toBe('Engineering');
    });

    it('preserves the original id and submittedAt', () => {
      const addResult = addSubmission(makeValidSubmission());
      const id = addResult.id;
      const originalSubmittedAt = getSubmissions()[0].submittedAt;

      updateSubmission(id, { fullName: 'Updated' });

      const stored = getSubmissions();
      expect(stored[0].id).toBe(id);
      expect(stored[0].submittedAt).toBe(originalSubmittedAt);
    });

    it('returns NOT_FOUND for a non-existent id', () => {
      addSubmission(makeValidSubmission());

      const result = updateSubmission('non-existent-id', { fullName: 'Ghost' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('NOT_FOUND');
    });

    it('returns INVALID_DATA for null id', () => {
      const result = updateSubmission(null, { fullName: 'Test' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_DATA');
    });

    it('returns INVALID_DATA for empty string id', () => {
      const result = updateSubmission('', { fullName: 'Test' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_DATA');
    });

    it('returns INVALID_DATA for null updates', () => {
      const addResult = addSubmission(makeValidSubmission());
      const result = updateSubmission(addResult.id, null);
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_DATA');
    });

    it('returns INVALID_DATA when update results in invalid email', () => {
      const addResult = addSubmission(makeValidSubmission());
      const result = updateSubmission(addResult.id, { email: 'not-valid' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_DATA');
    });

    it('returns INVALID_DATA when update results in invalid mobile', () => {
      const addResult = addSubmission(makeValidSubmission());
      const result = updateSubmission(addResult.id, { mobile: '123' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_DATA');
    });

    it('returns INVALID_DATA when update results in invalid department', () => {
      const addResult = addSubmission(makeValidSubmission());
      const result = updateSubmission(addResult.id, { department: 'InvalidDept' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_DATA');
    });

    it('returns INVALID_DATA when update results in empty fullName', () => {
      const addResult = addSubmission(makeValidSubmission());
      const result = updateSubmission(addResult.id, { fullName: '' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_DATA');
    });

    it('returns DUPLICATE_EMAIL when updating email to one that already exists', () => {
      addSubmission(makeValidSubmission({ email: 'first@example.com' }));
      const second = addSubmission(makeValidSubmission({ email: 'second@example.com', fullName: 'Second' }));

      const result = updateSubmission(second.id, { email: 'first@example.com' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('DUPLICATE_EMAIL');
    });

    it('allows updating email to the same email (no false duplicate)', () => {
      const addResult = addSubmission(makeValidSubmission({ email: 'same@example.com' }));

      const result = updateSubmission(addResult.id, { email: 'same@example.com' });
      expect(result.success).toBe(true);
    });

    it('ignores non-allowed fields in updates', () => {
      const addResult = addSubmission(makeValidSubmission());
      const id = addResult.id;

      updateSubmission(id, { fullName: 'Updated', randomField: 'should be ignored' });

      const stored = getSubmissions();
      expect(stored[0].fullName).toBe('Updated');
      expect(stored[0].randomField).toBeUndefined();
    });

    it('does not affect other submissions when updating one', () => {
      addSubmission(makeValidSubmission({ email: 'first@example.com', fullName: 'First' }));
      const second = addSubmission(makeValidSubmission({ email: 'second@example.com', fullName: 'Second' }));

      updateSubmission(second.id, { fullName: 'Updated Second' });

      const stored = getSubmissions();
      expect(stored[0].fullName).toBe('First');
      expect(stored[1].fullName).toBe('Updated Second');
    });
  });

  // ===== deleteSubmission =====

  describe('deleteSubmission', () => {
    it('deletes an existing submission by id', () => {
      const addResult = addSubmission(makeValidSubmission());
      const id = addResult.id;

      const result = deleteSubmission(id);
      expect(result.success).toBe(true);

      const stored = getSubmissions();
      expect(stored).toHaveLength(0);
    });

    it('persists deletion to localStorage', () => {
      const addResult = addSubmission(makeValidSubmission());
      deleteSubmission(addResult.id);

      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(raw);
      expect(parsed).toHaveLength(0);
    });

    it('only removes the targeted submission, leaving others intact', () => {
      const first = addSubmission(makeValidSubmission({ email: 'first@example.com', fullName: 'First' }));
      addSubmission(makeValidSubmission({ email: 'second@example.com', fullName: 'Second' }));
      addSubmission(makeValidSubmission({ email: 'third@example.com', fullName: 'Third' }));

      deleteSubmission(first.id);

      const stored = getSubmissions();
      expect(stored).toHaveLength(2);
      expect(stored.find((s) => s.id === first.id)).toBeUndefined();
      expect(stored[0].fullName).toBe('Second');
      expect(stored[1].fullName).toBe('Third');
    });

    it('returns NOT_FOUND for a non-existent id', () => {
      addSubmission(makeValidSubmission());

      const result = deleteSubmission('non-existent-id');
      expect(result.success).toBe(false);
      expect(result.error).toBe('NOT_FOUND');
    });

    it('returns NOT_FOUND when deleting from empty storage', () => {
      const result = deleteSubmission('some-id');
      expect(result.success).toBe(false);
      expect(result.error).toBe('NOT_FOUND');
    });

    it('returns INVALID_DATA for null id', () => {
      const result = deleteSubmission(null);
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_DATA');
    });

    it('returns INVALID_DATA for empty string id', () => {
      const result = deleteSubmission('');
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_DATA');
    });

    it('returns INVALID_DATA for undefined id', () => {
      const result = deleteSubmission(undefined);
      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_DATA');
    });

    it('allows re-adding a submission with the same email after deletion', () => {
      const addResult = addSubmission(makeValidSubmission({ email: 'reuse@example.com' }));
      deleteSubmission(addResult.id);

      const result = addSubmission(makeValidSubmission({ email: 'reuse@example.com' }));
      expect(result.success).toBe(true);

      const stored = getSubmissions();
      expect(stored).toHaveLength(1);
    });
  });

  // ===== resetSubmissions =====

  describe('resetSubmissions', () => {
    it('clears all submissions to an empty array', () => {
      addSubmission(makeValidSubmission({ email: 'a@example.com' }));
      addSubmission(makeValidSubmission({ email: 'b@example.com', fullName: 'B' }));

      resetSubmissions();

      const stored = getSubmissions();
      expect(stored).toEqual([]);
    });

    it('sets localStorage to an empty JSON array', () => {
      addSubmission(makeValidSubmission());
      resetSubmissions();

      const raw = localStorage.getItem(STORAGE_KEY);
      expect(raw).toBe('[]');
    });

    it('works when localStorage is already empty', () => {
      resetSubmissions();

      const stored = getSubmissions();
      expect(stored).toEqual([]);

      const raw = localStorage.getItem(STORAGE_KEY);
      expect(raw).toBe('[]');
    });

    it('allows adding submissions after reset', () => {
      addSubmission(makeValidSubmission({ email: 'before@example.com' }));
      resetSubmissions();

      const result = addSubmission(makeValidSubmission({ email: 'after@example.com' }));
      expect(result.success).toBe(true);

      const stored = getSubmissions();
      expect(stored).toHaveLength(1);
      expect(stored[0].email).toBe('after@example.com');
    });
  });

  // ===== localStorage failure handling =====

  describe('localStorage write failure handling', () => {
    it('returns CORRUPT_STORAGE when localStorage.setItem throws on addSubmission', () => {
      const originalSetItem = localStorage.setItem.bind(localStorage);
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key) => {
        if (key === STORAGE_KEY) {
          throw new Error('QuotaExceededError');
        }
        return originalSetItem(key);
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = addSubmission(makeValidSubmission());
      expect(result.success).toBe(false);
      expect(result.error).toBe('CORRUPT_STORAGE');

      setItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });

    it('returns CORRUPT_STORAGE when localStorage.setItem throws on updateSubmission', () => {
      const addResult = addSubmission(makeValidSubmission());
      const id = addResult.id;

      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = updateSubmission(id, { fullName: 'Updated' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('CORRUPT_STORAGE');

      setItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });

    it('returns CORRUPT_STORAGE when localStorage.setItem throws on deleteSubmission', () => {
      const addResult = addSubmission(makeValidSubmission());
      const id = addResult.id;

      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = deleteSubmission(id);
      expect(result.success).toBe(false);
      expect(result.error).toBe('CORRUPT_STORAGE');

      setItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  // ===== Allowed departments =====

  describe('allowed departments', () => {
    const validDepartments = [
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

    validDepartments.forEach((dept) => {
      it(`accepts "${dept}" as a valid department`, () => {
        const result = addSubmission(
          makeValidSubmission({ department: dept, email: `${dept.toLowerCase().replace(/\s/g, '')}@example.com` })
        );
        expect(result.success).toBe(true);
      });
    });
  });
});