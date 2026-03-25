import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { User, TrendingUp, Palette } from "lucide-react";
import type { ResumeAnalysis } from "@/lib/types";

interface UploadSectionProps {
  onAnalysisComplete: (analysis: ResumeAnalysis) => void;
}

const sampleResumes = [
  {
    id: 1,
    title: "Software Engineer",
    description: "5 years experience • Tech industry",
    icon: User,
  },
  {
    id: 2,
    title: "Data Scientist",
    description: "3 years experience • Analytics",
    icon: TrendingUp,
  },
  {
    id: 3,
    title: "UX Designer",
    description: "4 years experience • Design",
    icon: Palette,
  },
];

export function UploadSection({ onAnalysisComplete }: UploadSectionProps) {
  const [uploadError, setUploadError] = useState<string>("");

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await apiRequest("POST", "/api/analyzer/analyze-resume", formData);
      return response.json();
    },
    onSuccess: (analysis: ResumeAnalysis) => {
      setUploadError("");
      onAnalysisComplete(analysis);
    },
    onError: (error: Error) => {
      setUploadError(error.message);
    },
  });

  const sampleMutation = useMutation({
    mutationFn: async (sampleId: number) => {
      const response = await apiRequest("GET", `/api/analyzer/sample-analysis/${sampleId}`);
      return response.json();
    },
    onSuccess: (analysis: ResumeAnalysis) => {
      onAnalysisComplete(analysis);
    },
    onError: (error: Error) => {
      setUploadError(error.message);
    },
  });

  const handleFileSelect = (file: File) => {
    setUploadError("");
    uploadMutation.mutate(file);
  };

  const handleSampleSelect = (sampleId: number) => {
    setUploadError("");
    sampleMutation.mutate(sampleId);
  };

  const isLoading = uploadMutation.isPending || sampleMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 drop-shadow-sm">
          Get Your Resume Score in Seconds
        </h2>
        <p className="text-lg text-white/60 max-w-2xl mx-auto font-medium">
          Upload your CV to receive an instant, AI-driven score out of 100, plus actionable
          feedback to help you land your dream role.
        </p>
      </div>

      <FileUpload
        onFileSelect={handleFileSelect}
        isUploading={isLoading}
        error={uploadError}
      />

      {/* Sample Resume Cards */}
      <div className="mt-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl">
        <h3 className="text-xl font-semibold text-white mb-8 text-center">
          Try with Sample Resumes
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {sampleResumes.map((sample) => {
            const IconComponent = sample.icon;
            return (
              <Card
                key={sample.id}
                className="hover:bg-white/10 transition-colors cursor-pointer bg-white/5 border-white/10 backdrop-blur-md shadow-lg"
                onClick={() => handleSampleSelect(sample.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-white/10 shadow-inner">
                      <IconComponent className="h-6 w-6 text-purple-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white">{sample.title}</h4>
                      <p className="text-sm text-white/50 mt-1">{sample.description}</p>
                      <Button
                        variant="link"
                        className="text-purple-400 p-0 h-auto font-medium mt-3 hover:underline hover:text-purple-300"
                        disabled={isLoading}
                      >
                        Analyze Sample →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
