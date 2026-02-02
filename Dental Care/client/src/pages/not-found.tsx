import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 text-slate-400">
        <FileQuestion className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">404 Page Not Found</h1>
      <p className="text-slate-500 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button size="lg" className="btn-primary">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
