"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import DocumentViewer from "@/components/document-viewer";
import { 
    FileText, 
    FileImage, 
    FileSpreadsheet, 
    File, 
    Download, 
    Eye,
    Calendar,
    FolderOpen
} from "lucide-react";

export default function DocumentsPage() {
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [viewingDocument, setViewingDocument] = useState(null);

    // Real documents from the embedded collection
    const documents = [
        {
            id: "financial_invoice_traction_motor",
            name: "Financial Invoice - Traction Motor",
            filename: "fin13.pdf",
            type: "pdf",
            category: "Financial",
            description: "Invoice for traction motor services and maintenance",
            uploaded: "2025-01-15",
            size: "2.3 MB"
        },
        {
            id: "incident_report_emergency_brake",
            name: "Incident Report - Emergency Brake",
            filename: "incident12.pdf",
            type: "pdf",
            category: "Safety",
            description: "Detailed incident report for emergency brake failure",
            uploaded: "2025-01-14",
            size: "1.8 MB"
        },
        {
            id: "incident_report_signal_failure",
            name: "Incident Report - Signal Failure",
            filename: "incident12.pdf",
            type: "pdf",
            category: "Safety",
            description: "Signal system failure incident documentation",
            uploaded: "2025-01-13",
            size: "2.1 MB"
        },
        {
            id: "maintenance_checklist_weekly_inspection",
            name: "Maintenance Checklist - Weekly Inspection",
            filename: "maintenance11.pdf",
            type: "pdf",
            category: "Maintenance",
            description: "Weekly inspection checklist for metro systems",
            uploaded: "2025-01-12",
            size: "1.5 MB"
        },
        {
            id: "maintenance_checklist_malayalam",
            name: "Maintenance Checklist (Malayalam)",
            filename: "mal1.docx",
            type: "docx",
            category: "Maintenance",
            description: "Maintenance procedures in Malayalam language",
            uploaded: "2025-01-11",
            size: "1.9 MB"
        },
        {
            id: "maintenance_schedule_monthly",
            name: "Maintenance Schedule - Monthly",
            filename: "inspect6.docx",
            type: "docx",
            category: "Maintenance",
            description: "Monthly maintenance schedule and procedures",
            uploaded: "2025-01-10",
            size: "2.4 MB"
        },
        {
            id: "incident_report_malayalam",
            name: "Incident Report (Malayalam)",
            filename: "mal2.docx",
            type: "docx",
            category: "Safety",
            description: "Incident reporting template in Malayalam",
            uploaded: "2025-01-09",
            size: "1.7 MB"
        },
        {
            id: "regulatory_directive_safety",
            name: "Regulatory Directive - Safety",
            filename: "regulatory15.pdf",
            type: "pdf",
            category: "Regulatory",
            description: "Safety regulations and compliance directives",
            uploaded: "2025-01-08",
            size: "3.2 MB"
        },
        {
            id: "financial_budget_quarterly",
            name: "Financial Budget - Quarterly",
            filename: "fin8.docx",
            type: "docx",
            category: "Financial",
            description: "Quarterly budget allocation and expenses",
            uploaded: "2025-01-07",
            size: "1.2 MB"
        },
        {
            id: "engineering_blueprint_schematic",
            name: "Engineering Blueprint Schematic",
            filename: "img1.png",
            type: "png",
            category: "Engineering",
            description: "Technical blueprint and system schematic",
            uploaded: "2025-01-06",
            size: "4.1 MB"
        },
        {
            id: "dataset_summary",
            name: "Dataset Summary",
            filename: "op1.txt",
            type: "txt",
            category: "Documentation",
            description: "Summary of embedded documents and metadata",
            uploaded: "2025-01-05",
            size: "0.8 MB"
        }
    ];

    const getFileIcon = (type) => {
        switch (type) {
            case 'pdf':
                return <FileText className="h-5 w-5 text-red-500" />;
            case 'docx':
                return <FileText className="h-5 w-5 text-blue-500" />;
            case 'xlsx':
                return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
            case 'png':
            case 'jpg':
            case 'jpeg':
                return <FileImage className="h-5 w-5 text-purple-500" />;
            case 'md':
            case 'txt':
                return <FileText className="h-5 w-5 text-gray-500" />;
            default:
                return <File className="h-5 w-5 text-gray-500" />;
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Safety':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'Maintenance':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Financial':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Regulatory':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Engineering':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Documentation':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleDocumentSelect = (documentId) => {
        setSelectedDocuments(prev => 
            prev.includes(documentId) 
                ? prev.filter(id => id !== documentId)
                : [...prev, documentId]
        );
    };

    const handleSelectAll = () => {
        setSelectedDocuments(
            selectedDocuments.length === documents.length 
                ? [] 
                : documents.map(doc => doc.id)
        );
    };

    const handleViewDocument = (filename) => {
        setViewingDocument(filename);
    };

    const handleDownloadDocument = (filename) => {
        const link = document.createElement('a');
        link.href = `/documents/${filename}`;
        link.download = filename;
        link.click();
    };

    const selectedCount = selectedDocuments.length;

    return (
        <div className="h-screen w-full flex flex-col pt-16">
            <div className="h-full w-full flex flex-col px-6 md:px-16 py-4">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                    <div>
                        <h1 className="text-3xl font-sans font-bold flex items-center gap-3">
                            <FolderOpen className="h-8 w-8 text-gray-900" />
                            EMBEDDED DOCUMENTS
                        </h1>
                        <p className="text-md mt-4">
                            AI-powered document collection for metro operations, maintenance, and safety protocols.
                            <br />
                            <span className="text-sm text-gray-600">
                                {documents.length} documents available • {selectedCount} selected
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            onClick={handleSelectAll}
                            className="flex items-center gap-2"
                        >
                            {selectedCount === documents.length ? 'Deselect All' : 'Select All'}
                        </Button>
                        <Button className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Download Selected ({selectedCount})
                        </Button>
                    </div>
                </div>

                {/* System Explanation Section */}
                <div className="mb-6 p-6 bg-white border border-gray-200 rounded-xl">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                How Metro Link Processes Documents
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                <strong>Metro Link</strong> automatically collects all documents from Kochi Metro's data sources and intelligently processes them through advanced AI preprocessing and embedding techniques. When you query the system, it performs similarity search across the entire document collection to provide you with quick, instant, and relevant actions.
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                    Data Source Integration
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                    AI Preprocessing
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                    Smart Embedding
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                    Instant Results
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Document Grid */}
                <ScrollArea className="h-[70vh] w-full border-2 rounded-3xl p-4 z-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {documents.map((doc) => (
                            <Card key={doc.id} className={`w-full transition-all duration-200 hover:shadow-md ${
                                selectedDocuments.includes(doc.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                            }`}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <Checkbox
                                                checked={selectedDocuments.includes(doc.id)}
                                                onCheckedChange={() => handleDocumentSelect(doc.id)}
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                                    {getFileIcon(doc.type)}
                                                    <span className="truncate">{doc.name}</span>
                                                </CardTitle>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge className={getCategoryColor(doc.category)}>
                                                        {doc.category}
                                                    </Badge>
                                                    <span className="text-xs text-gray-500">{doc.type.toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="pt-0">
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {doc.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>{doc.uploaded}</span>
                                        </div>
                                        <span>{doc.size}</span>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewDocument(doc.filename)}
                                            className="flex-1 flex items-center gap-1"
                                        >
                                            <Eye className="h-3 w-3" />
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDownloadDocument(doc.filename)}
                                            className="flex-1 flex items-center gap-1"
                                        >
                                            <Download className="h-3 w-3" />
                                            Download
                                        </Button>
                                    </div>
                                    </CardContent>
                                </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>
            
            {/* Document Viewer Modal */}
            {viewingDocument && (
                <DocumentViewer 
                    filename={viewingDocument} 
                    onClose={() => setViewingDocument(null)} 
                />
            )}
        </div>
    );
}