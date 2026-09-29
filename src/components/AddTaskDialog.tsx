import { useContext, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { TaskContext } from "@/context/TaskContext";
import { Task } from "@shared/schema";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task; // If provided, we're editing an existing task
}

export default function AddTaskDialog({ open, onOpenChange, task }: AddTaskDialogProps) {
  const { toast } = useToast();
  const { refetchTasks } = useContext(TaskContext);
  
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState<string>(
    task?.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd'T'HH:mm") : ""
  );
  const [points, setPoints] = useState(task?.points?.toString() || "10");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Task title required",
        description: "Please enter a title for your task",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Convert the string dueDate to a proper ISO string that can be parsed as a Date
      const formattedDueDate = dueDate ? new Date(dueDate).toISOString() : null;
      
      const taskData = {
        title,
        description,
        dueDate: formattedDueDate,
        points: parseInt(points) || 10,
      };
      
      if (task) {
        // Update existing task
        await apiRequest("PATCH", `/api/tasks/${task.id}`, taskData);
        toast({
          title: "Task updated",
          description: "Your task has been updated successfully",
          duration: 3000,
        });
      } else {
        // Create new task
        await apiRequest("POST", "/api/tasks", taskData);
        toast({
          title: "Task created",
          description: "Your new task has been added",
          duration: 3000,
        });
      }
      
      // Refetch tasks and reset form
      refetchTasks();
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving task:", error);
      toast({
        title: "Error",
        description: "Failed to save task. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPoints("10");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date & Time (optional)</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="points">Points (1-50)</Label>
            <Input
              id="points"
              type="number"
              min="1"
              max="50"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">
              Higher points for more important or difficult tasks
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-dark">
              {task ? "Update Task" : "Add Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
