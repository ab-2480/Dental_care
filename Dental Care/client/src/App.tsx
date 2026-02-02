import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import Welcome from "@/pages/Welcome";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import PatientDashboard from "@/pages/patient/Dashboard";
import BookAppointment from "@/pages/patient/BookAppointment";
import PatientPrescriptions from "@/pages/patient/Prescriptions";
import DoctorDashboard from "@/pages/doctor/Dashboard";
import DoctorPrescriptions from "@/pages/doctor/Prescriptions";
import DoctorPatients from "@/pages/doctor/Patients";

// Auth Guard Wrapper (simple implementation)
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

function ProtectedRoute({ children, role }: { children: ReactNode, role: "patient" | "doctor" }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== role) {
    // Redirect logic handled in useAuth or component level typically
    // For now, render nothing or redirect via window.location in useEffect
    window.location.href = `/auth/${role}/login`;
    return null;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      
      {/* Auth Routes */}
      <Route path="/auth/:role/login" component={Login} />
      <Route path="/auth/patient/register" component={Register} />

      {/* Patient Routes */}
      <Route path="/patient/dashboard">
        <ProtectedRoute role="patient">
          <PatientDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/patient/book-appointment">
        <ProtectedRoute role="patient">
          <BookAppointment />
        </ProtectedRoute>
      </Route>
      <Route path="/patient/appointments">
        <ProtectedRoute role="patient">
          {/* Reusing dashboard but could be separate list page */}
          <PatientDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/patient/prescriptions">
        <ProtectedRoute role="patient">
          <PatientPrescriptions />
        </ProtectedRoute>
      </Route>

      {/* Doctor Routes */}
      <Route path="/doctor/dashboard">
        <ProtectedRoute role="doctor">
          <DoctorDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/doctor/patients">
        <ProtectedRoute role="doctor">
          <DoctorPatients />
        </ProtectedRoute>
      </Route>
      <Route path="/doctor/prescriptions">
        <ProtectedRoute role="doctor">
          <DoctorPrescriptions />
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
