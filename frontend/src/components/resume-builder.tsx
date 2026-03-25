import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Save, Plus, Trash2, Layout, FileText, Download, History as HistoryIcon, Loader2 } from "lucide-react";
import type { ResumeAnalysis } from "@/lib/types";

interface ResumeContent {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  skills: string[];
}

export function ResumeBuilder({ initialAnalysis }: { initialAnalysis?: ResumeAnalysis | null }) {
  const { toast } = useToast();
  const [resume, setResume] = useState<ResumeContent>({
    personalInfo: { fullName: "", email: "", phone: "", location: "" },
    summary: "",
    experience: [{ company: "", position: "", duration: "", description: "" }],
    skills: []
  });

  useEffect(() => {
    if (initialAnalysis && initialAnalysis.optimizedResume) {
      setResume(prev => ({
        ...prev,
        summary: initialAnalysis.optimizedResume.substring(0, 1000), // Quick fill
        personalInfo: {
          ...prev.personalInfo,
          fullName: initialAnalysis.fileName?.split(".")[0] || ""
        }
      }));
    }
  }, [initialAnalysis]);
  const [draftId, setDraftId] = useState<string | null>(null);

  const { data: drafts, isLoading: isHistoryLoading } = useQuery<any[]>({
    queryKey: ["/api/builder/history"],
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/builder/draft", { ...data, id: draftId });
    },
    onSuccess: (savedDraft: any) => {
      setDraftId(savedDraft._id);
      toast({ title: "Draft Saved", description: "Your resume draft has been successfully saved to the cloud." });
      queryClient.invalidateQueries({ queryKey: ["/api/builder/history"] });
    },
    onError: (error: Error) => {
      toast({ title: "Save Failed", description: error.message, variant: "destructive" });
    }
  });

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value }
    }));
  };

  const addExperience = () => {
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, { company: "", position: "", duration: "", description: "" }]
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const nextExp = [...resume.experience];
    nextExp[index] = { ...nextExp[index], [field]: value };
    setResume(prev => ({ ...prev, experience: nextExp }));
  };

  const removeExperience = (index: number) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const downloadPDF = async () => {
    try {
      // First save the current state
      await saveMutation.mutateAsync({ 
        title: resume.personalInfo.fullName || "Untitled Resume", 
        content: resume 
      });

      // Then trigger download
      const response = await apiRequest("POST", "/api/reports/download-builder-resume", {
        content: resume,
        title: resume.personalInfo.fullName || "resume"
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${(resume.personalInfo.fullName || "resume").replace(/\s+/g, "_")}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error: any) {
      toast({ title: "Download Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleLoadDraft = (draft: any) => {
    setResume(draft.content);
    setDraftId(draft._id);
    toast({ title: "Draft Loaded", description: `Loaded "${draft.title}" from your history.` });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/builder/draft/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Draft Deleted", description: "The resume draft has been removed." });
      queryClient.invalidateQueries({ queryKey: ["/api/builder/history"] });
      if (draftId) setDraftId(null);
    }
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-20">
      {/* Sidebar: History */}
      <div className="w-full lg:w-72 space-y-4 order-2 lg:order-1">
        <h3 className="text-xl font-bold text-white flex items-center px-2">
          <HistoryIcon className="w-5 h-5 mr-2 text-purple-400" />
          Saved Drafts
        </h3>
        <div className="space-y-3">
          {isHistoryLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-white/20" />
            </div>
          ) : drafts?.length === 0 ? (
            <p className="text-sm text-white/40 px-2">No saved drafts yet.</p>
          ) : (
            drafts?.map((draft) => (
              <div 
                key={draft._id} 
                className={`group p-4 bg-white/5 border rounded-2xl cursor-pointer transition-all hover:bg-white/10 ${draftId === draft._id ? 'border-purple-500/50 bg-white/10' : 'border-white/10'}`}
                onClick={() => handleLoadDraft(draft)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-medium text-white truncate">{draft.title}</h4>
                    <p className="text-xs text-white/40 mt-1">
                      {new Date(draft.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-red-400"
                    onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(draft._id); }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 space-y-8 max-w-4xl mx-auto order-1 lg:order-2">
        <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
          <div>
            <h2 className="text-3xl font-bold text-white">
              {draftId ? "Edit Resume" : "Resume Builder"}
            </h2>
            <p className="text-white/50">Create your professional resume with real-time editing</p>
          </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => saveMutation.mutate({ title: resume.personalInfo.fullName || "Untitled Resume", content: resume })}
            disabled={saveMutation.isPending}
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save Draft"}
          </Button>

          <Button 
            onClick={downloadPDF}
            disabled={saveMutation.isPending}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg shadow-purple-500/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-8">
        {/* Personal Info */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center text-white">
              <Layout className="w-5 h-5 mr-2 text-purple-400" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white/70">Full Name</Label>
              <Input name="fullName" value={resume.personalInfo.fullName} onChange={handlePersonalInfoChange} className="bg-white/5 border-white/10 text-white focus:ring-purple-500" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70">Email Address</Label>
              <Input name="email" value={resume.personalInfo.email} onChange={handlePersonalInfoChange} className="bg-white/5 border-white/10 text-white focus:ring-purple-500" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white/70">Phone Number</Label>
              <Input name="phone" value={resume.personalInfo.phone} onChange={handlePersonalInfoChange} className="bg-white/5 border-white/10 text-white focus:ring-purple-500" placeholder="+1 (555) 000-0000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-white/70">Location</Label>
              <Input name="location" value={resume.personalInfo.location} onChange={handlePersonalInfoChange} className="bg-white/5 border-white/10 text-white focus:ring-purple-500" placeholder="New York, NY" />
            </div>
          </CardContent>
        </Card>

        {/* Professional Summary */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center text-white">
              <FileText className="w-5 h-5 mr-2 text-blue-400" />
              Professional Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              value={resume.summary} 
              onChange={(e) => setResume(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Tell your professional story..."
              className="min-h-[120px] bg-white/5 border-white/10 text-white focus:ring-purple-500"
            />
          </CardContent>
        </Card>

        {/* Experience */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Plus className="w-5 h-5 mr-2 text-green-400" />
              Work Experience
            </h3>
            <Button onClick={addExperience} variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
              Add Position
            </Button>
          </div>
          
          {resume.experience.map((exp, idx) => (
            <Card key={idx} className="bg-white/5 border-white/10 backdrop-blur-xl group relative">
              <CardContent className="p-6 space-y-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeExperience(idx)}
                  className="absolute top-4 right-4 text-white/50 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white/60">Company</Label>
                    <Input value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/60">Position</Label>
                    <Input value={exp.position} onChange={(e) => updateExperience(idx, 'position', e.target.value)} className="bg-white/5 border-white/10 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60">Duration (e.g., 2020 - Present)</Label>
                  <Input value={exp.duration} onChange={(e) => updateExperience(idx, 'duration', e.target.value)} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60">Job Description</Label>
                  <Textarea value={exp.description} onChange={(e) => updateExperience(idx, 'description', e.target.value)} className="min-h-[100px] bg-white/5 border-white/10 text-white" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
