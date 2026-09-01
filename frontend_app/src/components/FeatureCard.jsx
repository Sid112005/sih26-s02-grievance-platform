import React from 'react';

const FeatureCard = ({ icon: IconComponent, title, description }) => {
  return (
    <div className="quick-action-card p-6 sm:p-8 flex flex-col items-start group">
      {/* Icon Box */}
      <div className="icon-box mb-5 group-hover:scale-105 transition-transform duration-200">
        {IconComponent && <IconComponent className="w-6 h-6" />}
      </div>

      {/* Feature Title */}
      <h3 className="text-lg sm:text-xl font-bold text-[var(--text-main)] mb-2.5 group-hover:text-[var(--primary-light)] transition-colors">
        {title}
      </h3>

      {/* Feature Description */}
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
