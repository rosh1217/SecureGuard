"use client";

import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/components/Sidebar"), {
  ssr: false,
  loading: () => <div className="w-64 h-screen bg-slate-950 border-r border-white/5 animate-pulse" />
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Sidebar />
      <main className="pl-64 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
