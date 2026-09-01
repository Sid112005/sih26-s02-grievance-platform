import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleCard = ({ icon: IconComponent, title, description, buttonText, to }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(to);
  };

  return (
    <div className="citizen-card p-6 sm:p-8 flex flex-col justify-between group cursor-pointer" onClick={handleCardClick}>
      <div>
        {/* Icon Box */}
        <div className="icon-box mb-6 group-hover:scale-105 transition-transform duration-200">
          {IconComponent && <IconComponent className="w-6 h-6" />}
        </div>

        {/* Card Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] mb-3 group-hover:text-[var(--primary-light)] transition-colors">
          {title}
        </h3>

        {/* Card Description */}
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
          {description}
        </p>
      </div>

      {/* Primary CTA Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleCardClick();
        }}
        className="btn-primary w-full text-sm font-semibold"
      >
        <span>{buttonText}</span>
      </button>
    </div>
  );
};

export default RoleCard;
