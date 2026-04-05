"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BeatLoader } from "react-spinners";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.replace("/link");
    } else {
      router.replace("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="w-screen h-screen bg-[#FAFAFA] flex justify-center items-center">
      <BeatLoader color="#633CFF" size={20} />
    </div>
  );
}
