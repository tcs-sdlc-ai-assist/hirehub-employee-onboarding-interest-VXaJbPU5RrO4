import React, { useState, useEffect, useCallback } from 'react';
import { SubmissionTable } from './SubmissionTable.jsx';
import { EditModal } from './EditModal.jsx';
import { getSubmissions, deleteSubmission } from '../utils/storage.js';

function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadSubmissions = useCallback(() => {
    const data = getSubmissions();
    setSubmissions(data);
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  function getUniqueDeparmentsCount() {
    const departments = new Set(submissions.map((s) => s.department));
    return departments.size;
  }

  function getLatestSubmissionDate() {
    if (submissions.length === 0) {
      return 'N/A';
    }

    let latest = null;

    for (const submission of submissions) {
      try {
        const date = new Date(submission.submittedAt);
        if (isNaN(date.getTime())) {
          continue;
        }
        if (!latest || date > latest) {
          latest = date;
        }
      } catch {
        continue;
      }
    }

    if (!latest) {
      return 'N/A';
    }

    return latest.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function handleEdit(submission) {
    setEditingSubmission(submission);
    setIsEditModalOpen(true);
  }

  function handleEditClose() {
    setIsEditModalOpen(false);
    setEditingSubmission(null);
  }

  function handleEditSaved() {
    setIsEditModalOpen(false);
    setEditingSubmission(null);
    loadSubmissions();
  }

  function handleDelete(submission) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the submission for "${submission.fullName}"?`
    );

    if (!confirmed) {
      return;
    }

    const result = deleteSubmission(submission.id);

    if (result.success) {
      loadSubmissions();
    } else if (result.error === 'NOT_FOUND') {
      loadSubmissions();
    }
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="dashboard">
          <h1 className="dashboard-title">Admin Dashboard</h1>

          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-card-value">{submissions.length}</div>
              <div className="stat-card-label">Total Submissions</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-value">{getUniqueDeparmentsCount()}</div>
              <div className="stat-card-label">Unique Departments</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-value">{getLatestSubmissionDate()}</div>
              <div className="stat-card-label">Latest Submission</div>
            </div>
          </div>

          <div className="table-container">
            <div className="table-header">
              <h2 className="table-title">All Submissions</h2>
            </div>
            <SubmissionTable
              submissions={submissions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>

        {isEditModalOpen && (
          <EditModal
            submission={editingSubmission}
            onClose={handleEditClose}
            onSaved={handleEditSaved}
          />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;