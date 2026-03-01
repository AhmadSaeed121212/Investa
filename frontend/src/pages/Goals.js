import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import './Goals.css';

const Goals = () => {
  useEffect(() => {
    // Add floating animation to cards
    const cards = document.querySelectorAll('.dashboard-card, .goal-card');
    cards.forEach((card, index) => {
      card.style.animation = `fadeInUp 0.8s ease-out ${index * 0.1}s both`;
    });
  }, []);

  const goals = [
    {
      name: 'Team Builder',
      level: 1,
      investment: 10,
      salary: 2,
      progress: 25,
      icon: 'fas fa-shield-alt',
      bgClass: 'bg-level-1',
      isCurrent: true
    },
    {
      name: 'Team Leader',
      level: 2,
      investment: 40,
      salary: 5,
      progress: 50,
      icon: 'fas fa-crown',
      bgClass: 'bg-level-2',
      isCurrent: false
    },
    {
      name: 'Team Director',
      level: 3,
      investment: 120,
      salary: 8,
      progress: 75,
      icon: 'fas fa-star',
      bgClass: 'bg-level-3',
      isCurrent: false
    },
    {
      name: 'Team Master',
      level: 4,
      investment: 200,
      salary: 16,
      progress: 100,
      icon: 'fas fa-medal',
      bgClass: 'bg-level-4',
      isCurrent: false
    },
    {
      name: 'Team Chief',
      level: 5,
      investment: 600,
      salary: 50,
      progress: 30,
      icon: 'fas fa-gem',
      bgClass: 'bg-level-5',
      isCurrent: false
    },
    {
      name: 'Team Executive',
      level: 6,
      investment: 1000,
      salary: 170,
      progress: 60,
      icon: 'fas fa-trophy',
      bgClass: 'bg-level-6',
      isCurrent: false
    }
  ];

  return (
    <Layout title="Ranks">
      {/* Current Goal Status */}
      <div className="mb-2">
        <h4 className="text-white fw-bold mb-1">Current Goal Status</h4>
        <p className="text-gray small">Track your progress and see what's needed for the next level.</p>
      </div>

      {/* Progress Card */}
      <div className="dashboard-card mb-5">
        <div className="row align-items-center">
          <div className="col-md-2 text-center">
            <div className="rank-badge mx-auto mb-2">
              <i className="fas fa-shield-alt text-white"></i>
            </div>
            <p className="text-white fw-bold mb-0">No Rank</p>
          </div>
          <div className="col-md-6">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <p className="text-gray mb-1">Progress to next goal</p>
                <h6 className="text-white mb-0">Team Builder</h6>
              </div>
              <div className="text-end">
                <h4 className="text-white mb-0">0%</h4>
                <span className="text-success-custom small">Almost there!</span>
              </div>
            </div>
            <div className="progress">
              <div className="progress-bar" role="progressbar" style={{ width: '0%' }}></div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="next-goal-card">
              <h6 className="text-white mb-3">Next Goal Team Builder</h6>
              <div className="d-flex align-items-center mb-2">
                <i className="fas fa-bullseye text-primary-custom me-2"></i>
                <span className="text-gray small">Team Progress</span>
                <span className="text-success-custom ms-auto fw-bold">$0</span>
              </div>
              <div className="progress mb-2" style={{ height: '6px' }}>
                <div className="progress-bar bg-success" role="progressbar" style={{ width: '0%' }}></div>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-success-custom small">$10 more needed</span>
                <span className="text-white small">$10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reward Requirements */}
      <div className="mb-4">
        <h4 className="text-white fw-bold mb-1">Reward Requirements</h4>
        <p className="text-gray small">Make Refers and Earn BIG exciting rewards + refer commission.</p>
      </div>

      {/* Goals Grid */}
      <div className="row g-4">
        {goals.map((goal, index) => (
          <div key={index} className="col-12 mb-4">
            <div className={`goal-card ${goal.isCurrent ? 'current' : ''}`}>
              {goal.isCurrent && <span className="current-badge">Current</span>}
              <div className="d-flex align-items-center mb-3">
                <div className={`goal-icon ${goal.bgClass}`}>
                  <i className={`${goal.icon} text-white`}></i>
                </div>
                <div>
                  <h6 className="text-white fw-bold mb-0">{goal.name}</h6>
                  <p className="text-gray small mb-0">Level {goal.level}</p>
                </div>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-gray small">Total Refers Investment</span>
                <span className="text-gray small">Sallery</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-white fw-bold">${goal.investment}</span>
                <span className="win-amount">${goal.salary}</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-gray small">Progress</span>
                <span className="text-white small">{goal.progress}%</span>
              </div>
              <div className="progress" style={{ height: '6px' }}>
                <div className="progress-bar" role="progressbar" style={{ width: `${goal.progress}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Goals;
