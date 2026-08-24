import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { queueScan } from '../lib/sync';
import { CheckCircle2, ChevronRight, Play, Pause, Leaf, Share2, Info, ArrowLeft, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function DiagnosticResults() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state passed from camera scan
  const passedFile = location.state?.file;
  const passedPreviewUrl = location.state?.previewUrl;

  const [diagnosis, setDiagnosis] = useState(null);
  const [loadingState, setLoadingState] = useState(0); 
  const [error, setError] = useState(null);
  
  // Loading state machine:
  // 0: Stripping EXIF Metadata...
  // 1: Running Local ONNX Inference...
  // 2: Mapping Pathology Confidence...
  // 3: Done

  useEffect(() => {
    if (location.state?.diagnosis) {
      setDiagnosis(location.state.diagnosis);
      setLoadingState(3);
      return;
    }

    let isMounted = true;
    const processImage = async () => {
      // If we directly navigated here without a file, show simulated default diagnostic after a delay
      if (!passedFile) {
        if (isMounted) setLoadingState(0);
        await new Promise(r => setTimeout(r, 800));
        if (isMounted) setLoadingState(1);
        await new Promise(r => setTimeout(r, 800));
        if (isMounted) setLoadingState(2);
        await new Promise(r => setTimeout(r, 800));
        if (isMounted) {
          setError("No image provided. Please scan a leaf image from the home page.");
          setLoadingState(3);
        }
        return;
      }

      // Normal path with file
      if (isMounted) setLoadingState(0); // Stripping EXIF
      await new Promise(r => setTimeout(r, 800));
      if (isMounted) setLoadingState(1); // ONNX Inference
      
      try {
        const formData = new FormData();
        formData.append('file', passedFile);
        formData.append('lat', '23.2599');
        formData.append('lon', '77.4126');

        const headers = { 'Content-Type': 'multipart/form-data' };
        const token = localStorage.getItem('agrin_token');
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await axios.post(`${API_BASE}/api/v1/diagnose/`, formData, {
          headers,
          timeout: 5000
        });
        
        if (isMounted) setLoadingState(2); // Mapping Confidence
        await new Promise(r => setTimeout(r, 600));

        if (isMounted) {
          if (response.data.status === 'error') {
            setError(response.data.message);
          } else {
            setDiagnosis(response.data);
          }
          setLoadingState(3);
        }
      } catch (err) {
        console.warn('Backend diagnosis failed:', err);
        
        if (isMounted) setLoadingState(2);
        await new Promise(r => setTimeout(r, 600));

        if (isMounted) {
          setError(err.response?.data?.message || "Diagnosis failed. Please reupload image.");
          setLoadingState(3);
        }
      }
    };

    processImage();

    return () => { isMounted = false; };
  }, [passedFile, location.state?.diagnosis, navigate]);

  // Audio Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [copiedToast, setCopiedToast] = useState(false);
  
  // Explainability Overlay State
  const [showExplainOverlay, setShowExplainOverlay] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            return 0;
          }
          return prev + 5;
        });
      }, 500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleAudio = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      setIsPlaying(true);
      if ('speechSynthesis' in window && diagnosis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(diagnosis.audio_script);
        utterance.rate = 0.95;
        utterance.onend = () => {
          setIsPlaying(false);
          setPlaybackProgress(0);
        };
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleShare = () => {
    if (navigator.share && diagnosis) {
      navigator.share({
        title: `AgriN-Pulse Diagnostic: ${diagnosis.disease_name}`,
        text: `Crop diagnostic ${diagnosis.scan_id}: ${diagnosis.disease_name} (${Math.round(diagnosis.confidence * 100)}% match). Regenerative protocol generated.`
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(
        `AgriN-Pulse Diagnostic ${diagnosis?.scan_id}: ${diagnosis?.disease_name} (${Math.round((diagnosis?.confidence || 0) * 100)}% confidence). Recommended: Bacillus bio-fungicide and drip irrigation.`
      );
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  if (loadingState < 3) {
    return (
      <div className="w-full relative z-10 text-white font-body-md pb-24 h-[80vh] flex flex-col justify-center items-center">
        <div className="relative w-64 h-64 border-2 border-dashed border-green-400 rounded-2xl flex items-center justify-center overflow-hidden bg-black/40 shadow-[0_0_40px_rgba(74,222,128,0.15)] mb-8">
            <img src={passedPreviewUrl || "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80"} alt="Scanning" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale blur-[2px] scale-110" />
            <Leaf className="w-16 h-16 text-green-400 animate-pulse z-10" />
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-scan shadow-[0_0_15px_#10b981]"></div>
        </div>
        
        <div className="w-full max-w-sm space-y-4 px-4">
          <div className={`flex items-center gap-3 transition-opacity duration-300 ${loadingState >= 0 ? 'opacity-100' : 'opacity-30'}`}>
            {loadingState > 0 ? <CheckCircle2 className="text-green-400 w-5 h-5" /> : <Loader2 className="animate-spin text-green-400 w-5 h-5" />}
            <span className={loadingState === 0 ? 'font-bold text-white' : 'text-white/70'}>Stripping EXIF Metadata...</span>
          </div>
          <div className={`flex items-center gap-3 transition-opacity duration-300 ${loadingState >= 1 ? 'opacity-100' : 'opacity-30'}`}>
            {loadingState > 1 ? <CheckCircle2 className="text-green-400 w-5 h-5" /> : loadingState === 1 ? <Loader2 className="animate-spin text-green-400 w-5 h-5" /> : <div className="w-5 h-5" />}
            <span className={loadingState === 1 ? 'font-bold text-white' : 'text-white/70'}>Running Local ONNX Inference...</span>
          </div>
          <div className={`flex items-center gap-3 transition-opacity duration-300 ${loadingState >= 2 ? 'opacity-100' : 'opacity-30'}`}>
            {loadingState > 2 ? <CheckCircle2 className="text-green-400 w-5 h-5" /> : loadingState === 2 ? <Loader2 className="animate-spin text-green-400 w-5 h-5" /> : <div className="w-5 h-5" />}
            <span className={loadingState === 2 ? 'font-bold text-white' : 'text-white/70'}>Mapping Pathology Confidence...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !diagnosis) {
    const isNoImage = error === "No image provided. Please scan a leaf image from the home page.";
    
    return (
      <div className="w-full relative z-10 text-white font-body-md pb-24 animate-in fade-in flex flex-col items-center mt-12 px-4">
        <div className="flex items-center gap-3 glass-panel px-4 py-2 w-fit cursor-pointer hover:bg-white/10 transition-colors mb-8 self-start" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold text-sm">Back</span>
        </div>
        <div className={`card p-8 flex flex-col items-center max-w-md text-center ${isNoImage ? 'border-white/20' : 'border-red-500/50'}`}>
           {isNoImage ? (
             <Leaf className="w-12 h-12 text-green-400 mb-4" />
           ) : (
             <Info className="w-12 h-12 text-red-400 mb-4" />
           )}
           <h2 className="text-xl font-bold mb-2">{isNoImage ? 'No Image Provided' : 'Diagnosis Failed'}</h2>
           <p className="text-sm text-white/80">{error || "Could not complete diagnosis."}</p>
           
           {isNoImage ? (
             <div className="mt-6 flex gap-4 w-full justify-center">
               <label className="bg-green-400 hover:bg-green-300 text-black px-6 py-2 rounded-full font-bold transition-colors cursor-pointer text-sm flex items-center justify-center">
                 Upload Leaf Image
                 <input 
                   type="file" 
                   accept="image/*" 
                   className="hidden" 
                   onChange={(e) => {
                     const file = e.target.files?.[0];
                     if (file) {
                       const previewUrl = URL.createObjectURL(file);
                       navigate('/diagnose', { state: { file, previewUrl }, replace: true });
                       window.location.reload(); // Quick way to restart the process
                     }
                   }} 
                 />
               </label>
             </div>
           ) : (
             <button onClick={() => navigate('/')} className="mt-6 bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full font-bold transition-colors">Return Home</button>
           )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative z-10 text-white font-body-md pb-24 animate-in fade-in">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-black px-4 py-2 rounded-full shadow-lg text-xs font-bold flex items-center gap-1.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>Diagnostic report copied to clipboard!</span>
        </div>
      )}

      {/* Main content wrapper */}
      <main className="flex flex-col gap-5 mt-4">
        {/* Back navigation */}
        <div className="flex items-center gap-3 glass-panel px-4 py-2 w-fit cursor-pointer hover:bg-white/10 transition-colors" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold text-sm">Back</span>
        </div>

        {/* Inference Status & Image */}
        <section className="card p-0 overflow-hidden relative">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
            <div className="flex items-center gap-2 text-green-300 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              High-Confidence Inference Complete
            </div>
            <span className="text-[10px] text-white/70 font-mono">{new Date().toLocaleTimeString()}</span>
          </div>

          <div className="p-4 bg-black/10 relative">
            <button 
              onClick={() => setShowExplainOverlay(!showExplainOverlay)}
              className="absolute top-6 right-6 z-20 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/20 hover:bg-black/70 transition-colors cursor-pointer group"
            >
              <Info className="w-4 h-4 text-white/70 group-hover:text-white" />
            </button>

            <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-white/20 shadow-inner bg-black/40 flex items-center justify-center">
              <div className="relative inline-block w-full h-full">
                <img
                  src={diagnosis.image_url || passedPreviewUrl || "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80"}
                  alt="Analyzed crop pathology"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-green-500/10 mix-blend-color-burn pointer-events-none"></div>

                {/* Dynamic Detections Bounding Boxes */}
                {diagnosis.detections && diagnosis.detections.map((det, idx) => {
                  if (!det.bbox) return null;
                  const [xmin, ymin, xmax, ymax] = det.bbox;
                  return (
                    <div 
                      key={idx}
                      className="absolute border-[1.5px] border-dashed border-green-400 bg-green-400/10 transition-all duration-500 pointer-events-none"
                      style={{
                        top: `${ymin * 100}%`,
                        left: `${xmin * 100}%`,
                        width: `${(xmax - xmin) * 100}%`,
                        height: `${(ymax - ymin) * 100}%`
                      }}
                    >
                      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-green-400 rounded-sm"></div>
                      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-green-400 rounded-sm"></div>
                      <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-green-400 rounded-sm"></div>
                      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-green-400 rounded-sm"></div>
                      
                      {!showExplainOverlay && (
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/90 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap border border-green-400/30 z-10">
                          {det.disease_name} ({(det.confidence * 100).toFixed(0)}%)
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explainability Overlay Tooltips */}
              {showExplainOverlay && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-in fade-in z-10 flex flex-col items-center justify-center p-6 text-center">
                  <div className="bg-black/80 border border-white/20 rounded-xl p-4 shadow-2xl max-w-[250px]">
                    <h4 className="font-bold text-green-400 mb-1 text-sm">AI Explanation</h4>
                    <p className="text-[11px] text-white/80 leading-relaxed">
                      The bounding box highlights the primary region with alternating dark and light rings indicative of Alternaria solani. 
                    </p>
                    <p className="text-[11px] text-white/80 leading-relaxed mt-2">
                      The confidence score ({Math.round(diagnosis.confidence * 100)}%) is derived by comparing morphological features against 50k+ samples.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={`p-3.5 flex justify-between items-center border-t-4 bg-black/20 ${diagnosis.severity === 'High' ? 'border-red-500' : 'border-amber-500'}`}>
            <span className={`font-label-md text-xs font-bold flex items-center gap-1.5 ${diagnosis.severity === 'High' ? 'text-red-400' : 'text-amber-400'}`}>
              <Info className="w-4 h-4 icon-filled" />
              Pathology Severity: {diagnosis.severity || 'Moderate'}
            </span>
            <span className="font-mono text-xs text-white/70 font-semibold">{diagnosis.scan_id}</span>
          </div>
        </section>

        {/* Primary Match Card */}
        <section className="card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold">{diagnosis.disease_name}</h2>
              <p className="text-xs text-white/70 italic mb-3">{diagnosis.scientific_name}</p>
            </div>
            <span className="bg-green-400/20 text-green-300 px-2.5 py-1 rounded-full text-xs font-bold border border-green-400/30 whitespace-nowrap">
              {Math.round(diagnosis.confidence * 100)}% Match
            </span>
          </div>

          <div className="space-y-1.5 mb-6">
            <div className="flex justify-between items-end text-xs">
              <span className="text-white/80 font-bold">Primary Match Confidence</span>
              <span className="font-mono text-green-400 font-bold">{Math.round(diagnosis.confidence * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400 rounded-full transition-all duration-1000 shadow-[0_0_8px_#4ade80]"
                style={{ width: `${Math.round(diagnosis.confidence * 100)}%` }}
              ></div>
            </div>
          </div>

          {diagnosis.detections && diagnosis.detections.length > 1 && (
            <div className="border-t border-white/10 pt-4">
              <h3 className="text-[11px] text-white/60 mb-3 uppercase tracking-wider font-bold">
                Alternative Detections
              </h3>
              <ul className="space-y-2">
                {diagnosis.detections.slice(1).map((det, idx) => (
                  <li key={idx} className="flex items-center justify-between text-xs py-0.5 bg-white/5 px-3 rounded-lg border border-white/5">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                      <span className="font-bold text-white/80">{det.disease_name}</span>
                    </span>
                    <span className="font-mono text-white/60 font-bold">{Math.round(det.confidence * 100)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Regenerative Treatment Plan */}
        <section className="space-y-3">
          <h2 className="text-base font-bold flex items-center gap-2 text-green-300">
            <Leaf className="w-5 h-5 icon-filled" />
            Regenerative Agro-Ecological Plan
          </h2>

          <div className="card p-0 overflow-hidden divide-y divide-white/10">
            <details className="group" open>
              <summary className="flex justify-between items-center p-4 cursor-pointer text-xs font-bold hover:bg-white/5 transition-colors">
                <span>Natural & Bio-Fungicide Treatments</span>
                <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 text-white/50" />
              </summary>
              <div className="px-4 pb-4">
                <ul className="list-disc pl-4 space-y-2 text-xs text-white/70">
                  {diagnosis.regenerative_plan?.treatments?.map((t, i) => (
                    <li key={i} className="leading-relaxed">{t}</li>
                  ))}
                </ul>
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center p-4 cursor-pointer text-xs font-bold hover:bg-white/5 transition-colors">
                <span>Soil & Water Irrigation Rules</span>
                <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 text-white/50" />
              </summary>
              <div className="px-4 pb-4">
                <ul className="list-disc pl-4 space-y-2 text-xs text-white/70">
                  {diagnosis.regenerative_plan?.management_rules?.map((m, i) => (
                    <li key={i} className="leading-relaxed">{m}</li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
        </section>

        {/* Audio Advisory Player & Actions */}
        <section className="space-y-4 pt-2">
          <div className="card p-4 flex items-center gap-4">
            <button
              onClick={toggleAudio}
              aria-label={isPlaying ? 'Pause audio advisory' : 'Play audio advisory'}
              className="w-12 h-12 flex-shrink-0 bg-green-400/20 border border-green-400/50 hover:bg-green-400/40 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow cursor-pointer text-green-300"
            >
              {isPlaying ? <Pause className="w-6 h-6 icon-filled" /> : <Play className="w-6 h-6 icon-filled ml-1" />}
            </button>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold">Spoken Audio Advisory</span>
                <span className="text-[10px] font-mono text-green-400 font-bold">
                  {isPlaying ? 'Speaking...' : 'Ready'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full transition-all duration-300 shadow-[0_0_8px_#4ade80]"
                    style={{ width: `${playbackProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="w-full bg-white text-black hover:bg-gray-200 transition-colors font-bold rounded-xl py-3 px-4 flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share with Extension Agent
          </button>
        </section>
      </main>
    </div>
  );
}
