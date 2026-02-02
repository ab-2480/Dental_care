import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useClinic } from "@/hooks/use-clinic";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FilePlus, FileText, User, Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function DoctorPrescriptions() {
  const { user } = useAuth();
  const { patients, prescriptions, createPrescription } = useClinic();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState("");
  const [dosage, setDosage] = useState("");

  const doctorPrescriptions = prescriptions?.filter(p => p.doctorId === user?.id) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !diagnosis || !medicines || !dosage) return;

    createPrescription.mutate({
      doctorId: user!.id,
      patientId: parseInt(selectedPatientId),
      date: new Date().toISOString(),
      diagnosis,
      medicines,
      dosage,
    }, {
      onSuccess: () => {
        setDiagnosis("");
        setMedicines("");
        setDosage("");
        setSelectedPatientId("");
      }
    });
  };

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Prescriptions</h1>
        <p className="text-slate-500">Issue and manage patient prescriptions.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Issue New Prescription */}
        <div className="lg:col-span-1">
          <Card className="border-slate-100 shadow-sm sticky top-8">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FilePlus className="w-5 h-5 text-primary" />
                Issue New
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patient">Select Patient</Label>
                  <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients?.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input 
                    id="diagnosis" 
                    value={diagnosis} 
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g. Tooth sensitivity"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicines">Medication Name</Label>
                  <Input 
                    id="medicines" 
                    value={medicines} 
                    onChange={(e) => setMedicines(e.target.value)}
                    placeholder="e.g. Amoxicillin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage & Duration</Label>
                  <Textarea 
                    id="dosage" 
                    value={dosage} 
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 500mg, twice a day for 7 days"
                    className="min-h-[100px]"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={createPrescription.isPending}
                >
                  {createPrescription.isPending ? "Saving..." : "Save Prescription"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Prescription History */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Recent History
          </h2>

          {doctorPrescriptions.length > 0 ? (
            doctorPrescriptions.map((p) => {
              const patient = patients?.find(pat => pat.id === p.patientId);
              return (
                <Card key={p.id} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-slate-400" />
                          <h4 className="font-bold text-slate-900">{patient?.name || "Patient"}</h4>
                        </div>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(p.date), "PPP")}
                        </p>
                      </div>
                      <div className="px-3 py-1 bg-slate-50 rounded-full text-xs font-medium text-slate-500 border border-slate-100">
                        #{p.id}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Diagnosis</p>
                        <p className="text-sm text-slate-700">{p.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Prescription</p>
                        <p className="text-sm text-slate-900 font-medium">{p.medicines}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{p.dosage}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500">You haven't issued any prescriptions yet.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
