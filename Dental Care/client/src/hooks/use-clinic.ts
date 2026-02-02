import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertPrescription } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useClinic() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const doctorsQuery = useQuery({
    queryKey: [api.doctors.list.path],
    queryFn: async () => {
      const res = await fetch(api.doctors.list.path);
      if (!res.ok) throw new Error("Failed to fetch doctors");
      return api.doctors.list.responses[200].parse(await res.json());
    },
  });

  const patientsQuery = useQuery({
    queryKey: [api.patients.list.path],
    queryFn: async () => {
      const res = await fetch(api.patients.list.path);
      if (!res.ok) throw new Error("Failed to fetch patients");
      return api.patients.list.responses[200].parse(await res.json());
    },
  });

  const prescriptionsQuery = useQuery({
    queryKey: [api.prescriptions.list.path],
    queryFn: async () => {
      const res = await fetch(api.prescriptions.list.path);
      if (!res.ok) throw new Error("Failed to fetch prescriptions");
      return api.prescriptions.list.responses[200].parse(await res.json());
    },
  });

  const createPrescription = useMutation({
    mutationFn: async (data: InsertPrescription) => {
      const res = await fetch(api.prescriptions.create.path, {
        method: api.prescriptions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create prescription");
      return api.prescriptions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.prescriptions.list.path] });
      toast({
        title: "Prescription Added",
        description: "Prescription has been saved successfully.",
      });
    },
  });

  return {
    doctors: doctorsQuery.data,
    patients: patientsQuery.data,
    prescriptions: prescriptionsQuery.data,
    createPrescription,
  };
}
