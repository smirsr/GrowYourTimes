import { cn } from "@/lib/utils";
import { Task } from "@shared/schema";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useContext } from "react";
import { TaskContext } from "@/context/TaskContext";
import { PlantContext } from "@/context/PlantContext";
import { useToast } from "@/hooks/use-toast";

interface TaskCardProps {
  task: Task;
  className?: string;
  onDelete?: (id: number) => void;
  onEdit?: (task: Task) => void;
  showActions?: boolean;
}

export default function TaskCard({ 
  task,
  className, 
  onDelete, 
  onEdit,
  showActions = false 
}: TaskCardProps) {
  const { refetchTasks } = useContext(TaskContext);
  const { refetchCurrentPlant } = useContext(PlantContext);
  const { toast } = useToast();
  
  const toggleTaskComplete = async () => {
    try {
      await apiRequest("PATCH", `/api/tasks/${task.id}`, { 
        completed: !task.completed
      });
      
      // Refetch data
      refetchTasks();
      refetchCurrentPlant();
      
      // Show toast for points earned if completing task
      if (!task.completed) {
        toast({
          title: "Task completed!",
          description: `You earned ${task.points} points for your plant`,
          className: "bg-primary text-white",
        });
      }
    } catch (error) {
      console.error("Error toggling task:", error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteClick = async () => {
    if (onDelete) {
      onDelete(task.id);
    }
  };
  
  const handleEditClick = () => {
    if (onEdit) {
      onEdit(task);
    }
  };
  
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm p-4",
      task.completed ? "border-l-4 border-green-500" : "border-l-4 border-primary",
      className
    )}>
      <div className="flex items-start">
        <div 
          className={cn(
            "w-6 h-6 mt-1 border-2 border-primary rounded-md flex items-center justify-center cursor-pointer",
            task.completed && "bg-primary"
          )}
          onClick={toggleTaskComplete}
        >
          {task.completed && (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 text-white" 
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={cn(
            "font-semibold text-neutral-dark",
            task.completed && "line-through opacity-60"
          )}>
            {task.title}
          </h3>
          <p className={cn(
            "text-sm text-neutral-dark mt-1",
            task.completed && "line-through opacity-60"
          )}>
            {task.description}
          </p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center text-sm">
              <span className={cn(
                "flex items-center text-neutral-dark",
                task.completed && "opacity-60"
              )}>
                <Clock className="h-4 w-4 mr-1" />
                {task.dueDate ? format(new Date(task.dueDate), 'h:mm a') : 'No due date'}
              </span>
              <span className={cn(
                "ml-4 px-2 py-0.5 rounded-full text-xs font-medium",
                task.completed 
                  ? "bg-green-100 text-green-600" 
                  : "bg-primary-light text-primary-dark"
              )}>
                {task.completed ? 'Completed' : `+${task.points} pts`}
              </span>
            </div>
            
            {showActions && (
              <div className="flex">
                <button 
                  className="text-neutral-dark hover:text-primary-dark mr-2"
                  onClick={handleEditClick}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button 
                  className="text-neutral-dark hover:text-red-500"
                  onClick={handleDeleteClick}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
