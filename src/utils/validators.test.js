import { describe, it, expect } from 'vitest';
import {
  validateFullName,
  validateEmail,
  validateMobile,
  validateDepartment,
  validateForm,
  isDuplicateEmail,
  ALLOWED_DEPARTMENTS,
} from './validators.js';

describe('validateFullName', () => {
  it('returns error when full name is undefined', () => {
    const result = validateFullName(undefined);
    expect(result).toBe('Full name is required.');
  });

  it('returns error when full name is null', () => {
    const result = validateFullName(null);
    expect(result).toBe('Full name is required.');
  });

  it('returns error when full name is empty string', () => {
    const result = validateFullName('');
    expect(result).toBe('Full name is required.');
  });

  it('returns error when full name is only whitespace', () => {
    const result = validateFullName('   ');
    expect(result).toBe('Full name is required.');
  });

  it('returns error when full name is too short (1 character)', () => {
    const result = validateFullName('A');
    expect(result).toBe('Full name must be at least 2 characters.');
  });

  it('returns error when full name exceeds 64 characters', () => {
    const longName = 'A'.repeat(65);
    const result = validateFullName(longName);
    expect(result).toBe('Full name must not exceed 64 characters.');
  });

  it('returns empty string for valid full name', () => {
    const result = validateFullName('John Doe');
    expect(result).toBe('');
  });

  it('returns empty string for full name with exactly 2 characters', () => {
    const result = validateFullName('Jo');
    expect(result).toBe('');
  });

  it('returns empty string for full name with exactly 64 characters', () => {
    const name = 'A'.repeat(64);
    const result = validateFullName(name);
    expect(result).toBe('');
  });
});

describe('validateEmail', () => {
  it('returns error when email is undefined', () => {
    const result = validateEmail(undefined);
    expect(result).toBe('Email address is required.');
  });

  it('returns error when email is null', () => {
    const result = validateEmail(null);
    expect(result).toBe('Email address is required.');
  });

  it('returns error when email is empty string', () => {
    const result = validateEmail('');
    expect(result).toBe('Email address is required.');
  });

  it('returns error for email without @ symbol', () => {
    const result = validateEmail('johndoe.com');
    expect(result).toBe('Please enter a valid email address.');
  });

  it('returns error for email without domain', () => {
    const result = validateEmail('john@');
    expect(result).toBe('Please enter a valid email address.');
  });

  it('returns error for email without TLD', () => {
    const result = validateEmail('john@example');
    expect(result).toBe('Please enter a valid email address.');
  });

  it('returns error for email with spaces', () => {
    const result = validateEmail('john doe@example.com');
    expect(result).toBe('Please enter a valid email address.');
  });

  it('returns empty string for valid email', () => {
    const result = validateEmail('john@example.com');
    expect(result).toBe('');
  });

  it('returns empty string for valid email with subdomain', () => {
    const result = validateEmail('john@mail.example.com');
    expect(result).toBe('');
  });

  it('returns empty string for valid email with plus sign', () => {
    const result = validateEmail('john+tag@example.com');
    expect(result).toBe('');
  });
});

describe('validateMobile', () => {
  it('returns error when mobile is undefined', () => {
    const result = validateMobile(undefined);
    expect(result).toBe('Mobile number is required.');
  });

  it('returns error when mobile is null', () => {
    const result = validateMobile(null);
    expect(result).toBe('Mobile number is required.');
  });

  it('returns error when mobile is empty string', () => {
    const result = validateMobile('');
    expect(result).toBe('Mobile number is required.');
  });

  it('returns error for non-numeric mobile', () => {
    const result = validateMobile('abcdefghij');
    expect(result).toBe('Mobile number must be exactly 10 digits.');
  });

  it('returns error for mobile with fewer than 10 digits', () => {
    const result = validateMobile('123456789');
    expect(result).toBe('Mobile number must be exactly 10 digits.');
  });

  it('returns error for mobile with more than 10 digits', () => {
    const result = validateMobile('12345678901');
    expect(result).toBe('Mobile number must be exactly 10 digits.');
  });

  it('returns error for mobile with special characters', () => {
    const result = validateMobile('123-456-78');
    expect(result).toBe('Mobile number must be exactly 10 digits.');
  });

  it('returns error for mobile with spaces', () => {
    const result = validateMobile('123 456 78');
    expect(result).toBe('Mobile number must be exactly 10 digits.');
  });

  it('returns empty string for valid 10-digit mobile', () => {
    const result = validateMobile('9876543210');
    expect(result).toBe('');
  });
});

