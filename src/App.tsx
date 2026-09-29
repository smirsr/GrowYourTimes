import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Tasks from "@/pages/Tasks";
import Garden from "@/pages/Garden";
import Chat from "@/pages/Chat";
import Layout from "@/components/Layout";
import { TaskProvider } from "@/context/TaskContext";
import { PlantProvider } from "@/context/PlantContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/garden" component={Garden} />
      <Route path="/chat" component={Chat} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PlantProvider>
        <TaskProvider>
          <Layout>
            <Router />
          </Layout>
        </TaskProvider>
      </PlantProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
