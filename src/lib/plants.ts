import { Plant } from "@shared/schema";

export interface PlantUnlockInfo {
  type: string;
  name: string;
  pointsRequired: number;
}

// Determine if a plant is locked, unlocked, or active
export type LockStatus = "locked" | "unlocked" | "active";

export function getLockStatus(
  plantInfo: PlantUnlockInfo,
  totalPoints: number,
  plants?: Plant[]
): LockStatus {
  // If this is the active plant
  if (plants && plants.some(p => p.type === plantInfo.type && !p.completed)) {
    return "active";
  }
  
  // If this plant is completed
  if (plants && plants.some(p => p.type === plantInfo.type && p.completed)) {
    return "unlocked";
  }
  
  // If user has enough points to unlock
  if (totalPoints >= plantInfo.pointsRequired) {
    return "unlocked";
  }
  
  // Otherwise locked
  return "locked";
}

// Get plant facts
export function getPlantFact(plantType: string): string {
  switch (plantType) {
    case "sunflower":
      return "Sunflowers can grow up to 12 feet tall and their heads track the sun from east to west.";
    case "tulip":
      return "Tulips were once more valuable than gold in the Dutch Golden Age.";
    case "cactus":
      return "Cacti can survive up to two years without water in their natural environment.";
    case "cherryblossom":
      return "Cherry blossoms represent the fragility and beauty of life in Japanese culture.";
    default:
      return "Complete tasks to help your plant grow!";
  }
}
