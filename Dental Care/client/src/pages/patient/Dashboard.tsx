import { useAuth } from "@/hooks/use-auth";
import { useAppointments } from "@/hooks/use-appointments";
import { Layout } from "@/components/Layout";
import { AppointmentCard } from "@/components/AppointmentCard";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Link } from "wouter";

export default function PatientDashboard() {
  const { user } = useAuth();
  const { appointments, cancelAppointment } = useAppointments();

  const upcomingAppointments = appointments
    ?.filter(apt => new Date(apt.date + "T" + apt.time) >= new Date() && apt.status !== 'cancelled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Patient Dashboard</h1>
        <p className="text-slate-500">Welcome back, {user?.name}. Here's your health overview.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-white/20 p-2.5 rounded-lg backdrop-blur-sm">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <Link href="/patient/book-appointment">
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                <Plus className="w-4 h-4 mr-1" /> Book New
              </Button>
            </Link>
          </div>
          <p className="text-blue-100 text-sm font-medium">Upcoming Visits</p>
          <h2 className="text-3xl font-bold mt-1">{upcomingAppointments.length}</h2>
        </div>
        
        {/* Placeholder stats */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
           <p className="text-slate-500 text-sm font-medium mb-1">Last Visit</p>
           <h2 className="text-2xl font-bold text-slate-900">Nov 12, 2024</h2>
           <p className="text-xs text-muted-foreground mt-2">Dr. Sarah Wilson - Routine Checkup</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
           <p className="text-slate-500 text-sm font-medium mb-1">Active Prescriptions</p>
           <h2 className="text-2xl font-bold text-slate-900">0</h2>
           <Link href="/patient/appointments" className="text-xs text-primary font-medium mt-2 block hover:underline">View History</Link>
        </div>
      </div>

      {/* Upcoming Appointments Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Upcoming Appointments</h2>
          {upcomingAppointments.length > 0 && (
             <Link href="/patient/appointments" className="text-sm font-medium text-primary hover:text-primary/80">View All</Link>
          )}
        </div>

        {upcomingAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingAppointments.map((apt) => (
              <AppointmentCard 
                key={apt.id} 
                appointment={apt} 
                role="patient"
                onCancel={(id) => cancelAppointment.mutate(id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <CalendarIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No upcoming appointments</h3>
            <p className="text-slate-500 mb-6">Schedule your next visit with one of our specialists.</p>
            <Link href="/patient/book-appointment">
              <Button className="btn-primary">Book Now</Button>
            </Link>
          </div>
        )}
      </section>
    </Layout>
  );
}
