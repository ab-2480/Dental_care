import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertAppointmentSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useClinic } from "@/hooks/use-clinic";
import { useAppointments } from "@/hooks/use-appointments";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { useLocation } from "wouter";

export default function BookAppointment() {
  const { user } = useAuth();
  const { doctors } = useClinic();
  const { createAppointment } = useAppointments();
  const [_, setLocation] = useLocation();

  const form = useForm<z.infer<typeof insertAppointmentSchema>>({
    resolver: zodResolver(insertAppointmentSchema),
    defaultValues: {
      patientId: user?.id,
      doctorId: undefined,
      date: "",
      time: "",
      reason: "",
    },
  });

  const onSubmit = (values: z.infer<typeof insertAppointmentSchema>) => {
    // Force numbers for IDs
    const payload = {
      ...values,
      patientId: Number(user?.id),
      doctorId: Number(values.doctorId),
    };
    
    createAppointment.mutate(payload, {
      onSuccess: () => setLocation("/patient/dashboard"),
    });
  };

  // Generate time slots (9 AM to 5 PM)
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Book Appointment</h1>
          <p className="text-slate-500">Schedule a visit with one of our specialists.</p>
        </header>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Doctor</FormLabel>
                    <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-slate-50">
                          <SelectValue placeholder="Choose a specialist" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {doctors?.map((doc) => (
                          <SelectItem key={doc.id} value={doc.id.toString()}>
                            Dr. {doc.name} - {doc.specialty || "General Dentist"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" className="h-12 bg-slate-50" {...field} min={new Date().toISOString().split('T')[0]} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-slate-50">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Visit</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please briefly describe your symptoms or reason for visit..." 
                        className="bg-slate-50 min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button type="submit" size="lg" className="w-full h-12 btn-primary" disabled={createAppointment.isPending}>
                  {createAppointment.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CalendarIcon className="w-5 h-5 mr-2" />}
                  Confirm Booking
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
}
