import { useContext, useState, useEffect } from "react";
import { TaskContext } from "@/context/TaskContext";
import { useToast } from "@/hooks/use-toast";
import TaskCard from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddTaskDialog from "@/components/AddTaskDialog";
import { Task } from "@shared/schema";
import { Plus, Search } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { isToday, isThisWeek } from "date-fns";

type FilterType = "all" | "today" | "thisWeek" | "completed" | "highPoints";
type SortType = "date" | "points" | "name";

export default function Tasks() {
  const { tasks, isLoading, refetchTasks } = useContext(TaskContext);
  const { toast } = useToast();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortType>("date");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    if (tasks) {
      let filtered = [...tasks];
      
      // Apply filter
      switch (activeFilter) {
        case "today":
          filtered = filtered.filter(task => 
            task.dueDate && isToday(new Date(task.dueDate))
          );
          break;
        case "thisWeek":
          filtered = filtered.filter(task => 
            task.dueDate && isThisWeek(new Date(task.dueDate))
          );
          break;
        case "completed":
          filtered = filtered.filter(task => task.completed);
          break;
        case "highPoints":
          filtered = filtered.filter(task => (task.points || 0) >= 20);
          break;
      }
      
      // Apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(task => 
          task.title.toLowerCase().includes(query) || 
          (task.description && task.description.toLowerCase().includes(query))
        );
      }
      
      // Apply sort
      switch (sortBy) {
        case "date":
          filtered.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          });
          break;
        case "points":
          filtered.sort((a, b) => (b.points || 0) - (a.points || 0));
          break;
        case "name":
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
      }
      
      setFilteredTasks(filtered);
    }
  }, [tasks, activeFilter, searchQuery, sortBy]);
  
  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsAddTaskOpen(true);
  };
  
  const handleDeleteTask = async (id: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await apiRequest("DELETE", `/api/tasks/${id}`);
        toast({
          title: "Task deleted",
          description: "Your task has been deleted successfully",
        });
        refetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
        toast({
          title: "Error",
          description: "Failed to delete task",
          variant: "destructive",
        });
      }
    }
  };
  
  return (
    <div className="p-4 md:p-8 h-screen overflow-y-auto pb-20 md:pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-dark">Tasks</h1>
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
      
      {/* Task filters */}
      <div className="mb-6 flex items-center overflow-x-auto pb-2">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          className={activeFilter === "all" ? "bg-primary text-white mr-2" : "bg-white text-neutral-dark mr-2"}
          onClick={() => setActiveFilter("all")}
        >
          All Tasks
        </Button>
        <Button
          variant={activeFilter === "today" ? "default" : "outline"}
          className={activeFilter === "today" ? "bg-primary text-white mr-2" : "bg-white text-neutral-dark mr-2"}
          onClick={() => setActiveFilter("today")}
        >
          Today
        </Button>
        <Button
          variant={activeFilter === "thisWeek" ? "default" : "outline"}
          className={activeFilter === "thisWeek" ? "bg-primary text-white mr-2" : "bg-white text-neutral-dark mr-2"}
          onClick={() => setActiveFilter("thisWeek")}
        >
          This Week
        </Button>
        <Button
          variant={activeFilter === "completed" ? "default" : "outline"}
          className={activeFilter === "completed" ? "bg-primary text-white mr-2" : "bg-white text-neutral-dark mr-2"}
          onClick={() => setActiveFilter("completed")}
        >
          Completed
        </Button>
        <Button
          variant={activeFilter === "highPoints" ? "default" : "outline"}
          className={activeFilter === "highPoints" ? "bg-primary text-white" : "bg-white text-neutral-dark"}
          onClick={() => setActiveFilter("highPoints")}
        >
          High Points
        </Button>
      </div>
      
      {/* Search and sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tasks..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="bg-white px-4 py-2 rounded-lg border border-input"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortType)}
        >
          <option value="date">Sort by date</option>
          <option value="points">Sort by points</option>
          <option value="name">Sort by name</option>
        </select>
      </div>
      
      {/* Task list */}
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
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              showActions={true}
            />
          ))}
        </div>
      ) : tasks.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <p className="text-neutral-dark mb-2">No tasks match your current filters or search.</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setActiveFilter("all");
              setSearchQuery("");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <p className="text-neutral-dark mb-4">You don't have any tasks yet!</p>
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
      
      {/* Add/Edit Task Dialog */}
      <AddTaskDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        task={taskToEdit}
      />
    </div>
  );
}
