/**
 * Custom hook for managing chat sessions
 */

import { useState, useCallback } from 'react';

export function useChats() {
    const [chats, setChats] = useState([
        { 
            id: "c1", 
            title: "What are the safety procedures...", 
            updatedAt: "10:12 AM",
            messageCount: 5,
            lastMessage: "Can you summarize the key findings?"
        },
        { 
            id: "c2", 
            title: "How do I report a signal...", 
            updatedAt: "Yesterday",
            messageCount: 3,
            lastMessage: "What are the main steps?"
        },
        { 
            id: "c3", 
            title: "What are the current operational...", 
            updatedAt: "Mon",
            messageCount: 7,
            lastMessage: "Please analyze the high-risk items"
        },
        { 
            id: "c4", 
            title: "Show me maintenance schedules...", 
            updatedAt: "Sep 12",
            messageCount: 4,
            lastMessage: "What are the key milestones?"
        }
    ]);
    const [activeChatId, setActiveChatId] = useState(chats[0]?.id || null);

    /**
     * Create a new chat
     */
    const createNewChat = useCallback((title = "New Chat") => {
        const timestamp = new Date();
        const newChat = {
            id: `c_${timestamp.getTime()}`,
            title,
            updatedAt: "Just now",
            messageCount: 0,
            lastMessage: "Chat started"
        };
        
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        return newChat;
    }, []);

    /**
     * Generate title from query (first few words)
     */
    const generateTitleFromQuery = useCallback((query, maxWords = 4) => {
        const words = query.trim().split(/\s+/);
        const title = words.slice(0, maxWords).join(' ');
        return title.length > 30 ? title.substring(0, 30) + '...' : title;
    }, []);

    /**
     * Update chat title
     */
    const updateChatTitle = useCallback((chatId, newTitle) => {
        setChats(prev => 
            prev.map(chat => 
                chat.id === chatId 
                    ? { ...chat, title: newTitle, updatedAt: "Just now" }
                    : chat
            )
        );
    }, []);

    /**
     * Update chat with new message
     */
    const updateChatWithMessage = useCallback((chatId, message) => {
        setChats(prev => 
            prev.map(chat => {
                if (chat.id === chatId) {
                    // If this is the first message and title is still default, update title
                    const newTitle = chat.messageCount === 0 && chat.title === "New Chat" 
                        ? generateTitleFromQuery(message)
                        : chat.title;
                    
                    return { 
                        ...chat, 
                        title: newTitle,
                        updatedAt: "Just now",
                        messageCount: chat.messageCount + 1,
                        lastMessage: message.length > 50 ? message.substring(0, 50) + "..." : message
                    };
                }
                return chat;
            })
        );
    }, [generateTitleFromQuery]);

    /**
     * Delete a chat
     */
    const deleteChat = useCallback((chatId) => {
        setChats(prev => prev.filter(chat => chat.id !== chatId));
        
        // If we deleted the active chat, switch to the first available chat
        if (activeChatId === chatId) {
            const remainingChats = chats.filter(chat => chat.id !== chatId);
            setActiveChatId(remainingChats[0]?.id || null);
        }
    }, [activeChatId, chats]);

    /**
     * Get active chat
     */
    const getActiveChat = useCallback(() => {
        return chats.find(chat => chat.id === activeChatId);
    }, [chats, activeChatId]);

    /**
     * Get chat by ID
     */
    const getChatById = useCallback((chatId) => {
        return chats.find(chat => chat.id === chatId);
    }, [chats]);

    return {
        chats,
        activeChatId,
        setActiveChatId,
        createNewChat,
        updateChatTitle,
        updateChatWithMessage,
        deleteChat,
        getActiveChat,
        getChatById,
        generateTitleFromQuery
    };
}