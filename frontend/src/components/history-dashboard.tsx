import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Loader2, ArrowRight, History } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { ResumeAnalysis } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface HistoryDashboardProps {
  onSelectAnalysis: (analysis: ResumeAnalysis) => void;
}

export function HistoryDashboard({ onSelectAnalysis }: HistoryDashboardProps) {
  const [history, setHistory] = useState<ResumeAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await apiRequest("GET", "/api/analyzer/history");
        const data = await res.json();
        setHistory(data);
      } catch (error) {
        toast({
          title: "Failed to load history",
          description: "There was an error loading your past analyses.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 relative z-10 w-full">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400 mb-4" />
        <p className="text-white/60 font-medium">Loading history...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl relative z-10 text-center max-w-2xl mx-auto mt-20 shadow-2xl">
        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
          <History className="h-8 w-8 text-white/40" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">No past analyses found</h3>
        <p className="text-white/60">Upload your first resume in the Dashboard to see your history logged here.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 flex-1 content-start animate-in fade-in duration-500 w-full mb-12 max-w-6xl mx-auto">
      <div className="md:col-span-2 lg:col-span-3 mb-2">
        <h2 className="text-2xl font-bold text-white mb-2">Your Analysis History</h2>
        <p className="text-white/60">Click on any past analysis to view detailed reports and AI feedback.</p>
      </div>
      
      {history.map((item) => (
        <Card
          key={item.id || (item as any)._id}
          className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all cursor-pointer shadow-xl group rounded-2xl"
          onClick={() => onSelectAnalysis(item)}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 shrink-0 shadow-inner">
                   <div className={`text-lg font-bold ${item.overallScore >= 80 ? 'text-green-400' : item.overallScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                     {item.overallScore}
                   </div>
                </div>
                <div>
                   <h4 className="font-bold text-white/90">AI Score</h4>
                   <p className="text-xs text-white/50">{new Date(item.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <ArrowRight className="text-white/40 group-hover:text-purple-400 transition-colors w-4 h-4" />
              </div>
            </div>

            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-xs mb-1.5 font-medium">
                     <span className="text-white/60">Formatting</span>
                     <span className="text-white">{item.scores.formatting}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10"><div className="bg-purple-400 h-full rounded-full" style={{width: `${item.scores.formatting}%`}}/></div>
               </div>
               <div>
                  <div className="flex justify-between text-xs mb-1.5 font-medium">
                     <span className="text-white/60">Content</span>
                     <span className="text-white">{item.scores.content}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10"><div className="bg-blue-400 h-full rounded-full" style={{width: `${item.scores.content}%`}}/></div>
               </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
