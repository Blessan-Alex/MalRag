/**
 * Custom hook for managing files from Google Drive and other sources
 */

import { useState, useEffect, useCallback } from 'react';
import apiService from '@/lib/api';
import googleDriveService from '@/lib/googleDriveService';

export function useFiles() {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Load files from Google Drive or other sources
     */
    const loadFiles = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Load files from Google Drive service
            const driveFiles = await googleDriveService.getFiles();
            setFiles(driveFiles);
        } catch (err) {
            console.error('Failed to load files:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Toggle file selection
     */
    const toggleFile = useCallback((fileId) => {
        setFiles(prev => 
            prev.map(file => 
                file.id === fileId 
                    ? { ...file, checked: !file.checked }
                    : file
            )
        );
    }, []);

    /**
     * Select all files
     */
    const selectAllFiles = useCallback(() => {
        setFiles(prev => 
            prev.map(file => ({ ...file, checked: true }))
        );
    }, []);

    /**
     * Deselect all files
     */
    const deselectAllFiles = useCallback(() => {
        setFiles(prev => 
            prev.map(file => ({ ...file, checked: false }))
        );
    }, []);

    /**
     * Get selected files
     */
    const getSelectedFiles = useCallback(() => {
        return files.filter(file => file.checked);
    }, [files]);

    /**
     * Refresh files from source
     */
    const refreshFiles = useCallback(() => {
        loadFiles();
    }, [loadFiles]);

    /**
     * Search files by query
     */
    const searchFiles = useCallback(async (query) => {
        if (!query.trim()) {
            await loadFiles();
            return;
        }
        
        setIsLoading(true);
        try {
            const results = await googleDriveService.searchFiles(query);
            setFiles(results);
        } catch (err) {
            console.error('Failed to search files:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [loadFiles]);

    // Load files on mount
    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    return {
        files,
        isLoading,
        error,
        toggleFile,
        selectAllFiles,
        deselectAllFiles,
        getSelectedFiles,
        refreshFiles,
        loadFiles,
        searchFiles
    };
}
