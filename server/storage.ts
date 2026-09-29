import { 
  users, type User, type InsertUser, 
  tasks, type Task, type InsertTask,
  plants, type Plant, type InsertPlant,
  chats, type Chat, type InsertChat
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Task operations
  getTask(id: number): Promise<Task | undefined>;
  getTasksForUser(userId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Plant operations
  getPlant(id: number): Promise<Plant | undefined>;
  getPlantsForUser(userId: number): Promise<Plant[]>;
  getCurrentPlantForUser(userId: number): Promise<Plant | undefined>;
  createPlant(plant: InsertPlant): Promise<Plant>;
  updatePlant(id: number, plant: Partial<Plant>): Promise<Plant | undefined>;
  
  // Plant care operations
  waterPlant(id: number, points: number): Promise<Plant | undefined>;
  provideSunlight(id: number, points: number): Promise<Plant | undefined>;
  addNutrients(id: number, points: number): Promise<Plant | undefined>;
  reducePlantCareLevels(plant: Plant): Promise<Plant | undefined>;
  
  // Chat operations
  getChatsForUser(userId: number): Promise<Chat[]>;
  createChat(chat: InsertChat): Promise<Chat>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async getTasksForUser(userId: number): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.userId, userId));
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values(insertTask)
      .returning();
    return task;
  }

  async updateTask(id: number, taskUpdate: Partial<Task>): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set(taskUpdate)
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask || undefined;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning({ id: tasks.id });
    return result.length > 0;
  }

  async getPlant(id: number): Promise<Plant | undefined> {
    const [plant] = await db.select().from(plants).where(eq(plants.id, id));
    return plant || undefined;
  }

  async getPlantsForUser(userId: number): Promise<Plant[]> {
    return db.select().from(plants).where(eq(plants.userId, userId));
  }

  async getCurrentPlantForUser(userId: number): Promise<Plant | undefined> {
    const [plant] = await db
      .select()
      .from(plants)
      .where(and(
        eq(plants.userId, userId),
        eq(plants.completed, false)
      ));
    return plant || undefined;
  }

  async createPlant(insertPlant: InsertPlant): Promise<Plant> {
    const [plant] = await db
      .insert(plants)
      .values({
        ...insertPlant,
        stage: 1,
        points: 0,
        completed: false,
        startDate: new Date()
      })
      .returning();
    return plant;
  }

  async updatePlant(id: number, plantUpdate: Partial<Plant>): Promise<Plant | undefined> {
    const [updatedPlant] = await db
      .update(plants)
      .set(plantUpdate)
      .where(eq(plants.id, id))
      .returning();
    return updatedPlant || undefined;
  }

  async waterPlant(id: number, points: number): Promise<Plant | undefined> {
    // First get the current plant to check points
    const plant = await this.getPlant(id);
    if (!plant) return undefined;
    
    // If plant is dead, it can't be revived
    if (plant.status === 'dead') {
      return plant;
    }
    
    // Check if user has enough points
    if (plant.points < points) return plant;
    
    // Update water level and points (add 10% per 5 points spent)
    const waterIncrease = (points / 5) * 10;
    const newWaterLevel = Math.min(100, plant.waterLevel + waterIncrease);
    
    // Prepare update data
    const updateData: any = { 
      waterLevel: newWaterLevel, 
      points: plant.points - points,
      lastCareDate: new Date()
    };
    
    // Check if plant should recover from withering
    if (plant.status === 'withering' && newWaterLevel > 0 && plant.sunlightLevel > 0 && plant.nutrientLevel > 0) {
      updateData.status = 'healthy';
      updateData.witheringSince = null;
    }
    
    const [updatedPlant] = await db
      .update(plants)
      .set(updateData)
      .where(eq(plants.id, id))
      .returning();
    
    return updatedPlant;
  }
  
  async provideSunlight(id: number, points: number): Promise<Plant | undefined> {
    // First get the current plant to check points
    const plant = await this.getPlant(id);
    if (!plant) return undefined;
    
    // If plant is dead, it can't be revived
    if (plant.status === 'dead') {
      return plant;
    }
    
    // Check if user has enough points
    if (plant.points < points) return plant;
    
    // Update sunlight level and points (add 10% per 5 points spent)
    const sunlightIncrease = (points / 5) * 10;
    const newSunlightLevel = Math.min(100, plant.sunlightLevel + sunlightIncrease);
    
    // Prepare update data
    const updateData: any = { 
      sunlightLevel: newSunlightLevel, 
      points: plant.points - points,
      lastCareDate: new Date()
    };
    
    // Check if plant should recover from withering
    if (plant.status === 'withering' && plant.waterLevel > 0 && newSunlightLevel > 0 && plant.nutrientLevel > 0) {
      updateData.status = 'healthy';
      updateData.witheringSince = null;
    }
    
    const [updatedPlant] = await db
      .update(plants)
      .set(updateData)
      .where(eq(plants.id, id))
      .returning();
    
    return updatedPlant;
  }
  
  async addNutrients(id: number, points: number): Promise<Plant | undefined> {
    // First get the current plant to check points
    const plant = await this.getPlant(id);
    if (!plant) return undefined;
    
    // If plant is dead, it can't be revived
    if (plant.status === 'dead') {
      return plant;
    }
    
    // Check if user has enough points
    if (plant.points < points) return plant;
    
    // Update nutrient level and points (add 10% per 5 points spent)
    const nutrientIncrease = (points / 5) * 10;
    const newNutrientLevel = Math.min(100, plant.nutrientLevel + nutrientIncrease);
    
    // Prepare update data
    const updateData: any = { 
      nutrientLevel: newNutrientLevel, 
      points: plant.points - points,
      lastCareDate: new Date()
    };
    
    // Check if plant should recover from withering
    if (plant.status === 'withering' && plant.waterLevel > 0 && plant.sunlightLevel > 0 && newNutrientLevel > 0) {
      updateData.status = 'healthy';
      updateData.witheringSince = null;
    }
    
    const [updatedPlant] = await db
      .update(plants)
      .set(updateData)
      .where(eq(plants.id, id))
      .returning();
    
    return updatedPlant;
  }
  
  /**
   * Reduces plant care levels based on time passed since last care
   * Reduces water, sunlight, and nutrient levels by 5% for each hour passed
   * Also handles plant withering and death:
   * - Plant status changes to "withering" when any care level reaches 0
   * - Plant dies (status = "dead") after 3 days of withering
   */
  async reducePlantCareLevels(plant: Plant): Promise<Plant | undefined> {
    if (!plant) return undefined;
    
    const now = new Date();
    const lastCareDate = new Date(plant.lastCareDate);
    
    // Calculate hours since last care
    const hoursPassed = Math.floor((now.getTime() - lastCareDate.getTime()) / (1000 * 60 * 60));
    
    // If less than an hour has passed, no reduction needed
    if (hoursPassed < 1) return plant;
    
    // Calculate reduction amount (5% per hour)
    const reductionPercentage = Math.min(100, hoursPassed * 5);
    
    // Calculate new levels, ensuring they don't go below 0
    const newWaterLevel = Math.max(0, plant.waterLevel - reductionPercentage);
    const newSunlightLevel = Math.max(0, plant.sunlightLevel - reductionPercentage);
    const newNutrientLevel = Math.max(0, plant.nutrientLevel - reductionPercentage);
    
    // Prepare update data
    const updateData: Partial<Plant> = {
      waterLevel: newWaterLevel,
      sunlightLevel: newSunlightLevel,
      nutrientLevel: newNutrientLevel
    };
    
    // Check if plant should start withering (when any care level reaches 0)
    if (plant.status === 'healthy' && (newWaterLevel === 0 || newSunlightLevel === 0 || newNutrientLevel === 0)) {
      updateData.status = 'withering';
      updateData.witheringSince = now;
    } 
    // Check if plant should recover from withering (when all care levels are above 0)
    else if (plant.status === 'withering' && newWaterLevel > 0 && newSunlightLevel > 0 && newNutrientLevel > 0) {
      updateData.status = 'healthy';
      updateData.witheringSince = null;
    } 
    // Check if plant should die (when it's been withering for 3 days)
    else if (plant.status === 'withering' && plant.witheringSince) {
      const witheringSince = new Date(plant.witheringSince);
      const millisecondsSinceWithering = now.getTime() - witheringSince.getTime();
      const daysSinceWithering = millisecondsSinceWithering / (1000 * 60 * 60 * 24);
      
      if (daysSinceWithering >= 3) {
        updateData.status = 'dead';
      }
    }
    
    // Update the plant with new levels and status
    return this.updatePlant(plant.id, updateData);
  }

  async getChatsForUser(userId: number): Promise<Chat[]> {
    return db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(chats.timestamp);
  }

  async createChat(insertChat: InsertChat): Promise<Chat> {
    const [chat] = await db
      .insert(chats)
      .values({
        ...insertChat,
        timestamp: new Date()
      })
      .returning();
    return chat;
  }
}

