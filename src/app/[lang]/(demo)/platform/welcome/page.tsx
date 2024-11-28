import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Welcome() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      {/* Welcome Card */}
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-6">
          {/* Illustration Placeholder */}
          <Image
            src="/images/platform/welcome-illustration.png"
            alt="Welcome Illustration"
            className="mx-auto mb-4"
            width={128} // specify the width
            height={128} // specify the height
          />
        </div>
        <h1 className="mb-2 text-2xl font-semibold text-gray-800">
          Welcome to ModAstera
        </h1>
        <p className="mb-6 text-gray-600">Build, Use, and Share Medical AI.</p>
        <Link href="/platform/dashboard">
          <button className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
