"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appsidebar";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import apiService from "@/lib/api";
import { useChat } from "@/hooks/useChat";
import { useChats } from "@/hooks/useChats";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Trash2, Mic, Train, AlertTriangle, Wrench } from "lucide-react";

export default function ChatPage() {
    const [inputValue, setInputValue] = useState("");
    const [isRecording, setIsRecording] = useState(false);

    // Audio recording refs
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const {
        messages,
        isLoading,
        error,
        sendMessage,
        clearMessages,
        loadDepartments,
        checkBackendHealth
    } = useChat();

    const {
        activeChatId,
        updateChatWithMessage,
        getActiveChat
    } = useChats();

    // Load departments and check health on mount
    useEffect(() => {
        loadDepartments();
        checkBackendHealth();
    }, [loadDepartments, checkBackendHealth]);

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

    // Send audio message with transcription using Backend
    const sendAudioMessage = async (audioBlob) => {
        try {
            const data = await apiService.transcribeAudio(audioBlob);
            const transcription = data.text || "Transcription failed";

            // Update chat with the transcribed message
            if (activeChatId) {
                updateChatWithMessage(activeChatId, transcription);
            }

            await sendMessage(transcription);
        } catch (err) {
            console.error('Audio processing failed:', err);

            if (activeChatId) {
                updateChatWithMessage(activeChatId, "Audio message (processing failed)");
            }
            await sendMessage("Audio message (processing failed)");
        }
    };

    // Toggle recording
    const toggleRecording = async () => {
        if (isRecording) {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                mediaRecorderRef.current.stop();
            }
            setIsRecording(false);
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            audioChunksRef.current = [];

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: "audio/webm;codecs=opus",
            });
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: "audio/webm;codecs=opus",
                });
                audioChunksRef.current = [];
                sendAudioMessage(audioBlob);
                stream.getTracks().forEach((track) => track.stop()); // release mic
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Mic access denied:", err);
            setIsRecording(false);
        }
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
                // Map document IDs to actual filenames
                const documentMap = {
                    'financial_invoice_traction_motor': 'fin13.pdf',
                    'incident_report_emergency_brake': 'incident12.pdf',
                    'incident_report_signal_failure': 'incident12.pdf',
                    'maintenance_checklist_weekly_inspection': 'maintenance11.pdf',
                    'maintenance_checklist_malayalam': 'mal1.docx',
                    'maintenance_schedule_monthly': 'inspect6.docx',
                    'incident_report_malayalam': 'mal2.docx',
                    'regulatory_directive_safety': 'regulatory15.pdf',
                    'financial_budget_quarterly': 'fin8.docx',
                    'engineering_blueprint_schematic': 'img1.png',
                    'dataset_summary': 'op1.txt'
                };

                const filename = documentMap[firstSource.document_id] || `${firstSource.document_id}.pdf`;
                const sourceLink = `<div class="mt-3 pt-2 border-t border-gray-200"><a href="/documents/${filename}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"><span>📄</span><span>Source: ${firstSource.document_id}</span></a></div>`;
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
                                        // Map document IDs to actual filenames
                                        const documentMap = {
                                            'financial_invoice_traction_motor': 'fin13.pdf',
                                            'incident_report_emergency_brake': 'incident12.pdf',
                                            'incident_report_signal_failure': 'incident12.pdf',
                                            'maintenance_checklist_weekly_inspection': 'maintenance11.pdf',
                                            'maintenance_checklist_malayalam': 'mal1.docx',
                                            'maintenance_schedule_monthly': 'inspect6.docx',
                                            'incident_report_malayalam': 'mal2.docx',
                                            'regulatory_directive_safety': 'regulatory15.pdf',
                                            'financial_budget_quarterly': 'fin8.docx',
                                            'engineering_blueprint_schematic': 'img1.png',
                                            'dataset_summary': 'op1.txt'
                                        };

                                        const filename = documentMap[doc.document_id] || `${doc.document_id}.pdf`;

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
                                                        <span>Source: {doc.document_id}</span>
                                                    </a>
                                                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                                        {doc.similarity_score?.toFixed(3)}
                                                    </span>
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
            <AppSidebar />
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
                                    AI is thinking...
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Recording indicator */}
                {isRecording && (
                    <div className="w-full px-4 md:px-12 py-2">
                        <div className="bg-red-100 border border-red-200 rounded-lg p-3 text-red-800 text-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                            <span>Recording... Click the microphone again to stop</span>
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

                {/* Input form */}
                <div className="w-full px-4 md:px-12 py-4 border-t">
                    <div className="flex items-center gap-2">
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