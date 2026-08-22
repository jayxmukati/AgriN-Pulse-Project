import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DiagnosticResults() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state passed from camera scan or fallback
  const passedData = location.state?.diagnosis;
  const previewUrl = location.state?.previewUrl;

  const data = passedData || {
    scan_id: 'SCAN-8492',
    disease_name: 'Tomato Early Blight',
    scientific_name: 'Alternaria solani',
    severity: 'Moderate',
    confidence: 0.94,
    privacy_status: 'GPS & Photo metadata anonymized (H3 Geo-ID: GEO-8860144aa7fffff)',
    alternatives: [
      { disease_name: 'Septoria Leaf Spot', confidence: 0.12 },
      { disease_name: 'Late Blight', confidence: 0.04 }
    ],
    regenerative_plan: {
      treatments: [
        'Apply Bio-fungicide sprays (e.g., Bacillus subtilis based) immediately to surrounding healthy plants.',
        'Use Neem oil at a dosage of 2 tablespoons per gallon of water, applied weekly in the early morning or late evening.',
        'Remove and securely dispose of infected lower leaves to reduce spore spread.'
      ],
      management_rules: [
        'Adjust irrigation based on upcoming rainfall: Switch entirely to drip irrigation to keep foliage dry. Avoid overhead watering.',
        'Increase spacing for airflow: Ensure a minimum of 24 inches between plants if possible, pruning excess dense foliage in the lower canopy.',
        'Apply a thick layer of organic mulch to prevent soil-borne spores from splashing onto lower leaves during heavy rain.'
      ]
    },
    audio_script: 'Diagnostic complete for tomato crop. Early Blight detected with 94 percent confidence. Deploy Bacillus subtilis bio-fungicide and transition to drip irrigation.'
  };

  // Audio Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [copiedToast, setCopiedToast] = useState(false);

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
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsPlaying(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(data.audio_script);
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
    if (navigator.share) {
      navigator.share({
        title: `AgriN-Pulse Diagnostic: ${data.disease_name}`,
        text: `Crop diagnostic ${data.scan_id}: ${data.disease_name} (${Math.round(data.confidence * 100)}% match). Regenerative protocol generated.`
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(
        `AgriN-Pulse Diagnostic ${data.scan_id}: ${data.disease_name} (${Math.round(data.confidence * 100)}% confidence). Recommended: Bacillus bio-fungicide and drip irrigation.`
      );
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface pb-16">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-primary text-on-primary px-4 py-2 rounded-full shadow-lg text-xs font-bold flex items-center gap-1.5 animate-bounce">
          <span className="material-symbols-outlined text-[16px]">check</span>
          <span>Diagnostic report copied to clipboard!</span>
        </div>
      )}

      {/* Header */}
      <header className="w-full top-0 sticky bg-surface/95 backdrop-blur-sm border-b border-outline-variant z-50">
        <div className="flex items-center justify-between px-4 h-14 w-full max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/')}
            aria-label="Go back"
            className="text-primary hover:bg-surface-container-high transition-colors p-2 rounded-full -ml-2 cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex flex-col items-center">
            <h1 className="font-headline-sm text-base font-bold text-primary">Diagnostic Results</h1>
            <span className="font-label-sm text-[10px] text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px] text-primary">verified_user</span> GPS & Metadata Anonymized
            </span>
          </div>
          <button
            onClick={handleShare}
            aria-label="Share"
            className="text-on-surface-variant hover:bg-surface-container-high transition-colors p-2 rounded-full -mr-2 cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* Scanned Image Preview with Bounding Box */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm relative">
          <div className="h-52 w-full relative bg-surface-variant">
            <img
              alt="Scanned crop leaf"
              className="w-full h-full object-cover"
              src={previewUrl || "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80"}
            />

            {/* Pathogen Bounding Box Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-28 h-28 border-2 border-primary border-dashed rounded-lg relative bg-primary/10 backdrop-blur-[1px]">
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-primary rounded-sm"></div>
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-primary rounded-sm"></div>
                <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-primary rounded-sm"></div>
                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-primary rounded-sm"></div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-surface/90 text-primary font-label-sm text-[10px] font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap border border-primary/30">
                  Detected Lesion Zone
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 flex justify-between items-center border-t-4 border-trend-warn bg-surface-container-lowest">
            <span className="font-label-md text-xs text-trend-warn font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined icon-filled text-[18px]">warning</span>
              Pathology Severity: {data.severity || 'Moderate'}
            </span>
            <span className="font-mono text-xs text-on-surface-variant font-semibold">{data.scan_id}</span>
          </div>
        </section>

        {/* Primary Match Card */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-headline-md text-xl font-bold text-on-surface">{data.disease_name}</h2>
              <p className="font-body-md text-xs text-on-surface-variant italic mb-3">{data.scientific_name}</p>
            </div>
            <span className="bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full text-xs font-bold">
              {Math.round(data.confidence * 100)}% Match
            </span>
          </div>

          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between items-end text-xs">
              <span className="font-label-md text-on-surface-variant">Primary Match Confidence</span>
              <span className="font-mono text-primary font-bold">{Math.round(data.confidence * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000"
                style={{ width: `${Math.round(data.confidence * 100)}%` }}
              ></div>
            </div>
          </div>

          {data.alternatives && data.alternatives.length > 0 && (
            <div className="border-t border-outline-variant pt-3">
              <h3 className="font-label-sm text-[11px] text-on-surface-variant mb-2 uppercase tracking-wider font-semibold">
                Alternative Differential Matches
              </h3>
              <ul className="space-y-1.5">
                {data.alternatives.map((alt, idx) => (
                  <li key={idx} className="flex items-center justify-between text-xs py-0.5">
                    <span className="text-on-surface flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                      {alt.disease_name}
                    </span>
                    <span className="font-mono text-on-surface-variant">{Math.round(alt.confidence * 100)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Regenerative Treatment Plan */}
        <section className="space-y-2.5">
          <h2 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary icon-filled">eco</span>
            Regenerative Agro-Ecological Plan
          </h2>

          <div className="border border-outline-variant rounded-2xl overflow-hidden bg-surface-container-lowest divide-y divide-outline-variant shadow-sm">
            <details className="group" open>
              <summary className="flex justify-between items-center p-4 cursor-pointer font-label-md text-xs font-bold text-on-surface bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
                <span>Natural & Bio-Fungicide Treatments</span>
                <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-on-surface-variant">expand_more</span>
              </summary>
              <div className="px-4 pb-4 bg-surface-container-lowest">
                <ul className="list-disc pl-4 space-y-2 text-xs text-on-surface-variant">
                  {data.regenerative_plan?.treatments?.map((t, i) => (
                    <li key={i} className="leading-relaxed">{t}</li>
                  ))}
                </ul>
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center p-4 cursor-pointer font-label-md text-xs font-bold text-on-surface bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
                <span>Soil & Water Irrigation Rules</span>
                <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-on-surface-variant">expand_more</span>
              </summary>
              <div className="px-4 pb-4 bg-surface-container-lowest">
                <ul className="list-disc pl-4 space-y-2 text-xs text-on-surface-variant">
                  {data.regenerative_plan?.management_rules?.map((m, i) => (
                    <li key={i} className="leading-relaxed">{m}</li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
        </section>

        {/* Audio Advisory Player & Actions */}
        <section className="space-y-3 pt-2">
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-3.5 flex items-center gap-3.5 shadow-sm">
            <button
              onClick={toggleAudio}
              aria-label={isPlaying ? 'Pause audio advisory' : 'Play audio advisory'}
              className="w-12 h-12 flex-shrink-0 bg-primary hover:bg-primary-container text-on-primary rounded-full flex items-center justify-center transition-transform active:scale-95 shadow cursor-pointer"
            >
              <span className="material-symbols-outlined text-[28px] icon-filled">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-1">
                <span className="font-label-sm text-xs font-bold text-on-surface">Spoken Audio Advisory</span>
                <span className="text-[10px] font-mono text-primary font-bold">
                  {isPlaying ? 'Speaking...' : 'Ready'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${playbackProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="w-full min-h-[48px] flex items-center justify-center gap-2 border border-outline-variant text-on-surface font-label-md text-xs font-bold rounded-2xl hover:bg-surface-container-low transition-colors bg-surface-container-lowest shadow-sm active:scale-98 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            Share with Regional Agricultural Extension Agent
          </button>
        </section>
      </main>
    </div>
  );
}

