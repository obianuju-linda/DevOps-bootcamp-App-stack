"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface ProfileRefreshContextType {
    refreshKey: number;
    triggerRefresh: () => void;
}

const ProfileRefreshContext = createContext<ProfileRefreshContextType | undefined>(undefined);

export function ProfileRefreshProvider({ children }: { children: React.ReactNode }) {
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    return (
        <ProfileRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
            {children}
        </ProfileRefreshContext.Provider>
    );
}

export function useProfileRefresh() {
    const context = useContext(ProfileRefreshContext);
    if (context === undefined) {
        // Return a no-op function if used outside provider
        return {
            refreshKey: 0,
            triggerRefresh: () => {}
        };
    }
    return context;
}
