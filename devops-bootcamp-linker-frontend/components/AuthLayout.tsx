import Image from 'next/image'
import React, { ReactNode } from 'react'

interface AuthLayoutProps {
    children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className='bg-lightGray h-[90vh] sm:min-h-[150vh] flex justify-center text-primary'>
            <div className='flex flex-col sm:items-center mt-8 sm:mt-20'>
                <div className='flex items-center gap-2 px-8 mb-[51px] text-[32px] text-primary font-extrabold'>
                    <Image src={'/logo.svg'} width={33} height={33} alt='dev links logo' />
                    devlinks
                </div>
                <div className="sm:bg-white w-full h-[90vh px-8 sm:p-10 sm:min-w-[476px] sm:rounded-[12px]">
                    {children}
                </div>
            </div>
        </div>
    )
}
