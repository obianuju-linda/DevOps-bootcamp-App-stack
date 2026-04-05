"use client";

import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import LinkCard from "@/components/LinkCard";
import React, { useEffect, useState, Suspense, useTransition, useCallback } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useProfileRefresh } from "@/providers/ProfileRefreshContext";
import { toast } from "sonner";
import { BeatLoader, ClipLoader } from "react-spinners";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface LinkData {
  platform: string;
  link: string;
}

const MAX_LINKS = 5;

function LinkContent() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();
  const { triggerRefresh } = useProfileRefresh();
  const [linkCards, setLinkCards] = useState<LinkData[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsLoadingLinks(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/links/${user.id}`);
        const result = await res.json();
        if (result.success && result.links?.length > 0) {
          const validLinks = result.links.filter((l: { platform?: string; url?: string }) => l.platform && l.url);
          if (validLinks.length > 0) {
            setLinkCards(validLinks.map((l: { platform: string; url: string }) => ({ platform: l.platform, link: l.url })));
          }
        }
      } catch {
        toast.error("Failed to load links");
      } finally {
        setIsLoadingLinks(false);
      }
    })();
  }, [user?.id]);

  useEffect(() => {
    if (isLoadingLinks) return;
    const linkCount = Number(searchParams.get("link_count")) || 0;
    if (linkCount > 0 && linkCards.length === 0) {
      setLinkCards(Array.from({ length: linkCount }, () => ({ platform: "", link: "" })));
    }
  }, [searchParams, isLoadingLinks, linkCards.length]);

  useEffect(() => {
    setHasUnsavedChanges(linkCards.some((card) => card.platform || card.link));
  }, [linkCards]);

  useEffect(() => {
    if (isLoadingLinks) return;
    const newURL = new URL(window.location.href);
    if (linkCards.length > 0) {
      newURL.searchParams.set("add_link", "true");
      newURL.searchParams.set("link_count", linkCards.length.toString());
    } else {
      newURL.searchParams.delete("add_link");
      newURL.searchParams.delete("link_count");
    }
    router.push(newURL.toString(), { scroll: false });
  }, [linkCards.length, router, isLoadingLinks]);

  const handleAddLink = useCallback(() => {
    if (linkCards.length >= MAX_LINKS) {
      toast.error(`Maximum ${MAX_LINKS} links allowed`);
      return;
    }
    setLinkCards((prev) => [...prev, { platform: "", link: "" }]);
    toast.success("New link added");
  }, [linkCards.length]);

  const handleRemoveLink = useCallback((index: number) => {
    setLinkCards((prev) => prev.filter((_, i) => i !== index));
    toast.success("Link removed");
  }, []);

  const validateLinks = useCallback((): boolean => {
    if (linkCards.length === 0) return true;
    for (let i = 0; i < linkCards.length; i++) {
      const card = linkCards[i];
      if (!card.platform || !card.link) {
        toast.error(`Link ${i + 1}: Both platform and URL are required`);
        return false;
      }
      try {
        new URL(card.link);
      } catch {
        toast.error(`Link ${i + 1}: Invalid URL format`);
        return false;
      }
    }
    return true;
  }, [linkCards]);

  const handleSaveLinks = useCallback(async () => {
    if (!user?.id || !token) {
      toast.error("You must be logged in to save links");
      return;
    }
    if (!validateLinks()) return;

    const links = linkCards.map((card) => ({ platform: card.platform, url: card.link.trim() }));

    startTransition(async () => {
      try {
        const res = await fetch(`${API_BASE}/links`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user.id, links }),
        });
        const result = await res.json();
        if (result.success) {
          toast.success(result.message || "Links saved successfully");
          setHasUnsavedChanges(false);
          triggerRefresh();
        } else {
          toast.error(result.message || "Failed to save links");
        }
      } catch {
        toast.error("An unexpected error occurred");
      }
    });
  }, [user?.id, token, linkCards, validateLinks, triggerRefresh]);

  const handleChange = useCallback((index: number, field: keyof LinkData, value: string) => {
    setLinkCards((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isPending) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges, isPending]);

  const isFormValid = linkCards.every((card) => card.platform && card.link);

  if (isLoadingLinks) {
    return (
      <DashboardLayout>
        <div className="w-full h-full flex items-center justify-center">
          <BeatLoader color="#633CFF" size={20} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:p-10">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-[32px] text-primary font-bold">Customize your links</h2>
            <p className="text-gray-600">Add/edit/remove links below and then share all your profiles with the world!</p>
          </div>
          <Button
            variant="outline"
            onClick={handleAddLink}
            disabled={linkCards.length >= MAX_LINKS}
            className="w-full mb-6"
          >
            + Add new link {linkCards.length > 0 && `(${linkCards.length}/${MAX_LINKS})`}
          </Button>
          {linkCards.length > 0 ? (
            <div className="flex flex-col gap-6">
              {linkCards.map((linkCard, index) => (
                <LinkCard
                  key={`link-${index}`}
                  index={index}
                  platform={linkCard.platform}
                  link={linkCard.link}
                  onRemove={handleRemoveLink}
                  onChange={handleChange}
                />
              ))}
            </div>
          ) : (
            <div className="bg-lightGray p-0 sm:p-5 rounded-xl flex flex-col items-center justify-center">
              <div className="flex flex-col items-center p-5 sm:p-10">
                <Image
                  src="/assets/icons/illustration.svg"
                  width={249}
                  height={160}
                  alt="Get started illustration"
                  priority
                />
                <h2 className="text-2xl sm:text-[32px] text-primary font-bold mt-10 mb-6">Let&apos;s get you started</h2>
                <p className="text-center text-gray-600 max-w-md">
                  Use the &quot;Add new link&quot; button to get started. Once you have more than one link, you can reorder and edit
                  them. We&apos;re here to help you share your profiles with everyone!
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="shrink-0 border-t bg-white border-[#D9D9D9] px-5 sm:px-10 py-4">
          <div className="flex flex-col justify-end items-center gap-4">
            {hasUnsavedChanges && !isPending && (
              <span className="text-sm text-gray-500 hidden sm:block">You have unsaved changes</span>
            )}
            <Button className="min-w-22.75 px-6" onClick={handleSaveLinks} disabled={!isFormValid || isPending}>
              {isPending ? <ClipLoader color="white" size={18} /> : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function LinkPage() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen bg-lightGray flex justify-center items-center">
          <BeatLoader color="#633CFF" size={20} />
        </div>
      }
    >
      <LinkContent />
    </Suspense>
  );
}
