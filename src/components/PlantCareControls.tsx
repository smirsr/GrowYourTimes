import React, { useState } from 'react';
import { Plant } from '@shared/schema';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

// Import the images from the attached assets
import waterImage from '@assets/Screenshot 2025-04-05 215411.png';
import sunImage from '@assets/Screenshot 2025-04-05 220513.png';
import wormImage from '@assets/Screenshot 2025-04-05 221613.png';

interface PlantCareControlsProps {
  plant: Plant;
  className?: string;
  onCareCompleted?: () => void;
}

export default function PlantCareControls({ 
  plant, 
  className,
  onCareCompleted
}: PlantCareControlsProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState({
    water: false,
    sunlight: false,
    nutrients: false
  });

  // Constants for care actions
  const CARE_COST = 5; // points required for each care action
  const CARE_INCREASE = 10; // 10% increase per 5 points spent

  // Handle water plant
  const handleWaterPlant = async () => {
    if (plant.points < CARE_COST) {
      toast({
        title: "Not enough points",
        description: `You need ${CARE_COST} points to water your plant`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(prev => ({ ...prev, water: true }));
    
    try {
      await apiRequest(
        'POST',
        `/api/plants/${plant.id}/water`, 
        { points: CARE_COST }
      );
      
      toast({
        title: "Plant watered!",
        description: `Your plant's water level increased by ${CARE_INCREASE}%. You spent ${CARE_COST} points.`,
      });
      
      // Refetch plant data
      queryClient.invalidateQueries({ queryKey: ['/api/plants/current'] });
      queryClient.invalidateQueries({ queryKey: ['/api/plants'] });
      
      if (onCareCompleted) {
        onCareCompleted();
      }
    } catch (error) {
      console.error('Error watering plant:', error);
      toast({
        title: "Failed to water plant",
        description: "An error occurred while trying to water your plant.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, water: false }));
    }
  };

  // Handle provide sunlight
  const handleProvideSunlight = async () => {
    if (plant.points < CARE_COST) {
      toast({
        title: "Not enough points",
        description: `You need ${CARE_COST} points to provide sunlight to your plant`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(prev => ({ ...prev, sunlight: true }));
    
    try {
      await apiRequest(
        'POST',
        `/api/plants/${plant.id}/sunlight`, 
        { points: CARE_COST }
      );
      
      toast({
        title: "Sunlight provided!",
        description: `Your plant's sunlight level increased by ${CARE_INCREASE}%. You spent ${CARE_COST} points.`,
      });
      
      // Refetch plant data
      queryClient.invalidateQueries({ queryKey: ['/api/plants/current'] });
      queryClient.invalidateQueries({ queryKey: ['/api/plants'] });
      
      if (onCareCompleted) {
        onCareCompleted();
      }
    } catch (error) {
      console.error('Error providing sunlight:', error);
      toast({
        title: "Failed to provide sunlight",
        description: "An error occurred while trying to provide sunlight to your plant.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, sunlight: false }));
    }
  };

  // Handle add nutrients
  const handleAddNutrients = async () => {
    if (plant.points < CARE_COST) {
      toast({
        title: "Not enough points",
        description: `You need ${CARE_COST} points to add nutrients to your plant`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(prev => ({ ...prev, nutrients: true }));
    
    try {
      await apiRequest(
        'POST',
        `/api/plants/${plant.id}/nutrients`, 
        { points: CARE_COST }
      );
      
      toast({
        title: "Nutrients added!",
        description: `Your plant's nutrient level increased by ${CARE_INCREASE}%. You spent ${CARE_COST} points.`,
      });
      
      // Refetch plant data
      queryClient.invalidateQueries({ queryKey: ['/api/plants/current'] });
      queryClient.invalidateQueries({ queryKey: ['/api/plants'] });
      
      if (onCareCompleted) {
        onCareCompleted();
      }
    } catch (error) {
      console.error('Error adding nutrients:', error);
      toast({
        title: "Failed to add nutrients",
        description: "An error occurred while trying to add nutrients to your plant.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, nutrients: false }));
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <h3 className="text-lg font-semibold mb-2">Care for Your Plant</h3>
      
      <div className="flex justify-center gap-4 flex-wrap">
        {/* Water Button */}
        <div className="flex flex-col items-center">
          <Button
            className="rounded-full w-16 h-16 p-0 relative overflow-hidden bg-primary-light hover:bg-primary-light/80"
            disabled={isLoading.water || plant.points < CARE_COST}
            onClick={handleWaterPlant}
          >
            <img 
              src={waterImage} 
              alt="Water" 
              className="w-full h-full object-cover"
            />
            {isLoading.water && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </Button>
          <span className="text-sm mt-1">Water</span>
          <span className="text-xs text-gray-500">{plant.waterLevel}%</span>
        </div>
        
        {/* Sunlight Button */}
        <div className="flex flex-col items-center">
          <Button
            className="rounded-full w-16 h-16 p-0 relative overflow-hidden bg-primary-light hover:bg-primary-light/80"
            disabled={isLoading.sunlight || plant.points < CARE_COST}
            onClick={handleProvideSunlight}
          >
            <img 
              src={sunImage} 
              alt="Sunlight" 
              className="w-full h-full object-cover"
            />
            {isLoading.sunlight && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </Button>
          <span className="text-sm mt-1">Sunlight</span>
          <span className="text-xs text-gray-500">{plant.sunlightLevel}%</span>
        </div>
        
        {/* Nutrients Button */}
        <div className="flex flex-col items-center">
          <Button
            className="rounded-full w-16 h-16 p-0 relative overflow-hidden bg-primary-light hover:bg-primary-light/80"
            disabled={isLoading.nutrients || plant.points < CARE_COST}
            onClick={handleAddNutrients}
          >
            <img 
              src={wormImage} 
              alt="Nutrients" 
              className="w-full h-full object-cover"
            />
            {isLoading.nutrients && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </Button>
          <span className="text-sm mt-1">Nutrients</span>
          <span className="text-xs text-gray-500">{plant.nutrientLevel}%</span>
        </div>
      </div>
      
      <div className="mt-2 text-center text-sm">
        <p>Each action costs {CARE_COST} points and increases the level by {CARE_INCREASE}%</p>
        <p className="font-medium">You have {plant.points} points available</p>
      </div>
    </div>
  );
}