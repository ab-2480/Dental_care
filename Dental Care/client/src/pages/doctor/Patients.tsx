import { useAuth } from "@/hooks/use-auth";
import { useAppointments } from "@/hooks/use-appointments";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { User, Phone, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

export default function DoctorPatients() {
  const { user } = useAuth();
  const { appointments } = useAppointments();

  // Get unique patients for this doctor
  const doctorAppointments = appointments?.filter(apt => apt.doctorId === user?.id) || [];
  
  // Create a map of unique patients with their latest appointment
  const patientMap = new Map();
  doctorAppointments.forEach(apt => {
    if (!patientMap.has(apt.patientId)) {
      patientMap.set(apt.patientId, {
        id: apt.patientId,
        name: apt.patientName,
        appointments: []
      });
    }
    patientMap.get(apt.patientId).appointments.push(apt);
  });

  const uniquePatients = Array.from(patientMap.values());

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Patients</h1>
        <p className="text-slate-500">View and manage patients who have booked appointments with you.</p>
      </header>

      <div className="grid gap-6">
        {uniquePatients.length > 0 ? (
          uniquePatients.map((patient: any) => (
            <Card key={patient.id} className="border-slate-100 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      {patient.name?.charAt(0) || "P"}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{patient.name}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        Patient ID: #{patient.id}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Visits</p>
                      <p className="text-sm font-semibold text-slate-700">{patient.appointments.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/50 border-t border-slate-100 p-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Appointment History</h4>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {patient.appointments.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((apt: any) => (
                      <div key={apt.id} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${apt.status === 'completed' ? 'bg-green-500' : apt.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'}`} />
                        <div>
                          <p className="text-sm font-medium text-slate-900 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {format(new Date(apt.date), "MMM d, yyyy")}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {apt.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <User className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No patients yet</h3>
            <p className="text-slate-500">Patients who book appointments with you will appear here.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
