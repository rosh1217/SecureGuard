"use client";

import { ShieldCheck, AlertTriangle, ShieldAlert, Activity, User, Lock, Key, Globe, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function DashboardPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(data);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome Back, {profile?.full_name || 'Defender'}</h1>
          <p className="text-gray-400 text-lg">Your security ecosystem is monitored and active.</p>
        </div>
        <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">{profile?.full_name?.[0] || 'U'}</div>
          <p className="font-bold text-sm">Pro Sentinel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-10 rounded-[40px] relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="relative w-48 h-48 flex items-center justify-center">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                 <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="552.9" strokeDashoffset={552.9 * (1 - (profile?.security_score || 80) / 100)} className="text-blue-500 transition-all duration-1000" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-5xl font-black">{profile?.security_score || 80}</span>
                 <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Security Score</span>
               </div>
            </div>
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl font-bold">Your Posture is { (profile?.security_score || 80) > 75 ? 'Strong' : 'At Risk' }</h2>
              <p className="text-gray-400 leading-relaxed">Protect your assets by completing the daily security audit. You have 2 unresolved alerts.</p>
              <button className="bg-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2">Improve Score <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <StatCard icon={<AlertTriangle className="text-orange-500" />} label="Leaks Detected" value="0" sub="Secure" />
          <StatCard icon={<Lock className="text-green-500" />} label="Vault Status" value="Locked" sub="AES-256 Active" />
          <StatCard icon={<Activity className="text-blue-500" />} label="2FA Keys" value="5" sub="Ready" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Security Command</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/dashboard/passwords" className="glass p-8 rounded-3xl border border-white/10 hover:border-blue-500/50 transition group flex flex-col items-center gap-4">
             <Key className="w-10 h-10 text-blue-400 group-hover:scale-110 transition" />
             <span className="font-bold">Password Health</span>
          </Link>
          <Link href="/dashboard/phishing" className="glass p-8 rounded-3xl border border-white/10 hover:border-purple-500/50 transition group flex flex-col items-center gap-4">
             <Globe className="w-10 h-10 text-purple-400 group-hover:scale-110 transition" />
             <span className="font-bold">Phishing Scan</span>
          </Link>
          <Link href="/dashboard/breach" className="glass p-8 rounded-3xl border border-white/10 hover:border-red-500/50 transition group flex flex-col items-center gap-4">
             <ShieldAlert className="w-10 h-10 text-red-400 group-hover:scale-110 transition" />
             <span className="font-bold">Breach Monitor</span>
          </Link>
          <Link href="/dashboard/vault" className="glass p-8 rounded-3xl border border-white/10 hover:border-emerald-500/50 transition group flex flex-col items-center gap-4">
             <Lock className="w-10 h-10 text-emerald-400 group-hover:scale-110 transition" />
             <span className="font-bold">Access Vault</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: any) {
  return (
    <div className="glass p-6 rounded-3xl border border-white/10 flex items-center gap-4">
      <div className="p-3 bg-white/5 rounded-2xl">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</p>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
    </div>
  );
}
