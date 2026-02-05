"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ className, ...props }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (email === "admin@example.com") {
            router.push("/dashboard");
        } else if (email === "user@example.com") {
            router.push("/home/chat");
        } else {
            setMessage("Invalid credentials. Use admin@example.com or user@example.com");
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Welcome back</CardTitle>
                    <CardDescription>
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            {message && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                                    {message}
                                </div>
                            )}
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                >
                                    Sign in
                                </Button>
                                <div className="text-center text-sm">
                                    Don't have an account?{" "}
                                    <Link
                                        href={"/signup"}
                                        className="underline underline-offset-4"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                                <div className="text-center text-sm">
                                    <Link
                                        href={"/forgot"}
                                        className="underline underline-offset-4"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <div className="text-center text-sm text-gray-600">
                                    <p>Demo accounts:</p>
                                    <p>admin@example.com → Dashboard</p>
                                    <p>user@example.com → Chat</p>
                                </div>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}