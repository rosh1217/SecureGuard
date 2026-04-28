"use client";

import { useState, useEffect } from "react";
import { QrCode, Plus, Trash2, Copy, ShieldCheck, RefreshCw, Clock, Key } from "lucide-react";
import * as OTPAuth from "otpauth";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

interface TOTPAccount {
  id: string;
  account_name: string;
  issuer: string;
  encrypted_secret: string;
}

export default function TwoFactorPage() {
  const supabase = createClient();
  const [accounts, setAccounts] = useState<TOTPAccount[]>([]);
  const [newName, setNewName] = useState("");
  const [newIssuer, setNewIssuer] = useState("");
  const [newSecret, setNewSecret] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
    const timer = setInterval(() => {
      setTimeRemaining(30 - (Math.floor(Date.now() / 1000) % 30));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAccounts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('two_factor_secrets').select('*').eq('user_id', user.id);
      if (data) setAccounts(data);
    }
    setLoading(false);
  };

  const addAccount = async () => {
    if (!newName || !newSecret) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase.from('two_factor_secrets').insert({
      user_id: user.id,
      account_name: newName,
      issuer: newIssuer || "Unknown",
      encrypted_secret: newSecret.replace(/\s/g, "").toUpperCase()
    }).select().single();

    if (!error) {
      setAccounts([...accounts, data]);
      setNewName("");
      setNewIssuer("");
      setNewSecret("");
    }
  };

  const deleteAccount = async (id: string) => {
    const { error } = await supabase.from('two_factor_secrets').delete().eq('id', id);
    if (!error) setAccounts(accounts.filter(a => a.id !== id));
  };

  const generateCode = (secret: string) => {
    try {
      const totp = new OTPAuth.TOTP({ secret });
      return totp.generate();
    } catch {
      return "ERROR";
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-bold mb-2">2FA Command Center</h1>
        <p className="text-gray-400">Securely store and generate TOTP codes linked to your account.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass p-8 rounded-3xl border border-white/10 space-y-6 h-fit">
          <h2 className="text-xl font-bold flex items-center gap-2"><Plus className="text-blue-500" /> Add New Key</h2>
          <input type="text" placeholder="Service Name (e.g. Google)" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none" />
          <input type="text" placeholder="Issuer (Optional)" value={newIssuer} onChange={(e) => setNewIssuer(e.target.value)} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none" />
          <input type="text" placeholder="Secret Key (Base32)" value={newSecret} onChange={(e) => setNewSecret(e.target.value)} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none font-mono" />
          <button onClick={addAccount} className="w-full bg-blue-600 font-bold py-3 rounded-xl hover:bg-blue-700 transition">Save 2FA Account</button>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {accounts.map(acc => (
            <div key={acc.id} className="glass p-8 rounded-3xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{acc.issuer}</p>
                <h3 className="text-xl font-bold">{acc.account_name}</h3>
                <div className="text-5xl font-black text-blue-500 font-mono tracking-widest mt-4">
                  {generateCode(acc.encrypted_secret).match(/.{1,3}/g)?.join(" ")}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                 <div className="relative w-12 h-12">
                   <svg className="w-full h-full transform -rotate-90">
                     <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                     <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="125.6" strokeDashoffset={125.6 * (1 - timeRemaining/30)} className="text-blue-500 transition-all duration-1000" />
                   </svg>
                   <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-blue-400">{timeRemaining}</span>
                 </div>
                 <button onClick={() => deleteAccount(acc.id)} className="p-3 hover:bg-red-500/10 rounded-xl transition text-gray-400 hover:text-red-500"><Trash2 /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
