import { useContext, useState, useEffect } from "react";
import { PlantContext } from "@/context/PlantContext";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getPlantSvg } from "../lib/plant-svgs";
import { AlertTriangle, Skull } from "lucide-react";

interface PlantGrowthProps {
  showPoints?: boolean;
  className?: string;
  size?: "small" | "medium" | "large";
}

export default function PlantGrowth({ 
  showPoints = true, 
  className,
  size = "medium"
}: PlantGrowthProps) {
  const { currentPlant, latestPoints } = useContext(PlantContext);
  const [showFloatingPoints, setShowFloatingPoints] = useState(false);
  
  useEffect(() => {
    if (latestPoints > 0) {
      setShowFloatingPoints(true);
      const timer = setTimeout(() => {
        setShowFloatingPoints(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [latestPoints]);
  
  if (!currentPlant) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center",
        className
      )}>
        <div className="text-gray-400 text-center p-4">
          No active plant. Start by completing tasks to grow your first plant!
        </div>
      </div>
    );
  }
  
  const PlantSvg = getPlantSvg(currentPlant.type, currentPlant.stage);
  
  // Calculate progress percentage
  const progressPercentage = Math.min(
    100, 
    Math.round((currentPlant.points / currentPlant.pointsToNextStage) * 100)
  );

  const sizeClasses = {
    small: "h-24",
    medium: "h-48 md:h-60",
    large: "h-64"
  };

  // Get styles based on plant status
  const getStatusStyles = () => {
    switch (currentPlant.status) {
      case 'withering':
        return "opacity-60 grayscale-[30%] filter";
      case 'dead':
        return "opacity-40 grayscale filter";
      default:
        return "";
    }
  };
  
  return (
    <div className={cn(
      "plant-growth-container relative flex justify-center",
      className
    )}>
      <div className={cn(
        "plant-stage relative flex items-end justify-center",
        sizeClasses[size]
      )}>
        <PlantSvg className={cn("h-full w-auto transition-all duration-500", getStatusStyles())} />
        
        {showFloatingPoints && showPoints && (
          <div className="absolute -top-4 right-0 bg-primary-dark text-white text-sm font-bold px-3 py-1 rounded-full animate-bounce">
            +{latestPoints} pts
          </div>
        )}

        {/* Plant status indicators */}
        {currentPlant.status === 'withering' && (
          <div className="absolute top-0 right-0 bg-amber-500 text-white p-1 rounded-full animate-pulse">
            <AlertTriangle size={size === 'small' ? 16 : 20} />
          </div>
        )}

        {currentPlant.status === 'dead' && (
          <div className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">
            <Skull size={size === 'small' ? 16 : 20} />
          </div>
        )}
      </div>
      
      {showPoints && (
        <div className="absolute bottom-0 left-0 right-0 px-4">
          <div className={cn(
            "bg-white bg-opacity-80 rounded-lg p-2",
            currentPlant.status === 'withering' && "border-amber-500 border",
            currentPlant.status === 'dead' && "border-red-500 border"
          )}>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-medium">
                Stage {currentPlant.stage}/{currentPlant.maxStage}
                {currentPlant.status === 'withering' && (
                  <span className="ml-1 text-amber-600"> (Withering)</span>
                )}
                {currentPlant.status === 'dead' && (
                  <span className="ml-1 text-red-600"> (Dead)</span>
                )}
              </span>
              <span>{currentPlant.points}/{currentPlant.pointsToNextStage} pts</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className={cn(
                currentPlant.status === 'withering' && "bg-amber-100",
                currentPlant.status === 'dead' && "bg-red-100"
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}
