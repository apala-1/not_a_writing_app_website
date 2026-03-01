// pages/privacy.tsx  (Next.js) or Privacy.tsx (React)
import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <p className="mb-4">
        We may collect personal information such as your name, email address, and usage data when you use our services.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. How We Use Information</h2>
      <p className="mb-4">
        We use the information to provide, maintain, and improve our services, as well as for communication purposes.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Data Sharing</h2>
      <p className="mb-4">
        We do not sell your personal data. We may share information with trusted third parties for business operations.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Security</h2>
      <p className="mb-4">
        We take reasonable measures to protect your personal information from unauthorized access or disclosure.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Your Rights</h2>
      <p className="mb-4">
        You can request access, correction, or deletion of your personal data by contacting us.
      </p>

      <p className="mt-8 text-gray-500 text-sm">
        Last updated: March 1, 2026
      </p>
    </div>
  );
}