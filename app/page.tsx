import Navbar from "@/components/Navbar";
import { Shield, Lock, Eye, Database, QrCode, ScanFace, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Enterprise-grade security for everyone</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Your Digital Life, <span className="text-gradient">Fortified.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            SecureGuard is your all-in-one cybersecurity command center. Monitor breaches, secure passwords, and protect your identity with advanced biometric encryption.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2">
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#features" className="w-full sm:w-auto glass hover:bg-white/5 text-white px-8 py-4 rounded-xl font-bold text-lg transition border border-white/10 flex items-center justify-center">
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Protection</h2>
            <p className="text-gray-400">Every tool you need to stay safe in the digital world.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Lock className="w-8 h-8 text-blue-500" />}
              title="Password Health"
              description="Analyze password strength, detect reuse, and generate unhackable alternatives."
            />
            <FeatureCard 
              icon={<Eye className="w-8 h-8 text-purple-500" />}
              title="Breach Monitor"
              description="Real-time alerts if your credentials appear in known data breaches."
            />
            <FeatureCard 
              icon={<Shield className="w-8 h-8 text-green-500" />}
              title="Phishing Detector"
              description="Scan suspicious links for malicious patterns before you click."
            />
            <FeatureCard 
              icon={<Database className="w-8 h-8 text-orange-500" />}
              title="Encrypted Vault"
              description="Zero-knowledge AES-256 encryption for your most sensitive data."
            />
            <FeatureCard 
              icon={<QrCode className="w-8 h-8 text-red-500" />}
              title="2FA Manager"
              description="Secure TOTP generation for all your online accounts."
            />
            <FeatureCard 
              icon={<ScanFace className="w-8 h-8 text-cyan-500" />}
              title="Face Unlock"
              description="Biometric secondary authentication for your secure vault."
            />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 border-t border-white/5 text-center text-gray-500">
        <p>© 2025 SecureGuard. Built for maximum privacy and impact.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass p-8 rounded-2xl hover:border-blue-500/50 transition duration-300 group">
      <div className="mb-6 p-3 bg-white/5 w-fit rounded-xl group-hover:scale-110 transition duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
