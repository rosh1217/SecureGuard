"use client";

import { useState, useRef, useEffect } from "react";
import { ScanFace, ShieldCheck, Camera, RefreshCw, Lock, Unlock, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as faceapi from "face-api.js";

export default function FaceUnlockPage() {
  const [status, setStatus] = useState<"loading" | "idle" | "scanning" | "success" | "error">("loading");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState("Initializing vision engine...");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReadyToScan, setIsReadyToScan] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setStatus("idle");
        setMessage("Ready for scanning.");
        if (localStorage.getItem("face_descriptor")) setIsRegistered(true);
      } catch (err) {
        setStatus("error");
        setMessage("Failed to load AI models.");
      }
    };
    loadModels();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
      }
    } catch (err) {
      setHasPermission(false);
    }
  };

  const handleVideoPlay = () => {
    detectFace();
  };

  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Wait for video to have valid dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setTimeout(detectFace, 100);
      return;
    }

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    const interval = setInterval(async () => {
      if (!video || !canvas) {
        clearInterval(interval);
        return;
      }

      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();
      
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      if (detections) {
        setIsReadyToScan(true);
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        // Draw Mesh
        ctx!.strokeStyle = '#22c55e'; // Green
        ctx!.lineWidth = 2;
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      } else {
        setIsReadyToScan(false);
      }
    }, 100);

    return () => clearInterval(interval);
  };

  const handleRegister = async () => {
    if (!isReadyToScan) return;
    setStatus("scanning");
    const detection = await faceapi.detectSingleFace(videoRef.current!, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
    if (detection) {
      localStorage.setItem("face_descriptor", JSON.stringify(Array.from(detection.descriptor)));
      setIsRegistered(true);
      setStatus("success");
    }
  };

  const handleVerify = async () => {
    if (!isReadyToScan) return;
    setStatus("scanning");
    const savedDescriptor = new Float32Array(JSON.parse(localStorage.getItem("face_descriptor")!));
    const faceMatcher = new faceapi.FaceMatcher([new faceapi.LabeledFaceDescriptors("user", [savedDescriptor])], 0.6);

    const detection = await faceapi.detectSingleFace(videoRef.current!, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
    if (detection) {
      const match = faceMatcher.findBestMatch(detection.descriptor);
      if (match.label === "user") setStatus("success");
      else alert("Identity Verification Failed!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Face Biometrics</h1>
        <p className="text-gray-400">Robust identity verification with AR mesh mapping.</p>
      </div>

      <div className="relative w-full max-w-md mx-auto aspect-square glass rounded-[40px] overflow-hidden border-2 border-white/10">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline 
          onPlay={handleVideoPlay}
          className="w-full h-full object-cover" 
        />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        <AnimatePresence>
          {status === "scanning" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-blue-500/10 pointer-events-none">
              <motion.div animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 2, repeat: Infinity }} className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_blue]" />
            </motion.div>
          )}
        </AnimatePresence>

        {!hasPermission && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <button onClick={startCamera} className="bg-blue-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Camera /> Enable Camera</button>
          </div>
        )}
      </div>

      <div className="max-w-md mx-auto text-center space-y-6">
        <div className={`p-4 rounded-2xl border transition ${isReadyToScan ? "bg-green-500/10 border-green-500/50" : "bg-red-500/10 border-red-500/50"}`}>
           <p className={`font-bold ${isReadyToScan ? "text-green-500" : "text-red-500"}`}>
             {isReadyToScan ? "✓ Ready to Scan" : "⚠ Position Face in Frame"}
           </p>
        </div>

        {!isRegistered ? (
          <button onClick={handleRegister} disabled={!isReadyToScan || status === "scanning"} className="w-full bg-blue-600 py-4 rounded-2xl font-bold disabled:opacity-50">Enroll Biometric Profile</button>
        ) : (
          <button onClick={handleVerify} disabled={!isReadyToScan || status === "scanning"} className="w-full bg-green-600 py-4 rounded-2xl font-bold disabled:opacity-50">Verify Identity</button>
        )}
      </div>
    </div>
  );
}
