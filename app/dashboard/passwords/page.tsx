"use client";

import { useState } from "react";
import { ShieldCheck, Key, AlertCircle, CheckCircle2, Copy, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function PasswordsPage() {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState({ score: 0, label: "Empty", color: "text-gray-500" });

  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length > 8) score++;
    if (pwd.length > 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (pwd.length === 0) return { score: 0, label: "Empty", color: "text-gray-500" };
    if (score <= 2) return { score: 25, label: "Weak", color: "text-red-500" };
    if (score <= 4) return { score: 60, label: "Good", color: "text-yellow-500" };
    return { score: 100, label: "Unbreakable", color: "text-green-500" };
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setStrength(calculateStrength(val));
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let newPass = "";
    for (let i = 0; i < 16; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPass);
    setStrength(calculateStrength(newPass));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-bold mb-2">Password Health</h1>
        <p className="text-gray-400">Audit your passwords and generate secure alternatives.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checker Card */}
        <div className="glass p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-600/20 rounded-lg"><Key className="w-6 h-6 text-blue-500" /></div>
            <h2 className="text-xl font-bold">Strength Checker</h2>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter password to test..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition text-lg font-mono"
              />
              <button 
                onClick={generatePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg text-gray-400 transition"
                title="Generate strong password"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-400 uppercase tracking-widest">Strength Status</span>
                <span className={strength.color}>{strength.label}</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${strength.score}%` }}
                  className={`h-full ${strength.color.replace('text', 'bg')}`}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-3">
            <CriteriaItem met={password.length > 12} text="Minimum 12 characters" />
            <CriteriaItem met={/[A-Z]/.test(password)} text="Contains uppercase letters" />
            <CriteriaItem met={/[0-9]/.test(password)} text="Contains numbers" />
            <CriteriaItem met={/[^A-Za-z0-9]/.test(password)} text="Contains special characters" />
          </div>
        </div>

        {/* Tips Card */}
        <div className="glass p-8 rounded-3xl border border-white/10 bg-blue-600/5">
          <h2 className="text-xl font-bold mb-6">Security Best Practices</h2>
          <div className="space-y-6">
            <TipItem 
              icon={<ShieldCheck className="text-blue-500" />} 
              title="Avoid Common Patterns"
              desc="Don't use sequences like '12345' or keyboard rows like 'qwerty'."
            />
            <TipItem 
              icon={<AlertCircle className="text-orange-500" />} 
              title="Never Reuse"
              desc="Use a unique password for every single account to prevent cascading leaks."
            />
            <TipItem 
              icon={<RefreshCw className="text-purple-500" />} 
              title="Regular Rotation"
              desc="Change your master passwords every 6 months for critical accounts."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CriteriaItem({ met, text }: { met: boolean, text: string }) {
  return (
    <div className="flex items-center space-x-3">
      {met ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <div className="w-5 h-5 rounded-full border-2 border-white/10" />}
      <span className={met ? "text-gray-300" : "text-gray-500"}>{text}</span>
    </div>
  );
}

function TipItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="font-bold text-white">{title}</p>
        <p className="text-sm text-gray-400">{desc}</p>
      </div>
    </div>
  );
}
