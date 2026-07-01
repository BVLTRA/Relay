import React from 'react';
import './Dashboard.css'; 

// Mechanism to calculate relative time (e.g., "2h ago", "3d ago")
const timeAgo = (dateString) => {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  
  let interval = seconds / 86400; // Days
  if (interval > 1) return Math.floor(interval) + "d ago";
  
  interval = seconds / 3600; // Hours
  if (interval > 1) return Math.floor(interval) + "h ago";
  
  interval = seconds / 60; // Minutes
  if (interval > 1) return Math.floor(interval) + "m ago";
  
  return "Just now";
};

const IssueCard = ({ issue }) => {
  // Map severity to a specific CSS class for coloring
  const severityClass = `severity-badge severity-${issue.severity.toLowerCase()}`;

  return (
    <div className="issue-card">
      <div className="issue-card-header">
        <span className="issue-id">{issue.id}</span>
        <span className="issue-time">{timeAgo(issue.createdAt)}</span>
      </div>
      <h3 className="issue-title">{issue.title}</h3>
      <div className="issue-card-footer">
        <span className={severityClass}>{issue.severity}</span>
      </div>
    </div>
  );
};

export default IssueCard;