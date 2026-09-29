import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertTaskSchema, insertPlantSchema, insertChatSchema } from "@shared/schema";
import { generateGeminiResponse } from "./gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Tasks endpoints
  app.get("/api/tasks", async (req: Request, res: Response) => {
    try {
      // In a real app we would get the userId from auth
      // For demo, using user id 1
      const userId = 1;
      const tasks = await storage.getTasksForUser(userId);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tasks", async (req: Request, res: Response) => {
    try {
      // Get the raw data from the request
      const { title, description, dueDate, points } = req.body;
      
      // In a real app we would get the userId from auth
      const userId = 1;
      
      // Prepare the task data with proper date handling
      const taskData = {
        title,
        description,
        // If dueDate is a string, convert it to a Date object
        dueDate: dueDate ? new Date(dueDate) : null,
        points: typeof points === 'string' ? parseInt(points) : points,
        userId
      };
      
      // Create the task with the processed data
      const task = await storage.createTask(taskData);
      
      res.status(201).json(task);
    } catch (error: any) {
      console.error("Error creating task:", error);
      res.status(400).json({ error: error.message || "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      
      // Extract data from request body
      const { title, description, dueDate, completed, points } = req.body;
      
      // Prepare task data with proper type handling
      const taskData: any = {};
      
      if (title !== undefined) taskData.title = title;
      if (description !== undefined) taskData.description = description;
      if (dueDate !== undefined) taskData.dueDate = dueDate ? new Date(dueDate) : null;
      if (completed !== undefined) taskData.completed = completed;
      if (points !== undefined) taskData.points = typeof points === 'string' ? parseInt(points) : points;
      
      const updatedTask = await storage.updateTask(taskId, taskData);
      
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      // If the task was completed, update the plant points
      if (taskData.completed === true) {
        const userId = 1; // In a real app we would get this from auth
        const currentPlant = await storage.getCurrentPlantForUser(userId);
        
        if (currentPlant) {
          const task = await storage.getTask(taskId);
          if (task) {
            const newPoints = currentPlant.points + task.points;
            
            // Check if we need to advance to the next stage
            let newStage = currentPlant.stage;
            let completed = currentPlant.completed;
            
            if (newPoints >= currentPlant.pointsToNextStage) {
              newStage = currentPlant.stage + 1;
              // Check if the plant is fully grown
              if (newStage > currentPlant.maxStage) {
                completed = true;
              }
            }
            
            await storage.updatePlant(currentPlant.id, {
              points: newPoints,
              stage: newStage,
              completed
            });
          }
        }
      }
      
      res.json(updatedTask);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      const success = await storage.deleteTask(taskId);
      
      if (!success) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Plants endpoints
  app.get("/api/plants", async (req: Request, res: Response) => {
    try {
      const userId = 1; // In a real app we would get this from auth
      let plants = await storage.getPlantsForUser(userId);
      
      // Update plant care levels based on time passed
      for (let i = 0; i < plants.length; i++) {
        // Only process plants with a lastCareDate
        if (plants[i].lastCareDate) {
          plants[i] = await storage.reducePlantCareLevels(plants[i]) || plants[i];
        }
      }
      
      res.json(plants);
    } catch (error: any) {
      console.error("Error fetching plants:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/plants/current", async (req: Request, res: Response) => {
    try {
      const userId = 1; // In a real app we would get this from auth
      let currentPlant = await storage.getCurrentPlantForUser(userId);
      
      if (!currentPlant) {
        return res.status(404).json({ error: "No active plant found" });
      }
      
      // Update plant care levels based on time passed
      if (currentPlant.lastCareDate) {
        currentPlant = await storage.reducePlantCareLevels(currentPlant) || currentPlant;
      }
      
      res.json(currentPlant);
    } catch (error: any) {
      console.error("Error fetching current plant:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/plants", async (req: Request, res: Response) => {
    try {
      // Get the plant type from the request body
      const { type } = req.body;
      
      if (!type) {
        return res.status(400).json({ error: "Plant type is required" });
      }
      
      // Find the plant type in the available plant types
      // These should match the types in the client
      const plantTypes = {
        "tulip": { name: "Tulip", pointsToNextStage: 100 },
        "cactus": { name: "Cactus", pointsToNextStage: 100 },
        "sunflower": { name: "Sunflower", pointsToNextStage: 100 },
        "cherryblossom": { name: "Cherry Blossom", pointsToNextStage: 100 }
      };
      
      if (!plantTypes[type]) {
        return res.status(400).json({ error: "Invalid plant type" });
      }
      
      // In a real app we would get the userId from auth
      const userId = 1;
      
      // Create a new plant with the plant type's details
      const plantData = {
        name: plantTypes[type].name,
        type: type,
        pointsToNextStage: plantTypes[type].pointsToNextStage,
        maxStage: 5,
        userId: userId,
      };
      
      const plant = await storage.createPlant({
        ...plantData,
        userId
      });
      
      res.status(201).json(plant);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Plant care endpoints
  app.post("/api/plants/:id/water", async (req: Request, res: Response) => {
    try {
      const plantId = parseInt(req.params.id);
      const { points } = req.body;
      
      if (isNaN(plantId)) {
        return res.status(400).json({ error: "Invalid plant ID" });
      }
      
      // First get the plant and update its care levels based on time passed
      let plant = await storage.getPlant(plantId);
      
      if (!plant) {
        return res.status(404).json({ error: "Plant not found" });
      }
      
      // Reduce care levels based on time elapsed
      if (plant.lastCareDate) {
        plant = await storage.reducePlantCareLevels(plant) || plant;
      }
      
      // Then water the plant
      const updatedPlant = await storage.waterPlant(plantId, points);
      
      if (!updatedPlant) {
        return res.status(404).json({ error: "Plant not found" });
      }
      
      res.json(updatedPlant);
    } catch (error) {
      console.error("Failed to water plant:", error);
      res.status(500).json({ error: "Failed to water plant" });
    }
  });
  
  app.post("/api/plants/:id/sunlight", async (req: Request, res: Response) => {
    try {
      const plantId = parseInt(req.params.id);
      const { points } = req.body;
      
      if (isNaN(plantId)) {
        return res.status(400).json({ error: "Invalid plant ID" });
      }
      
      // First get the plant and update its care levels based on time passed
      let plant = await storage.getPlant(plantId);
      
      if (!plant) {
        return res.status(404).json({ error: "Plant not found" });
      }
      
      // Reduce care levels based on time elapsed
      if (plant.lastCareDate) {
        plant = await storage.reducePlantCareLevels(plant) || plant;
      }
      
      // Then provide sunlight
      const updatedPlant = await storage.provideSunlight(plantId, points);
      
      if (!updatedPlant) {
        return res.status(404).json({ error: "Plant not found" });
      }
      
      res.json(updatedPlant);
    } catch (error) {
      console.error("Failed to provide sunlight:", error);
      res.status(500).json({ error: "Failed to provide sunlight" });
    }
  });
  
  app.post("/api/plants/:id/nutrients", async (req: Request, res: Response) => {
    try {
      const plantId = parseInt(req.params.id);
      const { points } = req.body;
      
      if (isNaN(plantId)) {
        return res.status(400).json({ error: "Invalid plant ID" });
      }
      
      // First get the plant and update its care levels based on time passed
      let plant = await storage.getPlant(plantId);
      
      if (!plant) {
        return res.status(404).json({ error: "Plant not found" });
      }
      
      // Reduce care levels based on time elapsed
      if (plant.lastCareDate) {
        plant = await storage.reducePlantCareLevels(plant) || plant;
      }
      
      // Then add nutrients
      const updatedPlant = await storage.addNutrients(plantId, points);
      
      if (!updatedPlant) {
        return res.status(404).json({ error: "Plant not found" });
      }
      
      res.json(updatedPlant);
    } catch (error) {
      console.error("Failed to add nutrients:", error);
      res.status(500).json({ error: "Failed to add nutrients" });
    }
  });

  // Chats endpoints
  app.get("/api/chats", async (req: Request, res: Response) => {
    try {
      const userId = 1; // In a real app we would get this from auth
      const chats = await storage.getChatsForUser(userId);
      res.json(chats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/chats", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const messageData = insertChatSchema.parse(req.body);
      
      // In a real app we would get the userId from auth
      const userId = 1;
      
      // Save user message
      const userMessage = await storage.createChat({
        ...messageData,
        userId
      });
      
      // Get user's tasks and plant for context
      const tasks = await storage.getTasksForUser(userId);
      const currentPlant = await storage.getCurrentPlantForUser(userId);
      
      // Generate a response based on the message content
      let aiResponse = "";
      
      // Function to get a random item from an array
      const getRandomItem = (array: string[]) => {
        return array[Math.floor(Math.random() * array.length)];
      };
      
      // Normalize the user's message for easier matching
      const normalizedMessage = messageData.message.toLowerCase().trim();
      
      // Dictionary of preset responses based on common queries
      if (normalizedMessage.includes("help") && normalizedMessage.includes("task")) {
        const taskResponses = [
          `I see you have ${tasks.length} tasks. Breaking them down into smaller steps can make them more manageable. Starting with the highest points tasks like "${tasks[0]?.title || 'your first task'}" could help your ${currentPlant?.name || 'plant'} grow faster!`,
          `When it comes to tasks, try using the "2-minute rule" - if something takes less than 2 minutes, do it immediately. For longer tasks like "${tasks[0]?.title || 'your current tasks'}", dedicate specific timeblocks in your day.`,
          `Looking at your task list, prioritizing based on both deadline and point value can be effective. Each task you complete helps your ${currentPlant?.name || 'plant'} grow stronger!`
        ];
        aiResponse = getRandomItem(taskResponses);
      } else if (normalizedMessage.includes("motivate") || normalizedMessage.includes("motivation")) {
        const motivationResponses = [
          `Remember that each task you complete adds ${tasks[0]?.points || 'points'} to your plant's growth! Your ${currentPlant?.name || 'plant'} is currently at stage ${currentPlant?.stage || 1} of 5 - keep going to see it blossom fully!`,
          `The secret to motivation is making progress visible - and that's exactly what your growing ${currentPlant?.name || 'plant'} does! It's a living reminder of your productivity.`,
          `Did you know that tracking progress, like watching your ${currentPlant?.name || 'plant'} grow, actually triggers dopamine release in your brain? That's why Grow Your Time makes productivity feel rewarding!`
        ];
        aiResponse = getRandomItem(motivationResponses);
      } else if (normalizedMessage.includes("plant") || normalizedMessage.includes("grow")) {
        let plantFact = "";
        if (currentPlant?.type === 'sunflower') {
          plantFact = "Sunflowers actually track the sun throughout the day, just like you're tracking your productivity!";
        } else if (currentPlant?.type === 'tulip') {
          plantFact = "Tulips continue to grow even after they're cut, which is why they sometimes outgrow their vases!";
        } else if (currentPlant?.type === 'cactus') {
          plantFact = "Cacti have special water-storage cells that help them survive in dry conditions - they're nature's efficiency experts!";
        } else if (currentPlant?.type === 'cherryblossom') {
          plantFact = "Cherry blossoms bloom for just a short time each year, reminding us to appreciate the beauty of focused work periods!";
        } else {
          plantFact = "Plants can sense gravity, light, and even touch - they're constantly adapting to their environment!";
        }
        
        aiResponse = `Your ${currentPlant?.name || 'plant'} is currently at stage ${currentPlant?.stage || 1} of 5 with ${currentPlant?.points || 0} points. ${plantFact} Complete more tasks to help it grow further!`;
      } else if (normalizedMessage.includes("productive") || normalizedMessage.includes("productivity")) {
        const productivityResponses = [
          `To boost productivity, try the Pomodoro Technique: 25 minutes of focused work followed by a 5-minute break. It works well for tasks like "${tasks[0]?.title || 'your current tasks'}"!`,
          `One productivity hack is to identify your "biological prime time" - the hours when you have the most energy. Save your most important tasks like "${tasks[1]?.title || 'your priority tasks'}" for those hours.`,
          `Creating a distraction-free environment is key to productivity. Try the "touch it once" principle: when you start a task like "${tasks[0]?.title || 'your current task'}", commit to finishing it before switching to something else.`
        ];
        aiResponse = getRandomItem(productivityResponses);
      } else if (normalizedMessage.includes("hi") || normalizedMessage.includes("hello") || normalizedMessage.length < 5) {
        const greetingResponses = [
          `Hello there! I'm Carmelina, your plant assistant. How can I help you with your tasks or plant today? Your ${currentPlant?.name || 'plant'} is looking great at stage ${currentPlant?.stage || 1}!`,
          `Hi! I'm Carmelina, here to help you be productive. You have ${tasks.length} tasks and your ${currentPlant?.name || 'plant'} has ${currentPlant?.points || 0} points. What would you like to know?`,
          `Greetings! I'm Carmelina, your productivity and plant assistant. I can help with task management strategies or share facts about your growing ${currentPlant?.type || 'plant'}. What are you working on today?`
        ];
        aiResponse = getRandomItem(greetingResponses);
      } else {
        // Default responses for any other queries
        const defaultResponses = [
          `I'm Carmelina, here to help with your productivity and plant growth! You currently have ${tasks.length} tasks and your ${currentPlant?.name || 'plant'} is at stage ${currentPlant?.stage || 1} with ${currentPlant?.points || 0} points. What specific help do you need?`,
          `As Carmelina, your plant assistant, I can tell you that your ${currentPlant?.name || 'plant'} grows as you complete tasks. Try completing "${tasks[0]?.title || 'your next task'}" to earn ${tasks[0]?.points || 'more'} points!`,
          `Remember, consistency is key both for productivity and plant growth! Your ${currentPlant?.type || 'plant'} responds to your regular task completion. Can I help you organize your task list or share plant facts?`
        ];
        aiResponse = getRandomItem(defaultResponses);
      }
      
      // Try to use Gemini API if available
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "dummy-api-key") {
        try {
          const systemPrompt = `
            You are Carmelina, a friendly plant assistant in the "Grow Your Time" productivity app that grows virtual plants as users complete tasks. 
            Your tone is friendly, helpful, and encouraging.
            Current user tasks: ${JSON.stringify(tasks)}
            Current plant: ${JSON.stringify(currentPlant)}
            Keep your responses brief and focused on helping with task management, providing motivation, or plant care tips.
            Always sign your messages with "- Carmelina" at the end.
          `;
          
          const geminiResponse = await generateGeminiResponse(
            messageData.message,
            systemPrompt,
            300
          );
          
          // Only use the Gemini response if it's not the error message
          if (geminiResponse && !geminiResponse.includes("I'm having trouble processing that right now")) {
            aiResponse = geminiResponse;
          }
        } catch (error) {
          console.log("Using fallback response instead of Gemini");
          // We already have aiResponse from above, so just continue
        }
      }
      
      // Save AI's response
      const aiMessage = await storage.createChat({
        message: aiResponse,
        isUser: false,
        userId
      });
      
      // Return both messages
      res.status(201).json({
        userMessage,
        aiMessage,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
