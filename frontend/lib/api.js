/**
 * API Service for FastAPI RAG Backend Integration
 * Handles all communication with the FastAPI backend
 */

import config from './config';

const API_BASE_URL = config.api.baseUrl;

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    /**
     * Generic fetch wrapper with error handling
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API request failed for ${endpoint}:`, error);
            throw error;
        }
    }

    /**
     * Send a chat query to the RAG system
     * @param {string} query - The user's question
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} Response with answer and context
     */
    async sendQuery(query, options = {}) {
        const payload = {
            query,
            mode: options.mode || 'hybrid',
            only_need_context: options.only_need_context || false
        };

        return this.request('/api/v1/chat/query', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    /**
     * Transcribe audio using backend
     * @param {Blob} audioBlob - The audio recording
     * @returns {Promise<Object>} Transcription result
     */
    async transcribeAudio(audioBlob) {
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');

        const url = `${this.baseURL}/api/v1/transcribe`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Audio transcription failed:`, error);
            throw error;
        }
    }

    /**
     * Check if the backend is healthy
     * @returns {Promise<Object>} Health status
     */
    async checkHealth() {
        return this.request('/health');
    }

    /**
     * Get available departments
     * @returns {Promise<Object>} List of departments
     */
    async getDepartments() {
        return this.request('/api/v1/departments');
    }

    /**
     * Get system statistics
     * @returns {Promise<Object>} System stats
     */
    async getStats() {
        return this.request('/api/v1/stats');
    }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;

// Export individual methods for convenience
export const {
    sendQuery,
    checkHealth,
    getDepartments,
    getStats,
    transcribeAudio
} = apiService;
