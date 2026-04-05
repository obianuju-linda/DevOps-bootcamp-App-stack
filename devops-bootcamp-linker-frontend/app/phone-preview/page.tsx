"use client";

import DashboardLayout from "@/components/DashboardLayout";
import PhonePreview from "@/components/PhonePreview";

export default function PhonePreviewPage() {
  return (
    <DashboardLayout>
      <div className="w-full h-full flex justify-center items-center py-10">
        <PhonePreview />
      </div>
    </DashboardLayout>
  );
}
