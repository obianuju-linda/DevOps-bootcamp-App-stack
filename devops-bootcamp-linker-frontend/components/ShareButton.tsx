'use client'

import React, { useState } from 'react'
import { FaShareNodes, FaCheck } from 'react-icons/fa6'

interface ShareButtonProps {
    userId: string
}

export default function ShareButton({ userId }: ShareButtonProps) {
    const [copied, setCopied] = useState(false)

    const handleShare = async () => {
        const url = typeof window !== 'undefined' ? window.location.href : ''
        
        // Try native share API first
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'DevLink Profile',
                    text: 'Check out my developer profile!',
                    url: url
                })
            } catch (error) {
                // User cancelled or error occurred
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Share failed:', error)
                    fallbackCopy(url)
                }
            }
        } else {
            // Fallback to copy
            fallbackCopy(url)
        }
    }

    const fallbackCopy = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            console.error('Failed to copy link:', error)
            alert('Failed to copy link. Please copy manually: ' + url)
        }
    }

    return (
        <button 
            onClick={handleShare}
            className='flex items-center gap-2 px-4 sm:px-6 py-3 font-semibold bg-secondary hover:bg-purple-700 text-white rounded-md h-11.5 transition-colors disabled:opacity-50'
            disabled={copied}
            aria-label='Share profile link'
        >
            {copied ? (
                <>
                    <FaCheck size={16} />
                    <span className='hidden sm:inline'>Copied!</span>
                </>
            ) : (
                <>
                    <FaShareNodes size={16} />
                    <span className='hidden sm:inline'>Share Link</span>
                </>
            )}
        </button>
    )
}
