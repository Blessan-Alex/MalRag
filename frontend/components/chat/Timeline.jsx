"use client";

import React from "react";
import { CheckCircle, Circle, Loader2 } from "lucide-react";

export const Timeline = ({ status, step, progress }) => {
    const steps = [
        { id: "uploaded", label: "Uploaded" },
        { id: "extracting_text", label: "Extracting Text" },
        { id: "chunking", label: "Chunking" },
        { id: "embedding", label: "Embedding (Vyakarth)" },
        { id: "indexing", label: "Indexing" },
        { id: "ready", label: "Ready" }
    ];

    // Helper to determine step state
    const getStepState = (stepId, currentStep) => {
        const stepIds = steps.map(s => s.id);
        const currentIndex = stepIds.indexOf(currentStep);
        const stepIndex = stepIds.indexOf(stepId);

        if (stepIndex < currentIndex) return "completed";
        if (stepIndex === currentIndex) return "current";
        return "pending";
    };

    return (
        <div className="w-full py-4 px-2">
            <div className="flex flex-col space-y-4">
                {steps.map((s, index) => {
                    const state = getStepState(s.id, step);
                    return (
                        <div key={s.id} className="flex items-center gap-3 relative">
                            {/* Vertical Line */}
                            {index !== steps.length - 1 && (
                                <div className={`absolute left-3 top-6 w-0.5 h-6 ${state === 'completed' ? 'bg-green-500' : 'bg-gray-200'}`} />
                            )}

                            <div className="z-10 bg-white">
                                {state === "completed" && <CheckCircle className="w-6 h-6 text-green-500" />}
                                {state === "current" && <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />}
                                {state === "pending" && <Circle className="w-6 h-6 text-gray-300" />}
                            </div>

                            <div className="flex-1">
                                <span className={`text-sm font-medium ${state === 'current' ? 'text-blue-600' : state === 'completed' ? 'text-green-600' : 'text-gray-500'}`}>
                                    {s.label}
                                </span>
                                {state === "current" && (
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                        <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
