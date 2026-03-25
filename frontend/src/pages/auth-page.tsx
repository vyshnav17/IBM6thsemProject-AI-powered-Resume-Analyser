import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, InsertUser } from "@shared/schema";
import { useLocation } from "wouter";
import { Sparkles, Loader2 } from "lucide-react";

export default function AuthPage() {
    const { user, loginMutation, registerMutation } = useAuth();
    const [, setLocation] = useLocation();

    if (user) {
        setLocation("/");
        return null;
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-[#09090b] text-white overflow-hidden relative">
            {/* Global Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="flex items-center justify-center p-8 z-10 relative">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl z-0 lg:hidden" />
                <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl shadow-purple-500/10 z-10 text-white">
                    <CardHeader>
                        <CardTitle className="text-2xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
                            Welcome to CV AI Insights
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="login" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/5">
                                <TabsTrigger value="login" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60">Login</TabsTrigger>
                                <TabsTrigger value="register" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60">Register</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login" className="mt-4">
                                <LoginForm />
                            </TabsContent>

                            <TabsContent value="register" className="mt-4">
                                <RegisterForm />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            <div className="hidden lg:flex flex-col justify-center p-12 bg-white/5 backdrop-blur-lg border-l border-white/10 z-10 relative">
                <div className="max-w-lg mx-auto">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-purple-500/20 border border-white/20">
                        <Sparkles className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 leading-tight">
                        Land your dream job with AI-powered resume analysis.
                    </h1>
                    <p className="text-xl text-white/50 leading-relaxed font-light">
                        Upload your CV and get instant feedback on your scores, strengths,
                        and tailored recommendations to stand out from the crowd.
                    </p>
                    <div className="mt-12 grid grid-cols-2 gap-8">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                            <div className="text-3xl font-bold mb-1 text-white">100/100</div>
                            <div className="text-white/40 text-sm">ATS Optimized</div>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                            <div className="text-3xl font-bold mb-1 text-white">Groq AI</div>
                            <div className="text-white/40 text-sm">Lightning Fast</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoginForm() {
    const { loginMutation } = useAuth();
    const form = useForm<InsertUser>({
        resolver: zodResolver(insertUserSchema),
        defaultValues: { username: "", password: "" },
    });

    return (
        <form
            className="space-y-5"
            onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))}
        >
            <div className="space-y-2">
                <Label htmlFor="username" className="text-white/70">Username</Label>
                <Input
                    id="username"
                    className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-purple-500"
                    {...form.register("username")}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password" className="text-white/70">Password</Label>
                <Input
                    id="password"
                    type="password"
                    className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-purple-500"
                    {...form.register("password")}
                    required
                />
            </div>
            <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg shadow-purple-500/20 border-0"
                disabled={loginMutation.isPending}
            >
                {loginMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Login
            </Button>
        </form>
    );
}

function RegisterForm() {
    const { registerMutation } = useAuth();
    const form = useForm<InsertUser>({
        resolver: zodResolver(insertUserSchema),
        defaultValues: { username: "", password: "" },
    });

    return (
        <form
            className="space-y-5"
            onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))}
        >
            <div className="space-y-2">
                <Label htmlFor="reg-username" className="text-white/70">Username</Label>
                <Input
                    id="reg-username"
                    className="bg-black/20 border-white/10 text-white focus-visible:ring-purple-500"
                    {...form.register("username")}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="reg-password" className="text-white/70">Password</Label>
                <Input
                    id="reg-password"
                    type="password"
                    className="bg-black/20 border-white/10 text-white focus-visible:ring-purple-500"
                    {...form.register("password")}
                    required
                />
            </div>
            <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg shadow-purple-500/20 border-0"
                disabled={registerMutation.isPending}
            >
                {registerMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Register
            </Button>
        </form>
    );
}
