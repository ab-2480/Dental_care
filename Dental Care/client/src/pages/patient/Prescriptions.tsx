import { useAuth } from "@/hooks/use-auth";
import { useClinic } from "@/hooks/use-clinic";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, User } from "lucide-react";
import { format } from "date-fns";

export default function PatientPrescriptions() {
  const { user } = useAuth();
  const { prescriptions, doctors } = useClinic();

  const patientPrescriptions = prescriptions?.filter(p => p.patientId === user?.id) || [];

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Prescriptions</h1>
        <p className="text-slate-500">View your prescribed medications and treatment history.</p>
      </header>

      <div className="grid gap-6">
        {patientPrescriptions.length > 0 ? (
          patientPrescriptions.map((p) => {
            const doctor = doctors?.find(d => d.id === p.doctorId);
            return (
              <Card key={p.id} className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">Prescription #{p.id}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(p.date), "PPP")}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Diagnosis</h4>
                        <p className="text-slate-900 font-medium">{p.diagnosis}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Doctor</h4>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <p className="text-slate-700">{doctor?.name || "Clinic Specialist"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
                      <h4 className="text-sm font-semibold text-blue-900 uppercase tracking-wider mb-3">Medication Details</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-blue-600 font-medium mb-1">Medicines</p>
                          <p className="text-slate-900 font-semibold">{p.medicines}</p>
                        </div>
                        <div>
                          <p className="text-xs text-blue-600 font-medium mb-1">Dosage & Duration</p>
                          <p className="text-slate-700">{p.dosage}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No prescriptions found</h3>
            <p className="text-slate-500">Your prescriptions will appear here once issued by your doctor.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
