import { useAuth } from "@/hooks/use-auth";
import { useAppointments } from "@/hooks/use-appointments";
import { Layout } from "@/components/Layout";
import { AppointmentCard } from "@/components/AppointmentCard";
import { Users, FileText, Clock, CalendarCheck } from "lucide-react";
import { format } from "date-fns";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { appointments } = useAppointments();

  const todayStr = format(new Date(), "yyyy-MM-dd");
  
  const todaysAppointments = appointments
    ?.filter(apt => apt.date === todayStr && apt.status !== 'cancelled')
    .sort((a, b) => a.time.localeCompare(b.time)) || [];

  // Calculate total unique patients for this doctor
  const totalPatients = new Set(
    appointments
      ?.filter(apt => apt.doctorId === user?.id && apt.status !== 'cancelled')
      .map(apt => apt.patientId)
  ).size;

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Doctor's Dashboard</h1>
        <p className="text-slate-500">Good morning, Dr. {user?.name}. Here is your schedule for today.</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Appointments Today</p>
            <h2 className="text-2xl font-bold text-slate-900">{todaysAppointments.length}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Patients</p>
            <h2 className="text-2xl font-bold text-slate-900">{totalPatients}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Reports</p>
            <h2 className="text-2xl font-bold text-slate-900">0</h2>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Today's Schedule
          </h2>
          
          <div className="space-y-4">
            {todaysAppointments.length > 0 ? (
              todaysAppointments.map((apt) => (
                <AppointmentCard 
                  key={apt.id} 
                  appointment={apt} 
                  role="doctor"
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-500">No appointments scheduled for today.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Notices */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-2">System Notice</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              System maintenance scheduled for this Sunday at 2:00 AM. Please save all reports before then.
            </p>
            <div className="text-xs text-slate-400">Posted by Admin</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
