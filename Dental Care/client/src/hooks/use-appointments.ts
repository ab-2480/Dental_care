import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertAppointment } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useAppointments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const appointmentsQuery = useQuery({
    queryKey: [api.appointments.list.path],
    queryFn: async () => {
      const res = await fetch(api.appointments.list.path);
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return api.appointments.list.responses[200].parse(await res.json());
    },
  });

  const createAppointment = useMutation({
    mutationFn: async (data: InsertAppointment) => {
      const res = await fetch(api.appointments.create.path, {
        method: api.appointments.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create appointment");
      }
      return api.appointments.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.appointments.list.path] });
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been successfully scheduled.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message,
      });
    },
  });

  const cancelAppointment = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.appointments.cancel.path, { id });
      const res = await fetch(url, { method: api.appointments.cancel.method });
      if (!res.ok) throw new Error("Failed to cancel appointment");
      return api.appointments.cancel.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.appointments.list.path] });
      toast({
        title: "Appointment Cancelled",
        description: "The appointment has been removed from your schedule.",
      });
    },
  });

  return {
    appointments: appointmentsQuery.data,
    isLoading: appointmentsQuery.isLoading,
    createAppointment,
    cancelAppointment,
  };
}
