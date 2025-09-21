import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Applications from "./pages/Applications";
import Messages from "./pages/Messages";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import AssessmentHub from "./pages/AssessmentHub";
import AssessmentPlayer from "./pages/AssessmentPlayer";
import AssessmentResult from "./pages/AssessmentResult";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CompanyRegister from "./pages/CompanyRegister";

// Company pages
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyJobs from "./pages/company/CompanyJobs";
import CompanyJobCreate from "./pages/company/CompanyJobCreate";
import CompanyCandidates from "./pages/company/CompanyCandidates";
import CompanyBilling from "./pages/company/CompanyBilling";
import CompanyMessages from "./pages/company/CompanyMessages";
import CompanyProfile from "./pages/company/CompanyProfile";
import CompanyTeam from "./pages/company/CompanyTeam";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/company/register" element={<CompanyRegister />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/job/:id" element={<JobDetail />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/messages/:threadId" element={<Messages />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/assessment" element={<AssessmentHub />} />
              <Route path="/assessment/play" element={<AssessmentPlayer />} />
              <Route path="/assessment/result/:id" element={<AssessmentResult />} />
            
            {/* Company routes */}
            <Route path="/company" element={<CompanyDashboard />} />
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
            <Route path="/company/jobs" element={<CompanyJobs />} />
            <Route path="/company/jobs/create" element={<CompanyJobCreate />} />
            <Route path="/company/jobs/:id/edit" element={<CompanyJobCreate />} />
            <Route path="/company/candidates" element={<CompanyCandidates />} />
            <Route path="/company/candidate/:id" element={<CompanyCandidates />} />
            <Route path="/company/messages" element={<CompanyMessages />} />
            <Route path="/company/messages/:threadId" element={<CompanyMessages />} />
            <Route path="/company/billing" element={<CompanyBilling />} />
            <Route path="/company/profile" element={<CompanyProfile />} />
            <Route path="/company/team" element={<CompanyTeam />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
