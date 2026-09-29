import { createContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

interface TaskContextProps {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  refetchTasks: () => void;
}

export const TaskContext = createContext<TaskContextProps>({
  tasks: [],
  isLoading: false,
  error: null,
  refetchTasks: () => {}
});

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const { 
    data,
    isLoading,
    error, 
    refetch
  } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });
  
  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);
  
  const refetchTasks = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
  };
  
  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        error: error as Error | null,
        refetchTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
