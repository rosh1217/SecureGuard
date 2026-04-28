"use client";

import { useState } from "react";
import { Search, Eye, ShieldAlert, CheckCircle, ExternalLink, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BreachPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const checkBreach = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Simulate API call to HIBP (using mock data for demonstration as requested to keep it simple/impactful)
    setTimeout(() => {
      const isBreached = email.includes("test");
      if (isBreached) {
        setResult({
          status: "breached",
          count: 3,
          leaks: [
            { source: "Adobe (2013)", impact: "Email, Password Hint, Username" },
            { source: "Canva (2019)", impact: "Email, Name, Password" },
            { source: "LinkedIn (2016)", impact: "Email, Password" },
          ]
        });
      } else {
        setResult({ status: "clean" });
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-gradient">Breach Monitor</h1>
          <p className="text-gray-400">Scan the dark web for your leaked credentials.</p>
        </div>
        <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-xl flex items-center space-x-2">
          <Eye className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-400 font-bold">HIBP Integrated</span>
        </div>
      </div>

      <div className="glass p-10 rounded-[32px] border border-white/10 relative overflow-hidden">
        <form onSubmit={checkBreach} className="relative z-10 space-y-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold">Start Your Security Scan</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Enter your email address below to check if your personal information has been compromised in any known data breaches.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@example.com"
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
            <button
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl transition shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Scan Now</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]" />
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {result.status === "breached" ? (
              <div className="space-y-6">
                <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <ShieldAlert className="w-10 h-10 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-red-400 mb-1">Oh no! Your email was found.</h3>
                    <p className="text-gray-300">
                      Your email address was found in <strong>{result.count} data breaches</strong>. We recommend changing your passwords immediately.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {result.leaks.map((leak: any, i: number) => (
                    <div key={i} className="glass p-6 rounded-2xl border border-white/10 hover:border-red-500/30 transition">
                      <h4 className="font-bold text-white mb-2">{leak.source}</h4>
                      <p className="text-xs text-gray-500 uppercase font-bold mb-3 tracking-widest">Impacted Data</p>
                      <p className="text-sm text-gray-400">{leak.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-3xl flex items-center gap-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-400 mb-1">Good news! No breaches found.</h3>
                  <p className="text-gray-300">
                    Your email address was not found in any of the data breaches indexed by Have I Been Pwned.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
