import React from 'react'

interface LogoProps {
  className?: string
  size?: number
}

export const Logo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size = 20 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 560.414 560.415"
      fill="currentColor"
      className={`tier-logo-svg group/logo cursor-pointer ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        .tier-logo-row {
          transform: translateY(0px);
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .tier-logo-row-1 { transition-delay: 0.16s; }
        .tier-logo-row-2 { transition-delay: 0.08s; }
        .tier-logo-row-3 { transition-delay: 0s; }

        .tier-logo-svg:hover .tier-logo-row {
          transform: translateY(18px);
        }
        .tier-logo-svg:hover .tier-logo-row-1 { transition-delay: 0s; }
        .tier-logo-svg:hover .tier-logo-row-2 { transition-delay: 0.08s; }
        .tier-logo-svg:hover .tier-logo-row-3 { transition-delay: 0.16s; }
      `}</style>
      <g>
        {/* Row 1 (Top) */}
        <g className="tier-logo-row tier-logo-row-1">
          <path d="M115.65,24.92H33.507C15.031,24.92,0,39.951,0,58.421v82.143c0,18.477,15.031,33.501,33.507,33.501h82.143 c18.476,0,33.501-15.031,33.501-33.501V58.421C149.145,39.945,134.12,24.92,115.65,24.92z" />
          <path d="M526.908,24.92H212.205c-18.477,0-33.501,15.031-33.501,33.501v82.143c0,18.477,15.025,33.501,33.501,33.501h314.703 c18.477,0,33.506-15.031,33.506-33.501V58.421C560.414,39.945,545.377,24.92,526.908,24.92z" />
        </g>
        
        {/* Row 2 (Middle) */}
        <g className="tier-logo-row tier-logo-row-2">
          <path d="M115.65,205.632H33.507C15.031,205.632,0,220.663,0,239.133v82.143c0,18.476,15.031,33.5,33.507,33.5h82.143 c18.476,0,33.501-15.024,33.501-33.5v-82.143C149.145,220.657,134.12,205.632,115.65,205.632z" />
          <path d="M526.908,205.632H212.205c-18.477,0-33.501,15.031-33.501,33.501v82.143c0,18.476,15.025,33.5,33.501,33.5h314.703 c18.477,0,33.506-15.024,33.506-33.5v-82.143C560.414,220.657,545.377,205.632,526.908,205.632z" />
        </g>

        {/* Row 3 (Bottom) */}
        <g className="tier-logo-row tier-logo-row-3">
          <path d="M115.65,386.343H33.507C15.031,386.343,0,401.374,0,419.85v82.143c0,18.477,15.031,33.501,33.507,33.501h82.143 c18.476,0,33.501-15.024,33.501-33.501V419.85C149.145,401.374,134.12,386.343,115.65,386.343z" />
          <path d="M526.908,386.343H212.205c-18.477,0-33.501,15.03-33.501,33.507v82.143c0,18.477,15.025,33.501,33.501,33.501h314.703 c18.477,0,33.506-15.024,33.506-33.501V419.85C560.414,401.374,545.377,386.343,526.908,386.343z" />
        </g>
      </g>
    </svg>
  )
}
