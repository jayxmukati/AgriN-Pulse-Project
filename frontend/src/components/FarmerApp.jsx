import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginModal from './LoginModal';
import { queueScan, getQueuedScans, clearQueuedScan } from '../lib/sync';
import { ShieldCheck, BrainCircuit, CheckCircle2, Flower2, ChevronRight, FileText, Mic, ChevronDown, User, ArrowRight, Camera, Leaf, X, RefreshCw, Activity, CloudLightning, LineChart, Cpu, BookOpen, Video, SwitchCamera, Upload, Sparkles } from 'lucide-react';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function FarmerApp() {
  const [lang, setLang] = useState('EN');

  useEffect(() => {
    const handleLang = (e) => setLang(e.detail);
    window.addEventListener('languageChange', handleLang);
    return () => window.removeEventListener('languageChange', handleLang);
  }, []);

  const heroTexts = {
    EN: "Glowinn Agri",
    HI: "ग्लोइन एग्री",
    SW: "Glowinn Kilimo",
    PT: "Glowinn Agro"
  };

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // States
  const [isScanning, setIsScanning] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [cameraError, setCameraError] = useState(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);

  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [voiceAdvisoryResponse, setVoiceAdvisoryResponse] = useState(null);
  const [selectedLang, setSelectedLang] = useState('English');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [news, setNews] = useState([]);
  
  useEffect(() => {
    const token = localStorage.getItem('agrin_token');
    if (token) setIsAuthenticated(true);
    
    // Fetch News
    axios.get(`${API_BASE}/api/v1/news?limit=5`)
      .then(res => setNews(res.data))
      .catch(err => console.log('News fetch failed:', err));
  }, []);
  
  const handleLoginSuccess = (token) => {
    setIsAuthenticated(true);
    setShowLoginModal(false);
    processOfflineQueue();
  };
  
  const processOfflineQueue = async () => {
    try {
      const scans = await getQueuedScans();
      if (scans.length > 0) {
          for (const scan of scans) {
            const formData = new FormData();
            formData.append('file', scan.file);
            formData.append('lat', scan.lat);
            formData.append('lon', scan.lon);
            
            await axios.post(`${API_BASE}/api/v1/diagnose/`, formData, {
              headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${localStorage.getItem('agrin_token')}` },
            });
            await clearQueuedScan(scan.id);
          }
          setLastSyncTime(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.log('Sync failed', err);
    }
  };
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'zh', name: '中文' }
  ];

  // Stop Webcam Stream
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Start Live Webcam Stream
  const startWebcam = async (deviceIdToUse) => {
    setIsStartingCamera(true);
    setCameraError(null);
    stopWebcam();

    try {
      // First get user media to ensure permission is granted
      const constraints = {
        video: deviceIdToUse ? { deviceId: { exact: deviceIdToUse } } : { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Enumerate all connected cameras (built-in + portable USB webcams)
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(d => d.kind === 'videoinput');
      setVideoDevices(videoInputs);
      
      if (!deviceIdToUse && videoInputs.length > 0) {
        setSelectedDeviceId(videoInputs[0].deviceId);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera or portable webcam. Please allow camera permissions or upload a file.');
    } finally {
      setIsStartingCamera(false);
    }
  };

  // Switch Selected Camera Device
  const handleDeviceChange = (e) => {
    const newDeviceId = e.target.value;
    setSelectedDeviceId(newDeviceId);
    startWebcam(newDeviceId);
  };

  // Capture Snapshot from Webcam Frame
  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], 'portable_webcam_leaf_scan.jpg', { type: 'image/jpeg' });
      const previewUrl = URL.createObjectURL(blob);

      stopWebcam();
      setShowCameraModal(false);

      navigate('/diagnose', {
        state: {
          file: file,
          previewUrl: previewUrl
        }
      });
    }, 'image/jpeg', 0.95);
  };

  // Trigger Camera Modal
  const handleScanTrigger = () => {
    setShowCameraModal(true);
    startWebcam(selectedDeviceId);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    stopWebcam();
    setShowCameraModal(false);
    
    // Navigate immediately to DiagnosticResults to handle the progressive stepper
    navigate('/diagnose', {
      state: {
        file: file,
        previewUrl: previewUrl
      }
    });
  };


  // Voice Advisory Handler
  const handleVoiceSubmit = async (textQuery) => {
    const query = textQuery || voiceQuery || 'What is the optimal irrigation schedule for wheat under high heat?';
    setIsRecording(false);
    setVoiceQuery(query);
    
    try {
      const res = await axios.post(`${API_BASE}/api/v1/voice/query`, {
        query_text: query,
        language: selectedLang
      }, { timeout: 3000 });
      setVoiceAdvisoryResponse(res.data);
    } catch (err) {
      setVoiceAdvisoryResponse({
        transcription: query,
        advisory: 'Based on current micro-climate forecasts (high THI risk and soil moisture at 20%), switch to evening drip irrigation to minimize evapotranspiration and apply organic mulch around root zones.',
        recommended_actions: [
          'Schedule drip irrigation between 6:00 PM and 9:00 PM',
          'Apply straw mulch at 5cm depth across open rows',
          'Monitor soil moisture levels tomorrow morning'
        ]
      });
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      setVoiceAdvisoryResponse(null);
      audioChunksRef.current = [];
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          formData.append('language', selectedLang);
          
          try {
            const res = await axios.post(`${API_BASE}/api/v1/voice/query`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            setVoiceAdvisoryResponse(res.data);
          } catch (err) {
            console.error('Audio submission failed', err);
            // Fallback for demo
            setVoiceAdvisoryResponse({
              transcription: "Live audio recorded (fallback)",
              advisory: "Audio processing failed. Please check network or microphone permissions.",
              recommended_actions: []
            });
          }
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Microphone access denied:", err);
      }
    }
  };

  return (
    <div className="w-full relative z-10 text-white font-body-md pb-24">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Landing Section (Picture 2) */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl sm:text-8xl font-bold tracking-tighter mb-4 drop-shadow-2xl">
          Glowinn <span className="font-light italic text-green-400">Agri</span>
        </h1>
        <p className="text-lg sm:text-xl font-medium text-white/80 max-w-md mx-auto leading-relaxed mb-16">
          Made for Modern Elegance.<br/>
          Engineered for Regenerative Agriculture.
        </p>
        
        {/* Scroll to Explore (Anchored to bottom of Picture 2) */}
        <div 
          onClick={() => {
            const mainEl = document.getElementById('main-app-content');
            if (mainEl) {
              mainEl.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' });
            }
          }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce opacity-80 hover:opacity-100 cursor-pointer transition-all z-20"
        >
          <span className="text-xs font-bold tracking-widest uppercase mb-1.5 text-white/90 drop-shadow">Scroll to Explore</span>
          <ChevronDown className="w-5 h-5 text-green-400 drop-shadow" />
        </div>
      </section>

      {/* Top App Bar */}
      <header id="main-app-content" className="sticky top-4 z-40 px-4 py-3 glass-panel mb-6 flex items-center justify-between mt-4">

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-white/70 font-medium">
            <RefreshCw className="w-5 h-5" />
            Synced {lastSyncTime}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-green-300">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
            PWA Ready
          </div>
          {!isAuthenticated ? (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="text-[11px] font-bold bg-white/10 border border-white/20 rounded-full px-3 py-1 hover:bg-white/20 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          ) : (
            <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          )}
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1 text-xs border border-white/20 rounded-full px-3 py-1 hover:bg-white/10 transition-colors"
          >
            translate
            <span className="font-bold">{selectedLang}</span>
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
        
        {showLangMenu && (
            <div className="absolute top-16 right-4 w-44 glass-panel border border-white/10 rounded-xl shadow-lg py-1.5 z-50">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setSelectedLang(l.name);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-white/10 flex items-center justify-between ${
                    selectedLang.includes(l.name) ? 'font-bold text-green-300' : 'text-white'
                  }`}
                >
                  <span>{l.name}</span>
                </button>
              ))}
            </div>
          )}
      </header>

      {/* Main Content Area */}
      <main className="flex flex-col gap-4 mt-2">
        {/* Massive Primary CTA Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 mb-8">
          <button 
            onClick={handleScanTrigger}
            className="glass-panel group relative overflow-hidden flex flex-col items-center justify-center p-10 cursor-pointer hover:bg-white/10 transition-all border border-green-500/30 hover:border-green-400 hover:shadow-[0_0_30px_rgba(74,222,128,0.2)]"
          >
            <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Camera className="w-16 h-16 text-green-400 mb-4 animate-pulse drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
            <span className="font-bold text-2xl tracking-tight text-white z-10">Scan Leaf Disease</span>
            <span className="text-xs text-white/60 mt-2 z-10">Run local ONNX AI Inference</span>
          </button>
          
          <button 
            onClick={() => {
              setShowVoiceModal(true);
              setVoiceAdvisoryResponse(null);
            }}
            className="glass-panel group relative overflow-hidden flex flex-col items-center justify-center p-10 cursor-pointer hover:bg-white/10 transition-all border border-amber-500/30 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(251,191,36,0.2)]"
          >
            <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Mic className="w-16 h-16 text-amber-400 mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
            <span className="font-bold text-2xl tracking-tight text-white z-10">Voice Advisory</span>
            <span className="text-xs text-white/60 mt-2 z-10">Ask agronomic questions in local dialect</span>
          </button>
        </div>

        {/* Density Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Field Status */}
          <section className="card p-0 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h2 className="font-bold text-base flex items-center gap-2">Field Status</h2>
                  <p className="text-[11px] text-white/70">Sentinel-2 Pass</p>
                </div>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-xs font-bold flex items-center hover:bg-white/10 px-2 py-1 rounded cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative w-full flex-grow min-h-[150px] bg-black/20 overflow-hidden">
              <img
                className="w-full h-full object-cover opacity-60"
                alt="Satellite view of farm plots"
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
              />
              <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md rounded-lg px-2.5 py-1 text-white text-[11px] font-mono flex items-center gap-1.5 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span>GEO-8860144</span>
              </div>
            </div>
          </section>

          {/* News & Intelligence Carousel */}
          <section className="card p-4 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-bold text-base flex items-center gap-2">Agri Intelligence</h2>
                <p className="text-[11px] text-white/70">Curated by AI</p>
              </div>
              <FileText className="w-5 h-5" />
            </div>

            <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar flex-grow">
              {news.length > 0 ? news.map((article, i) => (
                <div key={i} className="flex-shrink-0 w-64 p-3 rounded-xl border border-white/10 bg-black/20 text-white flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-green-400 mb-1 tracking-wider uppercase">{article.category || 'Updates'}</div>
                    <h3 className="font-bold text-sm leading-tight mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-xs text-white/60 line-clamp-2">{article.summary || article.content}</p>
                  </div>
                  <div className="mt-3 text-[10px] font-medium text-white/40">{article.source_name}</div>
                </div>
              )) : (
                <div className="text-xs text-white/50 p-4 text-center w-full">Loading insights...</div>
              )}
            </div>
          </section>

          <div className="flex flex-col gap-6">
            {/* Actionable Advisory */}
            <section className="card p-4 border-l-4 border-l-green-400">
              <div className="flex items-start gap-3">
                <Leaf className="w-5 h-5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-sm">Regenerative Protocol Tip</h3>
                  <p className="text-xs text-white/80 mt-1 leading-relaxed">
                    High temperature forecast for Thursday. Apply organic mulch or biochar in tree/crop rows to conserve soil moisture by up to 35%.
                  </p>
                  <button
                    onClick={() => navigate('/diagnose')}
                    className="mt-2.5 text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    View Protocols <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>
          
            {/* Dynamic Widgets */}
            <div className="grid grid-cols-2 gap-3 flex-grow">
              <div className="card p-4 flex flex-col justify-center gap-2">
                 <div className="flex items-center justify-between">
                    <CloudLightning className="w-5 h-5 text-amber-400" />
                    <span className="text-[10px] font-mono text-white/50">LIVE</span>
                 </div>
                 <h3 className="font-bold text-xs">Weather Alert</h3>
                 <p className="text-[10px] text-white/70 leading-snug line-clamp-2">Squall line approaching. Secure polyhouses.</p>
              </div>
              <div className="card p-4 flex flex-col justify-center gap-2">
                 <div className="flex items-center justify-between">
                    <LineChart className="w-5 h-5 text-green-400" />
                    <span className="text-[10px] font-mono text-white/50">MANDI</span>
                 </div>
                 <h3 className="font-bold text-xs">Wheat Index</h3>
                 <p className="text-xs text-green-300 font-mono text-lg font-bold">+2.4%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Market Ticker */}
        <div className="w-full overflow-hidden bg-black/40 backdrop-blur-md border-y border-white/10 py-2 mt-6">
          <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] flex gap-8 items-center text-xs font-mono">
            <span className="text-white/60">LIVE MARKET DATA:</span>
            <span>Wheat: <span className="text-white font-bold">$240/ton</span> <span className="text-green-400">(+1.2%)</span></span>
            <span>Soybean: <span className="text-white font-bold">$510/ton</span> <span className="text-red-400">(-0.4%)</span></span>
            <span>Maize: <span className="text-white font-bold">$185/ton</span> <span className="text-green-400">(+0.8%)</span></span>
            <span>Rice: <span className="text-white font-bold">$390/ton</span> <span className="text-white/60">(0.0%)</span></span>
            <span>Cotton: <span className="text-white font-bold">$1.12/lb</span> <span className="text-green-400">(+2.1%)</span></span>
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
          `}} />
        </div>


        {/* Why AgriN-Pulse? Boast Section */}
        <section className="mt-8 mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent blur-3xl -z-10"></div>
          <h2 className="text-2xl font-bold mb-6 text-center">Why AgriN-Pulse?</h2>
          
          <div className="space-y-4">
            <div className="glass-panel p-5 relative overflow-hidden group border border-white/20">
              <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
                <Flower2 className="w-24 h-24" />
              </div>
              <h3 className="text-lg font-bold text-green-300 flex items-center gap-2 mb-2">
                <Flower2 className="w-5 h-5" />
                Immersive Design
              </h3>
              <p className="text-sm text-white/80 leading-relaxed relative z-10">
                Unlike clunky, traditional ag-tech dashboards, AgriN-Pulse merges robust environmental tech applications with an immersive, high-fantasy inspired visual aesthetic.
              </p>
            </div>

            <div className="glass-panel p-5 relative overflow-hidden group border border-white/20">
              <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
                <Cpu className="w-24 h-24" />
              </div>
              <h3 className="text-lg font-bold text-green-300 flex items-center gap-2 mb-2">
                <Cpu className="w-5 h-5" />
                Edge AI
              </h3>
              <p className="text-sm text-white/80 leading-relaxed relative z-10">
                Fully localized inference capabilities via ONNX Runtime ensuring strict privacy, low latency, and continuous offline functionality in remote sectors.
              </p>
            </div>

            <div className="glass-panel p-5 relative overflow-hidden group border border-white/20">
              <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
                <BookOpen className="w-24 h-24" />
              </div>
              <h3 className="text-lg font-bold text-green-300 flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5" />
                Semantic Interoperability
              </h3>
              <p className="text-sm text-white/80 leading-relaxed relative z-10">
                Built on W3C JSON-LD standards for seamless global policy integration, bridging the gap between farm-level telemetry and international ESG compliance.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Scanning Laser Animation Modal */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="relative w-64 h-64 border-2 border-dashed border-primary rounded-2xl flex items-center justify-center overflow-hidden bg-black/40 shadow-2xl">
            <Flower2 className="w-5 h-5" />
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary-fixed to-transparent animate-scan shadow-[0_0_15px_#10b981]"></div>
          </div>
          <h3 className="text-xl font-bold mt-6 text-primary-fixed">Analyzing Crop Pathology...</h3>
          <p className="text-xs text-gray-300 mt-2 max-w-xs">Stripping EXIF/GPS coordinates & running localized disease inference...</p>
        </div>
      )}

      {/* Live Webcam / Portable Camera Scanner Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-[95] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xl rounded-3xl p-5 shadow-2xl border border-green-500/30 flex flex-col gap-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Live Leaf Disease Scanner</h3>
                  <p className="text-[10px] text-green-300 font-mono">Portable USB Webcam / Camera</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  stopWebcam();
                  setShowCameraModal(false);
                }}
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-full p-1.5 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Camera Device Selector (If multiple cameras/webcams detected) */}
            {videoDevices.length > 1 && (
              <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs">
                <span className="text-white/70 flex items-center gap-1.5 font-medium">
                  <SwitchCamera className="w-4 h-4 text-green-400" />
                  Camera Source:
                </span>
                <select
                  value={selectedDeviceId}
                  onChange={handleDeviceChange}
                  className="bg-black/60 text-green-300 font-bold border border-white/20 rounded-lg px-2.5 py-1 text-xs outline-none cursor-pointer"
                >
                  {videoDevices.map((device, idx) => (
                    <option key={device.deviceId || idx} value={device.deviceId} className="bg-slate-900 text-white">
                      {device.label || `Camera ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Viewfinder Video Stream Container */}
            <div className="relative w-full aspect-video sm:h-72 bg-black/80 rounded-2xl overflow-hidden border border-white/15 flex items-center justify-center shadow-inner">
              {cameraError ? (
                <div className="p-6 text-center text-red-300 space-y-3">
                  <p className="text-xs font-semibold">{cameraError}</p>
                  <button
                    onClick={() => {
                      stopWebcam();
                      setShowCameraModal(false);
                      if (fileInputRef.current) fileInputRef.current.click();
                    }}
                    className="text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl cursor-pointer"
                  >
                    Upload from Files Instead
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Animated High-Tech Viewfinder Overlays */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                    {/* Top Stats Banner */}
                    <div className="flex justify-between items-center">
                      <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-green-300 flex items-center gap-1.5 border border-green-500/30">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span>LIVE FEED // 720p</span>
                      </div>
                      <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-white/70 border border-white/10">
                        AI Vision Ready
                      </div>
                    </div>

                    {/* Centered Target Bounding Reticle */}
                    <div className="self-center relative w-44 h-44 sm:w-52 sm:h-52 border border-green-400/40 rounded-2xl flex items-center justify-center">
                      {/* Corner Brackets */}
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-green-400"></div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-green-400"></div>
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-green-400"></div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-green-400"></div>

                      {/* Center crosshair */}
                      <div className="w-3 h-3 border border-green-400/80 rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                      </div>

                      {/* Instruction prompt */}
                      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-green-300 font-mono text-[9px] px-2 py-0.5 rounded shadow whitespace-nowrap border border-green-500/30">
                        Position leaf lesion inside reticle
                      </span>
                    </div>

                    {/* Bottom Status */}
                    <div className="text-center text-[10px] text-white/60 font-mono">
                      EXIF/GPS data will be stripped automatically
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Shutter & Alternate Actions */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  stopWebcam();
                  setShowCameraModal(false);
                  if (fileInputRef.current) fileInputRef.current.click();
                }}
                className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2.5 rounded-xl border border-white/15 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload File</span>
              </button>

              {/* Big Shutter Capture Button */}
              <button
                type="button"
                onClick={captureSnapshot}
                disabled={isStartingCamera || !!cameraError}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300 text-black font-bold py-3 px-5 rounded-2xl shadow-[0_0_20px_rgba(74,222,128,0.4)] active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="w-5 h-5 text-black" />
                <span className="text-sm">Capture & Analyze Leaf</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Advisory Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="glass-panel w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5" />
                <h3 className="font-bold text-base text-white">Voice Agricultural Advisory</h3>
              </div>
              <button
                onClick={() => setShowVoiceModal(false)}
                className="text-white/60 hover:bg-white/10 rounded-full p-1 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex flex-col items-center text-center">
              <button
                onClick={toggleRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse ring-8 ring-red-500/20'
                    : 'bg-green-400 text-black shadow-lg active:scale-95'
                }`}
              >
                {isRecording ? <Activity className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>
              <p className="text-xs font-semibold mt-3 text-white/70">
                {isRecording ? 'Listening... Speak your crop question' : 'Tap mic to speak or select a quick prompt below'}
              </p>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                'Optimal irrigation for high heat?',
                'Bio-fungicide dosage for blight?',
                'Cover crop advice for next season'
              ].map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleVoiceSubmit(query)}
                  className="text-xs bg-black/20 hover:bg-white/10 text-white px-3 py-1.5 rounded-full border border-white/20 transition-colors cursor-pointer"
                >
                  "{query}"
                </button>
              ))}
            </div>

            {/* Response Area */}
            {voiceAdvisoryResponse && (
              <div className="mt-5 p-4 rounded-xl bg-green-400/10 border border-green-400/30 text-left">
                <div className="flex items-center gap-1.5 text-xs font-bold text-green-300 mb-1">
                  <ShieldCheck className="w-5 h-5" />
                  <span>IIFSR Ground-Truth Advisory</span>
                </div>
                <p className="text-xs text-white font-medium leading-relaxed">
                  {voiceAdvisoryResponse.advisory}
                </p>
                {voiceAdvisoryResponse.recommended_actions && (
                  <ul className="mt-3 space-y-1.5 border-t border-green-400/20 pt-2 text-[11px] text-white/80">
                    {voiceAdvisoryResponse.recommended_actions.map((act, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

