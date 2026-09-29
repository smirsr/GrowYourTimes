import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import AddTaskDialog from "@/components/AddTaskDialog";
import logoImage from "@/assets/grow-your-time-logo.png";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  return (
    <div className="app-container min-h-screen flex flex-col md:flex-row">
      {/* Side Navigation (larger screens) */}
      <div className="hidden md:flex flex-col w-64 bg-white shadow-md p-4 h-screen">
        <div className="mb-8 flex items-center justify-center">
          <img 
            src={logoImage} 
            alt="Grow Your Time Logo" 
            className="h-[84px] w-[84px] rounded-full object-cover border-2 border-primary"
          />
        </div>
        
        <nav className="flex flex-col gap-3 mt-6">
          <Link href="/">
            <a className={cn(
              "flex items-center p-3 rounded-lg font-medium",
              isActive('/') 
                ? "bg-primary-light bg-opacity-30 text-primary-dark" 
                : "text-neutral-dark hover:bg-primary-light hover:bg-opacity-20 transition"
            )}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="mr-3 text-xl h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>Dashboard</span>
            </a>
          </Link>
          
          <Link href="/tasks">
            <a className={cn(
              "flex items-center p-3 rounded-lg font-medium",
              isActive('/tasks') 
                ? "bg-primary-light bg-opacity-30 text-primary-dark" 
                : "text-neutral-dark hover:bg-primary-light hover:bg-opacity-20 transition"
            )}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="mr-3 text-xl h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
                <path d="m9 16 2 2 4-4"></path>
              </svg>
              <span>Tasks</span>
            </a>
          </Link>
          
          <Link href="/garden">
            <a className={cn(
              "flex items-center p-3 rounded-lg font-medium",
              isActive('/garden') 
                ? "bg-primary-light bg-opacity-30 text-primary-dark" 
                : "text-neutral-dark hover:bg-primary-light hover:bg-opacity-20 transition"
            )}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="mr-3 text-xl h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
              </svg>
              <span>Garden</span>
            </a>
          </Link>
          
          <Link href="/chat">
            <a className={cn(
              "flex items-center p-3 rounded-lg font-medium",
              isActive('/chat') 
                ? "bg-primary-light bg-opacity-30 text-primary-dark" 
                : "text-neutral-dark hover:bg-primary-light hover:bg-opacity-20 transition"
            )}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="mr-3 text-xl h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path>
                <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
              </svg>
              <span>Assistant</span>
            </a>
          </Link>
        </nav>
        
        <div className="mt-auto">
          <button
            className="w-full bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center transition"
            onClick={() => setIsAddTaskOpen(true)}
          >
            <Plus className="h-5 w-5 mr-1" />
            <span>Add New Task</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 relative overflow-hidden ${isMobile ? 'mt-[76px]' : ''}`}>
        {children}
      </div>
      
      {/* Mobile Logo */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-white shadow-[0_1px_5px_rgba(0,0,0,0.05)] flex justify-center items-center py-3 z-10">
          <img 
            src={logoImage} 
            alt="Grow Your Time Logo" 
            className="h-[60px] w-[60px] rounded-full object-cover border-2 border-primary"
          />
        </div>
      )}
      
      {/* Mobile Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-1px_5px_rgba(0,0,0,0.05)] flex justify-around items-center p-3 z-10">
          <Link href="/">
            <a className={cn(
              "flex flex-col items-center",
              isActive('/') ? "text-primary" : "text-neutral-dark"
            )}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="text-xl h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span className="text-xs mt-1">Home</span>
            </a>
          </Link>
          
          <Link href="/tasks">
            <a className={cn(
              "flex flex-col items-center",
              isActive('/tasks') ? "text-primary" : "text-neutral-dark"
            )}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="text-xl h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
                <path d="m9 16 2 2 4-4"></path>
              </svg>
              <span className="text-xs mt-1">Tasks</span>
            </a>
          </Link>
          
          <button 
            className="flex flex-col items-center justify-center bg-primary text-white rounded-full w-14 h-14 -mt-5"
            onClick={() => setIsAddTaskOpen(true)}
          >
            <Plus className="h-6 w-6" />
          </button>
          
          <Link href="/garden">
            <a className={cn(
              "flex flex-col items-center",
              isActive('/garden') ? "text-primary" : "text-neutral-dark"
            )}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="text-xl h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
              </svg>
              <span className="text-xs mt-1">Garden</span>
            </a>
          </Link>
          
          <Link href="/chat">
            <a className={cn(
              "flex flex-col items-center",
              isActive('/chat') ? "text-primary" : "text-neutral-dark"
            )}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="text-xl h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path>
                <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
              </svg>
              <span className="text-xs mt-1">Chat</span>
            </a>
          </Link>
        </div>
      )}
      
      {/* Add Task Dialog */}
      <AddTaskDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
      />
    </div>
  );
}
