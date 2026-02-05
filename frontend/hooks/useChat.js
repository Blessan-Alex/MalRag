/**
 * Custom hook for managing chat state and API interactions
 */

import { useState, useCallback } from 'react';
import apiService from '@/lib/api';

export function useChat() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    /**
     * Send a message to the RAG system
     */
    const sendMessage = useCallback(async (content, options = {}) => {
        if (!content.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: content.trim(),
            timestamp: new Date().toISOString(),
        };

        // Add user message immediately
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            // Send to API
            const response = await apiService.sendQuery(content, {
                department: selectedDepartment,
                ...options
            });

            const aiMessage = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: response.response,
                timestamp: new Date().toISOString(),
                context: response.context_documents,
                searchTime: response.search_time,
                totalDocuments: response.total_documents_searched,
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error('Failed to send message:', err);
            setError(err.message);
            
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                type: 'error',
                content: `Sorry, I encountered an error: ${err.message}`,
                timestamp: new Date().toISOString(),
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
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

    return {
        // State
        messages,
        isLoading,
        error,
        departments,
        selectedDepartment,
        
        // Actions
        sendMessage,
        clearMessages,
        loadDepartments,
        checkBackendHealth,
        setSelectedDepartment,
    };
}
