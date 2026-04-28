"use client";

import { useState } from "react";
import { Search, ShieldAlert, ShieldCheck, Globe, AlertTriangle, ExternalLink, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PhishingPage() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const scanUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setScanning(true);
    setResult(null);

    setTimeout(() => {
      const issues = [];
      let riskScore = 0;

      const suspiciousKeywords = ["login", "verify", "update", "bank", "secure", "account", "paypal", "wallet"];
      const lowerUrl = url.toLowerCase();

      // Heuristics
      if (suspiciousKeywords.some(kw => lowerUrl.includes(kw))) {
        issues.push("Contains suspicious keywords often used in phishing.");
        riskScore += 30;
      }

      if (url.length > 50) {
        issues.push("Unusually long URL (often used to hide real domain).");
        riskScore += 20;
      }

      if (!url.startsWith("https://")) {
        issues.push("Unsecured connection (HTTP instead of HTTPS).");
        riskScore += 40;
      }

      const domain = url.split("/")[2] || "";
      if (domain.split(".").length > 3) {
        issues.push("Excessive subdomains (common in phishing hosts).");
        riskScore += 25;
      }

      if (riskScore >= 60) {
        setResult({ status: "dangerous", score: riskScore, issues });
      } else if (riskScore >= 20) {
        setResult({ status: "warning", score: riskScore, issues });
      } else {
        setResult({ status: "safe", score: riskScore, issues: ["No immediate threats detected."] });
      }
      
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-bold mb-2">Phishing Detector</h1>
        <p className="text-gray-400">Scan suspicious links before you click them.</p>
      </div>

      <div className="glass p-10 rounded-[32px] border border-white/10 relative overflow-hidden">
        <form onSubmit={scanUrl} className="relative z-10 space-y-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
             <Globe className="w-12 h-12 text-blue-500 animate-pulse" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">URL Security Scanner</h2>
            <p className="text-gray-400">Our heuristic engine analyzes the URL structure for malicious patterns.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://suspicious-site.com/verify-account"
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-blue-500 transition"
            />
            <button
              disabled={scanning}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl transition shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {scanning ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Scan URL</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className={`md:col-span-1 glass p-8 rounded-3xl border flex flex-col items-center justify-center text-center space-y-4 ${
              result.status === "dangerous" ? "border-red-500/30 bg-red-500/5" :
              result.status === "warning" ? "border-orange-500/30 bg-orange-500/5" :
              "border-green-500/30 bg-green-500/5"
            }`}>
              {result.status === "dangerous" ? <ShieldAlert className="w-16 h-16 text-red-500" /> :
               result.status === "warning" ? <AlertTriangle className="w-16 h-16 text-orange-500" /> :
               <ShieldCheck className="w-16 h-16 text-green-500" />}
              <div>
                <h3 className={`text-2xl font-bold uppercase ${
                  result.status === "dangerous" ? "text-red-500" :
                  result.status === "warning" ? "text-orange-500" :
                  "text-green-500"
                }`}>{result.status}</h3>
                <p className="text-gray-400 font-medium">Risk Score: {result.score}/100</p>
              </div>
            </div>

            <div className="md:col-span-2 glass p-8 rounded-3xl border border-white/10 space-y-4">
              <h4 className="text-lg font-bold flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" /> Scan Details
              </h4>
              <div className="space-y-3">
                {result.issues.map((issue: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                      result.status === "dangerous" ? "bg-red-500" :
                      result.status === "warning" ? "bg-orange-500" :
                      "bg-green-500"
                    }`} />
                    <p className="text-gray-300 text-sm leading-relaxed">{issue}</p>
                  </div>
                ))}
              </div>
              
              {result.status !== "safe" && (
                <div className="pt-4 mt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-2">Recommendation</p>
                  <p className="text-sm text-red-400">Do not enter any personal or financial information on this site. Close the tab immediately.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
