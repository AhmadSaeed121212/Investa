import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import './InvestmentPlans.css';

const InvestmentPlans = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Lithium',
      description: 'Earn through lithium mining',
      icon: 'fas fa-battery-full',
      min: 2,
      max: 100000,
      roiDaily: '3/3.5%',
      roiHourly: '0.125%'
    },
    {
      name: 'Gold',
      description: 'Earn through gold trading',
      icon: 'fas fa-gem',
      min: 100,
      max: 50000,
      roiDaily: '2.5/3%',
      roiHourly: '0.104%'
    },
    {
      name: 'Platinum',
      description: 'Premium AI trading bot',
      icon: 'fas fa-crown',
      min: 500,
      max: 100000,
      roiDaily: '4/4.5%',
      roiHourly: '0.167%'
    },
    {
      name: 'Diamond',
      description: 'Elite trading strategies',
      icon: 'fas fa-gem',
      min: 1000,
      max: 500000,
      roiDaily: '5/5.5%',
      roiHourly: '0.208%'
    }
  ];

  const handleStartInvesting = (planName) => {
    alert(`Starting investment in ${planName} plan...`);
    // Add your investment processing logic here
  };

  return (
    <Layout title="Plans">
      <div className="p-4">
        {/* Header Section */}
        <div className="mb-5">
          <h2 className="text-white fw-bold mb-2">Investment Plans</h2>
          <p className="text-gray">Choose your AI trading bot and start earning</p>
        </div>

        {/* Plans Grid */}
        <div className="row g-4">
          {plans.map((plan, index) => (
            <div key={plan.name} className="col-12 mb-4">
              <div className="plan-card" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="d-flex align-items-start mb-4">
                  <div className="plan-icon me-4">
                    <i className={plan.icon}></i>
                  </div>
                  <div>
                    <h4 className="text-white fw-bold mb-2">{plan.name}</h4>
                    <p className="text-gray mb-2">{plan.description}</p>
                    <p className="text-success-custom mb-0">Principal Return Policy Will Be Returned</p>
                  </div>
                </div>
            
                <div className="d-flex align-items-center mb-2">
                  <div>
                    <p className="text-gray mb-1">Range</p>
                    <p className="text-white fw-bold mb-0">
                      ${plan.min} - ${plan.max.toLocaleString()} <span className="text-gray fw-normal">Min</span>
                    </p>
                  </div>
                  <div className="plan-divider"></div>
                  <div>
                    <p className="text-white fw-bold mb-1">
                      ROI {plan.roiDaily} <span className="text-gray fw-normal">Daily</span>
                    </p>
                    <p className="text-white mb-0">{plan.roiHourly} / Hourly</p>
                  </div>
                </div>
                
                <div className="d-flex justify-content-end">
                  <button className="btn-start" onClick={() => handleStartInvesting(plan.name)}>
                    Start Investing
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default InvestmentPlans;
