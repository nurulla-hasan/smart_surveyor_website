import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Map, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10 animate-pulse delay-700" />
      
      <div className="max-w-md w-full px-6 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Animated Icon Section */}
        <div className="relative inline-block">
          <div className="text-9xl font-black text-muted/20 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-primary/10 p-5 rounded-3xl backdrop-blur-sm border border-primary/20 shadow-2xl">
              <Map className="h-16 w-16 text-primary animate-bounce" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase italic">
            রাস্তা হারিয়ে ফেলেছেন?
          </h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            দুঃখিত, আপনি যে পাতাটি খুঁজছেন সেটি খুঁজে পাওয়া যায়নি। সম্ভবত লিংকটি ভুল অথবা পাতাটি সরিয়ে ফেলা হয়েছে।
          </p>
        </div>

        {/* Quick Links / Suggestions */}
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="p-4 rounded-2xl bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors group cursor-default">
            <Search className="h-5 w-5 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
            <p className="text-xs font-bold uppercase text-muted-foreground group-hover:text-foreground transition-colors">ভুল লিংক</p>
          </div>
          <div className="p-4 rounded-2xl bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors group cursor-default">
            <Map className="h-5 w-5 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
            <p className="text-xs font-bold uppercase text-muted-foreground group-hover:text-foreground transition-colors">ম্যাপে নেই</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto font-bold uppercase tracking-wider rounded-xl hover:bg-muted group">
            <Link href="javascript:history.back()" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              পিছনে যান
            </Link>
          </Button>
          <Button asChild size="lg" className="w-full sm:w-auto font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-primary/20 group">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
              হোমপেজে ফিরুন
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer hint */}
      <p className="absolute bottom-8 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/50">
        Smart Surveyor &copy; 2026
      </p>
    </div>
  );
}
