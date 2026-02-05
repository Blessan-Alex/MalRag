"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUpload } from "./FileUpload";
import ReactMarkdown from 'react-markdown';

export default function ChatInterface() {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hello! I am your RAG assistant powered by Gemini and MalRag. Upload a file to get started or ask me anything." }
    ]);
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const scrollRef = useRef(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, showUpload]);

    const handleSendMessage = async () => {
        if (!query.trim()) return;

        const userMsg = { role: "user", content: query };
        setMessages(prev => [...prev, userMsg]);
        setQuery("");
        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:8000/api/v1/chat/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: userMsg.content, mode: "hybrid" }),
            });

            const data = await res.json();
            const aiMsg = {
                role: "assistant",
                content: data.data || "I couldn't generate a response."
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { role: "assistant", content: "Error communicating with backend." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadComplete = (filename) => {
        setMessages(prev => [...prev, { role: "assistant", content: `**System:** File \`${filename}\` successfully ingested. I can now answer questions about it.` }]);
        setShowUpload(false); // Hide upload after done, or keep it? User might want to see history. keeping simpler.
    };

    return (
        <div className="flex flex-col h-screen max-h-screen bg-gray-50">
            <header className="bg-white border-b p-4 flex items-center justify-between">
                <h1 className="font-bold text-xl flex items-center gap-2">
                    <Bot className="text-blue-600" />
                    MalRag Chat
                </h1>
            </header>

            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="max-w-3xl mx-auto space-y-6 pb-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-5 h-5 text-blue-600" />
                                </div>
                            )}
                            <div className={`p-4 rounded-2xl max-w-[80%] shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border text-gray-800 rounded-bl-none'}`}>
                                {msg.role === 'assistant' ? (
                                    <div className="prose prose-sm max-w-none dark:prose-invert">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <p>{msg.content}</p>
                                )}
                            </div>
                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-gray-600" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="bg-white border p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}

                    {showUpload && (
                        <div className="max-w-md mx-auto">
                            <FileUpload onUploadComplete={handleUploadComplete} />
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 bg-white border-t">
                <div className="max-w-3xl mx-auto flex gap-2">
                    <Button variant="outline" onClick={() => setShowUpload(!showUpload)} className={showUpload ? "bg-gray-100 flex gap-2" : "flex gap-2"}>
                        <Paperclip className="w-5 h-5 text-gray-700" />
                        <span className="hidden sm:inline">Upload</span>
                    </Button>
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask about your documents..."
                        className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading || !query.trim()}>
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
