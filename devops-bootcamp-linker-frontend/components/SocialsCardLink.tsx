import Link from 'next/link'
import React from 'react'
import { IconType } from 'react-icons'
import { FaArrowRight } from 'react-icons/fa6'

interface SocialsCardLinkProps {
    link: string,
    PlatformIcon: IconType,
    platformName: string,
    bgColor: string
}

export default function SocialsCardLink({ link, PlatformIcon, platformName, bgColor }: SocialsCardLinkProps) {
    return (
        <Link 
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className='w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-white hover:opacity-90 hover:shadow-lg transition-all text-xs sm:text-sm'
            style={{ backgroundColor: bgColor }}
            aria-label={`Visit ${platformName} profile`}
        >
            <span className='flex items-center gap-1.5 sm:gap-2'>
                <PlatformIcon size={14} className="sm:w-4 sm:h-4" aria-hidden="true" /> 
                <span className="truncate">{platformName}</span>
            </span>
            <FaArrowRight size={14} className="sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
        </Link>
    )
}
