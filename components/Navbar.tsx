"use client";

import Link from "next/link";
import { Shield, Lock, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-500" />
            <span className="font-bold text-xl tracking-tight text-white">SecureGuard</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-gray-300 hover:text-white transition">Features</Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition">About</Link>
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>Secure Login</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass border-b border-white/10"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/features" className="block px-3 py-2 text-gray-300 hover:text-white">Features</Link>
              <Link href="/about" className="block px-3 py-2 text-gray-300 hover:text-white">About</Link>
              <Link href="/login" className="block px-3 py-2 text-blue-400 font-medium">Login</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
