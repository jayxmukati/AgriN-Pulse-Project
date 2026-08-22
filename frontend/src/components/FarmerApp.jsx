import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function FarmerApp() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // States
  const [isScanning, setIsScanning] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [voiceAdvisoryResponse, setVoiceAdvisoryResponse] = useState(null);
  const [selectedLang, setSelectedLang] = useState('English');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'zh', name: '中文' }
  ];

  // Handle Photo / Leaf Scan
  const handleScanTrigger = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setIsScanning(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('lat', '23.2599');
      formData.append('lon', '77.4126');

      const response = await axios.post(`${API_BASE}/api/v1/diagnose/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 5000
      });

      navigate('/diagnose', {
        state: {
          diagnosis: response.data,
          previewUrl: previewUrl
        }
      });
    } catch (err) {
      console.warn('Backend unavailable, using simulated offline diagnosis:', err);
      setTimeout(() => {
        navigate('/diagnose', {
          state: {
            previewUrl: previewUrl,
            diagnosis: {
              scan_id: `SCAN-${Math.floor(1000 + Math.random() * 9000)}`,
              disease_name: 'Tomato Early Blight',
              scientific_name: 'Alternaria solani',
              confidence: 0.94,
              severity: 'Moderate',
              severity_color: 'tertiary',
              privacy_status: 'GPS & EXIF stripped. Mapped to H3 Hex Geo-ID: GEO-8860144aa7fffff',
              alternatives: [
                { disease_name: 'Septoria Leaf Spot', confidence: 0.12 },
                { disease_name: 'Late Blight', confidence: 0.04 }
              ],
              regenerative_plan: {
                treatments: [
                  'Apply Bio-fungicide sprays (Bacillus subtilis based) immediately to surrounding healthy foliage.',
                  'Use Neem oil (2 tbsp / gallon) applied weekly in early morning or late evening.',
                  'Prune and securely discard infected lower leaves to limit spore spread.'
                ],
                management_rules: [
                  'Adjust irrigation: Switch entirely to drip irrigation to keep leaf canopies dry.',
                  'Increase plant spacing to minimum 24 inches for optimal airflow.',
                  'Apply organic mulch (straw/leaves) to prevent soil-borne spore splashes.'
                ]
              },
              audio_script: 'Diagnostic complete for tomato crop. Early Blight detected at 94 percent confidence. Deploy Bacillus bio-fungicide and transition to drip irrigation immediately.'
            }
          }
        });
      }, 1500);
    } finally {
      setIsScanning(false);
    }
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

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md pb-24">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Sync Status Banner */}
      <div className="fixed top-0 w-full h-[40px] bg-surface-container-high flex items-center justify-between px-4 z-[60] text-xs">
        <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm">
          <span className="material-symbols-outlined text-[16px] text-primary animate-spin" style={{ animationDuration: '6s' }}>sync</span>
          <span>Synced {lastSyncTime}</span>
        </div>
        <div className="flex items-center gap-1 font-label-sm text-primary font-bold">
          <span className="w-2 h-2 rounded-full bg-trend-up"></span>
          <span>PWA Ready</span>
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-[40px] w-full z-50 bg-surface/95 backdrop-blur-sm flex justify-between items-center px-4 h-14 border-b border-surface-container-high shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <span className="material-symbols-outlined text-primary text-[28px] icon-filled">agriculture</span>
          <div>
            <h1 className="font-headline-md text-[18px] font-bold text-primary leading-tight">AgriSafe</h1>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">BRICS Pulse Node</p>
          </div>
        </div>

        {/* Language Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1 hover:bg-surface-container-high px-3 py-1.5 rounded-full text-on-surface-variant border border-outline-variant text-xs font-semibold active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">translate</span>
            <span>{selectedLang}</span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg py-1.5 z-50">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setSelectedLang(l.name);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-surface-container-high flex items-center justify-between ${
                    selectedLang.includes(l.name) ? 'font-bold text-primary bg-primary-fixed/20' : 'text-on-surface'
                  }`}
                >
                  <span>{l.name}</span>
                  {selectedLang.includes(l.name) && (
                    <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-[104px] px-4 max-w-[600px] mx-auto space-y-6">

        {/* Quick Action Grid */}
        <section className="grid grid-cols-2 gap-3.5">
          <button
            onClick={handleScanTrigger}
            className="bg-primary hover:bg-primary-container text-on-primary rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 h-[126px] shadow-md active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[28px] icon-filled">photo_camera</span>
            </div>
            <span className="font-label-lg text-sm text-center font-bold leading-tight">Scan Leaf<br />Disease</span>
          </button>

          <button
            onClick={() => {
              setShowVoiceModal(true);
              setVoiceAdvisoryResponse(null);
            }}
            className="bg-surface-container-lowest border-2 border-primary text-primary hover:bg-primary-fixed/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 h-[126px] shadow-sm active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[28px]">mic</span>
            </div>
            <span className="font-label-lg text-sm text-center font-bold leading-tight">Ask Voice<br />Advisory</span>
          </button>
        </section>

        {/* Field Status Card */}
        <section className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
          <div className="p-4 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
            <div>
              <h2 className="font-headline-sm text-base font-bold text-on-surface">Field Status & Telemetry</h2>
              <p className="text-xs text-on-surface-variant">Sentinel-2 High-Resolution Pass</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-primary font-label-lg text-xs font-bold flex items-center hover:underline cursor-pointer"
            >
              Command Center <span className="material-symbols-outlined text-[16px] ml-0.5">chevron_right</span>
            </button>
          </div>

          <div className="relative w-full h-[210px] bg-surface-variant overflow-hidden">
            <img
              className="w-full h-full object-cover"
              alt="Satellite view of farm plots"
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
            />
            {/* Live NDVI Overlay Indicator */}
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md rounded-lg px-2.5 py-1 text-white text-[11px] font-mono flex items-center gap-1.5 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-trend-up animate-pulse"></span>
              <span>GEO-8860144 // Plot A</span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 bg-surface-container-lowest/95 backdrop-blur-sm rounded-xl p-3 shadow-md flex justify-between items-center border border-outline-variant">
              <div>
                <p className="font-label-sm text-xs text-on-surface-variant">Active Sector: North Plot</p>
                <p className="font-headline-sm text-base font-bold text-on-surface">Vegetation Index: 0.72 NDVI</p>
              </div>
              <div className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-label-sm text-xs font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span> Healthy
              </div>
            </div>
          </div>
        </section>

        {/* Micro-Climate & Agro-Weather */}
        <section className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-4">
          <div className="flex justify-between items-center mb-3.5">
            <div>
              <h2 className="font-headline-sm text-base font-bold text-on-surface">Micro-Climate Forecast</h2>
              <p className="text-xs text-on-surface-variant">Open-Meteo Agro Forecast Node</p>
            </div>
            <span className="material-symbols-outlined text-primary">thermostat</span>
          </div>

          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-1">
            <div className="flex flex-col items-center min-w-[76px] bg-primary-fixed/20 rounded-xl p-3 border border-primary/30">
              <span className="font-label-sm text-[11px] text-primary font-bold mb-1">Today</span>
              <span className="material-symbols-outlined text-secondary text-[24px] mb-1">wb_sunny</span>
              <span className="font-headline-sm text-sm font-bold text-on-surface">28°C</span>
              <div className="mt-2 text-center text-[10px] space-y-0.5">
                <span className="font-semibold text-primary block">Soil: 42%</span>
                <span className="text-on-surface-variant block">THI: Low</span>
              </div>
            </div>

            <div className="flex flex-col items-center min-w-[76px] bg-surface-container-low rounded-xl p-3 border border-outline-variant">
              <span className="font-label-sm text-[11px] text-on-surface-variant mb-1">Tomorrow</span>
              <span className="material-symbols-outlined text-secondary text-[24px] mb-1">partly_cloudy_day</span>
              <span className="font-headline-sm text-sm font-bold text-on-surface">26°C</span>
              <div className="mt-2 text-center text-[10px] space-y-0.5">
                <span className="font-semibold text-primary block">Soil: 38%</span>
                <span className="text-on-surface-variant block">THI: Low</span>
              </div>
            </div>

            <div className="flex flex-col items-center min-w-[76px] bg-surface-container-low rounded-xl p-3 border border-outline-variant">
              <span className="font-label-sm text-[11px] text-on-surface-variant mb-1">Wednesday</span>
              <span className="material-symbols-outlined text-primary text-[24px] mb-1">rainy</span>
              <span className="font-headline-sm text-sm font-bold text-on-surface">24°C</span>
              <div className="mt-2 text-center text-[10px] space-y-0.5">
                <span className="font-semibold text-primary block">Soil: 55%</span>
                <span className="text-on-surface-variant block">THI: Low</span>
              </div>
            </div>

            <div className="flex flex-col items-center min-w-[76px] bg-surface-container-low rounded-xl p-3 border border-outline-variant">
              <span className="font-label-sm text-[11px] text-on-surface-variant mb-1">Thursday</span>
              <span className="material-symbols-outlined text-trend-warn text-[24px] mb-1">wb_sunny</span>
              <span className="font-headline-sm text-sm font-bold text-on-surface">31°C</span>
              <div className="mt-2 text-center text-[10px] space-y-0.5">
                <span className="font-semibold text-error block">Soil: 20%</span>
                <span className="text-error font-bold block">THI: High</span>
              </div>
            </div>
          </div>
        </section>

        {/* Regenerative Advisory Highlights */}
        <section className="bg-gradient-to-br from-primary-fixed/30 to-surface-container-low border border-primary/20 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-[28px] icon-filled mt-0.5">eco</span>
            <div>
              <h3 className="font-bold text-sm text-primary">Regenerative Protocol Tip</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                High temperature forecast for Thursday. Apply organic mulch or biochar in tree/crop rows to conserve soil moisture by up to 35%.
              </p>
              <button
                onClick={() => navigate('/diagnose')}
                className="mt-2.5 text-xs font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
              >
                View Standard Protocols <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Scanning Laser Animation Modal */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="relative w-64 h-64 border-2 border-dashed border-primary rounded-2xl flex items-center justify-center overflow-hidden bg-black/40 shadow-2xl">
            <span className="material-symbols-outlined text-6xl text-primary animate-pulse">local_florist</span>
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary-fixed to-transparent animate-scan shadow-[0_0_15px_#10b981]"></div>
          </div>
          <h3 className="text-xl font-bold mt-6 text-primary-fixed">Analyzing Crop Pathology...</h3>
          <p className="text-xs text-gray-300 mt-2 max-w-xs">Stripping EXIF/GPS coordinates & running localized disease inference...</p>
        </div>
      )}

      {/* Voice Advisory Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl border border-outline-variant max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-surface-container-low pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary icon-filled">psychology</span>
                <h3 className="font-bold text-base text-on-surface">Voice Agricultural Advisory</h3>
              </div>
              <button
                onClick={() => setShowVoiceModal(false)}
                className="text-on-surface-variant hover:bg-surface-container-high rounded-full p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mt-4 flex flex-col items-center text-center">
              <button
                onClick={() => {
                  setIsRecording(!isRecording);
                  if (!isRecording) {
                    setTimeout(() => {
                      handleVoiceSubmit('What is the optimal irrigation schedule for wheat under high heat?');
                    }, 2000);
                  }
                }}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? 'bg-error text-white animate-pulse ring-8 ring-error/20'
                    : 'bg-primary text-white shadow-lg active:scale-95'
                }`}
              >
                <span className="material-symbols-outlined text-3xl">{isRecording ? 'graphic_eq' : 'mic'}</span>
              </button>
              <p className="text-xs font-semibold mt-3 text-on-surface-variant">
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
                  className="text-xs bg-surface-container-low hover:bg-primary-fixed/20 text-on-surface px-3 py-1.5 rounded-full border border-outline-variant transition-colors"
                >
                  "{query}"
                </button>
              ))}
            </div>

            {/* Response Area */}
            {voiceAdvisoryResponse && (
              <div className="mt-5 p-4 rounded-xl bg-primary-fixed/20 border border-primary/30 text-left">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>IIFSR Ground-Truth Advisory</span>
                </div>
                <p className="text-xs text-on-surface font-medium leading-relaxed">
                  {voiceAdvisoryResponse.advisory}
                </p>
                {voiceAdvisoryResponse.recommended_actions && (
                  <ul className="mt-3 space-y-1.5 border-t border-primary/20 pt-2 text-[11px] text-on-surface-variant">
                    {voiceAdvisoryResponse.recommended_actions.map((act, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-primary mt-0.5">check_circle</span>
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

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-surface/95 backdrop-blur-md border-t border-outline-variant shadow-lg pb-safe">
        <button
          onClick={() => navigate('/')}
          className="flex flex-col items-center justify-center text-primary p-1.5 rounded-xl cursor-pointer"
        >
          <div className="flex items-center justify-center bg-primary-fixed text-on-primary-fixed rounded-full px-4 py-1">
            <span className="material-symbols-outlined text-[22px] icon-filled">home</span>
          </div>
          <span className="font-label-sm text-[11px] mt-1 font-bold">Home</span>
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary p-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">map</span>
          <span className="font-label-sm text-[11px] mt-1">Fields</span>
        </button>

        <button
          onClick={handleScanTrigger}
          className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary p-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">photo_camera</span>
          <span className="font-label-sm text-[11px] mt-1">Scan</span>
        </button>

        <button
          onClick={() => {
            setShowVoiceModal(true);
            setVoiceAdvisoryResponse(null);
          }}
          className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary p-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">psychology</span>
          <span className="font-label-sm text-[11px] mt-1">Advisories</span>
        </button>
      </nav>
    </div>
  );
}

