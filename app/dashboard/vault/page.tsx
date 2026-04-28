"use client";

import { useState, useEffect, useRef } from "react";
import { Lock, Unlock, Plus, Trash2, Eye, EyeOff, Save, KeyRound, AlertTriangle, ShieldAlert, RotateCcw, RefreshCw } from "lucide-react";
import CryptoJS from "crypto-js";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

interface VaultItem {
  id: string;
  title: string;
  encrypted_content: string;
}

export default function VaultPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [masterKey, setMasterKey] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Setup States
  const [showSetup, setShowSetup] = useState(false);
  const [setupKey, setSetupKey] = useState("");
  const [recoveryQuestion, setRecoveryQuestion] = useState("");
  const [recoveryAnswer, setRecoveryAnswer] = useState("");
  
  // Lockout States
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [showContent, setShowContent] = useState<string | null>(null);

  useEffect(() => {
    fetchUserAndProfile();
  }, []);

  const fetchUserAndProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(profile);
      if (!profile?.master_key_hash) {
        setShowSetup(true);
      }
      fetchVaultItems();
    }
    setLoading(false);
  };

  const fetchVaultItems = async () => {
    const { data } = await supabase.from('vault_items').select('*');
    if (data) setItems(data);
  };

  const handleLockout = (attempts: number) => {
    const waitTimes = [0, 0, 0, 1, 2, 5, 10, 15, 60]; // minutes
    const wait = waitTimes[Math.min(attempts, waitTimes.length - 1)];
    if (wait > 0) {
      const until = Date.now() + wait * 60 * 1000;
      setLockoutTime(until);
      localStorage.setItem("vault_lockout", until.toString());
    }
  };

  const handleUnlock = async () => {
    const now = Date.now();
    const savedLockout = localStorage.getItem("vault_lockout");
    if (savedLockout && now < parseInt(savedLockout)) {
      alert(`Vault locked. Try again in ${Math.ceil((parseInt(savedLockout) - now) / 60000)} minutes.`);
      return;
    }

    // Hash the entered key to compare
    const enteredHash = CryptoJS.SHA256(masterKey).toString();
    
    if (enteredHash === profile.master_key_hash) {
      setIsUnlocked(true);
      setFailedAttempts(0);
      localStorage.removeItem("vault_lockout");
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      handleLockout(newAttempts);
      alert(`Invalid Master Key. Attempt ${newAttempts}/3 before lockout.`);
      if (newAttempts >= 3) {
        setMasterKey("");
      }
    }
  };

  const handleSetup = async () => {
    if (setupKey.length < 8) {
      alert("Master Key must be at least 8 characters.");
      return;
    }
    const keyHash = CryptoJS.SHA256(setupKey).toString();
    const answerHash = CryptoJS.SHA256(recoveryAnswer.toLowerCase()).toString();

    const { error } = await supabase.from('profiles').update({
      master_key_hash: keyHash,
      recovery_question: recoveryQuestion,
      recovery_answer_hash: answerHash
    }).eq('id', user.id);

    if (!error) {
      setShowSetup(false);
      setProfile({ ...profile, master_key_hash: keyHash });
      alert("Vault Security Initialized.");
    }
  };

  const handleForget = async () => {
    const answer = prompt(`Recovery Question: ${profile.recovery_question}\n\nEnter Answer:`);
    if (!answer) return;

    const answerHash = CryptoJS.SHA256(answer.toLowerCase()).toString();
    if (answerHash === profile.recovery_answer_hash) {
       if (confirm("Correct answer. To reset your Master Key, all current vault data MUST be erased for security. Proceed?")) {
         await supabase.from('vault_items').delete().eq('user_id', user.id);
         await supabase.from('profiles').update({ master_key_hash: null }).eq('id', user.id);
         window.location.reload();
       }
    } else {
      alert("Incorrect recovery answer. Access denied.");
    }
  };

  const addItem = async () => {
    if (!newTitle || !newContent) return;
    const encrypted = CryptoJS.AES.encrypt(newContent, masterKey).toString();
    const { data, error } = await supabase.from('vault_items').insert({
      user_id: user.id,
      title: newTitle,
      encrypted_content: encrypted
    }).select().single();

    if (!error) {
      setItems([...items, data]);
      setNewTitle("");
      setNewContent("");
    }
  };

  const decryptContent = (encrypted: string) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, masterKey);
      return bytes.toString(CryptoJS.enc.Utf8) || "DECRYPTION_ERROR";
    } catch {
      return "INVALID_KEY";
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><RefreshCw className="animate-spin" /></div>;

  if (showSetup) {
    return (
      <div className="max-w-md mx-auto mt-20 glass p-10 rounded-[40px] border border-white/10 space-y-8">
        <div className="text-center">
          <KeyRound className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold">Setup Vault</h2>
          <p className="text-gray-400">Initialize your zero-knowledge master key.</p>
        </div>
        <div className="space-y-4">
          <input type="password" placeholder="New Master Key (8+ chars)" value={setupKey} onChange={(e) => setSetupKey(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500" />
          <input type="text" placeholder="Recovery Question (e.g. Pet name)" value={recoveryQuestion} onChange={(e) => setRecoveryQuestion(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500" />
          <input type="text" placeholder="Recovery Answer" value={recoveryAnswer} onChange={(e) => setRecoveryAnswer(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500" />
          <button onClick={handleSetup} className="w-full bg-blue-600 font-bold py-4 rounded-2xl hover:bg-blue-700 transition">Initialize Vault</button>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto mt-20 glass p-10 rounded-[40px] border border-white/10 text-center space-y-8">
        <Lock className="w-16 h-16 text-blue-500 mx-auto" />
        <h2 className="text-3xl font-bold">Vault Locked</h2>
        <input type="password" placeholder="Master Key..." value={masterKey} onChange={(e) => setMasterKey(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-center text-xl tracking-widest outline-none focus:border-blue-500" />
        <div className="space-y-3">
          <button onClick={handleUnlock} className="w-full bg-blue-600 font-bold py-4 rounded-2xl hover:bg-blue-700 transition">Unlock Vault</button>
          <button onClick={handleForget} className="text-sm text-gray-500 hover:text-white transition">Forgot Master Key?</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold mb-2">Secure Vault</h1>
          <p className="text-gray-400">Manage your encrypted secrets safely.</p>
        </div>
        <button onClick={() => { setIsUnlocked(false); setMasterKey(""); }} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white">
          <Lock className="w-4 h-4" /> Lock Vault
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass p-8 rounded-3xl border border-white/10 space-y-6 h-fit">
          <h3 className="text-xl font-bold flex items-center gap-2"><Plus className="text-blue-500" /> New Entry</h3>
          <input type="text" placeholder="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none" />
          <textarea placeholder="Secret Content" value={newContent} onChange={(e) => setNewContent(e.target.value)} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none resize-none" rows={5} />
          <button onClick={addItem} className="w-full bg-blue-600 font-bold py-3 rounded-xl hover:bg-blue-700 transition">Encrypt & Save</button>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="glass p-6 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-bold text-white text-lg">{item.title}</h4>
                {showContent === item.id ? (
                  <p className="mt-2 text-blue-400 font-mono text-sm break-all bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">{decryptContent(item.encrypted_content)}</p>
                ) : (
                  <p className="mt-2 text-gray-600 font-mono tracking-widest">••••••••••••••••</p>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => setShowContent(showContent === item.id ? null : item.id)} className="p-3 hover:bg-white/10 rounded-xl transition text-gray-400">
                  {showContent === item.id ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <button onClick={async () => { await supabase.from('vault_items').delete().eq('id', item.id); fetchVaultItems(); }} className="p-3 hover:bg-red-500/10 rounded-xl transition text-gray-400 hover:text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
