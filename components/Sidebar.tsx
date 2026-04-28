"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Eye, 
  Globe, 
  Lock, 
  QrCode, 
  ScanFace, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/utils/cn";
import { createClient } from "@/utils/supabase/client";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: ShieldCheck, label: "Password Health", href: "/dashboard/passwords" },
  { icon: Eye, label: "Breach Monitor", href: "/dashboard/breach" },
  { icon: Globe, label: "Phishing Scan", href: "/dashboard/phishing" },
  { icon: Lock, label: "Secure Vault", href: "/dashboard/vault" },
  { icon: QrCode, label: "2FA Manager", href: "/dashboard/2fa" },
  { icon: ScanFace, label: "Face Unlock", href: "/dashboard/face" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-64 h-screen bg-slate-950/50 backdrop-blur-xl border-r border-white/5 flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">SecureGuard</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between group px-3 py-2.5 rounded-xl transition-all duration-150",
                  isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-gray-500 group-hover:text-blue-400")} />
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3 h-3 opacity-50" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition group text-sm font-medium"
        >
          <LogOut className="w-4 h-4 group-hover:scale-110 transition" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
