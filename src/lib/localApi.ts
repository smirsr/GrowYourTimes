const TASKS_KEY = "growyourtime_tasks";
const PLANTS_KEY = "growyourtime_plants";
const CHATS_KEY = "growyourtime_chats";

const now = () => new Date().toISOString();

const seedTasks = () => [
  { id: 1, title: "Complete project presentation", description: "Finalize slides and practice delivery", dueDate: new Date(new Date().setHours(14,30,0,0)).toISOString(), completed: false, points: 25, userId: 1 },
  { id: 2, title: "Morning workout", description: "30 minutes cardio + stretching", dueDate: new Date(new Date().setHours(7,0,0,0)).toISOString(), completed: false, points: 10, userId: 1 },
  { id: 3, title: "Grocery shopping", description: "Pick up fruits, vegetables, and bread", dueDate: new Date(new Date().setHours(16,0,0,0)).toISOString(), completed: false, points: 15, userId: 1 },
  { id: 4, title: "Read book chapter", description: 'Chapter 7 of "The Psychology of Habits"', dueDate: new Date(new Date().setHours(20,0,0,0)).toISOString(), completed: false, points: 10, userId: 1 }
];

const seedPlants = () => [{ id: 1, name: "Sunflower", type: "sunflower", stage: 1, maxStage: 5, points: 20, pointsToNextStage: 100, completed: false, startDate: now(), userId: 1, waterLevel: 70, sunlightLevel: 65, nutrientLevel: 60, status: "healthy", witheringSince: null, lastCareDate: now() }];
const seedChats = () => [{ id: 1, message: "Hi there! I'm Carmelina, your plant assistant. I can help you organize tasks, care for your garden, and stay productive. What would you like help with today?", isUser: false, timestamp: now(), userId: 1 }];

function load<T>(key: string, seed: () => T): T {
  const raw = localStorage.getItem(key);
  if (raw) return JSON.parse(raw);
  const value = seed(); localStorage.setItem(key, JSON.stringify(value)); return value;
}
function save(key: string, value: unknown) { localStorage.setItem(key, JSON.stringify(value)); }
function response(data: unknown, status = 200) { return new Response(data === undefined ? null : JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }); }

function assistantReply(message: string) {
  const m = message.toLowerCase();
  if (m.includes("plant") || m.includes("water") || m.includes("garden")) return "Keep your plant healthy by balancing water, sunlight, and nutrients. Complete tasks to earn points, then spend those points on plant care. Small, consistent progress is the goal!";
  if (m.includes("organize") || m.includes("task")) return "Try choosing your top three tasks first. Give the hardest or most important task more points, then work through them one at a time. Completing them will also help your plant grow!";
  if (m.includes("productiv") || m.includes("focus")) return "Pick one clear task, work on it for 25–30 minutes without switching, then take a short break. A small finished task is better than five half-started ones.";
  return "I'm running in portfolio demo mode, but I can still help with task organization, productivity tips, and plant-care guidance. Try one of the quick prompts below!";
}

export async function localApi(method: string, url: string, data?: any): Promise<Response> {
  method = method.toUpperCase();
  let tasks: any[] = load(TASKS_KEY, seedTasks);
  let plants: any[] = load(PLANTS_KEY, seedPlants);
  let chats: any[] = load(CHATS_KEY, seedChats);

  if (url === "/api/tasks" && method === "GET") return response(tasks);
  if (url === "/api/tasks" && method === "POST") {
    const task = { id: Math.max(0, ...tasks.map(t=>t.id))+1, title: data.title, description: data.description || "", dueDate: data.dueDate || null, completed: false, points: Number(data.points)||10, userId: 1 };
    tasks.push(task); save(TASKS_KEY, tasks); return response(task, 201);
  }
  const taskMatch = url.match(/^\/api\/tasks\/(\d+)$/);
  if (taskMatch && method === "PATCH") {
    const id = Number(taskMatch[1]); const idx = tasks.findIndex(t=>t.id===id); if (idx < 0) return response({error:"Task not found"},404);
    const wasCompleted = tasks[idx].completed; tasks[idx] = {...tasks[idx], ...data}; save(TASKS_KEY,tasks);
    if (!wasCompleted && data.completed === true) {
      const p = plants.find(p=>!p.completed) || plants[plants.length-1];
      if (p) { p.points += tasks[idx].points; while (p.stage < p.maxStage && p.points >= p.pointsToNextStage * p.stage) p.stage++; if (p.stage >= p.maxStage && p.points >= p.pointsToNextStage * p.maxStage) p.completed=true; save(PLANTS_KEY,plants); }
    }
    return response(tasks[idx]);
  }
  if (taskMatch && method === "DELETE") { tasks = tasks.filter(t=>t.id!==Number(taskMatch[1])); save(TASKS_KEY,tasks); return response(undefined,204); }

  if (url === "/api/plants" && method === "GET") return response(plants);
  if (url === "/api/plants/current" && method === "GET") return response(plants.find(p=>!p.completed) || plants[plants.length-1]);
  if (url === "/api/plants" && method === "POST") {
    const info: any = {tulip:"Tulip",cactus:"Cactus",sunflower:"Sunflower",cherryblossom:"Cherry Blossom"};
    const plant = { id: Math.max(0,...plants.map(p=>p.id))+1, name: info[data.type] || "Plant", type:data.type, stage:1,maxStage:5,points:20,pointsToNextStage:100,completed:false,startDate:now(),userId:1,waterLevel:70,sunlightLevel:70,nutrientLevel:70,status:"healthy",witheringSince:null,lastCareDate:now() };
    plants.push(plant); save(PLANTS_KEY,plants); return response(plant,201);
  }
  const careMatch = url.match(/^\/api\/plants\/(\d+)\/(water|sunlight|nutrients)$/);
  if (careMatch && method === "POST") {
    const p = plants.find(p=>p.id===Number(careMatch[1])); if (!p) return response({error:"Plant not found"},404);
    const cost = Number(data?.points)||5; if (p.points < cost) return response({error:"Not enough points"},400); p.points -= cost;
    const field = careMatch[2] === "water" ? "waterLevel" : careMatch[2] === "sunlight" ? "sunlightLevel" : "nutrientLevel";
    p[field] = Math.min(100,p[field]+10); p.status="healthy"; p.lastCareDate=now(); save(PLANTS_KEY,plants); return response(p);
  }

  if (url === "/api/chats" && method === "GET") return response(chats);
  if (url === "/api/chats" && method === "POST") {
    const user = {id:Math.max(0,...chats.map(c=>c.id))+1,message:data.message,isUser:true,timestamp:now(),userId:1}; chats.push(user);
    const bot = {id:user.id+1,message:assistantReply(data.message),isUser:false,timestamp:now(),userId:1}; chats.push(bot); save(CHATS_KEY,chats); return response(user,201);
  }
  return response({error:`Unknown local API route: ${method} ${url}`},404);
}
