import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, ShieldCheck, HeartPulse, Mail, Phone, MapPin, Instagram } from "lucide-react";
import { motion } from "framer-motion";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex flex-col font-sans">
      <nav className="p-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <Activity className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold font-display tracking-tight text-slate-900">DentalCare</span>
        </div>
        <div className="flex gap-4">
          <Link href="/auth/doctor/login">
            <Button variant="ghost" className="font-medium text-slate-600 hover:text-primary">Doctor Access</Button>
          </Link>
          <Link href="/auth/patient/login">
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-full px-6">
              Patient Portal
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 md:px-12 max-w-5xl mx-auto relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-3xl z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-primary text-sm font-semibold mb-4 border border-blue-200">
            <ShieldCheck className="w-4 h-4" />
            <span>Trusted by over 10,000 patients</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-display text-slate-900 leading-[1.1]">
            Modern Dentistry for a <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Brighter Smile</span>
          </h1>
          
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Experience world-class dental care with our team of specialists. 
            Book appointments, manage prescriptions, and track your dental health online.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/auth/patient/register">
              <Button size="lg" className="h-14 px-8 rounded-full text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 hover:translate-y-[-2px] transition-all">
                Book Appointment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth/patient/login">
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg border-2 hover:bg-slate-50">
                Patient Login
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl"
        >
          <FeatureCard 
            icon={Calendar} 
            title="Easy Scheduling" 
            desc="Book appointments online 24/7 with your preferred specialist." 
          />
          <FeatureCard 
            icon={HeartPulse} 
            title="Comprehensive Care" 
            desc="From routine checkups to complex surgeries, we cover it all." 
          />
          <FeatureCard 
            icon={ShieldCheck} 
            title="Secure Records" 
            desc="Your medical history and prescriptions stored securely online." 
          />
        </motion.div>
      </main>

      <footer className="bg-primary text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-white text-primary rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold font-display tracking-tight">DentalCare</span>
              </div>
              <p className="text-blue-100 text-sm leading-relaxed">
                Providing modern, high-quality dental care for you and your family. Your smile is our priority.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Contact Info</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-blue-100 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span>denatlcare@gmail.com</span>
                </li>
                <li className="flex items-center gap-3 text-blue-100 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span>9988776655</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Location</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-blue-100 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span>kottayam</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Social Media</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-blue-100 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                  <span>dentalcare_34</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-blue-200/60 text-xs">
            © 2026 DentalCare Clinic. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white/60 backdrop-blur-sm border border-white/40 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all text-left">
      <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-lg text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

// Helper for icon component usage since Lucide components are functions
import { Calendar } from "lucide-react";
