import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { FaCircle } from "react-icons/fa6";
import { socialsObject } from "@/utils/data/data";
import SocialsCardLink from "./SocialsCardLink";
import { useProfileRefresh } from "@/providers/ProfileRefreshContext";
import { useAuth } from "@/providers/AuthProvider";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

type LinkData = {
  platform: string;
  url: string;
};

type ProfileData = {
  displayName: string;
  email: string;
  photoURL?: string;
};

export default function PhonePreview() {
  const { user, token } = useAuth();
  const { refreshKey } = useProfileRefresh();
  const [profileInfo, setProfileInfo] = useState<ProfileData | null>(null);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [profileRes, linksRes] = await Promise.all([
        fetch(`${API_BASE}/profile/${user.id}`),
        fetch(`${API_BASE}/links/${user.id}`),
      ]);

      const profileJson = await profileRes.json();
      const linksJson = await linksRes.json();

      if (profileJson.success && profileJson.profileData) {
        setProfileInfo(profileJson.profileData);
      } else {
        setError(profileJson.message || "Failed to load profile");
      }

      setLinks(linksJson.links ?? []);
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id, fetchData, refreshKey]);

  const skeleton = (
    <div className="w-full flex flex-col gap-5">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="w-full h-11 rounded-lg" />
      ))}
    </div>
  );

  const renderProfileSection = () => {
    if (isLoading) {
      return (
        <>
          <Skeleton className="size-20 sm:size-24 rounded-full mb-4 sm:mb-6.25" />
          <Skeleton className="w-32 sm:w-40 h-3 sm:h-4 rounded-full mb-2 sm:mb-3.25" />
          <Skeleton className="w-28 sm:w-40 h-2 rounded-full mb-10 sm:mb-14" />
        </>
      );
    }

    if (error || !profileInfo) {
      return (
        <>
          <div className="size-20 sm:size-24 rounded-full bg-gray-200 mb-4 sm:mb-6.25 flex items-center justify-center">
            <span className="text-gray-400 text-xs sm:text-sm">No Image</span>
          </div>
          <p className="w-32 sm:w-40 h-3 sm:h-4 rounded-full mb-2 sm:mb-3.25 text-center text-gray-500 text-xs sm:text-sm">
            Anonymous
          </p>
          <p className="h-2 rounded-full mb-10 sm:mb-14 text-center text-xs text-gray-400">
            {user?.email || "No email"}
          </p>
        </>
      );
    }

    return (
      <>
        <div className="relative size-20 sm:size-24 mb-4 sm:mb-6.25">
          <Image
            src={profileInfo.photoURL || "/default-profile.png"}
            width={96}
            height={96}
            alt={`${profileInfo.displayName}'s profile`}
            className="size-20 sm:size-24 rounded-full object-cover"
            priority
          />
        </div>
        <p className="w-32 sm:w-40 rounded-full mb-2 sm:mb-3.25 text-center font-semibold text-xs sm:text-sm truncate px-2">
          {profileInfo.displayName || "Anonymous"}
        </p>
        <p className="mb-10 sm:mb-14 text-center text-xs text-gray-600 truncate px-2 max-w-full">
          {profileInfo.email}
        </p>
      </>
    );
  };

  const renderLinksSection = () => {
    if (isLoading) {
      return skeleton;
    }

    if (!links.length) {
      return (
        <div className="w-full flex flex-col items-center justify-center gap-3 py-8">
          <p className="text-sm text-gray-400">No links added yet</p>
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col gap-5 overflow-y-auto max-h-75 scrollbar-hide">
        {links.map((item, idx) => {
          const platformData =
            socialsObject[item.platform as keyof typeof socialsObject];
          const color = platformData?.color ?? "#6B7280";
          const Icon = platformData?.icon ?? FaCircle;

          return (
            <SocialsCardLink
              key={`${item.platform}-${idx}`}
              bgColor={color}
              link={item.url}
              platformName={item.platform}
              PlatformIcon={Icon}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-h-157.75">
      <div className="bg-[url(/assets/icons/phone-outside-frame.svg)] bg-center flex items-center justify-center w-76.75 h-157.75">
        <div className="bg-[url(/assets/icons/phone-inner-frame.svg)] bg-center flex justify-center w-71.25 h-152.75 px-5.75 pt-13.25">
          <div className="flex flex-col items-center w-full">
            {renderProfileSection()}
            {renderLinksSection()}
          </div>
        </div>
      </div>
    </div>
  );
}
