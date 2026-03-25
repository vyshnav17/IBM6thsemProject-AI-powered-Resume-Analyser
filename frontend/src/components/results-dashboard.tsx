import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Download,
  Share,
  RotateCcw,
  FileText,
  Check,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  ArrowUp,
  Sparkles
} from "lucide-react";
import type { ResumeAnalysis } from "@/lib/types";

interface ResultsDashboardProps {
  analysis: ResumeAnalysis;
  onNewAnalysis: () => void;
}

export function ResultsDashboard({ analysis, onNewAnalysis }: ResultsDashboardProps) {
  const { toast } = useToast();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreGradient = (score: number) => {
    const percentage = (score / 100) * 360;
    return {
      background: `conic-gradient(from 0deg, #10B981 0deg ${percentage}deg, #E5E7EB ${percentage}deg 360deg)`
    };
  };

  const downloadReport = () => {
    window.location.href = `/api/reports/download-analysis-report/${analysis.id}`;

    toast({
      title: "Generating Report",
      description: "Your professional PDF analysis report is being generated...",
    });
  };

  const shareResults = async () => {
    const shareText = `I analyzed my resume and scored ${analysis.overallScore}/100! Key strengths: ${analysis.strengths.map(s => s.title).join(', ')}.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Resume Analysis Results',
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: "Resume analysis summary copied to clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Share Failed",
        description: "Unable to copy to clipboard. Try manually copying the results.",
        variant: "destructive"
      });
    });
  };

  const optimizeResumeMutation = useMutation({
    mutationFn: async () => {
      // We'll just trigger the download directly since it's a GET request that returns a file
      window.location.href = `/api/reports/download-optimized-resume/${analysis.id}`;
    },
    onSuccess: () => {
      toast({
        title: "Optimized Resume Downloaded",
        description: "Your professional PDF resume has been generated and downloaded!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const generateOptimizedResume = () => {
    optimizeResumeMutation.mutate();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 relative z-10">
      {/* Score Overview */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Score Circle */}
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32">
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                  style={getScoreGradient(analysis.overallScore)}
                >
                  <div className="w-24 h-24 bg-[#09090b] rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${analysis.overallScore >= 80 ? "text-green-400" : analysis.overallScore >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                        {analysis.overallScore}
                      </div>
                      <div className="text-sm text-white/50">out of 100</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Details */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-white mb-2">
                {analysis.overallScore >= 80 ? "Excellent Resume!" :
                  analysis.overallScore >= 60 ? "Good Resume Score!" :
                    "Room for Improvement"}
              </h2>
              <p className="text-white/70 mb-4">
                {analysis.overallScore >= 80
                  ? "Your resume shows excellent structure and content with strong potential to impress employers."
                  : analysis.overallScore >= 60
                    ? "Your resume shows strong potential with some areas for improvement. Follow our recommendations below to boost your score."
                    : "Your resume needs significant improvements. Follow our detailed recommendations to enhance your chances."
                }
              </p>

              {analysis.overallScore < 100 && (
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4 mb-6 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-5 w-5 text-blue-400" />
                    <h3 className="font-semibold text-blue-300">Want a Perfect 100/100 Resume?</h3>
                  </div>
                  <p className="text-sm text-blue-200/70 mb-3">
                    Get an AI-optimized version of your resume that would score 100/100 based on your current content.
                  </p>
                  <Button
                    onClick={generateOptimizedResume}
                    disabled={optimizeResumeMutation.isPending}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm border-0 shadow-lg shadow-purple-500/20"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {optimizeResumeMutation.isPending ? "Generating..." : "Generate Perfect Resume"}
                  </Button>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 backdrop-blur-sm transition-all hover:bg-white/10">
                  <div className={`text-xl font-bold ${analysis.scores.formatting >= 80 ? 'text-green-400' : analysis.scores.formatting >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {analysis.scores.formatting}%
                  </div>
                  <div className="text-sm text-white/50 font-medium">Formatting</div>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 backdrop-blur-sm transition-all hover:bg-white/10">
                  <div className={`text-xl font-bold ${analysis.scores.content >= 80 ? 'text-green-400' : analysis.scores.content >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {analysis.scores.content}%
                  </div>
                  <div className="text-sm text-white/50 font-medium">Content</div>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 backdrop-blur-sm transition-all hover:bg-white/10">
                  <div className={`text-xl font-bold ${analysis.scores.keywords >= 80 ? 'text-green-400' : analysis.scores.keywords >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {analysis.scores.keywords}%
                  </div>
                  <div className="text-sm text-white/50 font-medium">Keywords</div>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 backdrop-blur-sm transition-all hover:bg-white/10">
                  <div className={`text-xl font-bold ${analysis.scores.experience >= 80 ? 'text-green-400' : analysis.scores.experience >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {analysis.scores.experience}%
                  </div>
                  <div className="text-sm text-white/50 font-medium">Experience</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <Button
                onClick={downloadReport}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 shadow-lg shadow-purple-500/20 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button
                onClick={shareResults}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Share className="w-4 h-4 mr-2" />
                Share Results
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Feedback */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Strengths */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/20 shadow-inner">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Strengths</h3>
            </div>

            <div className="space-y-4">
              {analysis.strengths.map((strength, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5 border border-green-500/20">
                    <Check className="h-3 w-3 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white/90">{strength.title}</h4>
                    <p className="text-sm text-white/60 mt-1">{strength.description}</p>
                  </div>
                </div>
              ))}
              {analysis.strengths.length === 0 && (
                <p className="text-white/40 text-center py-4 italic">
                  Focus on the recommendations below to build your strengths.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/20 shadow-inner">
                <Lightbulb className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Recommendations</h3>
            </div>

            <div className="space-y-4">
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className="border border-orange-500/20 rounded-xl p-4 bg-orange-500/5 backdrop-blur-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <ArrowUp className="h-3 w-3 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white/90">{rec.title}</h4>
                      <p className="text-sm text-white/60 mt-1 mb-2">{rec.description}</p>
                      {rec.example && (
                        <div className="text-sm text-white/80 bg-black/40 rounded-lg px-3 py-2 border border-white/10 shadow-inner">
                          <strong className="text-purple-300">Example:</strong> {rec.example}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Sections */}
      <div className="mt-8 grid lg:grid-cols-2 gap-8">
        {/* Content Analysis */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Content Analysis</h3>
            <div className="space-y-5">
              {Object.entries(analysis.sectionAnalysis).map(([section, score]) => (
                <div key={section} className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70 capitalize font-medium">
                      {section.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`text-sm font-bold ${score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {score}%
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/5">
                    <div
                      className={`h-full rounded-full ${score >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                        score >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' : 'bg-gradient-to-r from-red-500 to-rose-400'
                        }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ATS Compatibility */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6">ATS Compatibility</h3>
            <div className="space-y-5">
              {analysis.atsCompatibility.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  {item.status === 'success' ? (
                    <CheckCircle className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-bold text-white/90 mb-1">{item.title}</p>
                    <p className="text-xs text-white/60 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center pb-8">
        <Button
          onClick={onNewAnalysis}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-6 rounded-xl border-0 shadow-lg shadow-purple-500/20 font-medium"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Analyze Another Resume
        </Button>
        <Button
          onClick={downloadReport}
          variant="outline"
          className="px-8 py-6 rounded-xl border-white/20 text-white hover:bg-white/10 font-medium"
        >
          <FileText className="w-5 h-5 mr-2" />
          Generate PDF Report
        </Button>
        <Button
          onClick={() => toast({
            title: "Resume Builder",
            description: "Resume builder feature coming soon! Use our analysis to improve your current resume.",
          })}
          variant="outline"
          className="px-8 py-6 rounded-xl border-white/20 text-white hover:bg-white/10 font-medium"
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Resume Builder
        </Button>
      </div>
    </div>
  );
}
