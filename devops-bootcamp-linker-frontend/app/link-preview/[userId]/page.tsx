import SocialsCardLink from "@/components/SocialsCardLink";
import ShareButton from "@/components/ShareButton";
import { socialsObject } from "@/utils/data/data";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaCircle } from "react-icons/fa6";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

type Params = { params: Promise<{ userId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { userId } = await params;
  try {
    const res = await fetch(`${API_BASE}/profile/${userId}`, { cache: "no-store" });
    const profileResult = await res.json();
    if (!profileResult.success || !profileResult.profileData) {
      return { title: "User Not Found", description: "The requested user profile could not be found." };
    }
    const { displayName } = profileResult.profileData;
    return {
      title: `${displayName} - DevLink Profile`,
      description: `Check out ${displayName}'s developer profile and social links.`,
      openGraph: {
        title: `${displayName} - DevLink Profile`,
        description: `Check out ${displayName}'s developer profile and social links.`,
        type: "profile",
      },
    };
  } catch {
    return { title: "User Not Found", description: "The requested user profile could not be found." };
  }
}

export default async function Page({ params }: Params) {
  const { userId } = await params;

  if (!userId?.trim()) {
    notFound();
  }

  let profileResult: { success: boolean; profileData?: { displayName: string; email: string; photoURL?: string }; message?: string };
  let linksResult: { success: boolean; links?: { id?: string; platform: string; url: string }[] };

  try {
    const [profileRes, linksRes] = await Promise.all([
      fetch(`${API_BASE}/profile/${userId}`, { cache: "no-store" }),
      fetch(`${API_BASE}/links/${userId}`, { cache: "no-store" }),
    ]);
    profileResult = await profileRes.json();
    linksResult = await linksRes.json();
  } catch {
    notFound();
  }

  if (!profileResult.success || !profileResult.profileData) {
    notFound();
  }

  const profileData = profileResult.profileData;
  const links = linksResult.success ? linksResult.links ?? [] : [];

  return (
    <div className="bg-lightGray pb-20 min-h-screen">
      <div className="sm:bg-secondary px-6 pt-6 pb-4 sm:pb-63.75 rounded-b-4xl">
        <div className="sm:bg-white flex justify-between w-full sm:px-6 py-4 rounded-xl">
          <Link
            href="/link"
            className="flex items-center px-4 font-semibold border border-secondary bg-white hover:bg-lightPurple text-secondary rounded-md h-11.5 transition-colors"
          >
            Back to editor
          </Link>
          <ShareButton userId={userId} />
        </div>
      </div>

      <div className="flex justify-center mt-0 sm:-mt-36">
        <div className="sm:bg-white w-full max-w-87 flex flex-col justify-center px-14 py-12 rounded-3xl sm:shadow-grayShadow">
          <div className="flex flex-col items-center gap-6 mb-14">
            <div className="flex items-center justify-center size-26 border-4 border-secondary rounded-full overflow-hidden bg-lightGray">
              {profileData.photoURL ? (
                <Image
                  src={profileData.photoURL}
                  width={104}
                  height={104}
                  alt={profileData.displayName}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                  {profileData.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="w-full">
              <h1 className="text-[32px] text-center font-bold text-gray-900 wrap-break-word">
                {profileData.displayName}
              </h1>
              <p className="text-center text-gray-600 break-all mt-2">{profileData.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {links.length > 0 ? (
              links.map((link) => {
                const color = socialsObject[link.platform as keyof typeof socialsObject]?.color ?? "#1e1e1e";
                const Icon = socialsObject[link.platform as keyof typeof socialsObject]?.icon ?? FaCircle;
                return (
                  <SocialsCardLink
                    key={link.id ?? link.platform + link.url}
                    bgColor={color}
                    link={link.url}
                    platformName={link.platform}
                    PlatformIcon={Icon}
                  />
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">No links added yet</p>
                <p className="text-sm mt-2">This user hasn&apos;t added any social links yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
