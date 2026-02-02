import { Appointment } from "@shared/schema";
import { format } from "date-fns";
import { Calendar, Clock, User, XCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppointmentCardProps {
  appointment: Appointment & { patientName?: string; doctorName?: string };
  role: "doctor" | "patient";
  onCancel?: (id: number) => void;
}

export function AppointmentCard({ appointment, role, onCancel }: AppointmentCardProps) {
  const isUpcoming = new Date(appointment.date + "T" + appointment.time) > new Date();
  const canCancel = isUpcoming && appointment.status === "scheduled";

  const statusColors = {
    scheduled: "bg-blue-100 text-blue-700 border-blue-200",
    completed: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColors[appointment.status as keyof typeof statusColors]}`}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </span>
          </div>
          <h3 className="font-semibold text-lg text-slate-900">
            {role === "patient" ? `Dr. ${appointment.doctorName}` : `Patient: ${appointment.patientName}`}
          </h3>
          <p className="text-sm text-muted-foreground">{appointment.reason || "General Checkup"}</p>
        </div>
        {canCancel && onCancel && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => onCancel(appointment.id)}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="font-medium">{format(new Date(appointment.date), "EEE, MMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-medium">{appointment.time}</span>
        </div>
      </div>
    </div>
  );
}
