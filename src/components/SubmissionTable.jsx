import React from 'react';
import PropTypes from 'prop-types';

const departmentColors = {
  Engineering: '#3b82f6',
  Marketing: '#10b981',
  Sales: '#f59e0b',
  HR: '#8b5cf6',
  Finance: '#ef4444',
  Operations: '#06b6d4',
  Design: '#ec4899',
  Legal: '#6366f1',
  Support: '#14b8a6',
};

function getDepartmentColor(department) {
  return departmentColors[department] || '#6b7280';
}

function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'N/A';
  }
}

export function SubmissionTable({ submissions, onEdit, onDelete }) {
  if (!submissions || submissions.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <p style={styles.emptyText}>No submissions yet.</p>
      </div>
    );
  }

  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Mobile</th>
            <th style={styles.th}>Department</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission, index) => (
            <tr key={submission.id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
              <td style={styles.td}>{index + 1}</td>
              <td style={styles.td}>{submission.fullName}</td>
              <td style={styles.td}>{submission.email}</td>
              <td style={styles.td}>{submission.mobile}</td>
              <td style={styles.td}>
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor: getDepartmentColor(submission.department),
                  }}
                >
                  {submission.department}
                </span>
              </td>
              <td style={styles.td}>{formatDate(submission.submittedAt)}</td>
              <td style={styles.td}>
                <div style={styles.actions}>
                  <button
                    type="button"
                    style={styles.editButton}
                    onClick={() => onEdit(submission)}
                    aria-label={`Edit submission for ${submission.fullName}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    style={styles.deleteButton}
                    onClick={() => onDelete(submission)}
                    aria-label={`Delete submission for ${submission.fullName}`}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '700px',
    fontSize: '14px',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    backgroundColor: '#f1f5f9',
    borderBottom: '2px solid #e2e8f0',
    fontWeight: '600',
    color: '#334155',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '10px 16px',
    borderBottom: '1px solid #e2e8f0',
    color: '#475569',
    verticalAlign: 'middle',
  },
  rowEven: {
    backgroundColor: '#ffffff',
  },
  rowOdd: {
    backgroundColor: '#f8fafc',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'nowrap',
  },
  editButton: {
    padding: '6px 14px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  deleteButton: {
    padding: '6px 14px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  emptyContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '48px 16px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#94a3b8',
    fontStyle: 'italic',
  },
};

SubmissionTable.propTypes = {
  submissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      mobile: PropTypes.string.isRequired,
      department: PropTypes.string.isRequired,
      submittedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default SubmissionTable;