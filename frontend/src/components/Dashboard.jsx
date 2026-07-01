import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import GlowOrbs from "./GlowOrb";
import IssueCard from "./IssueCard";
import "./Dashboard.css";
import logo from "../assets/images/logo.svg"; // Assuming you have a logo in the assets folder

// --- MOCK DATA ---
const statusData = [
  { name: "New", count: 14 },
  { name: "Assigned", count: 8 },
  { name: "In Progress", count: 22 },
  { name: "Resolved", count: 35 },
  { name: "Closed", count: 42 },
];

// --- MOCK DATA ---
const mockIssues = [
  {
    id: "BV-092",
    title: "Conveyor belt 3 motor overheating",
    status: "New",
    severity: "Critical",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  }, // 1 hour ago
  {
    id: "BV-091",
    title: "Calibration error on filler head A",
    status: "Assigned",
    severity: "High",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }, // 1 day ago
  {
    id: "BV-090",
    title: "Palletizer sensor out of alignment",
    status: "In Progress",
    severity: "Medium",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  }, // 2 days ago
  {
    id: "BV-089",
    title: "Routine lubrication required for line 2",
    status: "New",
    severity: "Low",
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  }, // 4 hours ago
  {
    id: "BV-088",
    title: "Valve casing leak on fermentation tank",
    status: "Resolved",
    severity: "High",
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  }, // 5 days ago
];

const statuses = ["New", "Assigned", "In Progress", "Resolved", "Closed"];

const severityData = [
  { name: "Low", value: 40, patternId: "pattern-low" },
  { name: "Medium", value: 30, patternId: "pattern-medium" },
  { name: "High", value: 15, patternId: "pattern-high" },
  { name: "Critical", value: 5, patternId: "pattern-critical" },
];

// A lightweight, hardware-synced counter
const AnimatedCounter = ({ end, duration = 1500, className }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;

      // Calculate how far along we are in the given duration (0.0 to 1.0)
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // easeOutExpo function: Starts fast, applies heavy friction at the end
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCount(Math.floor(ease * end));

      // Keep requesting frames until we hit 100% progress
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span className={className}>{count}</span>;
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState("column"); // 'column' or 'list'
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIssues = mockIssues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("gridlock_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="dashboard-layout">
      <GlowOrbs />

      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logo} alt="Relay Logo" className="brand-logo" height="15" />
          <span className="brand-text">RELAY</span>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="1"></rect>
              <rect x="14" y="3" width="7" height="7" rx="1"></rect>
              <rect x="14" y="14" width="7" height="7" rx="1"></rect>
              <rect x="3" y="14" width="7" height="7" rx="1"></rect>
            </svg>
            Dashboard
          </button>
          <button className="nav-item">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Report Issue
          </button>
          <button className="nav-item">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2v4"></path>
              <path d="M16 2v4"></path>
              <rect x="4" y="8" width="16" height="14" rx="2"></rect>
              <path d="M9 14h6"></path>
              <path d="M9 18h6"></path>
              <path d="M12 11v8"></path>
            </svg>
            All Reports
          </button>
          <button className="nav-item">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            Analytics
          </button>
          <button className="nav-item">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Settings
          </button>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">{user ? user.name.charAt(0) : "U"}</div>
          <div className="user-info">
            <span className="user-name">
              {user ? `${user.name} ${user.surname}` : "User"}
            </span>
          </div>
          <button className="logout-icon">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </aside>

      <main className="main-viewport">
        <header className="viewport-header">
          <h1 className="current-page-title">Dashboard</h1>
          <button className="header-action-btn">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Report Issue
          </button>
        </header>

        <section className="content-canvas">
          {/* TOP ROW: KPI CARDS */}
          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-label">Total Issues</span>
              <AnimatedCounter end={121} className="metric-value" />
            </div>
            <div className="metric-card">
              <span className="metric-label">Critical Issues</span>
              <AnimatedCounter end={5} className="metric-value critical-text" />
            </div>
            <div className="metric-card">
              <span className="metric-label">Open Issues</span>
              <AnimatedCounter end={44} className="metric-value" />
            </div>
            <div className="metric-card">
              <span className="metric-label">Resolved Issues</span>
              <AnimatedCounter end={77} className="metric-value" />
            </div>
          </div>

          {/* BOTTOM ROW: CHARTS */}
          <div className="charts-grid">
            {/* BAR CHART */}
            <div className="chart-panel bar-panel">
              <div className="chart-header">
                <h2>Issues by status</h2>
                <p>Distribution across workflow stages</p>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statusData}
                    margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                  >
                    {/* Inject the pattern directly into the BarChart's SVG namespace */}
                    <defs>
                      <pattern
                        id="pattern-bar"
                        patternUnits="userSpaceOnUse"
                        width="6"
                        height="6"
                        patternTransform="rotate(45)"
                      >
                        <rect
                          width="6"
                          height="6"
                          fill="#ffffff"
                          fillOpacity="0.05"
                        />
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="6"
                          stroke="#ffffff"
                          strokeOpacity="0.25"
                          strokeWidth="2"
                        />
                      </pattern>
                    </defs>

                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#888", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#555", fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.05)" }}
                      contentStyle={{
                        backgroundColor: "#111",
                        border: "1px solid #333",
                        borderRadius: "6px",
                      }}
                      itemStyle={{ color: "#fff" }}
                    />

                    <Bar
                      dataKey="count"
                      fill="url(#pattern-bar)"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* DONUT CHART */}