describe('validateDepartment', () => {
  it('returns error when department is undefined', () => {
    const result = validateDepartment(undefined);
    expect(result).toBe('Please select a department.');
  });

  it('returns error when department is null', () => {
    const result = validateDepartment(null);
    expect(result).toBe('Please select a department.');
  });

  it('returns error when department is empty string', () => {
    const result = validateDepartment('');
    expect(result).toBe('Please select a department.');
  });

  it('returns error for invalid department value', () => {
    const result = validateDepartment('InvalidDept');
    expect(result).toBe('Please select a valid department.');
  });

  it('returns empty string for valid department', () => {
    const result = validateDepartment('Engineering');
    expect(result).toBe('');
  });

  it('returns empty string for each allowed department', () => {
    ALLOWED_DEPARTMENTS.forEach((dept) => {
      const result = validateDepartment(dept);
      expect(result).toBe('');
    });
  });
});

describe('validateForm', () => {
  it('returns all errors when all fields are empty', () => {
    const result = validateForm({});
    expect(result.isValid).toBe(false);
    expect(result.fullName).toBe('Full name is required.');
    expect(result.email).toBe('Email address is required.');
    expect(result.mobile).toBe('Mobile number is required.');
    expect(result.department).toBe('Please select a department.');
  });

  it('returns all errors when form data is null', () => {
    const result = validateForm(null);
    expect(result.isValid).toBe(false);
    expect(result.fullName).toBe('Full name is required.');
    expect(result.email).toBe('Email address is required.');
    expect(result.mobile).toBe('Mobile number is required.');
    expect(result.department).toBe('Please select a department.');
  });

  it('returns no errors when all fields are valid', () => {
    const result = validateForm({
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      mobile: '1234567890',
      department: 'Engineering',
    });
    expect(result.isValid).toBe(true);
    expect(result.fullName).toBe('');
    expect(result.email).toBe('');
    expect(result.mobile).toBe('');
    expect(result.department).toBe('');
  });

  it('returns errors only for invalid fields', () => {
    const result = validateForm({
      fullName: 'Jane Smith',
      email: 'invalid-email',
      mobile: '1234567890',
      department: 'Engineering',
    });
    expect(result.isValid).toBe(false);
    expect(result.fullName).toBe('');
    expect(result.email).toBe('Please enter a valid email address.');
    expect(result.mobile).toBe('');
    expect(result.department).toBe('');
  });

  it('returns multiple errors when multiple fields are invalid', () => {
    const result = validateForm({
      fullName: '',
      email: 'invalid',
      mobile: '123',
      department: 'Unknown',
    });
    expect(result.isValid).toBe(false);
    expect(result.fullName).not.toBe('');
    expect(result.email).not.toBe('');
    expect(result.mobile).not.toBe('');
    expect(result.department).not.toBe('');
  });
});

describe('isDuplicateEmail', () => {
  const submissions = [
    { id: '1', email: 'john@example.com' },
    { id: '2', email: 'jane@example.com' },
    { id: '3', email: 'admin@hirehub.com' },
  ];

  it('returns true when duplicate email is found', () => {
    const result = isDuplicateEmail('john@example.com', submissions);
    expect(result).toBe(true);
  });

  it('returns false when no duplicate email is found', () => {
    const result = isDuplicateEmail('unique@example.com', submissions);
    expect(result).toBe(false);
  });

  it('performs case-insensitive comparison', () => {
    const result = isDuplicateEmail('JOHN@EXAMPLE.COM', submissions);
    expect(result).toBe(true);
  });

  it('performs case-insensitive comparison with mixed case', () => {
    const result = isDuplicateEmail('Jane@Example.Com', submissions);
    expect(result).toBe(true);
  });

  it('returns false when email is null', () => {
    const result = isDuplicateEmail(null, submissions);
    expect(result).toBe(false);
  });

  it('returns false when email is empty string', () => {
    const result = isDuplicateEmail('', submissions);
    expect(result).toBe(false);
  });

  it('returns false when submissions array is empty', () => {
    const result = isDuplicateEmail('john@example.com', []);
    expect(result).toBe(false);
  });

  it('returns false when submissions is not an array', () => {
    const result = isDuplicateEmail('john@example.com', null);
    expect(result).toBe(false);
  });

  it('excludes submission with matching excludeId', () => {
    const result = isDuplicateEmail('john@example.com', submissions, '1');
    expect(result).toBe(false);
  });

  it('still detects duplicate when excludeId does not match', () => {
    const result = isDuplicateEmail('john@example.com', submissions, '99');
    expect(result).toBe(true);
  });

  it('handles submissions with null email entries gracefully', () => {
    const submissionsWithNull = [
      { id: '1', email: null },
      { id: '2', email: 'jane@example.com' },
    ];
    const result = isDuplicateEmail('jane@example.com', submissionsWithNull);
    expect(result).toBe(true);
  });

  it('handles submissions with missing email property gracefully', () => {
    const submissionsWithMissing = [
      { id: '1' },
      { id: '2', email: 'jane@example.com' },
    ];
    const result = isDuplicateEmail('jane@example.com', submissionsWithMissing);
    expect(result).toBe(true);
  });

  it('trims whitespace when comparing emails', () => {
    const result = isDuplicateEmail('  john@example.com  ', submissions);
    expect(result).toBe(true);
  });
});