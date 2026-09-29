import React from "react";

// Plant SVGs for each type and stage
interface PlantSvgProps {
  className?: string;
}

// Tulip SVG Components
export const TulipStage1: React.FC<PlantSvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    className={className}
  >
    <path
      d="M50 160V120"
      fill="none"
      stroke="#718947"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <circle cx="50" cy="120" r="5" fill="#9cb365" />
    <path d="M45 115C45 115 40 110 40 105C40 100 45 95 50 95C55 95 60 100 60 105C60 110 55 115 55 115" fill="#c8d4a9" />
  </svg>
);

export const TulipStage2: React.FC<PlantSvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    className={className}
  >
    <path
      d="M50 160V100"
      fill="none"
      stroke="#718947"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M40 95L35 85M60 95L65 85"
      fill="none"
      stroke="#718947"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path d="M45 95C45 95 40 90 40 85C40 80 45 75 50 75C55 75 60 80 60 85C60 90 55 95 55 95" fill="#c8d4a9" />
    <ellipse cx="50" cy="85" rx="10" ry="15" fill="#e8a3bf" />
  </svg>
);

export const TulipStage3: React.FC<PlantSvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    className={className}
  >
    <path
      d="M50 160V80"
      fill="none"
      stroke="#718947"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M30 80L25 70M70 80L75 70"
      fill="none"
      stroke="#718947"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path d="M40 80C40 80 35 75 35 70C35 65 40 60 50 60C60 60 65 65 65 70C65 75 60 80 60 80" fill="#9cb365" />
    <ellipse cx="50" cy="65" rx="15" ry="20" fill="#e55c8b" />
  </svg>
);

export const TulipStage4: React.FC<PlantSvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    className={className}
  >
    <path
      d="M50 160V60"
      fill="none"
      stroke="#718947"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M30 80L20 65M70 80L80 65"
      fill="none"
      stroke="#718947"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path d="M35 60C35 60 30 55 30 50C30 45 35 40 50 40C65 40 70 45 70 50C70 55 65 60 65 60" fill="#9cb365" />
    <ellipse cx="50" cy="40" rx="25" ry="30" fill="#e8396b" />
    <circle cx="50" cy="40" r="10" fill="#f9ca24" />
  </svg>
);

export const TulipStage5: React.FC<PlantSvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    className={className}
  >
    <path
      d="M50 160V40"
      fill="none"
      stroke="#718947"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M25 70L15 55M75 70L85 55"
      fill="none"
      stroke="#718947"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path d="M35 50C35 50 25 45 25 35C25 25 35 20 50 20C65 20 75 25 75 35C75 45 65 50 65 50" fill="#9cb365" />
    <ellipse cx="50" cy="25" rx="30" ry="35" fill="#e8396b" />
    <circle cx="50" cy="25" r="15" fill="#f9ca24" />
  </svg>
);

// Cactus SVG Components
export const CactusStage1: React.FC<PlantSvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    className={className}
  >
    <rect x="40" y="120" width="20" height="40" rx="5" fill="#7bb776" />
    <line x1="50" y1="125" x2="50" y2="135" stroke="#5a8a56" strokeWidth="1" strokeDasharray="2,2" />
    <line x1="45" y1="130" x2="55" y2="130" stroke="#5a8a56" strokeWidth="1" strokeDasharray="2,2" />
  </svg>
);

export const CactusStage2: React.FC<PlantSvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    className={className}
  >
    <rect x="40" y="100" width="20" height="60" rx="5" fill="#7bb776" />
    <line x1="50" y1="110" x2="50" y2="120" stroke="#5a8a56" strokeWidth="1" strokeDasharray="2,2" />
    <line x1="45" y1="115" x2="55" y2="115" stroke="#5a8a56" strokeWidth="1" strokeDasharray="2,2" />
    <line x1="50" y1="130" x2="50" y2="140" stroke="#5a8a56" strokeWidth="1" strokeDasharray="2,2" />
    <line x1="45" y1="135" x2="55" y2="135" stroke="#5a8a56" strokeWidth="1" strokeDasharray="2,2" />
  </svg>
);

export const CactusStage3: React.FC<PlantSvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    className={className}
  >
    <rect x="40" y="80" width="20" height="80" rx="5" fill="#7bb776" />
    <rect x="60" y="100" width="15" height="20" rx="5" fill="#7bb776" />
    <line x1="50" y1="90" x2="50" y2="100" stroke="#5a8a56" strokeWidth="1" strokeDasharray="2,2" />
    <line x1="45" y1="95" x2="55" y2="95" stroke="#5a8a56" strokeWidth="1" strokeDasharray="2,2" />
    <line x1="50" y1="120" x2="50" y2="130" stroke="#5a8a56" strokeWidth="1" strokeDasharray="2,2" />
    <line x1="45" y1="125" x2="55" y2="125" stroke="#5a8a56" strokeWidth="1" strokeDasharray="2,2" />
  </svg>
);

