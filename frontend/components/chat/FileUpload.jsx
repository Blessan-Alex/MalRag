"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Timeline } from "./Timeline";

export const FileUpload = ({ onUploadComplete }) => {
    const [file, setFile] = useState(null);
    const [jobId, setJobId] = useState(null);
    const [jobStatus, setJobStatus] = useState(null); // { status, step, progress, message }
    const fileInputRef = useRef(null);
    const pollInterval = useRef(null);

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const uploadFile = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://localhost:8000/api/v1/ingest/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            setJobId(data.job_id);
            setJobStatus({ status: "processing", step: "uploaded", progress: 0, message: "Uploaded" });
        } catch (error) {
            console.error(error);
            setJobStatus({ status: "failed", message: "Upload failed" });
        }
    };

    useEffect(() => {
        if (jobId && jobStatus?.status !== "completed" && jobStatus?.status !== "failed") {
            pollInterval.current = setInterval(async () => {
                try {
                    const res = await fetch(`http://localhost:8000/api/v1/ingest/status/${jobId}`);
                    const data = await res.json();

                    if (data.data) {
                        setJobStatus(data.data);
                        if (data.data.status === "completed") {
                            clearInterval(pollInterval.current);
                            onUploadComplete(file.name);
                        }
                        if (data.data.status === "failed") {
                            clearInterval(pollInterval.current);
                        }
                    }
                } catch (e) {
                    console.error("Polling error", e);
                }
            }, 1000);
        }

        return () => clearInterval(pollInterval.current);
    }, [jobId, jobStatus?.status]);

    if (jobId) {
        return (
            <div className="border rounded-lg p-4 bg-gray-50 mt-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-sm">Processing {file.name}</h3>
                    {jobStatus?.status === 'completed' && <span className="text-green-600 text-xs font-bold">DONE</span>}
                </div>
                <Timeline status={jobStatus?.status} step={jobStatus?.step} progress={jobStatus?.progress} />
                <p className="text-xs text-gray-500 mt-2">{jobStatus?.message}</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2 mt-2">
            {!file ? (
                <div
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload document for RAG</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, TXT, DOCX, JSON</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                        accept=".txt,.pdf,.doc,.docx,.json,.md"
                    />
                </div>
            ) : (
                <div className="flex items-center gap-2 bg-white border p-2 rounded-lg">
                    <File className="w-4 h-4 text-blue-500" />
                    <span className="text-sm flex-1 truncate">{file.name}</span>
                    <Button size="sm" onClick={uploadFile}>Start Processing</Button>
                    <Button size="icon" variant="ghost" onClick={() => setFile(null)}><X className="w-4 h-4" /></Button>
                </div>
            )}
        </div>
    );
};
