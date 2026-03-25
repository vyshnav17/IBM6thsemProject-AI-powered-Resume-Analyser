import { useState, useEffect } from "react";
import { UploadSection } from "@/components/upload-section";
import { ResultsDashboard } from "@/components/results-dashboard";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, Loader2, LogOut, LayoutDashboard, History, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { ResumeAnalysis } from "@/lib/types";
import { HistoryDashboard } from "@/components/history-dashboard";
import { ResumeBuilder } from "@/components/resume-builder";

export default function Home() {
  const { logoutMutation } = useAuth();
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [view, setView] = useState<'dashboard' | 'history' | 'builder'>('dashboard');

  const handleAnalysisComplete = (newAnalysis: ResumeAnalysis) => {
    setAnalysis(newAnalysis);
    setView('dashboard');
    // Scroll to top to show results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewAnalysis = () => {
    setAnalysis(null);
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleViewChange = (e: any) => {
      if (e.detail === 'builder') {
        setView('builder');
        setAnalysis(null);
      }
    };
    window.addEventListener('change-view', handleViewChange);
    return () => window.removeEventListener('change-view', handleViewChange);
  }, []);

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden relative">
      {/* Glowing Mesh Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[40%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Sidebar Navigation */}
      <aside className="w-72 border-r border-white/10 bg-white/5 backdrop-blur-xl flex flex-col z-10 hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">CV AI Insights</h1>
              <p className="text-xs text-white/50 font-medium">Next-Gen Engine</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 mt-2 px-2">Menu</div>
          
          <button onClick={handleNewAnalysis} className="w-full flex items-center space-x-3 px-4 py-3 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-sm font-medium border border-white/5 shadow-sm">
            <Plus className="w-4 h-4 text-purple-400" />
            <span>New Analysis</span>
          </button>
          
          <button onClick={() => setView('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/5 transition-colors rounded-xl text-sm font-medium ${view === 'dashboard' ? 'bg-white/5 text-white border border-white/5' : 'text-white/70 border border-transparent'}`}>
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button onClick={() => { setView('history'); setAnalysis(null); }} className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/5 transition-colors rounded-xl text-sm font-medium ${view === 'history' ? 'bg-white/5 text-white border border-white/5' : 'text-white/70 border border-transparent'}`}>
            <History className="w-4 h-4" />
            <span>History</span>
          </button>

          <button onClick={() => { setView('builder'); setAnalysis(null); }} className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/5 transition-colors rounded-xl text-sm font-medium ${view === 'builder' ? 'bg-white/5 text-white border border-white/5' : 'text-white/70 border border-transparent'}`}>
            <TrendingUp className="w-4 h-4" />
            <span>Resume Builder</span>
          </button>
        </div>

        <div className="p-4 border-t border-white/10">
          <Button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            variant="ghost"
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
          >
            {logoutMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <LogOut className="h-4 w-4 mr-2" />
            )}
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto z-10 relative">
        <div className="md:hidden p-4 border-b border-white/10 bg-white/5 backdrop-blur-md flex justify-between items-center z-20 sticky top-0">
          <div className="flex items-center space-x-2">
            <span className="font-bold">CV AI</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => logoutMutation.mutate()}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 lg:p-10 max-w-6xl mx-auto min-h-full flex flex-col">
          {view === 'history' ? (
             <HistoryDashboard onSelectAnalysis={(item) => { setAnalysis(item); setView('dashboard'); window.scrollTo(0,0); }} />
          ) : view === 'builder' ? (
             <ResumeBuilder initialAnalysis={analysis} />
          ) : analysis ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <ResultsDashboard
                 analysis={analysis}
                 onNewAnalysis={handleNewAnalysis}
               />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col justify-center">
               <UploadSection onAnalysisComplete={handleAnalysisComplete} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