// Initialize with the database storage
export const storage = new DatabaseStorage();

// Seed initial demo user and data if needed
async function seedInitialData() {
  const username = "demo";
  
  // Check if demo user exists
  let user = await storage.getUserByUsername(username);
  
  if (!user) {
    // Create demo user
    user = await storage.createUser({
      username,
      password: "password"
    });
    
    // Add initial plant
    await storage.createPlant({
      name: "Sunflower", 
      type: "sunflower", 
      maxStage: 5, 
      pointsToNextStage: 100,
      userId: user.id
    });
    
    // Add some tasks
    await storage.createTask({
      title: "Complete project presentation",
      description: "Finalize slides and practice delivery",
      dueDate: new Date(new Date().setHours(14, 30, 0, 0)),
      points: 25,
      userId: user.id
    });
    
    await storage.createTask({
      title: "Morning workout",
      description: "30 minutes cardio + stretching",
      dueDate: new Date(new Date().setHours(7, 0, 0, 0)),
      points: 10,
      userId: user.id,
    });
    
    await storage.createTask({
      title: "Grocery shopping",
      description: "Pick up fruits, vegetables, and bread",
      dueDate: new Date(new Date().setHours(16, 0, 0, 0)),
      points: 15,
      userId: user.id
    });
    
    await storage.createTask({
      title: "Read book chapter",
      description: "Chapter 7 of \"The Psychology of Habits\"",
      dueDate: new Date(new Date().setHours(20, 0, 0, 0)),
      points: 10,
      userId: user.id
    });
    
    // Add initial chat message
    await storage.createChat({
      message: "Hi there! I'm your Plant Assistant. I can help you manage tasks, give gardening tips, or just chat. What would you like help with today?",
      isUser: false,
      userId: user.id
    });
  }
}

// Run the seeding (this will execute when the module is imported)
seedInitialData().catch(err => console.error("Error seeding initial data:", err));
