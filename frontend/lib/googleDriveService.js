/**
 * Google Drive Service for KMRL Frontend
 * Handles Google Drive API integration and file operations
 */

import apiService from './api';

class GoogleDriveService {
    constructor() {
        this.baseURL = '/api/v1';
        this.isAuthenticated = false;
        this.accessToken = null;
    }

    /**
     * Authenticate with Google Drive
     */
    async authenticate() {
        try {
            const response = await apiService.get('/auth/google-drive/url');
            const { authUrl } = response.data;
            
            // Open authentication window
            const authWindow = window.open(
                authUrl,
                'google-auth',
                'width=500,height=600,scrollbars=yes,resizable=yes'
            );

            return new Promise((resolve, reject) => {
                const checkClosed = setInterval(() => {
                    if (authWindow.closed) {
                        clearInterval(checkClosed);
                        // Check if authentication was successful
                        this.checkAuthStatus()
                            .then(resolve)
                            .catch(reject);
                    }
                }, 1000);
            });
        } catch (error) {
            console.error('Google Drive authentication failed:', error);
            throw new Error('Failed to authenticate with Google Drive');
        }
    }

    /**
     * Check authentication status
     */
    async checkAuthStatus() {
        try {
            const response = await apiService.get('/auth/google-drive/status');
            this.isAuthenticated = response.data.authenticated;
            this.accessToken = response.data.accessToken;
            return this.isAuthenticated;
        } catch (error) {
            this.isAuthenticated = false;
            this.accessToken = null;
            return false;
        }
    }

    /**
     * Get files from Google Drive
     */
    async getFiles(folderId = null, pageSize = 50) {
        try {
            if (!this.isAuthenticated) {
                await this.checkAuthStatus();
                if (!this.isAuthenticated) {
                    throw new Error('Not authenticated with Google Drive');
                }
            }

            const params = {
                pageSize,
                ...(folderId && { folderId })
            };

            const response = await apiService.get('/google-drive/files', { params });
            return response.data.files || [];
        } catch (error) {
            console.error('Failed to get Google Drive files:', error);
            throw new Error('Failed to load files from Google Drive');
        }
    }

    /**
     * Search files in Google Drive
     */
    async searchFiles(query, folderId = null) {
        try {
            if (!this.isAuthenticated) {
                await this.checkAuthStatus();
                if (!this.isAuthenticated) {
                    throw new Error('Not authenticated with Google Drive');
                }
            }

            const params = {
                q: query,
                ...(folderId && { folderId })
            };

            const response = await apiService.get('/google-drive/search', { params });
            return response.data.files || [];
        } catch (error) {
            console.error('Failed to search Google Drive files:', error);
            throw new Error('Failed to search files in Google Drive');
        }
    }

    /**
     * Get file details
     */
    async getFileDetails(fileId) {
        try {
            if (!this.isAuthenticated) {
                await this.checkAuthStatus();
                if (!this.isAuthenticated) {
                    throw new Error('Not authenticated with Google Drive');
                }
            }

            const response = await apiService.get(`/google-drive/files/${fileId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to get file details:', error);
            throw new Error('Failed to get file details');
        }
    }

    /**
     * Download file from Google Drive
     */
    async downloadFile(fileId) {
        try {
            if (!this.isAuthenticated) {
                await this.checkAuthStatus();
                if (!this.isAuthenticated) {
                    throw new Error('Not authenticated with Google Drive');
                }
            }

            const response = await apiService.get(`/google-drive/files/${fileId}/download`, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            console.error('Failed to download file:', error);
            throw new Error('Failed to download file');
        }
    }

    /**
     * Sync files to KMRL system
     */
    async syncFiles(fileIds) {
        try {
            if (!this.isAuthenticated) {
                await this.checkAuthStatus();
                if (!this.isAuthenticated) {
                    throw new Error('Not authenticated with Google Drive');
                }
            }

            const response = await apiService.post('/google-drive/sync', {
                fileIds
            });
            return response.data;
        } catch (error) {
            console.error('Failed to sync files:', error);
            throw new Error('Failed to sync files to KMRL system');
        }
    }

    /**
     * Get folder structure
     */
    async getFolders(parentId = null) {
        try {
            if (!this.isAuthenticated) {
                await this.checkAuthStatus();
                if (!this.isAuthenticated) {
                    throw new Error('Not authenticated with Google Drive');
                }
            }

            const params = {
                ...(parentId && { parentId })
            };

            const response = await apiService.get('/google-drive/folders', { params });
            return response.data.folders || [];
        } catch (error) {
            console.error('Failed to get folders:', error);
            throw new Error('Failed to get folder structure');
        }
    }

    /**
     * Disconnect from Google Drive
     */
    async disconnect() {
        try {
            await apiService.post('/auth/google-drive/disconnect');
            this.isAuthenticated = false;
            this.accessToken = null;
        } catch (error) {
            console.error('Failed to disconnect from Google Drive:', error);
            throw new Error('Failed to disconnect from Google Drive');
        }
    }

    /**
     * Get authentication status
     */
    isConnected() {
        return this.isAuthenticated;
    }
}

// Create and export singleton instance
const googleDriveService = new GoogleDriveService();
export default googleDriveService;