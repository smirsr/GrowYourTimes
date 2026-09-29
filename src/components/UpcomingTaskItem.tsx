import { Task } from "@shared/schema";
import { format, isTomorrow, isToday, addDays } from "date-fns";
import { ChevronRight } from "lucide-react";

interface UpcomingTaskItemProps {
  task: Task;
  onClick?: () => void;
}

export default function UpcomingTaskItem({ task, onClick }: UpcomingTaskItemProps) {
  // Format the date for display
  const formatTaskDate = (date: Date | null) => {
    if (!date) return "No due date";
    
    if (isToday(new Date(date))) {
      return `Today, ${format(new Date(date), 'h:mm a')}`;
    } else if (isTomorrow(new Date(date))) {
      return `Tomorrow, ${format(new Date(date), 'h:mm a')}`;
    } else if (new Date(date) < addDays(new Date(), 7)) {
      return `${format(new Date(date), 'EEEE')}, ${format(new Date(date), 'h:mm a')}`;
    } else {
      return format(new Date(date), 'MMM d, h:mm a');
    }
  };

  return (
    <div className="py-3 border-b border-neutral last:border-b-0">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-neutral-dark">{task.title}</h3>
          <div className="flex items-center text-sm mt-1">
            <span className="text-neutral-dark">
              {task.dueDate ? formatTaskDate(new Date(task.dueDate)) : "No due date"}
            </span>
            <span className="ml-3 px-2 py-0.5 bg-primary-light rounded-full text-xs font-medium text-primary-dark">
              +{task.points} pts
            </span>
          </div>
        </div>
        <button 
          className="text-primary hover:text-primary-dark"
          onClick={onClick}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
