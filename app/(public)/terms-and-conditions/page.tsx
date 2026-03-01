// pages/terms.tsx  (Next.js) or Terms.tsx (React)
import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <p className="mb-4">
        Welcome to our website! By accessing or using our services, you agree to be bound by these Terms & Conditions.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Use of Services</h2>
      <p className="mb-4">
        You agree to use our services only for lawful purposes and in accordance with these terms.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. Account Responsibility</h2>
      <p className="mb-4">
        You are responsible for maintaining the confidentiality of your account information and for all activities under your account.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Intellectual Property</h2>
      <p className="mb-4">
        All content, trademarks, and intellectual property on this site are owned by us or our licensors.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Limitation of Liability</h2>
      <p className="mb-4">
        We are not liable for any direct, indirect, incidental, or consequential damages arising from the use of our services.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Changes to Terms</h2>
      <p className="mb-4">
        We reserve the right to modify these Terms & Conditions at any time. Your continued use of the services signifies acceptance of the updated terms.
      </p>

      <p className="mt-8 text-gray-500 text-sm">
        Last updated: March 1, 2026
      </p>
    </div>
  );
}