<div className="chart-panel donut-panel">
  <div className="chart-header">
    <h2>Severity Distribution</h2>
    <p>Breakdown by severity level</p>
  </div>
  
  <div className="chart-wrapper">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        {/* Your <defs> and <Pie> code stays exactly the same here */}
        <defs>
          <pattern id="pattern-low" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#4ade80" fillOpacity="0.08" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#4ade80" strokeOpacity="0.35" strokeWidth="2" />
          </pattern>
          <pattern id="pattern-medium" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#facc15" fillOpacity="0.08" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#facc15" strokeOpacity="0.35" strokeWidth="2" />
          </pattern>
          <pattern id="pattern-high" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#fb923c" fillOpacity="0.08" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#fb923c" strokeOpacity="0.35" strokeWidth="2" />
          </pattern>
          <pattern id="pattern-critical" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#ef4444" fillOpacity="0.08" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#ef4444" strokeOpacity="0.35" strokeWidth="2" />
          </pattern>
        </defs>

        <Pie data={severityData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
          {severityData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`url(#${entry.patternId})`} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '6px' }} itemStyle={{ color: '#fff' }} />
      </PieChart>
    </ResponsiveContainer>
  </div>

  {/* --- NEW CUSTOM LEGEND --- */}
  <div className="donut-legend">
    {severityData.map((entry, index) => {
      // Map the pattern ID back to its raw hex color for the solid dot
      const colorMap = {
        'pattern-low': '#4ade80ab',
        'pattern-medium': '#facc15a2',
        'pattern-high': '#fb923cbb',
        'pattern-critical': '#ef4444ab'
      };
      
      return (
        <div key={index} className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: colorMap[entry.patternId] }}></span>
          <span className="legend-label">{entry.name}</span>
        </div>
      );
    })}
  </div>
</div>
          </div>
          {/* ISSUES LIST */}
          <div className="data-explorer-section">
            {/* SEARCH & CONTROLS */}
            <div className="explorer-controls">
              <div className="search-bar-wrapper">
                <svg
                  className="search-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Search issues by ID or Title..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="view-toggles">
                <button
                  className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </button>
                <button
                  className={`toggle-btn ${viewMode === "column" ? "active" : ""}`}
                  onClick={() => setViewMode("column")}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="7" height="18" rx="1"></rect>
                    <rect x="14" y="3" width="7" height="18" rx="1"></rect>
                  </svg>
                </button>
              </div>
            </div>

            <div className="explorer-content">
              {viewMode === "column" ? (
                /* --- COLUMN (KANBAN) VIEW --- */
                <div className="kanban-board">
                  {statuses.map((status) => {
                    // Filter issues for this specific column
                    const columnIssues = filteredIssues.filter(
                      (i) => i.status === status,
                    );
                    // Determine dot color dynamically
                    const dotClass = `status-dot dot-${status.toLowerCase().replace(" ", "-")}`;

                    return (
                      <div key={status} className="kanban-column">
                        <div className="kanban-column-header">
                          <div className="header-left">
                            <span className={dotClass}></span>
                            <h4>{status}</h4>
                          </div>
                          <span className="issue-count">
                            {columnIssues.length}
                          </span>
                        </div>

                        <div className="kanban-column-body">
                          {columnIssues.length > 0 ? (
                            columnIssues.map((issue) => (
                              <IssueCard key={issue.id} issue={issue} />
                            ))
                          ) : (
                            <div className="empty-column-state">
                              No issues under this stage
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* --- LIST VIEW --- */
                <div className="list-view-container">
                  <table className="list-view-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIssues.map((issue) => (
                        <tr key={issue.id}>
                          <td className="list-id">{issue.id}</td>
                          <td className="list-title">{issue.title}</td>
                          <td>
                            <span
                              className={`status-badge stat-${issue.status.toLowerCase().replace(" ", "-")}`}
                            >
                              {issue.status}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`severity-badge severity-${issue.severity.toLowerCase()}`}
                            >
                              {issue.severity}
                            </span>
                          </td>
                          <td className="list-date">
                            {new Date(issue.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
