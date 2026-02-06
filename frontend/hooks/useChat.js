/**
 * Custom hook for managing chat state and API interactions
 */

import { useState, useCallback } from 'react';
import apiService from '@/lib/api';

export function useChat() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState("");
    const [error, setError] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    /**
     * Send a message to the RAG system
     */
    const sendMessage = useCallback(async (content, options = {}) => {
        if (!content.trim()) return;

        const userMessage = {
            id: crypto.randomUUID(),
            type: 'user',
            content: content.trim(),
            timestamp: new Date().toISOString(),
        };

        // Add user message immediately
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);
        setLoadingStatus("Finding the document...");

        // Cycle through status messages
        const statusTimeouts = [];
        statusTimeouts.push(setTimeout(() => setLoadingStatus("We found it. Analyzing content..."), 4000));
        statusTimeouts.push(setTimeout(() => setLoadingStatus("Getting it ready for your question..."), 8000));
        statusTimeouts.push(setTimeout(() => setLoadingStatus("Generating response..."), 12000));

        try {
            // Send to API
            const response = await apiService.sendQuery(content, {
                department: selectedDepartment,
                ...options
            });

            const aiMessage = {
                id: crypto.randomUUID(),
                type: 'assistant',
                content: response.data || response.response || "No response data", // Fallback to data
                timestamp: new Date().toISOString(),
                context: response.sources || response.context || [], // Backend returns sources now in sources field
                searchTime: response.search_time,
                totalDocuments: response.total_documents_searched,
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error('Failed to send message:', err);
            setError(err.message);

            const errorMessage = {
                id: crypto.randomUUID(),
                type: 'error',
                content: `Sorry, I encountered an error: ${err.message}`,
                timestamp: new Date().toISOString(),
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            statusTimeouts.forEach(clearTimeout);
            setIsLoading(false);
            setLoadingStatus("");
        }
    }, [selectedDepartment]);

    /**
     * Clear all messages
     */
    const clearMessages = useCallback(() => {
        setMessages([]);
        setError(null);
    }, []);

    /**
     * Load available departments
     */
    const loadDepartments = useCallback(async () => {
        try {
            const response = await apiService.getDepartments();
            setDepartments(response.departments || []);
        } catch (err) {
            console.error('Failed to load departments:', err);
        }
    }, []);

    /**
     * Check backend health
     */
    const checkBackendHealth = useCallback(async () => {
        try {
            const health = await apiService.checkHealth();
            return health;
        } catch (err) {
            console.error('Backend health check failed:', err);
            return null;
        }
    }, []);

    const [documents, setDocuments] = useState([]);

    /**
     * Load available documents
     */
    const loadDocuments = useCallback(async () => {
        try {
            const response = await apiService.getDocuments();
            setDocuments(response.data.documents || []);
        } catch (err) {
            console.error('Failed to load documents:', err);
        }
    }, []);

    return {
        // State
        messages,
        messages,
        isLoading,
        loadingStatus,
        error,
        departments,
        selectedDepartment,
        documents,

        // Actions
        sendMessage,
        clearMessages,
        loadDepartments,
        checkBackendHealth,
        setSelectedDepartment,
        loadDocuments,
    };
}
