import React, { useState } from 'react';

export default function AdminView({
  adminState,
  isLoading,
  setActiveView,
  onResolveIssue,
  onPostJob,
  onReviewProfiles,
  currentUser
}) {
  const [activeSubView, setActiveSubView] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [heatMapActive, setHeatMapActive] = useState(false);
  const [revenueToggle, setRevenueToggle] = useState('week'); // 'week' or 'month'

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // Use adminState directly, with fallbacks
  const liveOps = adminState.liveOps || [];
  const criticalIssues = adminState.criticalIssues || [];

  const handleExport = () => {
    const event = new CustomEvent('show-toast', { detail: { message: "CSV report generated. Export process running in background...", type: 'info' } });
    window.dispatchEvent(event);
    setTimeout(() => {
      const finishEvent = new CustomEvent('show-toast', { detail: { message: "CSV export completed. Downloaded 'BuildTrust_Ops_Oct2024.csv'", type: 'success' } });
      window.dispatchEvent(finishEvent);
    }, 1500);
  };

  const handleGisClick = () => {
    const event = new CustomEvent('show-toast', { detail: { message: "Clustering predictions loaded: high demand predicted in Sector 62.", type: 'info' } });
    window.dispatchEvent(event);
  };

  // SVGs Paths coordinates for Revenue trends
  const linePathWeek = "M 40,170 C 120,150 180,80 260,110 C 340,135 420,95 500,50 C 530,30 550,25 570,25";
  const areaPathWeek = "M 40,170 C 120,150 180,80 260,110 C 340,135 420,95 500,50 C 530,30 550,25 570,25 L 570,170 Z";

  const linePathMonth = "M 40,130 C 100,120 160,160 220,110 C 300,50 380,80 440,40 C 500,10 540,55 570,10";
  const areaPathMonth = "M 40,130 C 100,120 160,160 220,110 C 300,50 380,80 440,40 C 500,10 540,55 570,10 L 570,170 Z";

  const currentLinePath = revenueToggle === 'week' ? linePathWeek : linePathMonth;
  const currentAreaPath = revenueToggle === 'week' ? areaPathWeek : areaPathMonth;

  // Extract initials from name
  const getInitials = (name) => {
    if (!name) return 'VS';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const adminName = currentUser?.name || 'Vikram Singh';

  return (
    <div id="view-admin" className="app-view active-view admin-view">
      <div className={`admin-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
            {isSidebarCollapsed ? '→' : '←'}
          </button>
          <div className="admin-logo-box">
            <svg className="admin-logo-icon" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.3C.5 6.7.9 9.8 2.9 11.8c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.1z" />
            </svg>
            {!isSidebarCollapsed && (
              <div>
                <h2>Build_Trust</h2>
                <span className="sub-portal">ADMIN PORTAL</span>
              </div>
            )}
          </div>

          <nav className="admin-nav">
            {['dashboard', 'leads', 'workers', 'payments', 'analytics', 'settings'].map(sub => (
              <button
                key={sub}
                className={`admin-nav-item ${activeSubView === sub ? 'active' : ''}`}
                onClick={() => {
                  setActiveSubView(sub);
                  const event = new CustomEvent('show-toast', { detail: { message: `Switched view to ${sub.toUpperCase()} panel.`, type: 'info' } });
                  window.dispatchEvent(event);
                }}
                title={isSidebarCollapsed ? sub.charAt(0).toUpperCase() + sub.slice(1) : ''}
              >
                <span className="nav-icon">{sub.charAt(0).toUpperCase()}</span>
                {!isSidebarCollapsed && <span style={{ textTransform: 'capitalize' }}>{sub}</span>}
              </button>
            ))}
          </nav>

          <button
            className={`btn btn-accent ${isSidebarCollapsed ? 'btn-icon' : 'btn-full post-job-btn-sidebar'}`}
            onClick={onPostJob}
            title={isSidebarCollapsed ? 'Post New Job' : ''}
          >
            {isSidebarCollapsed ? '+' : '+ Post New Job'}
          </button>

          <div className="admin-user-profile">
            <div className="admin-avatar">{getInitials(adminName)}</div>
            <div className="admin-user-info">
              <h4>{adminName}</h4>
              <p>Administrator</p>
            </div>
            <a
              href="#home"
              className="logout-link"
              title="Exit Admin Portal"
              onClick={(e) => {
                e.preventDefault();
                setActiveView('home');
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
              </svg>
            </a>
          </div>
        </aside>

        {/* Content Area */}
        <main className="admin-content">
          <header className="admin-content-header">
            <div>
              <h1>Operational Overview</h1>
              <p>Real-time infrastructure management & field analytics (India Operations).</p>
            </div>
            <div className="admin-header-actions">
              <div className="date-selector">
                <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginRight: '8px' }}>
                  <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                </svg>
                <span>Oct 24, 2024</span>
              </div>

              <button className="btn btn-primary" onClick={handleExport}>
                <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginRight: '6px' }}>
                  <path fill="currentColor" d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
                </svg>
                Export Reports
              </button>
            </div>
          </header>

          {/* Dashboard Sub-view */}
          {activeSubView === 'dashboard' && (
            <>
              {/* Metrics row */}
              <section className="admin-metrics-grid">
                {isLoading ? (
                  // SKELETON LOADERS
                  [1, 2, 3, 4].map(i => (
                    <div key={i} className="metric-card skeleton-metric skeleton"></div >
                  ))
                ) : (
                  <>
                    <div className="metric-card">
                      <div className="metric-header">
                        <span>Active Jobs</span>
                        <span className="metric-trend trend-up">▲ 8%</span>
                      </div>
                      <div className="metric-value">{adminState.activeJobs}</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-header">
                        <span>Pending Leads</span>
                        <span className="metric-trend trend-down">▼ 3%</span>
                      </div>
                      <div className="metric-value">{adminState.pendingLeads}</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-header">
                        <span>Total Revenue</span>
                        <span className="metric-trend trend-up">▲ 12%</span>
                      </div>
                      <div className="metric-value">₹8.2L</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-header">
                        <span>Worker Pool</span>
                        <span className="metric-trend trend-up">▲ 5%</span>
                      </div>
                      <div className="metric-value">88%</div>
                    </div>
                  </>
                )}
              </section>

              {/* Revenue and Live feed panels */}
              <section className="admin-double-column">
                <div className="admin-panel panel-revenue">
                  <div className="panel-header">
                    <div>
                      <h3>Revenue Trends</h3>
                      <p>Performance metrics across all workers.</p>
                    </div>

                    <div className="toggle-buttons">
                      <button
                        className={`toggle-btn ${revenueToggle === 'week' ? 'active' : ''}`}
                        onClick={() => {
                          setRevenueToggle('week');
                          const event = new CustomEvent('show-toast', { detail: { message: "Revenue trends rendered by weekly increments.", type: 'info' } });
                          window.dispatchEvent(event);
                        }}
                      >
                        Week
                      </button>
                      <button
                        className={`toggle-btn ${revenueToggle === 'month' ? 'active' : ''}`}
                        onClick={() => {
                          setRevenueToggle('month');
                          const event = new CustomEvent('show-toast', { detail: { message: "Revenue trends rendered by monthly increments.", type: 'info' } });
                          window.dispatchEvent(event);
                        }}
                      >
                        Month
                      </button>
                    </div>
                  </div>

                  <div className="chart-container">
                    <svg id="revenueChart" className="svg-chart" viewBox="0 0 600 220">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ff6f00" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#ff6f00" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      <line x1="40" y1="20" x2="570" y2="20" className="chart-grid-line" />
                      <line x1="40" y1="70" x2="570" y2="70" className="chart-grid-line" />
                      <line x1="40" y1="120" x2="570" y2="120" className="chart-grid-line" />
                      <line x1="40" y1="170" x2="570" y2="170" className="chart-grid-line" />

                      {/* Y-Axis Labels */}
                      <text x="30" y="25" className="chart-label y-label">₹10L</text>
                      <text x="30" y="75" className="chart-label y-label">₹7L</text>
                      <text x="30" y="125" className="chart-label y-label">₹4L</text>
                      <text x="30" y="175" className="chart-label y-label">₹1L</text>

                      {/* SVG paths with smooth coordinate transitions */}
                      <path d={currentAreaPath} fill="url(#chartGradient)" style={{ transition: 'd 0.3s ease' }} />
                      <path d={currentLinePath} fill="none" stroke="#ff6f00" strokeWidth="3" style={{ transition: 'd 0.3s ease' }} />

                      {/* X-Axis Labels */}
                      <text x="40" y="195" className="chart-label x-label">Oct 01</text>
                      <text x="146" y="195" className="chart-label x-label">Oct 08</text>
                      <text x="252" y="195" className="chart-label x-label">Oct 15</text>
                      <text x="358" y="195" className="chart-label x-label">Oct 22</text>
                      <text x="464" y="195" className="chart-label x-label">Oct 29</text>
                    </svg>
                  </div>
                </div>

                <div className="admin-panel panel-live-ops">
                  <div className="panel-header">
                    <div>
                      <h3 className="flex-align">
                        Live Operations
                        <span className="live-pulse"></span>
                      </h3>
                      <p>Real-time updates & activities.</p>
                    </div>
                  </div>
                  <div className="live-feed-list">
                    {isLoading ? (
                      [1, 2, 3].map(i => (
                        <div key={i} className="feed-item skeleton skeleton-text" style={{ height: '40px', marginBottom: '10px' }}></div>
                      ))
                    ) : liveOps.length === 0 ? (
                      <div className="text-center" style={{ padding: '20px', color: 'var(--text-muted)' }}>No recent activity.</div>
                    ) : (
                      liveOps.map(op => (
                        <div key={op.id} className="feed-item">
                          <div className={`feed-icon-box ${op.color}`}>
                            <span style={{ fontWeight: 'bold', color: 'white', fontSize: '11px' }}>{op.icon}</span>
                          </div>
                          <div className="feed-body">
                            <p>{op.text}</p>
                            <span className="feed-time">{op.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>

              {/* Radial progress and issues columns */}
              <section className="admin-three-column">
                <div className="admin-panel panel-completion">
                  <h3>Completion Rate</h3>
                  <div className="completion-content">
                    <div className="radial-progress-wrapper">
                      <svg className="radial-svg" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" className="radial-bg" />
                        <circle
                          cx="50" cy="50" r="40"
                          className="radial-fill"
                          strokeDasharray="251.2"
                          strokeDashoffset={251.2 - (251.2 * adminState.completionRate) / 100}
                        />
                      </svg>
                      <div className="radial-text">
                        <span className="radial-val">{adminState.completionRate}%</span>
                        <span className="radial-trend">+2.4%</span>
                      </div>
                    </div>

                    <div className="completion-legend">
                      <div className="legend-item">
                        <span className="legend-dot green-dot"></span>
                        <span className="legend-label">On Schedule</span>
                        <span className="legend-val">{adminState.onSchedule}</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-dot red-dot"></span>
                        <span className="legend-label">Delayed</span>
                        <span className="legend-val">{adminState.delayed}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-panel panel-tasks dark-bg">
                  <span className="task-badge-label">PRIORITY TASKS</span>
                  <h3>Awaiting Verification</h3>
                  <div className="awaiting-number-box">
                    <span className="num-val">{adminState.unverifiedCount}</span>
                    <span className="num-unit"> workers</span>
                  </div>
                  <button className="btn btn-accent btn-full" onClick={onReviewProfiles}>
                    Review Profiles
                  </button>
                </div>

                <div className="admin-panel panel-issues red-border">
                  <div className="issues-header">
                    <span className="critical-icon">⚠</span>
                    <h3>CRITICAL ISSUES</h3>
                    <span className="issues-badge-count">{adminState.issuesCount}</span>
                  </div>
                  <div className="issues-list">
                    {criticalIssues.map(issue => (
                      <div key={issue.id} className="issue-item-card">
                        <div className="issue-body">
                          <h4>{issue.title}</h4>
                          <p>{issue.desc}</p>
                        </div>
                        <button
                          className="btn btn-outline btn-small resolve-issue-btn"
                          onClick={() => onResolveIssue(issue.id)}
                        >
                          Resolve
                        </button>
                      </div>
                    ))}
                    {criticalIssues.length === 0 && (
                      <div className="text-center" style={{ padding: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        No critical issues pending. All systems running optimal.
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Sector Intelligence */}
              <section className="admin-panel panel-intelligence">
                <div className="intelligence-layout">
                  <div className="intelligence-left">
                    <span className="panel-label">INFRASTRUCTURE GIS</span>
                    <h2>Dynamic Sector Intelligence</h2>
                    <p>Access real-time worker density and project clustering data. Predictive analysis for resource allocation across NCR.</p>
                    <div className="intelligence-actions">
                      <button
                        className="btn btn-accent"
                        onClick={() => {
                          setHeatMapActive(!heatMapActive);
                          const event = new CustomEvent('show-toast', {
                            detail: {
                              message: heatMapActive ? "GIS Heat Map layers disabled." : "GIS Heat Map layers initialized successfully.",
                              type: heatMapActive ? 'info' : 'success'
                            }
                          });
                          window.dispatchEvent(event);
                        }}
                      >
                        {heatMapActive ? "Disable Heat Map" : "Initialize Heat Map"}
                      </button>

                      <button className="btn btn-outline" onClick={handleGisClick}>
                        Advanced GIS Tools
                      </button>
                    </div>
                  </div>

                  <div className="intelligence-right">
                    <div className="gis-map-container">
                      <div className="map-grid-layer"></div>

                      {/* Sector Node coordinates */}
                      <div className="sector-node sec-62" style={{ top: '30%', left: '40%' }} title="Sector 62 (Noida) - High Density">
                        <span className="pulse-ring"></span>
                        <span className="sector-dot font-dot"></span>
                      </div>
                      <div className="sector-node sec-44" style={{ top: '60%', left: '25%' }} title="Sector 44 (Noida) - Overdue Safety Audit">
                        <span className="pulse-ring pulse-red"></span>
                        <span className="sector-dot font-dot red-dot"></span>
                      </div>
                      <div className="sector-node sec-goida" style={{ top: '75%', left: '70%' }} title="Greater Noida - Optimal Density">
                        <span className="pulse-ring pulse-green"></span>
                        <span className="sector-dot font-dot green-dot"></span>
                      </div>

                      <div className={`heat-map-overlay ${heatMapActive ? 'active' : ''}`}></div>

                      <div className="map-labels">
                        <div className="map-lbl-item"><span className="legend-dot green-dot"></span> Noida Sector 62 (Optimal)</div>
                        <div className="map-lbl-item"><span className="legend-dot red-dot"></span> Sector 44 (Safety Alert)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Leads Sub-view */}
          {activeSubView === 'leads' && (
            <section className="admin-panel">
              <h3>Pending Leads Pipeline</h3>
              <p>Incoming customer requests awaiting contractor assignment.</p>
              <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px' }}>
                      <th style={{ padding: '16px' }}>LEAD ID</th>
                      <th style={{ padding: '16px' }}>CUSTOMER</th>
                      <th style={{ padding: '16px' }}>REQUIREMENT</th>
                      <th style={{ padding: '16px' }}>BUDGET</th>
                      <th style={{ padding: '16px' }}>LOCATION</th>
                      <th style={{ padding: '16px' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px', fontFamily: 'monospace' }}>#LD-8402</td>
                      <td style={{ padding: '16px', fontWeight: '500' }}>Amit Patel</td>
                      <td style={{ padding: '16px' }}>Structural Masonry (300 sq ft)</td>
                      <td style={{ padding: '16px', fontWeight: 'bold' }}>₹1,50,000</td>
                      <td style={{ padding: '16px' }}>Noida Sector 62</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: 'rgba(255, 111, 0, 0.15)', color: '#ff6f00' }}>
                          Pending Assignment
                        </span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px', fontFamily: 'monospace' }}>#LD-8403</td>
                      <td style={{ padding: '16px', fontWeight: '500' }}>Neha Sharma</td>
                      <td style={{ padding: '16px' }}>Inverter & Rewiring (Full House)</td>
                      <td style={{ padding: '16px', fontWeight: 'bold' }}>₹45,000</td>
                      <td style={{ padding: '16px' }}>Greater Noida</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: 'rgba(255, 111, 0, 0.15)', color: '#ff6f00' }}>
                          Pending Assignment
                        </span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px', fontFamily: 'monospace' }}>#LD-8404</td>
                      <td style={{ padding: '16px', fontWeight: '500' }}>Sandeep Roy</td>
                      <td style={{ padding: '16px' }}>Waterproof Painting (Balcony)</td>
                      <td style={{ padding: '16px', fontWeight: 'bold' }}>₹18,000</td>
                      <td style={{ padding: '16px' }}>Delhi Sector 44</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: 'rgba(0, 200, 83, 0.15)', color: '#00c853' }}>
                          Assigned
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Workers Sub-view */}
          {activeSubView === 'workers' && (
            <section className="admin-panel">
              <h3>Verified Specialist Registry</h3>
              <p>Directory of skilled workers and contractors currently on the platform.</p>
              <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px' }}>
                      <th style={{ padding: '16px' }}>NAME</th>
                      <th style={{ padding: '16px' }}>SPECIALTY</th>
                      <th style={{ padding: '16px' }}>LOCATION</th>
                      <th style={{ padding: '16px' }}>HOURLY RATE</th>
                      <th style={{ padding: '16px' }}>RATING</th>
                      <th style={{ padding: '16px' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px', fontWeight: 'bold' }}>Rajesh Kumar</td>
                      <td style={{ padding: '16px' }}>Masonry</td>
                      <td style={{ padding: '16px' }}>Greater Noida</td>
                      <td style={{ padding: '16px', fontWeight: '500' }}>₹450/hr</td>
                      <td style={{ padding: '16px', color: '#ffd600' }}>⭐ 4.9</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: 'rgba(0, 200, 83, 0.15)', color: '#00c853' }}>
                          Verified
                        </span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px', fontWeight: 'bold' }}>Manish Sharma</td>
                      <td style={{ padding: '16px' }}>Electrical</td>
                      <td style={{ padding: '16px' }}>Delhi NCR</td>
                      <td style={{ padding: '16px', fontWeight: '500' }}>₹350/hr</td>
                      <td style={{ padding: '16px', color: '#ffd600' }}>⭐ 4.9</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: 'rgba(0, 200, 83, 0.15)', color: '#00c853' }}>
                          Verified
                        </span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px', fontWeight: 'bold' }}>Sunita Rao</td>
                      <td style={{ padding: '16px' }}>Painting</td>
                      <td style={{ padding: '16px' }}>Mumbai</td>
                      <td style={{ padding: '16px', fontWeight: '500' }}>₹280/hr</td>
                      <td style={{ padding: '16px', color: '#ffd600' }}>⭐ 4.8</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: 'rgba(0, 200, 83, 0.15)', color: '#00c853' }}>
                          Verified
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Payments Sub-view */}
          {activeSubView === 'payments' && (
            <section className="admin-panel">
              <h3>Payments & Escrow Transactions</h3>
              <p>Financial ledger for contract payouts, commission cuts, and escrow holdings.</p>
              <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px' }}>
                      <th style={{ padding: '16px' }}>TRANSACTION ID</th>
                      <th style={{ padding: '16px' }}>DATE</th>
                      <th style={{ padding: '16px' }}>AMOUNT</th>
                      <th style={{ padding: '16px' }}>SERVICE</th>
                      <th style={{ padding: '16px' }}>TYPE</th>
                      <th style={{ padding: '16px' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px', fontFamily: 'monospace' }}>#TXN-9021</td>
                      <td style={{ padding: '16px' }}>Today, 10:15 AM</td>
                      <td style={{ padding: '16px', fontWeight: 'bold' }}>₹5,000</td>
                      <td style={{ padding: '16px' }}>Masonry Booking Settlement</td>
                      <td style={{ padding: '16px' }}>Payout</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: 'rgba(0, 200, 83, 0.15)', color: '#00c853' }}>
                          Settled
                        </span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px', fontFamily: 'monospace' }}>#TXN-9022</td>
                      <td style={{ padding: '16px' }}>Yesterday</td>
                      <td style={{ padding: '16px', fontWeight: 'bold' }}>₹12,400</td>
                      <td style={{ padding: '16px' }}>Electrical rewiring deposit</td>
                      <td style={{ padding: '16px' }}>Escrow holding</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: 'rgba(255, 235, 59, 0.15)', color: '#ffd600' }}>
                          Held in Escrow
                        </span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px', fontFamily: 'monospace' }}>#TXN-9023</td>
                      <td style={{ padding: '16px' }}>Oct 22, 2024</td>
                      <td style={{ padding: '16px', fontWeight: 'bold' }}>₹4,500</td>
                      <td style={{ padding: '16px' }}>Premium Subscription Fee</td>
                      <td style={{ padding: '16px' }}>Platform Revenue</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: 'rgba(0, 200, 83, 0.15)', color: '#00c853' }}>
                          Settled
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Analytics Sub-view */}
          {activeSubView === 'analytics' && (
            <section className="admin-panel">
              <h3>Operational Analytics</h3>
              <p>Regional growth, demand heat maps, and fulfillment speed metrics across India.</p>
              <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <div className="metric-card" style={{ background: '#121c38' }}>
                  <h4>Job Fulfillment Rate</h4>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', margin: '15px 0', color: '#ff6f00' }}>94.2%</div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Average time to match: 14.2 minutes.</p>
                </div>
                <div className="metric-card" style={{ background: '#121c38' }}>
                  <h4>Customer Retention Rate</h4>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', margin: '15px 0', color: '#00c853' }}>82.6%</div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Repeat bookings count within 90 days.</p>
                </div>
              </div>
            </section>
          )}

          {/* Settings Sub-view */}
          {activeSubView === 'settings' && (
            <section className="admin-panel">
              <h3>Portal Settings & Configurations</h3>
              <p>Manage system parameters, MSAL directory sync, and automated email messaging.</p>
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#121c38', borderRadius: '8px' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>Auto-Assign Leads</h4>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>Automatically dispatch leads to available certified workers based on location.</p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: '#ff6f00' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#121c38', borderRadius: '8px' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>Gemma Pricing Engine (Gemma-2-9b)</h4>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>Use LLM for automated project cost estimation calculations.</p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: '#ff6f00' }} />
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
