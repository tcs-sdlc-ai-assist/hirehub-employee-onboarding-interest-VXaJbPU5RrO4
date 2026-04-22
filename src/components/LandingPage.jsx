import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: '💡',
    title: 'Innovation',
    description: 'Work on cutting-edge projects that push boundaries and shape the future of technology.',
  },
  {
    icon: '📈',
    title: 'Growth',
    description: 'Accelerate your career with mentorship, learning opportunities, and clear advancement paths.',
  },
  {
    icon: '🤝',
    title: 'Culture',
    description: 'Join a diverse, inclusive team that values collaboration, respect, and work-life balance.',
  },
  {
    icon: '🌍',
    title: 'Impact',
    description: 'Make a meaningful difference by contributing to solutions that impact communities worldwide.',
  },
];

function LandingPage() {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <h1 className="hero-heading">Welcome to HireHub</h1>
        <p className="hero-subheading">
          Discover exciting opportunities and take the first step toward joining our world-class team.
        </p>
        <Link to="/apply" className="cta-button hero-cta">
          Express Your Interest
        </Link>
      </section>

      <section className="features-section">
        <h2 className="features-heading">Why Join Us?</h2>
        <div className="features-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.title}>
              <span className="feature-icon" role="img" aria-label={feature.title}>
                {feature.icon}
              </span>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bottom-cta-section">
        <h2 className="bottom-cta-heading">Ready to Get Started?</h2>
        <p className="bottom-cta-text">
          Take the leap and express your interest in joining HireHub today.
        </p>
        <Link to="/apply" className="cta-button bottom-cta">
          Apply Now
        </Link>
      </section>
    </div>
  );
}

export default LandingPage;