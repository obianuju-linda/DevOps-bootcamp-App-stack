import Link from "next/link";
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-lightGray flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-6">
            <FaExclamationTriangle className="text-red-600 text-5xl" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">User Not Found</h1>
        <p className="text-gray-600 mb-8">
          The profile you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/link"
          className="inline-flex items-center justify-center px-6 py-3 bg-secondary hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
