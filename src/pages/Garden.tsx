import { useContext } from "react";
import { PlantContext } from "@/context/PlantContext";
import PlantGrowth from "@/components/PlantGrowth";
import PlantCareControls from "@/components/PlantCareControls";
import { Progress } from "@/components/ui/progress";
import { getLockStatus, PlantUnlockInfo } from "@/lib/plants";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

const ACHIEVEMENTS = [
  {
    id: 1,
    name: "First Plant",
    icon: "seedling-line",
    unlocked: true
  },
  {
    id: 2,
    name: "7-Day Streak",
    icon: "calendar-check-line",
    unlocked: true
  },
  {
    id: 3,
    name: "10 Tasks",
    icon: "check-double-line",
    unlocked: true
  },
  {
    id: 4,
    name: "Plant Master",
    icon: "trophy-line",
    unlocked: false
  },
  {
    id: 5,
    name: "Productivity",
    icon: "rocket-line",
    unlocked: false
  },
  {
    id: 6,
    name: "Elite",
    icon: "star-line",
    unlocked: false
  }
];

export default function Garden() {
  const { plants, currentPlant, isLoading, totalPoints, refetchPlants, refetchCurrentPlant } = useContext(PlantContext);
  
  // Get all available plants for collection
  const plantCollection = [
    { type: "tulip", name: "Tulip", pointsRequired: 0 },
    { type: "cactus", name: "Cactus", pointsRequired: 100 },
    { type: "sunflower", name: "Sunflower", pointsRequired: 250 },
    { type: "cherryblossom", name: "Cherry Blossom", pointsRequired: 500 }
  ];
  
  const renderUnlockedPlant = (plantInfo: PlantUnlockInfo) => {
    // Don't check for completed status for first-time users
    const plantEntry = plants?.find(p => p.type === plantInfo.type);
    const isActive = currentPlant?.type === plantInfo.type;
    
    // Function to set this plant as active
    const switchToPlant = async () => {
      if (!isActive) {
        try {
          await apiRequest('/api/plants', 'POST', { type: plantInfo.type });
          // Refetch plants after switching
          refetchCurrentPlant();
          refetchPlants();
        } catch (error) {
          console.error("Error switching plants:", error);
        }
      }
    };

    return (
      <div 
        key={plantInfo.type}
        className={`bg-white rounded-xl shadow-sm p-4 text-center ${isActive ? "border-2 border-primary" : ""} cursor-pointer hover:shadow-md transition-all`}
        onClick={switchToPlant}
      >
        <div className="h-32 flex items-center justify-center">
          <PlantGrowth 
            size="small" 
            showPoints={false}
          />
        </div>
        <h3 className={`font-semibold ${isActive ? "text-primary-dark" : "text-neutral-dark"} mt-2`}>
          {plantInfo.name}
        </h3>
        <div className="text-sm text-neutral-dark">
          {isActive ? "Growing" : "Ready to grow"}
        </div>
        <div className={`mt-2 text-xs px-2 py-1 rounded-full inline-block ${
          isActive ? "bg-primary text-white" : "bg-green-500 text-white"
        }`}>
          {isActive ? "Active" : "Available"}
        </div>
      </div>
    );
  };
  
  const renderLockedPlant = (plantInfo: PlantUnlockInfo) => {
    return (
      <div 
        key={plantInfo.type}
        className="bg-white rounded-xl shadow-sm p-4 text-center opacity-60"
      >
        <div className="h-32 flex items-center justify-center relative">
          <div className="h-28 w-28 bg-gray-100 rounded-full opacity-30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="text-4xl text-neutral-dark h-10 w-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        </div>
        <h3 className="font-semibold text-neutral-dark mt-2">{plantInfo.name}</h3>
        <div className="text-sm text-neutral-dark">Locked</div>
        <div className="mt-2 text-xs px-2 py-1 bg-neutral text-neutral-dark rounded-full inline-block">
          {plantInfo.pointsRequired} pts needed
        </div>
      </div>
    );
  };
  
  const renderPlantCollection = () => {
    return plantCollection.map(plantInfo => {
      const lockStatus = getLockStatus(plantInfo, totalPoints, plants);
      
      if (lockStatus === "unlocked" || lockStatus === "active") {
        return renderUnlockedPlant(plantInfo);
      } else {
        return renderLockedPlant(plantInfo);
      }
    });
  };
  
  return (
    <div className="p-4 md:p-8 h-screen overflow-y-auto pb-20 md:pb-8">
      <h1 className="text-2xl font-bold text-neutral-dark mb-6">Your Garden</h1>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <svg 
            className="animate-spin h-8 w-8 text-primary" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        <>
          {/* Current Plant Section */}
          {currentPlant && (
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
                  <PlantGrowth size="large" />
                  
                  {/* Plant Care Controls */}
                  <PlantCareControls 
                    plant={currentPlant} 
                    className="mt-6 w-full max-w-sm"
                    onCareCompleted={() => {
                      // This will be triggered after a care action is completed
                    }}
                  />
                </div>
                
                <div className="mt-6 md:mt-0 md:ml-6 w-full md:w-1/2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-neutral-dark">{currentPlant.name}</h2>
                    {currentPlant.status === 'withering' && (
                      <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                        <svg 
                          className="w-4 h-4 mr-1 text-amber-600" 
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        Withering
                      </div>
                    )}
                    {currentPlant.status === 'dead' && (
                      <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                        <svg 
                          className="w-4 h-4 mr-1 text-red-600" 
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Dead
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-neutral-dark mb-4">
                    Growing since {format(new Date(currentPlant.startDate), 'MMMM d, yyyy')}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Growth progress</span>
                      <span className="font-medium text-primary-dark">
                        Stage {currentPlant.stage}/{currentPlant.maxStage}
                      </span>
                    </div>
                    <Progress value={(currentPlant.points / currentPlant.pointsToNextStage) * 100} />
                    <div className="text-sm mt-2 text-neutral-dark">
                      {currentPlant.points}/{currentPlant.pointsToNextStage} points earned
                    </div>
                  </div>
                  
                  {/* Plant health status */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Health Status</span>
                      <span className={`text-sm font-semibold ${
                        currentPlant.status === 'healthy' ? 'text-green-600' : 
                        currentPlant.status === 'withering' ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {currentPlant.status === 'healthy' ? 'Healthy' : 
                         currentPlant.status === 'withering' ? 'Withering' : 'Dead'}
                      </span>
                    </div>
                    
                    <div className="bg-gray-100 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full transition-all duration-500 ${
                          currentPlant.status === 'healthy' ? 'bg-green-500' : 
                          currentPlant.status === 'withering' ? 'bg-amber-500' : 'bg-red-500'
                        }`} 
                        style={{ 
                          width: `${currentPlant.status === 'healthy' ? 100 : 
                                   currentPlant.status === 'withering' ? 40 : 10}%` 
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between mt-2 text-xs">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${currentPlant.waterLevel <= 10 ? 'bg-red-500 animate-pulse' : 'bg-blue-500'} mr-1`}></div>
                        <span>Water {Math.round(currentPlant.waterLevel)}%</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${currentPlant.sunlightLevel <= 10 ? 'bg-red-500 animate-pulse' : 'bg-amber-500'} mr-1`}></div>
                        <span>Sun {Math.round(currentPlant.sunlightLevel)}%</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${currentPlant.nutrientLevel <= 10 ? 'bg-red-500 animate-pulse' : 'bg-green-500'} mr-1`}></div>
                        <span>Nutrients {Math.round(currentPlant.nutrientLevel)}%</span>
                      </div>
                    </div>
                    
                    {currentPlant.status === 'withering' && (
                      <div className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded-md flex items-center">
                        <svg className="w-4 h-4 mr-1 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        Your plant is withering! Provide care to revive it.
                      </div>
                    )}
                    
                    {currentPlant.status === 'dead' && (
                      <div className="mt-2 text-xs text-red-700 bg-red-50 p-2 rounded-md flex items-center">
                        <svg className="w-4 h-4 mr-1 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Your plant has died. Start growing a new one.
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-primary-light bg-opacity-30 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="text-xl text-primary-dark mt-0.5 h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4"></path>
                        <path d="M12 2v2"></path>
                        <path d="M12 20v2"></path>
                        <path d="m4.9 4.9 1.4 1.4"></path>
                        <path d="m17.7 17.7 1.4 1.4"></path>
                        <path d="M2 12h2"></path>
                        <path d="M20 12h2"></path>
                        <path d="m6.3 17.7-1.4 1.4"></path>
                        <path d="m19.1 4.9-1.4 1.4"></path>
                      </svg>
                      <div className="ml-3">
                        <h3 className="font-bold text-primary-dark">Plant Facts</h3>
                        <p className="text-sm text-neutral-dark">
                          {currentPlant.type === "sunflower" && "Sunflowers can grow up to 12 feet tall and their heads track the sun from east to west."}
                          {currentPlant.type === "tulip" && "Tulips were once more valuable than gold in the Dutch Golden Age."}
                          {currentPlant.type === "cactus" && "Cacti can survive up to two years without water in their natural environment."}
                          {currentPlant.type === "cherryblossom" && "Cherry blossoms represent the fragility and beauty of life in Japanese culture."}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-primary bg-opacity-10 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="text-xl text-primary-dark mt-0.5 h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                        <line x1="16" x2="16" y1="2" y2="6"></line>
                        <line x1="8" x2="8" y1="2" y2="6"></line>
                        <line x1="3" x2="21" y1="10" y2="10"></line>
                        <path d="M8 14h.01"></path>
                        <path d="M12 14h.01"></path>
                        <path d="M16 14h.01"></path>
                        <path d="M8 18h.01"></path>
                        <path d="M12 18h.01"></path>
                        <path d="M16 18h.01"></path>
                      </svg>
                      <div className="ml-3">
                        <h3 className="font-bold text-primary-dark">Next milestone</h3>
                        <p className="text-sm text-neutral-dark">
                          {currentPlant.pointsToNextStage - currentPlant.points <= 0 
                            ? "Ready to advance to the next stage!" 
                            : `Complete ${Math.ceil((currentPlant.pointsToNextStage - currentPlant.points) / 10)} more tasks to reach stage ${currentPlant.stage + 1}!`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Plant Collection */}
          <h2 className="text-xl font-bold text-neutral-dark mb-4">Your Collection</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {renderPlantCollection()}
          </div>
          
          {/* Achievement Badges */}
          <h2 className="text-xl font-bold text-neutral-dark mb-4 mt-8">Achievements</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {ACHIEVEMENTS.map(achievement => (
              <div 
                key={achievement.id}
                className={`bg-white rounded-xl shadow-sm p-4 text-center ${!achievement.unlocked ? "opacity-60" : ""}`}
              >
                <div className="h-16 flex items-center justify-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`text-4xl h-10 w-10 ${
                      achievement.unlocked 
                        ? achievement.id === 3 ? "text-primary" : "text-green-500" 
                        : "text-gray-400"
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {achievement.icon === "seedling-line" && (
                      <path d="M7 20h10"></path>
                    )}
                    {achievement.icon === "seedling-line" && (
                      <path d="M10 20c0-8.5 6.5-9.5 8-9 .5.5-1.5 3-1.5 3l3-2.5c.5 3-1 6-4.5 6S10 20 10 20"></path>
                    )}
                    {achievement.icon === "calendar-check-line" && (
                      <>
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                        <line x1="16" x2="16" y1="2" y2="6"></line>
                        <line x1="8" x2="8" y1="2" y2="6"></line>
                        <line x1="3" x2="21" y1="10" y2="10"></line>
                        <path d="m9 16 2 2 4-4"></path>
                      </>
                    )}
                    {achievement.icon === "check-double-line" && (
                      <>
                        <path d="M18 7l-8 8-4-4"></path>
                        <path d="M18 16l-8-8-4 4"></path>
                      </>
                    )}
                    {achievement.icon === "trophy-line" && (
                      <>
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                        <path d="M4 22h16"></path>
                        <path d="M10 22V8a4 4 0 0 1 4-4h.5"></path>
                        <path d="M14 22V8a4 4 0 0 0-4-4h-.5"></path>
                      </>
                    )}
                    {achievement.icon === "rocket-line" && (
                      <>
                        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                      </>
                    )}
                    {achievement.icon === "star-line" && (
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    )}
                  </svg>
                </div>
                <div className="text-sm font-medium text-neutral-dark mt-2">{achievement.name}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
