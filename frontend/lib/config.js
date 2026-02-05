/**
 * Configuration for the KMRM Frontend Application
 */

const config = {
    // API Configuration
    api: {
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
        timeout: 30000, // 30 seconds
    },
    
    // Chat Configuration
    chat: {
        maxMessages: 100,
        defaultTopK: 5,
        defaultSearchType: 'vector',
    },
    
    // UI Configuration
    ui: {
        animationDuration: 200,
        debounceDelay: 300,
    }
};

export default config;
