import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plant } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { TaskContext } from "./TaskContext";

interface PlantContextProps {
  plants: Plant[];
  currentPlant: Plant | null;
  totalPoints: number;
  latestPoints: number;
  isLoading: boolean;
  error: Error | null;
  refetchPlants: () => void;
  refetchCurrentPlant: () => void;
}

export const PlantContext = createContext<PlantContextProps>({
  plants: [],
  currentPlant: null,
  totalPoints: 0,
  latestPoints: 0,
  isLoading: false,
  error: null,
  refetchPlants: () => {},
  refetchCurrentPlant: () => {}
});

interface PlantProviderProps {
  children: ReactNode;
}

export function PlantProvider({ children }: PlantProviderProps) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [currentPlant, setCurrentPlant] = useState<Plant | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [latestPoints, setLatestPoints] = useState(0);
  const { tasks } = useContext(TaskContext);
  
  // Query for all plants
  const { 
    data: plantsData,
    isLoading: isLoadingPlants,
    error: plantsError, 
    refetch: refetchAllPlants
  } = useQuery<Plant[]>({
    queryKey: ['/api/plants'],
  });
  
  // Query for current plant
  const { 
    data: currentPlantData,
    isLoading: isLoadingCurrentPlant,
    error: currentPlantError, 
    refetch: refetchCurrentPlantQuery
  } = useQuery<Plant>({
    queryKey: ['/api/plants/current'],
  });
  
  useEffect(() => {
    if (plantsData) {
      setPlants(plantsData);
      
      // Calculate total points
      const points = plantsData.reduce((sum, plant) => sum + plant.points, 0);
      setTotalPoints(points);
    }
  }, [plantsData]);
  
  useEffect(() => {
    if (currentPlantData) {
      // Check if the current plant has changed
      if (!currentPlant || currentPlant.id !== currentPlantData.id) {
        setCurrentPlant(currentPlantData);
      } else if (currentPlant.points !== currentPlantData.points) {
        // Calculate latest points earned
        const pointsDiff = currentPlantData.points - currentPlant.points;
        setLatestPoints(pointsDiff > 0 ? pointsDiff : 0);
        setCurrentPlant(currentPlantData);
      } else {
        setCurrentPlant(currentPlantData);
      }
    }
  }, [currentPlantData, currentPlant]);
  
  // Calculate total points based on completed tasks if plants not available
  useEffect(() => {
    if (!plantsData && tasks) {
      const completedTasksPoints = tasks
        .filter(task => task.completed)
        .reduce((sum, task) => sum + (task.points || 0), 0);
        
      setTotalPoints(completedTasksPoints);
    }
  }, [tasks, plantsData]);
  
  const refetchPlants = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/plants'] });
  };
  
  const refetchCurrentPlant = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/plants/current'] });
  };
  
  const isLoading = isLoadingPlants || isLoadingCurrentPlant;
  const error = plantsError || currentPlantError;
  
  return (
    <PlantContext.Provider
      value={{
        plants,
        currentPlant,
        totalPoints,
        latestPoints,
        isLoading,
        error: error as Error | null,
        refetchPlants,
        refetchCurrentPlant
      }}
    >
      {children}
    </PlantContext.Provider>
  );
}
