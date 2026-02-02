import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link } from "wouter";
import { Activity, Loader2 } from "lucide-react";
import { z } from "zod";

export default function Register() {
  const { register } = useAuth();

  const form = useForm<z.infer<typeof insertUserSchema>>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "patient",
      name: "",
      phone: "",
    },
  });

  const onSubmit = (values: z.infer<typeof insertUserSchema>) => {
    register.mutate(values);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden grid md:grid-cols-5">
        <div className="md:col-span-2 bg-primary p-8 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-30 -skew-y-12 scale-150 transform origin-top-left" />
          <div className="z-10">
            <div className="flex items-center gap-2 font-bold font-display text-xl mb-8">
              <Activity className="w-6 h-6" />
              DentalCare
            </div>
            <h2 className="text-3xl font-bold mb-4">Start your journey today</h2>
            <p className="text-blue-100">Create an account to book appointments, manage your profile, and more.</p>
          </div>
          <div className="z-10 text-sm opacity-80">© 2024 DentalCare</div>
        </div>

        <div className="md:col-span-3 p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
            <p className="text-slate-500 text-sm">Fill in your details to register as a new patient.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} className="bg-slate-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} className="bg-slate-50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 000-0000" {...field} value={field.value || ""} className="bg-slate-50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="bg-slate-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-11 btn-primary mt-4" disabled={register.isPending}>
                {register.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Register Account
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/auth/patient/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