export const CactusStage4: React.FC<PlantSvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    className={className}
  >
    <rect x="40" y="60" width="20" height="100" rx="5" fill="#7bb776" />
    <rect x="60" y="80" width="15" height="30" rx="5" fill="#7bb776" />
    <rect x="25" y="90" width="15" height="30" rx="5" fill="#7bb776" />
    <line x1="50" y1="70" x2="50" y2="80" stroke="#5a8a56" strokeWidth="1" strokeDasharray="2,2" />
    <line x1="45" y1="75" x2="55" y2="75" stroke="#5a8a56" strokeWidth="1" strokeDasharray="2,2" />
    <line x1="50" y1="120" x2="50" y2="130" stroke="#5a8a56" strokeWidth="1" strokeDasharray="2,2" />
    <line x1="45" y1="125" x2="55" y2="125" stroke="#5a8a56" strokeWidth="1" strokeDasharray="2,2" />
    <circle cx="67.5" cy="85" r="2" fill="#f9ca24" />
  </svg>
);

export const CactusStage5: React.FC<PlantSvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    className={className}
  >
    <rect x="40" y="40" width="20" height="120" rx="5" fill="#7bb776" />
    <rect x="60" y="60" width="15" height="40" rx="5" fill="#7bb776" />
    <rect x="25" y="70" width="15" height="40" rx="5" fill="#7bb776" />
    <line x1="50" y1="50" x2="50" y2="60" stroke="#5a8a56" strokeWidth="1" strokeDasharray="2,2" />
    <line x1="45" y1="55" x2="55" y2="55" stroke="#5a8a56" strokeWidth="1" strokeDasharray="2,2" />
    <line x1="50" y1="100" x2="50" y2="110" stroke="#5a8a56" strokeWidth="1" strokeDasharray="2,2" />
    <line x1="45" y1="105" x2="55" y2="105" stroke="#5a8a56" strokeWidth="1" strokeDasharray="2,2" />
    <circle cx="67.5" cy="65" r="3" fill="#f06292" />
    <circle cx="32.5" cy="75" r="3" fill="#f06292" />
    <circle cx="67.5" cy="85" r="3" fill="#f9ca24" />
  </svg>
);

// Sunflower SVG Components
export const SunflowerStage1: React.FC<PlantSvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    className={className}
  >
    <path
      d="M50 160V120"
      stroke="#718947"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="50" cy="115" r="5" fill="#9cb365" />
    <path
      d="M45 115L55 115M50 110L50 120"
      stroke="#718947"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const SunflowerStage2: React.FC<PlantSvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    className={className}
  >
    <path
      d="M50 160V100"
      stroke="#718947"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M45 100L40 95M55 100L60 95"
      stroke="#718947"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="50" cy="95" r="10" fill="#9cb365" />
    <circle cx="50" cy="95" r="5" fill="#f9ca24" />
  </svg>
);

export const SunflowerStage3: React.FC<PlantSvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    className={className}
  >
    <path
      d="M50 160V80"
      stroke="#718947"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M45 80L35 75M55 80L65 75"
      stroke="#718947"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="50" cy="70" r="20" fill="#f9ca24" />
    <circle cx="50" cy="70" r="10" fill="#8d6e63" />
    <path
      d="M30 60L35 65M40 55L40 60M50 50L50 55M60 55L60 60M70 60L65 65"
      stroke="#f9ca24"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

export const SunflowerStage4: React.FC<PlantSvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    className={className}
  >
    <path
      d="M50 160V60"
      stroke="#718947"
      strokeWidth="6"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M45 60L30 50M55 60L70 50"
      stroke="#718947"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="50" cy="45" r="25" fill="#f9ca24" />
    <circle cx="50" cy="45" r="12" fill="#8d6e63" />
    <path
      d="M25 30L30 40M35 25L35 35M50 20L50 30M65 25L65 35M75 30L70 40"
      stroke="#f9ca24"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M30 45L25 55M40 60L30 65M60 60L70 65M70 45L75 55"
      stroke="#f9ca24"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

