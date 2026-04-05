"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode, useEffect } from 'react'
import { CgProfile } from 'react-icons/cg'
import { FiLink } from 'react-icons/fi'
import { usePathname, useRouter } from 'next/navigation'
import { MdOutlineRemoveRedEye } from 'react-icons/md'
import { BeatLoader } from 'react-spinners'
import { toast } from 'sonner'
import { useAuth } from '@/providers/AuthProvider'
import PhonePreview from './PhonePreview'
import { ProfileRefreshProvider } from '@/providers/ProfileRefreshContext'

interface DashboardLayoutProps {
    children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();
    function isActive(path: string) {
        return pathname === path;
    }
    const { user, isAuthenticated, isLoading } = useAuth();
    const id = user?.id;
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) {
            router.push("/auth/login");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="w-screen h-screen bg-[#FAFAFA] flex justify-center items-center">
                <BeatLoader color="#633CFF" size={20} />
            </div>
        );
    }

    if (!isAuthenticated) {
        toast.error("You're not authorized!");
        return null;
    }

    return (
        <ProfileRefreshProvider>
            <div className='h-screen text-[#737373] bg-lightGray p-2 sm:p-4 md:p-6 flex flex-col overflow-hidden'>
                <div className='bg-white flex justify-between px-3 sm:px-6 py-3 sm:py-4 rounded-xl shrink-0'>
                    <div className='flex items-center gap-1.5 sm:gap-2 px-0 sm:px-8 text-xl sm:text-2xl text-primary font-extrabold'>
                        <Image src={'/logo.svg'} className='size-6 sm:size-8' width={26} height={26} alt='dev links logo' />
                        <p className='hidden sm:block'>devlinks</p>
                    </div>
                    <div className='flex items-center gap-2 sm:gap-4'>
                        <Link href={"/link"} className={`text-gray-500 font-semibold flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6.75 py-2 sm:py-2.75 rounded-lg ${isActive("/link") ? 'bg-lightPurple text-secondary' : 'hover:bg-lightPurple hover:text-secondary'}`}>
                            <FiLink size={18} className="sm:w-5 sm:h-5" strokeWidth={2.2} />
                            <p className='hidden sm:block'>Links</p>
                        </Link>
                        <Link href={"/profile"} className={`font-semibold flex items-center text-gray-500 gap-1.5 sm:gap-2 px-3 sm:px-6.75 py-2 sm:py-2.75 rounded-lg ${isActive("/profile") ? 'bg-lightPurple text-secondary' : 'hover:bg-lightPurple hover:text-secondary'}`}>
                            <CgProfile size={18} className="sm:w-5 sm:h-5" />
                            <p className='hidden sm:block'>Profile Details</p>
                        </Link>
                    </div>
                    {id ? (
                        <Link href={`/link-preview/${id}`} className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs sm:text-sm font-semibold border border-secondary bg-white hover:bg-lightPurple text-secondary min-h-9 sm:min-h-11.5 px-3 sm:px-4 py-2'>
                            <span className='hidden sm:block'>Preview</span>
                            <MdOutlineRemoveRedEye size={18} className='sm:hidden' />
                        </Link>
                    ) : (
                        <button disabled className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs sm:text-sm font-semibold border border-gray-300 bg-gray-100 text-gray-400 min-h-9 sm:min-h-11.5 px-3 sm:px-4 py-2 cursor-not-allowed'>
                            <span className='hidden sm:block'>Preview</span>
                            <MdOutlineRemoveRedEye size={18} className='sm:hidden' />
                        </button>
                    )}
                </div>
                <div className='flex gap-3 sm:gap-6 my-3 sm:my-6 flex-1 min-h-0'>
                    <div className='hidden lg:flex w-[40%] xl:w-[45%]'>
                        <div className='bg-white flex justify-center items-center rounded-xl py-10 xl:py-20 w-full overflow-hidden'>
                            <PhonePreview />
                        </div>
                    </div>
                    <div className='bg-white w-full lg:w-[60%] xl:w-[55%] flex grow rounded-xl overflow-hidden'>
                        {children}
                    </div>
                </div>
            </div>
        </ProfileRefreshProvider>
    )
}
