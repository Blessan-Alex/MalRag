"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appsidebar";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useChat } from "@/hooks/useChat";
import { useChats } from "@/hooks/useChats";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Trash2, Mic, Train, AlertTriangle, Wrench, Paperclip } from "lucide-react";
import { FileUpload } from "@/components/chat/FileUpload";

export default function ChatPage() {
    const [inputValue, setInputValue] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [speechLang, setSpeechLang] = useState("en-US");

    // Speech recognition ref
    const recognitionRef = useRef(null);

    const {
        messages,
        isLoading,
        loadingStatus,
        error,
        sendMessage,
        clearMessages,
        loadDepartments,
        checkBackendHealth,
        loadDocuments,
        documents
    } = useChat();

    const {
        activeChatId,
        updateChatWithMessage,
        getActiveChat
    } = useChats();

    // Load departments, documents and check health on mount
    useEffect(() => {
        loadDepartments();
        loadDocuments();
        checkBackendHealth();
    }, [loadDepartments, loadDocuments, checkBackendHealth]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const message = inputValue.trim();
        setInputValue("");

        // Update chat with the new message
        if (activeChatId) {
            updateChatWithMessage(activeChatId, message);
        }

        await sendMessage(message);
    };

    // Toggle speech recognition using Web Speech API
    const toggleRecording = () => {
        if (isRecording) {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            setIsRecording(false);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = speechLang;
        recognition.interimResults = true;
        recognition.continuous = true;
        recognitionRef.current = recognition;

        recognition.onresult = (event) => {
            let transcript = "";
            for (let i = 0; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            setInputValue(transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsRecording(false);
            if (event.error === "network") {
                alert("Speech recognition requires an internet connection. Please check your network and try again.");
            } else if (event.error === "not-allowed") {
                alert("Microphone access was denied. Please allow microphone access in your browser settings.");
            }
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognition.start();
        setIsRecording(true);
    };

    const handleUploadComplete = (filename) => {
        // Refresh documents list
        loadDocuments();

        // Optional: Close uploader after a delay or keep open for user to see success message
        // For now, we keep it open so they see the success message
        // setShowUpload(false); 
    };


    const MessageBubble = ({ message }) => {
        const isUser = message.type === 'user';
        const isError = message.type === 'error';

        // Enhanced formatting function for AI messages
        const formatMessage = (content, sources = []) => {
            if (isUser) return content; // Don't format user messages
            if (!content) return ""; // Handle missing content

            let formattedContent = content
                // Handle headers
                .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-3 mb-2 text-gray-800">$1</h3>')
                .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-3 text-gray-900">$1</h2>')
                .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-5 mb-4 text-gray-900">$1</h1>')
                // Handle bold and italic
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
                .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
                // Handle bullet points
                .replace(/^[\s]*[\*\-\+] (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
                // Handle numbered lists
                .replace(/^[\s]*\d+\. (.*$)/gim, '<li class="ml-4 mb-1 list-decimal">$1</li>')
                // Handle paragraphs
                .replace(/\n\n/g, '</p><p class="mb-3 leading-relaxed">')
                // Handle line breaks
                .replace(/\n/g, '<br/>');

            // Add first source as a clickable link at the end of the content
            if (sources && sources.length > 0) {
                const firstSource = sources[0];
                let filename = `${firstSource.document_id}.pdf`;

                // Try to find filename from documents list if available
                if (firstSource.full_doc_id && documents.length > 0) {
                    const doc = documents.find(d => d.doc_id === firstSource.full_doc_id);
                    if (doc) filename = doc.filename;
                } else if (firstSource.document_id) {
                    // Fallback: try to match by ID or just show ID
                    // Note: malrag currently returns 'full_doc_id' which matches our 'doc_id'
                    const doc = documents.find(d => d.doc_id === firstSource.full_doc_id || d.id === firstSource.full_doc_id);
                    if (doc) filename = doc.filename;
                }

                const sourceLink = `<div class="mt-3 pt-2 border-t border-gray-200"><a href="/documents/${filename}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"><span>📄</span><span>Source: ${filename}</span></a></div>`;
                formattedContent += sourceLink;
            }

            return formattedContent;
        };

        return (
            <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
                <div className={`max-w-[85%] rounded-xl p-5 shadow-sm ${isUser
                    ? 'bg-primary text-white'
                    : isError
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-white border border-gray-200'
                    }`}>
                    {isUser ? (
                        <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                    ) : (
                        <div
                            className="prose prose-sm max-w-none text-gray-800"
                            dangerouslySetInnerHTML={{
                                __html: `<div class="leading-relaxed">${formatMessage(message.content, message.context)}</div>`
                            }}
                        />
                    )}

                    {message.context && message.context.length > 1 && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                            <details className="text-xs">
                                <summary className="cursor-pointer font-medium text-gray-600 hover:text-gray-800 flex items-center gap-1">
                                    <span>📚</span>
                                    <span>Additional Sources ({message.context.length - 1})</span>
                                </summary>
                                <div className="mt-3 space-y-2">
                                    {message.context.slice(1, 6).map((doc, idx) => {
                                        let filename = `${doc.document_id}.pdf`;
                                        if (doc.full_doc_id) {
                                            const d = documents.find(x => x.doc_id === doc.full_doc_id);
                                            if (d) filename = d.filename;
                                        }

                                        return (
                                            <div key={idx + 1} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                                <div className="flex items-center justify-between">
                                                    <a
                                                        href={`/documents/${filename}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="font-medium text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 transition-colors"
                                                    >
                                                        <span>📄</span>
                                                        <span>Source: {filename}</span>
                                                    </a>
                                                    {doc.similarity_score && (
                                                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                                            {doc.similarity_score?.toFixed(3)}
                                                        </span>
                                                    )}
                                                </div>
                                                {doc.department && (
                                                    <div className="text-xs text-gray-600 mt-1">
                                                        Department: {doc.department}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </details>
                        </div>
                    )}

                    <div className="text-xs text-gray-500 mt-3 flex items-center gap-2">
                        <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                        {message.searchTime && (
                            <span>• {message.searchTime.toFixed(2)}s</span>
                        )}
                        {message.totalDocuments && (
                            <span>• {message.totalDocuments} docs</span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <SidebarProvider>
            <AppSidebar documents={documents} />
            <SidebarTrigger />
            <div className="h-screen w-full flex flex-col items-center justify-between min-h-0 overflow-hidden">
                {/* Header with clear button */}
                <div className="w-full px-4 md:px-12 pt-4 pb-2 border-b">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-semibold">Chat with Metro Link AI</h1>
                            {getActiveChat() && (
                                <p className="text-sm text-muted-foreground">
                                    {getActiveChat().title} • {getActiveChat().messageCount} messages
                                </p>
                            )}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearMessages}
                            disabled={messages.length === 0}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear Chat
                        </Button>
                    </div>
                </div>

                {/* Messages area */}
                <ScrollArea className="flex-1 w-full overflow-y-auto px-4 md:px-12 py-4">
                    <div className="mx-auto w-full max-w-3xl space-y-4">
                        {messages.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Metro Link AI</h3>
                                    <p className="text-gray-600 text-lg">Ask me anything about metro systems, safety protocols, or operational procedures.</p>
                                </div>

                                <div className="space-y-3 max-w-2xl mx-auto">
                                    <p className="text-sm font-medium text-gray-700 mb-4">Try these suggestions:</p>
                                    <div className="grid gap-3">
                                        <button
                                            onClick={() => setInputValue("What are the safety procedures for train maintenance?")}
                                            className="text-left p-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-sm group"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-800 transition-colors">
                                                    <Train className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-1">Train Maintenance Safety</h4>
                                                    <p className="text-sm text-gray-600">What are the safety procedures for train maintenance?</p>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setInputValue("How do I report a signal failure incident?")}
                                            className="text-left p-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-sm group"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-800 transition-colors">
                                                    <AlertTriangle className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-1">Incident Reporting</h4>
                                                    <p className="text-sm text-gray-600">How do I report a signal failure incident?</p>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setInputValue("മെയിൻ്റനൻസ് രേഖകൾ എന്തെലാം ?")}
                                            className="text-left p-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-sm group"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-800 transition-colors">
                                                    <Wrench className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-1">Maintenance Documents</h4>
                                                    <p className="text-sm text-gray-600">മെയിൻ്റനൻസ് രേഖകൾ എന്തെലാം ?</p>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <MessageBubble key={message.id} message={message} />
                            ))
                        )}

                        {isLoading && (
                            <div className="flex justify-start mb-4">
                                <div className="bg-muted rounded-lg p-3 text-sm flex items-center">
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    {loadingStatus || "AI is thinking..."}
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Recording indicator */}
                {isRecording && (
                    <div className="w-full px-4 md:px-12 py-2">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800 text-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                            <span>Listening... Speak now. Click mic to stop.</span>
                        </div>
                    </div>
                )}

                {/* Error display */}
                {error && (
                    <div className="w-full px-4 md:px-12 py-2">
                        <div className="bg-red-100 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
                            <strong>Connection Error:</strong> {error}
                        </div>
                    </div>
                )}

                {/* File Upload Area */}
                {showUpload && (
                    <div className="w-full px-4 md:px-12 py-2">
                        <div className="bg-white border rounded-lg p-3 shadow-sm relative">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2 h-6 w-6 p-0"
                                onClick={() => setShowUpload(false)}
                            >
                                <span className="sr-only">Close</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </Button>
                            <FileUpload onUploadComplete={handleUploadComplete} />
                        </div>
                    </div>
                )}

                {/* Input form */}
                <div className="w-full px-4 md:px-12 py-4 border-t">
                    <div className="flex items-center gap-2">
                        {/* Upload Button */}
                        <Button
                            type="button"
                            onClick={() => setShowUpload(!showUpload)}
                            variant={showUpload ? "secondary" : "outline"}
                            size="sm"
                            className="hover:bg-gray-100"
                        >
                            <Paperclip className="h-4 w-4" />
                        </Button>

                        {/* Language selector for speech */}
                        <select
                            value={speechLang}
                            onChange={(e) => setSpeechLang(e.target.value)}
                            className="h-9 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                            title="Speech language"
                        >
                            <option value="en-US">EN</option>
                            <option value="ml-IN">ML</option>
                            <option value="hi-IN">HI</option>
                            <option value="ta-IN">TA</option>
                            <option value="ar-SA">AR</option>
                        </select>

                        {/* Microphone button */}
                        <Button
                            type="button"
                            onClick={toggleRecording}
                            variant={isRecording ? "destructive" : "outline"}
                            size="sm"
                            className={`transition-all ${isRecording
                                ? "bg-red-500 text-white animate-pulse"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            <Mic className="h-4 w-4" />
                        </Button>

                        {/* Text input */}
                        <Input
                            type="text"
                            placeholder="Ask a question about metro operations..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isLoading}
                            className="flex-1"
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                        />

                        {/* Send button */}
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!inputValue.trim() || isLoading}
                            size="sm"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}