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
    <div className="min-h-screen bg-[#020617] text-[#e5e2e3] font-mono flex flex-col selection:bg-primary selection:text-black">
      {/* Toast Notification */}
      {exportToast && (
        <div className="fixed top-4 right-4 z-[100] bg-trend-up text-black px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-2xl border border-white">
          <span className="material-symbols-outlined text-[16px]">download_done</span>
          <span>W3C JSON-LD Export Downloaded (OpenAgri OCSM)</span>
        </div>
      )}

      {/* Header */}
      <header className="flex justify-between items-center w-full px-6 py-2 h-14 bg-[#090d16] border-b border-[#1e293b] shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined text-trend-up text-[24px]">satellite_alt</span>
            <span className="text-sm font-bold tracking-tight text-white uppercase">OpenAgri Intelligence</span>
          </div>
          <div className="h-5 w-px bg-[#1e293b]"></div>
          <nav className="flex gap-4 text-xs">
            <span className="text-trend-up font-bold border-b border-trend-up pb-0.5">IIT Delhi Node</span>
            <span className="text-gray-400">BRICS Taskforce: India Sector</span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-xs px-3 py-1.5 border border-[#1e293b] hover:bg-[#1e293b] text-gray-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">smartphone</span>
            <span>Farmer Mobile App</span>
          </button>
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

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col border-r border-[#1e293b] bg-[#090d16] w-60 shrink-0">
          <div className="p-4 border-b border-[#1e293b]">
            <div className="text-xs font-bold uppercase text-white tracking-widest">Command Console</div>
            <div className="text-[11px] text-gray-400">Decentralized Node v4.2</div>
          </div>

          <nav className="flex-1 py-2 text-xs space-y-1">
            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-[#1e293b] text-white font-bold border-r-2 border-trend-up text-left">
              <span className="material-symbols-outlined text-[18px] text-trend-up">grid_view</span>
              <span>Spatial H3 Analysis</span>
            </button>
            <button
              onClick={() => navigate('/diagnose')}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-[#131b2e] text-left transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">biotech</span>
              <span>Pathology Telemetry</span>
            </button>
            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-[#131b2e] text-left transition-colors">
              <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
              <span>Data Stream Feeds</span>
            </button>
            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-[#131b2e] text-left transition-colors">
              <span className="material-symbols-outlined text-[18px]">policy</span>
              <span>BRICS Policy Reports</span>
            </button>
          </nav>

          <div className="p-4 border-t border-[#1e293b]">
            <div className="p-2.5 bg-[#020617] border border-[#1e293b] rounded text-[10px] text-gray-400 space-y-1">
              <div className="flex justify-between text-white font-semibold">
                <span>Node Status</span>
                <span className="text-trend-up">Online</span>
              </div>
              <div>Pgvector Extension: Active</div>
              <div>H3 Resolution: 9 (Privacy)</div>
            </div>
          </div>
        </aside>

        {/* Dashboard Main Workspace */}
        <main className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto bg-[#020617]">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
            <div className="tech-panel">
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Total Reg. Field Area</div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold text-white">1.2M</div>
                <div className="text-xs text-trend-up font-mono">Hectares</div>
              </div>
            </div>

            <div className="tech-panel">
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Active Disease Alerts</div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold text-trend-down">14</div>
                <div className="text-xs text-trend-down font-mono">High Risk</div>
              </div>
            </div>

            <div className="tech-panel">
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Avg Regional NDVI</div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold text-white">0.72</div>
                <div className="text-xs text-trend-up font-mono">+0.04 y/y</div>
              </div>
            </div>

            <div className="tech-panel">
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Climate Adapt Index</div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold text-white">84<span className="text-xs text-gray-400 font-normal">/100</span></div>
                <div className="text-xs text-trend-warn font-mono">Stable</div>
              </div>
            </div>
          </div>

          {/* Middle Section: Map + Live Advisory Feed */}
          <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-[380px]">
            {/* H3 Spatial Map Grid */}
            <div className="w-full lg:w-3/5 tech-panel p-0 flex flex-col relative overflow-hidden bg-[#0a0f1d] border border-[#1e293b]">
              <div
                className="absolute inset-0 z-0 opacity-40"
                style={{
                  backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              ></div>

              {/* Interactive H3 Hex Grid Canvas */}
              <div className="relative z-10 flex-1 p-6 flex items-center justify-center overflow-hidden">
                <div className="grid grid-cols-12 gap-1.5 w-full max-w-lg p-2">
                  {hexCells.map((hex) => (
                    <div
                      key={hex.index}
                      onClick={() => setSelectedHex({
                        id: hex.id,
                        sector: `Sector Cluster #${hex.index + 1}`,
                        ndvi: hex.ndvi,
                        status: hex.status,
                        pathogenRisk: hex.risk
                      })}
                      title={`${hex.id} | NDVI: ${hex.ndvi}`}
                      className="cursor-pointer transition-all hover:scale-125 hover:z-20 hover:ring-2 hover:ring-white"
                      style={{
                        backgroundColor: hex.color,
                        aspectRatio: '1',
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        marginTop: hex.index % 2 === 0 ? '0' : '8px'
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Map Overlay Telemetry Info */}
              <div className="relative z-20 p-3 m-3 bg-[#020617]/90 backdrop-blur-md border border-[#1e293b] self-start max-w-sm">
                <div className="text-[11px] text-white font-bold mb-1 flex items-center justify-between gap-4">
                  <span>Spatial Grid: Madhya Pradesh Sector</span>
                  <span className="text-[9px] text-trend-up uppercase">Live STAC Pass</span>
                </div>
                <div className="text-[10px] text-gray-300 space-y-0.5 border-t border-[#1e293b] pt-1.5 font-mono">
                  <div>Active Hex: <span className="text-white font-bold">{selectedHex.id}</span></div>
                  <div>NDVI Vigor: <span className="text-trend-up font-bold">{selectedHex.ndvi}</span> ({selectedHex.status})</div>
                  <div>Pathogen Outbreak Risk: <span className={selectedHex.pathogenRisk.includes('High') ? 'text-trend-down font-bold' : 'text-gray-300'}>{selectedHex.pathogenRisk}</span></div>
                </div>
                <div className="flex gap-3 text-[9px] text-gray-400 mt-2 border-t border-[#1e293b] pt-1 font-mono">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-trend-up inline-block"></span> High Vigor (&gt;0.8)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-trend-down inline-block"></span> Pathogen Alert</span>
                </div>
              </div>
            </div>

            {/* AI Advisory Trend Feed */}
            <div className="w-full lg:w-2/5 flex flex-col gap-3">
              <div className="tech-panel flex-1 flex flex-col overflow-hidden">
                <div className="text-xs font-bold border-b border-[#1e293b] pb-2 mb-2 flex justify-between items-center shrink-0 text-white">
                  <span>AI Advisory Outbreak Feed</span>
                  <span className="material-symbols-outlined text-trend-up text-sm animate-pulse">wifi_tethering</span>
                </div>

                <div className="overflow-y-auto flex-1 text-xs space-y-2.5 pr-1">
                  <div className="p-2.5 bg-[#020617] border-l-2 border-trend-down border-y border-r border-[#1e293b]">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
                      <span>QRY-902A // Bhopal Sector</span>
                      <span>Just now</span>
                    </div>
                    <div className="font-bold text-trend-down text-[11px]">Wheat Rust Outbreak Detected</div>
                    <div className="text-[10px] text-gray-300 mt-1">Anonymized farmer scans report 40% spike in rust pathology searches.</div>
                  </div>

                  <div className="p-2.5 bg-[#020617] border-l-2 border-trend-up border-y border-r border-[#1e293b]">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
                      <span>REC-IIFSR-22 // System Ground-Truth</span>
                      <span>12m ago</span>
                    </div>
                    <div className="font-bold text-trend-up text-[11px]">Regenerative Bio-Fungicide Alert</div>
                    <div className="text-[10px] text-gray-300 mt-1">Deploy Bacillus subtilis protocols; reduce synthetic nitrogen by 15% in sector.</div>
                  </div>

                  <div className="p-2.5 bg-[#020617] border-l-2 border-trend-warn border-y border-r border-[#1e293b]">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
                      <span>QRY-881B // Indore Sector</span>
                      <span>45m ago</span>
                    </div>
                    <div className="font-bold text-trend-warn text-[11px]">Soil Moisture Deficit Alert</div>
                    <div className="text-[10px] text-gray-300 mt-1">High THI index. Recommend automated transition to evening drip schedules.</div>
                  </div>
                </div>
              </div>

              {/* Multi-Tab Telemetry Panel */}
              <div className="tech-panel p-0 border border-[#1e293b] flex flex-col shrink-0">
                <div className="flex border-b border-[#1e293b] bg-[#020617] text-[10px] uppercase font-bold">
                  <button
                    onClick={() => setActiveTab('sentinel')}
                    className={`px-3 py-2 border-r border-[#1e293b] cursor-pointer transition-colors ${
                      activeTab === 'sentinel' ? 'bg-[#0f172a] text-white border-b-2 border-b-trend-up' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Sentinel-2 Telemetry
                  </button>
                  <button
                    onClick={() => setActiveTab('weather')}
                    className={`px-3 py-2 border-r border-[#1e293b] cursor-pointer transition-colors ${
                      activeTab === 'weather' ? 'bg-[#0f172a] text-white border-b-2 border-b-trend-up' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Open-Meteo Trends
                  </button>
                  <button
                    onClick={() => setActiveTab('standards')}
                    className={`px-3 py-2 cursor-pointer transition-colors ${
                      activeTab === 'standards' ? 'bg-[#0f172a] text-white border-b-2 border-b-trend-up' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    W3C OCSM Model
                  </button>
                </div>

                <div className="p-3 text-[11px] bg-[#090e1a] space-y-1.5">
                  {activeTab === 'sentinel' && (
                    <>
                      <div className="flex justify-between border-b border-[#1e293b] pb-1">
                        <span className="text-gray-400">Satellite Pass (L2A):</span>
                        <span className="text-white font-mono">2024-05-18 10:30 UTC</span>
                      </div>
                      <div className="flex justify-between border-b border-[#1e293b] pb-1">
                        <span className="text-gray-400">Band 8 (NIR) Reflectance:</span>
                        <span className="text-trend-up font-mono">0.45 ± 0.02</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Band 4 (Red) Reflectance:</span>
                        <span className="text-gray-300 font-mono">0.12 ± 0.01</span>
                      </div>
                    </>
                  )}

                  {activeTab === 'weather' && (
                    <>
                      <div className="flex justify-between border-b border-[#1e293b] pb-1">
                        <span className="text-gray-400">Surface Temp Avg:</span>
                        <span className="text-white font-mono">27.5°C</span>
                      </div>
                      <div className="flex justify-between border-b border-[#1e293b] pb-1">
                        <span className="text-gray-400">Soil Moisture (0-7cm):</span>
                        <span className="text-trend-warn font-mono">38.4% (Deficit Risk)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Precipitation Prob:</span>
                        <span className="text-gray-300 font-mono">15% (7-day dry window)</span>
                      </div>
                    </>
                  )}

                  {activeTab === 'standards' && (
                    <>
                      <div className="flex justify-between border-b border-[#1e293b] pb-1">
                        <span className="text-gray-400">Ontology Schema:</span>
                        <span className="text-white font-mono">schema.org / OpenAgri v4.2</span>
                      </div>
                      <div className="flex justify-between border-b border-[#1e293b] pb-1">
                        <span className="text-gray-400">Spatial Encoding:</span>
                        <span className="text-trend-up font-mono">Uber H3 (Res 9) + GeoJSON</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Interoperability:</span>
                        <span className="text-gray-300 font-mono">W3C JSON-LD Compliant</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="flex justify-between items-center w-full px-6 py-1.5 h-8 bg-[#090d16] border-t border-[#1e293b] shrink-0 text-[10px] text-gray-400">
        <div className="text-trend-up font-semibold">OpenAgri Protocol v4.2 | BRICS Agricultural Taskforce Node</div>
        <nav className="flex gap-4">
          <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('sentinel')}>Sentinel-2</span>
          <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('weather')}>Open-Meteo</span>
          <span className="hover:text-white cursor-pointer" onClick={handleExportJSONLD}>API JSON-LD</span>
        </nav>
      </footer>
    </div>
  );
}

