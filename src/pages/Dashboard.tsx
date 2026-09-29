import { useContext, useState, useEffect } from "react";
import { TaskContext } from "@/context/TaskContext";
import { PlantContext } from "@/context/PlantContext";
import { useToast } from "@/hooks/use-toast";
import TaskCard from "@/components/TaskCard";
import UpcomingTaskItem from "@/components/UpcomingTaskItem";
import PlantGrowth from "@/components/PlantGrowth";
import { Button } from "@/components/ui/button";
import AddTaskDialog from "@/components/AddTaskDialog";
import { Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Task } from "@shared/schema";
import { isToday, isFuture, compareAsc } from "date-fns";

export default function Dashboard() {
  const { tasks, isLoading: isTasksLoading } = useContext(TaskContext);
  const { currentPlant, totalPoints } = useContext(PlantContext);
  const { toast } = useToast();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  
  useEffect(() => {
    if (tasks) {
      // Filter tasks for today
      const today = tasks.filter(task => 
        task.dueDate && isToday(new Date(task.dueDate))
      ).sort((a, b) => {
        if (a.dueDate && b.dueDate) {
          return compareAsc(new Date(a.dueDate), new Date(b.dueDate));
        }
        return 0;
      });
      
      // Filter upcoming tasks (future dates, not today)
      const upcoming = tasks.filter(task => 
        task.dueDate && isFuture(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
      ).sort((a, b) => {
        if (a.dueDate && b.dueDate) {
          return compareAsc(new Date(a.dueDate), new Date(b.dueDate));
        }
        return 0;
      }).slice(0, 3); // Show only the next 3 upcoming tasks
      
      setTodaysTasks(today);
      setUpcomingTasks(upcoming);
    }
  }, [tasks]);
  
  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsAddTaskOpen(true);
  };
  
  // Daily goal calculation
  const completedTodayCount = todaysTasks.filter(task => task.completed).length;
  const dailyGoalPercentage = todaysTasks.length > 0 
    ? Math.round((completedTodayCount / todaysTasks.length) * 100) 
    : 0;
  
  return (
    <div className="p-4 md:p-8 h-screen overflow-y-auto pb-20 md:pb-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-neutral-dark">Dashboard</h1>
        <div className="hidden md:flex items-center gap-3">
          <Button 
            className="bg-primary hover:bg-primary-dark text-white flex items-center"
            onClick={() => {
              setTaskToEdit(undefined);
              setIsAddTaskOpen(true);
            }}
          >
            <Plus className="mr-1 h-5 w-5" /> New Task
          </Button>
        </div>
      </div>
      
      {/* Plant Progress */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2">
            <PlantGrowth />
          </div>
          
          <div className="mt-6 md:mt-0 md:ml-6 w-full md:w-1/2">
            <h2 className="text-xl font-bold text-neutral-dark mb-2">Your Garden</h2>
            <p className="text-neutral-dark mb-4">Keep completing tasks to help your plants grow!</p>
            
            {currentPlant && (
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-sm">
                    Current Plant: {currentPlant.name}
                  </span>
                  <span className="font-medium text-sm">
                    Stage {currentPlant.stage}/{currentPlant.maxStage}
                  </span>
                </div>
                <Progress value={(currentPlant.stage / currentPlant.maxStage) * 100} />
              </div>
            )}
            
            <div className="bg-primary-light bg-opacity-30 rounded-lg p-4">
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
                  <circle cx="12" cy="8" r="6"></circle>
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
                </svg>
                <div className="ml-3">
                  <h3 className="font-bold text-primary-dark">Total Points: {totalPoints}</h3>
                  {currentPlant && (
                    <p className="text-sm text-neutral-dark">
                      {currentPlant.pointsToNextStage - currentPlant.points} more points until next stage!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Daily Goal */}
      <div className="md:hidden rounded-lg bg-primary-light bg-opacity-30 p-4 text-sm mb-6">
        <div className="font-semibold mb-1 text-primary-dark">Daily Goal</div>
        <Progress value={dailyGoalPercentage} />
        <div className="text-xs mt-1 text-neutral-dark">{dailyGoalPercentage}% completed</div>
      </div>
      
      {/* Today's Tasks */}
      <h2 className="text-xl font-bold text-neutral-dark mb-4">Today's Tasks</h2>
      
      {isTasksLoading ? (
        <div className="flex justify-center p-4">
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
      ) : todaysTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {todaysTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={handleEditTask}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <p className="text-neutral-dark mb-4">No tasks scheduled for today!</p>
          <Button 
            className="bg-primary hover:bg-primary-dark text-white"
            onClick={() => {
              setTaskToEdit(undefined);
              setIsAddTaskOpen(true);
            }}
          >
            <Plus className="mr-1 h-5 w-5" /> Add your first task
          </Button>
        </div>
      )}
      
      {/* Upcoming Tasks */}
      <h2 className="text-xl font-bold text-neutral-dark mb-4 mt-8">Upcoming Tasks</h2>
      
      {isTasksLoading ? (
        <div className="flex justify-center p-4">
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
      ) : upcomingTasks.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-4">
          {upcomingTasks.map(task => (
            <UpcomingTaskItem 
              key={task.id} 
              task={task} 
              onClick={() => handleEditTask(task)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <p className="text-neutral-dark">
            No upcoming tasks. Plan ahead by adding tasks with future dates!
          </p>
        </div>
      )}
      
      {/* Add Task Dialog */}
      <AddTaskDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        task={taskToEdit}
      />
    </div>
  );
}
