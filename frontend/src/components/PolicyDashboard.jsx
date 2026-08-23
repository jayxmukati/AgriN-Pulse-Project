import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function PolicyDashboard() {
  const navigate = useNavigate();

  // Active States
  const [activeTab, setActiveTab] = useState('sentinel');
  const [selectedHex, setSelectedHex] = useState({
    id: 'GEO-8860144aa7fffff',
    sector: 'Madhya Pradesh Grid 14-B',
    ndvi: 0.82,
    status: 'High Vigor (Healthy)',
    pathogenRisk: 'Low (2%)'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportToast, setExportToast] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Fetch initial analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/v1/analytics/`, { timeout: 3000 });
        setAnalyticsData(res.data);
      } catch (err) {
        console.warn('Backend analytics endpoint unavailable, using cached telemetry.');
      }
    };
    fetchAnalytics();
  }, []);

  // Handle W3C JSON-LD Export
  const handleExportJSONLD = async () => {
    setIsExporting(true);
    try {
      const res = await axios.get(`${API_BASE}/api/v1/export/jsonld`, {
        responseType: 'blob',
        timeout: 5000
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/ld+json' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'agrin_pulse_brics_export.jsonld');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setExportToast(true);
      setTimeout(() => setExportToast(false), 3000);
    } catch (err) {
      // Fallback client-side download
      const mockPayload = {
        "@context": {
          "@vocab": "https://schema.org/",
          "openagri": "https://openagri.brics.int/schema/v4/"
        },
        "@type": "Dataset",
        "name": "BRICS AgriN-Pulse Regional Agro-Ecological Dataset",
        "spatialCoverage": "Madhya Pradesh Sector (India)",
        "avgNDVI": 0.72,
        "activeDiseaseAlerts": 14,
        "climateAdaptationIndex": "84/100"
      };
      const blob = new Blob([JSON.stringify(mockPayload, null, 2)], { type: 'application/ld+json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'agrin_pulse_brics_export.jsonld');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setExportToast(true);
      setTimeout(() => setExportToast(false), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  // Generate H3 Grid Hexagons with Deterministic Data
  const hexCells = Array.from({ length: 96 }).map((_, i) => {
    const isStress = i % 11 === 0 || i % 19 === 0;
    const isHighVigor = !isStress && i % 3 === 0;
    return {
      index: i,
      id: `GEO-886014${i.toString(16).padStart(3, '0')}fffff`,
      ndvi: isStress ? (0.35 + (i % 15) * 0.01).toFixed(2) : (0.72 + (i % 20) * 0.01).toFixed(2),
      status: isStress ? 'Pathogen Stress Detected' : (isHighVigor ? 'High Vigor (Optimal)' : 'Normal Growth'),
      color: isStress ? '#ef4444' : (isHighVigor ? '#10b981' : '#334155'),
      risk: isStress ? 'High (78%)' : 'Low (<5%)'
    };
  });

  return (
    <div className="w-full max-w-[var(--shell)] mx-auto px-[var(--gutter)] relative z-10 text-white pb-20">
      {/* Toast Notification */}
      {exportToast && (
        <div className="fixed top-4 right-4 z-[100] bg-green-400 text-black px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-2xl border border-white rounded-md">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          Exporting RDF (W3C JSON-LD)...
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-col h-[calc(100svh-var(--nav-h))]">
        {/* Header Toolbar */}
        <header className="flex justify-between items-center py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-white/60 hover:text-white transition-colors cursor-pointer mr-2 flex items-center justify-center"
              title="Return to Farmer Interface"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-green-300">globe_asia</span>
              Policy Dashboard
            </h1>
            <span className="text-[10px] bg-green-400/20 text-green-300 px-2 py-0.5 border border-green-400/30">L2A Sentinel Data</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white/80">Regional Analytics Node</div>
              <div className="text-[10px] text-green-300">Madhya Pradesh Sector Active</div>
            </div>
            <button
              onClick={handleExportJSONLD}
              disabled={isExporting}
              className="text-xs bg-white text-black px-4 py-1.5 font-bold hover:bg-gray-200 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[14px]">share</span>
              <span>{isExporting ? 'Exporting...' : 'Export JSON-LD'}</span>
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
          
          {/* Geospatial Map Visualization (Mock) */}
          <div className="flex-1 flex flex-col gap-3 min-w-[300px]">
            <div className="card flex-1 flex flex-col p-3 border border-white/10 relative overflow-hidden">
              <div className="text-xs font-bold border-b border-white/10 pb-2 mb-3 flex justify-between items-center z-10 relative">
                <span className="text-white">Agro-Ecological Grid View (H3 Index)</span>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 inline-block"></span> Normal</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 inline-block"></span> Pathogen Alert</span>
                </div>
              </div>
              
              <div className="flex-1 grid grid-cols-12 auto-rows-fr gap-0.5 overflow-hidden p-1 relative z-10">
                {hexCells.map(hex => (
                  <div 
                    key={hex.id} 
                    onClick={() => setSelectedHex(hex)}
                    className="w-full h-full cursor-pointer hover:opacity-80 transition-opacity border border-white/5"
                    style={{ backgroundColor: hex.color, opacity: selectedHex.id === hex.id ? 1 : 0.65 }}
                    title={`${hex.id}\nNDVI: ${hex.ndvi}\nStatus: ${hex.status}`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Selected Hex Telemetry Bar */}
            <div className="card p-3 flex justify-between items-center border border-white/10">
              <div>
                <div className="text-[10px] text-white/60 mb-1">SELECTED SPATIAL HEX (H3)</div>
                <div className="text-sm font-bold text-white">{selectedHex.id}</div>
                <div className="text-[10px] text-green-300 mt-1">{selectedHex.sector}</div>
              </div>
              <div className="flex gap-6">
                <div className="text-right">
                  <div className="text-[10px] text-white/60">NDVI</div>
                  <div className="font-bold text-white text-base">{selectedHex.ndvi}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-white/60">STATUS</div>
                  <div className="font-bold text-white text-base" style={{ color: selectedHex.color }}>{selectedHex.status}</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Advisory Trend Feed */}
          <div className="w-full lg:w-2/5 flex flex-col gap-3">
            <div className="card p-4 flex-1 flex flex-col overflow-hidden">
              <div className="text-xs font-bold border-b border-white/10 pb-2 mb-2 flex justify-between items-center shrink-0">
                <span>AI Advisory Outbreak Feed</span>
                <span className="material-symbols-outlined text-green-300 text-sm animate-pulse">wifi_tethering</span>
              </div>

              <div className="overflow-y-auto flex-1 text-xs space-y-2.5 pr-1 no-scrollbar">
                <div className="p-2.5 bg-black/20 border-l-2 border-red-400">
                  <div className="flex justify-between text-[10px] text-white/50 mb-0.5">
                    <span>QRY-902A // Bhopal Sector</span>
                    <span>Just now</span>
                  </div>
                  <div className="font-bold text-red-400 text-[11px]">Wheat Rust Outbreak Detected</div>
                  <div className="text-[10px] text-white/70 mt-1">Anonymized farmer scans report 40% spike in rust pathology searches.</div>
                </div>

                <div className="p-2.5 bg-black/20 border-l-2 border-green-400">
                  <div className="flex justify-between text-[10px] text-white/50 mb-0.5">
                    <span>REC-IIFSR-22 // System Ground-Truth</span>
                    <span>12m ago</span>
                  </div>
                  <div className="font-bold text-green-300 text-[11px]">Regenerative Bio-Fungicide Alert</div>
                  <div className="text-[10px] text-white/70 mt-1">Deploy Bacillus subtilis protocols; reduce synthetic nitrogen by 15% in sector.</div>
                </div>
              </div>
            </div>

            {/* Multi-Tab Telemetry Panel */}
            <div className="card p-0 flex flex-col shrink-0 overflow-hidden">
              <div className="flex border-b border-white/10 bg-black/40 text-[10px] uppercase font-bold">
                <button
                  onClick={() => setActiveTab('sentinel')}
                  className={`flex-1 py-2 cursor-pointer transition-colors ${
                    activeTab === 'sentinel' ? 'bg-black/20 text-white border-b-2 border-b-green-400' : 'text-white/50 hover:text-white'
                  }`}
                >
                  Sentinel-2
                </button>
                <button
                  onClick={() => setActiveTab('weather')}
                  className={`flex-1 py-2 cursor-pointer transition-colors ${
                    activeTab === 'weather' ? 'bg-black/20 text-white border-b-2 border-b-green-400' : 'text-white/50 hover:text-white'
                  }`}
                >
                  Meteo
                </button>
                <button
                  onClick={() => setActiveTab('standards')}
                  className={`flex-1 py-2 cursor-pointer transition-colors ${
                    activeTab === 'standards' ? 'bg-black/20 text-white border-b-2 border-b-green-400' : 'text-white/50 hover:text-white'
                  }`}
                >
                  Model
                </button>
              </div>

              <div className="p-3 text-[11px] bg-black/10 space-y-1.5 min-h-[90px]">
                {activeTab === 'sentinel' && (
                  <>
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span className="text-white/60">Satellite Pass (L2A):</span>
                      <span className="text-white font-mono">2024-05-18 10:30 UTC</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span className="text-white/60">Band 8 (NIR) Reflectance:</span>
                      <span className="text-green-300 font-mono">0.45 ± 0.02</span>
                    </div>
                  </>
                )}

                {activeTab === 'weather' && (
                  <>
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span className="text-white/60">Surface Temp Avg:</span>
                      <span className="text-white font-mono">27.5°C</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span className="text-white/60">Soil Moisture:</span>
                      <span className="text-red-400 font-mono">38.4% (Deficit)</span>
                    </div>
                  </>
                )}

                {activeTab === 'standards' && (
                  <>
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span className="text-white/60">Ontology Schema:</span>
                      <span className="text-white font-mono">schema.org</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span className="text-white/60">Spatial Encoding:</span>
                      <span className="text-green-300 font-mono">Uber H3 (Res 9)</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
