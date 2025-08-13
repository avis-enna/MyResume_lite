"use client";

import Link from 'next/link';

export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-black relative">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
      </div>

      <div className="relative z-10">
        <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-light tracking-[0.2em] text-white">ADMIN PANEL</h1>
              <Link
                href="/"
                className="px-4 py-2 border border-gray-700 text-gray-400 font-light tracking-[0.1em] uppercase text-sm hover:border-white hover:text-white transition-colors"
              >
                View Site
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-light tracking-[0.2em] text-white mb-8">Portfolio Management</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                  href="/admin/about"
                  className="block bg-gray-900/50 border border-gray-700 rounded-lg p-6 hover:border-white transition-colors"
                >
                  <h3 className="text-lg font-light tracking-[0.1em] text-white mb-2">ABOUT EDITOR</h3>
                  <p className="text-gray-400 text-sm">Edit your personal information</p>
                </Link>

                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 opacity-50">
                  <h3 className="text-lg font-light tracking-[0.1em] text-white mb-2">PROJECTS</h3>
                  <p className="text-gray-400 text-sm">Coming soon...</p>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 opacity-50">
                  <h3 className="text-lg font-light tracking-[0.1em] text-white mb-2">SKILLS</h3>
                  <p className="text-gray-400 text-sm">Coming soon...</p>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 opacity-50">
                  <h3 className="text-lg font-light tracking-[0.1em] text-white mb-2">EXPERIENCE</h3>
                  <p className="text-gray-400 text-sm">Coming soon...</p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-green-900/20 border border-green-700 rounded-lg">
                <p className="text-green-400 text-sm">
                  ✅ Admin panel is working! Click "ABOUT EDITOR" to edit your information.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