export const SunflowerStage5: React.FC<PlantSvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    className={className}
  >
    <path
      d="M50 160V40"
      stroke="#718947"
      strokeWidth="8"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M45 40L25 20M55 40L75 20"
      stroke="#718947"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="50" cy="25" r="30" fill="#f9ca24" />
    <circle cx="50" cy="25" r="15" fill="#8d6e63" />
    <path
      d="M20 10L25 20M30 5L30 15M50 0L50 10M70 5L70 15M80 10L75 20"
      stroke="#f9ca24"
      strokeWidth="6"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M20 25L15 35M30 40L20 45M70 40L80 45M80 25L85 35"
      stroke="#f9ca24"
      strokeWidth="6"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M20 40L25 50M40 45L35 55M60 45L65 55M80 40L75 50"
      stroke="#f9ca24"
      strokeWidth="6"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

// Cherry Blossom SVG Components
export const CherryBlossomStage1: React.FC<PlantSvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    className={className}
  >
    <path
      d="M50 160V120"
      stroke="#8d6e63"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="50" cy="115" r="5" fill="#a1887f" />
  </svg>
);

export const CherryBlossomStage2: React.FC<PlantSvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    className={className}
  >
    <path
      d="M50 160V100"
      stroke="#8d6e63"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    <path d="M50 100C50 100 45 95 40 95S30 100 30 105 35 115 40 115 50 110 50 110" fill="#c8d4a9" />
    <path d="M50 100C50 100 55 95 60 95S70 100 70 105 65 115 60 115 50 110 50 110" fill="#c8d4a9" />
  </svg>
);

export const CherryBlossomStage3: React.FC<PlantSvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    className={className}
  >
    <path
      d="M50 160V80"
      stroke="#8d6e63"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
    />
    <path d="M30 80C30 80 20 70 20 60S30 45 40 45 55 50 55 60 45 80 45 80" fill="#9cb365" />
    <path d="M70 80C70 80 80 70 80 60S70 45 60 45 45 50 45 60 55 80 55 80" fill="#9cb365" />
    <circle cx="35" cy="60" r="7" fill="#f8bbd0" />
    <circle cx="65" cy="60" r="7" fill="#f8bbd0" />
  </svg>
);

export const CherryBlossomStage4: React.FC<PlantSvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    className={className}
  >
    <path
      d="M50 160V60"
      stroke="#8d6e63"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
    <path d="M20 60C20 60 5 50 5 35S20 10 35 10 60 20 60 35 45 60 45 60" fill="#9cb365" />
    <path d="M80 60C80 60 95 50 95 35S80 10 65 10 40 20 40 35 55 60 55 60" fill="#9cb365" />
    <circle cx="20" cy="35" r="10" fill="#f8bbd0" />
    <circle cx="35" cy="20" r="10" fill="#f8bbd0" />
    <circle cx="80" cy="35" r="10" fill="#f8bbd0" />
    <circle cx="65" cy="20" r="10" fill="#f8bbd0" />
  </svg>
);

export const CherryBlossomStage5: React.FC<PlantSvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    className={className}
  >
    <path
      d="M50 160V40"
      stroke="#8d6e63"
      strokeWidth="6"
      fill="none"
      strokeLinecap="round"
    />
    <path d="M10 40C10 40 0 30 0 20S5 0 20 0 40 5 40 20 30 40 30 40" fill="#9cb365" />
    <path d="M90 40C90 40 100 30 100 20S95 0 80 0 60 5 60 20 70 40 70 40" fill="#9cb365" />
    <circle cx="10" cy="25" r="12" fill="#f06292" />
    <circle cx="25" cy="10" r="12" fill="#f06292" />
    <circle cx="90" cy="25" r="12" fill="#f06292" />
    <circle cx="75" cy="10" r="12" fill="#f06292" />
    <circle cx="30" cy="30" r="8" fill="#f06292" />
    <circle cx="70" cy="30" r="8" fill="#f06292" />
  </svg>
);

// Function to get the plant SVG component based on type and stage
export const getPlantSvg = (type: string, stage: number): React.FC<PlantSvgProps> => {
  const stageIndex = Math.min(Math.max(1, stage), 5) - 1;
  
  switch (type) {
    case "tulip":
      return [TulipStage1, TulipStage2, TulipStage3, TulipStage4, TulipStage5][stageIndex];
    case "cactus":
      return [CactusStage1, CactusStage2, CactusStage3, CactusStage4, CactusStage5][stageIndex];
    case "sunflower":
      return [SunflowerStage1, SunflowerStage2, SunflowerStage3, SunflowerStage4, SunflowerStage5][stageIndex];
    case "cherryblossom":
      return [CherryBlossomStage1, CherryBlossomStage2, CherryBlossomStage3, CherryBlossomStage4, CherryBlossomStage5][stageIndex];
    default:
      return TulipStage1;
  }
};