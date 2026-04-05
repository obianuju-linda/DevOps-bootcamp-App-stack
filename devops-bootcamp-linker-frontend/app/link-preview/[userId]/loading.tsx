import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-lightGray pb-20 min-h-screen">
      <div className="sm:bg-secondary px-6 pt-6 pb-4 sm:pb-63.75 rounded-b-4xl">
        <div className="sm:bg-white flex justify-between w-full sm:px-6 py-4 rounded-xl">
          <Skeleton className="h-11.5 w-32" />
          <Skeleton className="h-11.5 w-28" />
        </div>
      </div>
      <div className="flex justify-center mt-0 sm:-mt-36">
        <div className="sm:bg-white w-full max-w-87 flex flex-col justify-center px-14 py-12 rounded-3xl sm:shadow-grayShadow">
          <div className="flex flex-col items-center gap-6 mb-14">
            <Skeleton className="size-26 rounded-full" />
            <div className="w-full space-y-3">
              <Skeleton className="h-10 w-3/4 mx-auto" />
              <Skeleton className="h-5 w-2/3 mx-auto" />
            </div>
          </div>
          <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-11 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
