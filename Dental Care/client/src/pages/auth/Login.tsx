import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@shared/routes";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link, useRoute } from "wouter";
import { Activity, Loader2 } from "lucide-react";

export default function Login() {
  const [match, params] = useRoute("/auth/:role/login");
  const role = params?.role as "patient" | "doctor" || "patient";
  const { login } = useAuth();

  const form = useForm<z.infer<typeof api.auth.login.input>>({
    resolver: zodResolver(api.auth.login.input),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof api.auth.login.input>) => {
    login.mutate(values);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold font-display text-xl mb-8">
              <Activity className="w-6 h-6" />
              DentalCare
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {role === "doctor" ? "Doctor Login" : "Welcome Back"}
            </h1>
            <p className="text-slate-500">
              Enter your credentials to access your {role} portal.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" className="h-12 bg-slate-50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" className="h-12 bg-slate-50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-12 text-lg font-medium btn-primary" disabled={login.isPending}>
                {login.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Sign In
              </Button>
            </form>
          </Form>

          {role === "patient" && (
            <p className="text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link href="/auth/patient/register" className="font-semibold text-primary hover:underline">
                Register here
              </Link>
            </p>
          )}
          
          <div className="pt-6 border-t border-slate-100 text-center">
             <Link href={role === "patient" ? "/auth/doctor/login" : "/auth/patient/login"} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
               Switch to {role === "patient" ? "Doctor" : "Patient"} Login
             </Link>
          </div>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:block relative bg-slate-900">
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10" />
        {/* Medical themed placeholder image */}
        <img 
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=2000" 
          alt="Dental Office" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-slate-900/90 to-transparent z-20">
          <h2 className="text-3xl font-bold text-white mb-4">World Class Dental Care</h2>
          <p className="text-slate-200 text-lg max-w-md">
            Join thousands of satisfied patients who have trusted us with their smiles.
          </p>
        </div>
      </div>
    </div>
  );
}
