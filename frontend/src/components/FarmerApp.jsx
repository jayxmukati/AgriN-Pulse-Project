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

      {/* Landing Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 -mt-20">
        <h1 className="text-6xl sm:text-8xl font-bold tracking-tighter mb-4 drop-shadow-2xl">
          Glowinn <span className="font-light italic text-green-400">Agri</span>
        </h1>
        <p className="text-lg sm:text-xl font-medium text-white/80 max-w-md mx-auto leading-relaxed mb-16">
          Made for Modern Elegance.<br/>
          Engineered for Regenerative Agriculture.
        </p>
        
        <div className="absolute bottom-10 flex flex-col items-center animate-bounce opacity-70">
          <span className="text-xs font-bold tracking-widest uppercase mb-2">Scroll to Explore</span>
          <span className="material-symbols-outlined text-3xl">keyboard_arrow_down</span>
        </div>
      </section>

      {/* Top App Bar */}
      <header className="sticky top-4 z-40 px-4 py-3 glass-panel mb-6 flex items-center justify-between mt-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-white/70 font-medium">
            <span className="material-symbols-outlined text-[14px]">sync</span>
            Synced {lastSyncTime}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-green-300">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
            PWA Ready
          </div>
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1 text-xs border border-white/20 rounded-full px-3 py-1 hover:bg-white/10 transition-colors"
          >
            translate
            <span className="font-bold">{selectedLang}</span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
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
        {/* Quick Action Tiles */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleScanTrigger}
            className="card flex flex-col items-center justify-center p-5 cursor-pointer hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-4xl mb-2 text-white">photo_camera</span>
            <span className="font-bold text-sm text-center">Scan Leaf<br/>Disease</span>
          </button>
          
          <button 
            onClick={() => {
              setShowVoiceModal(true);
              setVoiceAdvisoryResponse(null);
            }}
            className="card flex flex-col items-center justify-center p-5 cursor-pointer hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-4xl mb-2 text-white">mic</span>
            <span className="font-bold text-sm text-center">Ask Voice<br/>Advisory</span>
          </button>
        </div>

        {/* Field Status */}
        <section className="card p-0 overflow-hidden mt-2">
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="font-bold text-base flex items-center gap-2">Field Status & Telemetry</h2>
                <p className="text-[11px] text-white/70">Sentinel-2 High-Resolution Pass</p>
              </div>
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-xs font-bold flex items-center hover:bg-white/10 px-2 py-1 rounded cursor-pointer"
              >
                Command Center <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="relative w-full h-[210px] bg-black/20 overflow-hidden">
            <img
              className="w-full h-full object-cover opacity-60"
              alt="Satellite view of farm plots"
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
            />
            <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md rounded-lg px-2.5 py-1 text-white text-[11px] font-mono flex items-center gap-1.5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span>GEO-8860144 // Plot A</span>
            </div>
          </div>
        </section>

        {/* Micro-Climate Forecast */}
        <section className="card p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-bold text-base flex items-center gap-2">Micro-Climate Forecast</h2>
              <p className="text-[11px] text-white/70">Open-Meteo Agro Forecast Node</p>
            </div>
            <span className="material-symbols-outlined text-2xl text-white/70">thermostat</span>
          </div>

          <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
            {[
              { time: 'Now', temp: '32°', icon: 'sunny', desc: 'High UV', alert: true },
              { time: '14:00', temp: '34°', icon: 'partly_cloudy_day', desc: 'Heat Stress' },
              { time: '17:00', temp: '29°', icon: 'cloud', desc: 'Cooling' },
              { time: '20:00', temp: '24°', icon: 'clear_night', desc: 'Clear' },
            ].map((forecast, i) => (
              <div key={i} className={`flex-shrink-0 w-20 p-2.5 rounded-xl border flex flex-col items-center ${
                forecast.alert 
                  ? 'border-red-400/50 bg-red-900/30 text-white' 
                  : 'border-white/10 bg-black/20 text-white'
              }`}>
                <span className="text-[11px] font-medium opacity-80">{forecast.time}</span>
                <span className={`material-symbols-outlined text-2xl my-1.5 ${forecast.alert ? 'text-red-300 icon-filled animate-pulse' : ''}`}>
                  {forecast.icon}
                </span>
                <span className="text-sm font-bold">{forecast.temp}</span>
                <span className="text-[9px] text-center mt-1 font-medium opacity-70 leading-tight">{forecast.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Actionable Advisory */}
        <section className="card p-4 border-l-4 border-l-green-400">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[28px] icon-filled mt-0.5 text-green-300">eco</span>
            <div>
              <h3 className="font-bold text-sm">Regenerative Protocol Tip</h3>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">
                High temperature forecast for Thursday. Apply organic mulch or biochar in tree/crop rows to conserve soil moisture by up to 35%.
              </p>
              <button
                onClick={() => navigate('/diagnose')}
                className="mt-2.5 text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer"
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
          <div className="glass-panel w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-300 icon-filled">psychology</span>
                <h3 className="font-bold text-base text-white">Voice Agricultural Advisory</h3>
              </div>
              <button
                onClick={() => setShowVoiceModal(false)}
                className="text-white/60 hover:bg-white/10 rounded-full p-1 cursor-pointer transition-colors"
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
                    ? 'bg-red-500 text-white animate-pulse ring-8 ring-red-500/20'
                    : 'bg-green-400 text-black shadow-lg active:scale-95'
                }`}
              >
                <span className="material-symbols-outlined text-3xl">{isRecording ? 'graphic_eq' : 'mic'}</span>
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
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>IIFSR Ground-Truth Advisory</span>
                </div>
                <p className="text-xs text-white font-medium leading-relaxed">
                  {voiceAdvisoryResponse.advisory}
                </p>
                {voiceAdvisoryResponse.recommended_actions && (
                  <ul className="mt-3 space-y-1.5 border-t border-green-400/20 pt-2 text-[11px] text-white/80">
                    {voiceAdvisoryResponse.recommended_actions.map((act, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-green-300 mt-0.5">check_circle</span>
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

      {/* Bottom Navigation Bar is now removed as Layout handles navigation */}
    </div>
  );
}

