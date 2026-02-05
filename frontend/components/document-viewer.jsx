"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Download, 
    ExternalLink, 
    FileText, 
    FileImage, 
    FileSpreadsheet,
    File,
    ArrowLeft,
    ZoomIn,
    ZoomOut,
    RotateCw
} from 'lucide-react';

const DocumentViewer = ({ filename, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [zoom, setZoom] = useState(100);

    const getFileType = (filename) => {
        const extension = filename.split('.').pop().toLowerCase();
        return extension;
    };

    const getFileIcon = (type) => {
        switch (type) {
            case 'pdf':
                return <FileText className="h-8 w-8 text-red-500" />;
            case 'docx':
                return <FileText className="h-8 w-8 text-blue-500" />;
            case 'xlsx':
                return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
            case 'png':
            case 'jpg':
            case 'jpeg':
                return <FileImage className="h-8 w-8 text-purple-500" />;
            case 'md':
            case 'txt':
                return <FileText className="h-8 w-8 text-gray-500" />;
            default:
                return <File className="h-8 w-8 text-gray-500" />;
        }
    };

    const fileType = getFileType(filename);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `/documents/${filename}`;
        link.download = filename;
        link.click();
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 25, 300));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 25, 50));
    };

    const renderDocument = () => {
        switch (fileType) {
            case 'pdf':
                return (
                    <iframe
                        src={`/documents/${filename}#toolbar=1&navpanes=1&scrollbar=1`}
                        className="w-full h-full border-0"
                        style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                        onLoad={() => setLoading(false)}
                        onError={() => setError('Failed to load PDF')}
                    />
                );
            case 'png':
            case 'jpg':
            case 'jpeg':
                return (
                    <div className="flex items-center justify-center h-full">
                        <img
                            src={`/documents/${filename}`}
                            alt={filename}
                            className="max-w-full max-h-full object-contain"
                            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
                            onLoad={() => setLoading(false)}
                            onError={() => setError('Failed to load image')}
                        />
                    </div>
                );
            case 'md':
            case 'txt':
                return (
                    <div className="h-full overflow-auto p-4">
                        <iframe
                            src={`/documents/${filename}`}
                            className="w-full h-full border-0"
                            onLoad={() => setLoading(false)}
                            onError={() => setError('Failed to load document')}
                        />
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <File className="h-16 w-16 mb-4" />
                        <p className="text-lg mb-2">Document Preview Not Available</p>
                        <p className="text-sm mb-4">This file type cannot be previewed in the browser.</p>
                        <Button onClick={handleDownload} className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Download to View
                        </Button>
                    </div>
                );
        }
    };

    useEffect(() => {
        // Reset zoom when filename changes
        setZoom(100);
        setLoading(true);
        setError(null);
    }, [filename]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-[90vw] h-[90vh] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        {getFileIcon(fileType)}
                        <div>
                            <CardTitle className="text-lg">{filename}</CardTitle>
                            <Badge variant="outline" className="mt-1">
                                {fileType.toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {(fileType === 'pdf' || fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg') && (
                            <>
                                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                                    <ZoomOut className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-medium min-w-[3rem] text-center">
                                    {zoom}%
                                </span>
                                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                                    <ZoomIn className="h-4 w-4" />
                                </Button>
                                <div className="w-px h-6 bg-gray-300 mx-2" />
                            </>
                        )}
                        <Button variant="outline" size="sm" onClick={handleDownload}>
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => window.open(`/documents/${filename}`, '_blank')}>
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                
                <CardContent className="flex-1 p-0 overflow-hidden">
                    {loading && (
                        <div className="flex items-center justify-center h-full">
                            <div className="flex flex-col items-center gap-2">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <p className="text-sm text-gray-500">Loading document...</p>
                            </div>
                        </div>
                    )}
                    
                    {error && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <p className="text-red-500 mb-4">{error}</p>
                                <Button onClick={handleDownload}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Document
                                </Button>
                            </div>
                        </div>
                    )}
                    
                    {!loading && !error && renderDocument()}
                </CardContent>
            </Card>
        </div>
    );
};

export default DocumentViewer;
