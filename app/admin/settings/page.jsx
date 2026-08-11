"use client";

import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminNavbar from "@/component/admin/AdminNavbar";
import AdminPageHeader from "@/component/admin/AdminPageHeader";

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="lg:ml-72">
        <AdminNavbar />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <AdminPageHeader
              title="Settings"
              description="Configure TripGuard platform settings and account preferences."
            />

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Platform configuration
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Booking rules, safety alert delivery, and operating defaults.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Access & permissions
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Admin roles, profile visibility, and moderation controls.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
