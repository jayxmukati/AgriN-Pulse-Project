import React from 'react';
import axios from 'axios';

export default function PolicyDashboard() {
  return (
    <>
      

<header className="flex justify-between items-center w-full px-margin-desktop py-2 h-14 bg-surface dark:bg-surface border-b border-outline-variant dark:border-outline-variant shrink-0">
<div className="flex items-center gap-4">
<span className="font-headline-md text-headline-md font-bold text-on-surface dark:text-on-surface tracking-tight">OpenAgri Intelligence</span>
<div className="h-6 w-px bg-outline-variant"></div>
<nav className="flex gap-4">
<a className="text-primary dark:text-primary font-bold border-b border-primary pb-1 flex flex-col" href="#">IIT Delhi Node</a>
<a className="text-on-surface-variant dark:text-on-surface-variant font-mono-data pb-1" href="#">Member: India</a>
</nav>
</div>
<div className="flex items-center gap-4">
<button className="font-label-caps text-label-caps px-3 py-1.5 border border-border-subtle hover:bg-surface-container-high transition-colors">Language</button>
<button className="font-label-caps text-label-caps bg-on-surface text-surface px-4 py-1.5 font-bold hover:opacity-90 transition-opacity">Export JSON-LD</button>
</div>
</header>
<div className="flex flex-1 overflow-hidden">

<aside className="flex flex-col h-screen border-r border-outline-variant bg-surface-container dark:bg-surface-container w-64 shrink-0">
<div className="p-4 border-b border-outline-variant">
<div className="font-headline-sm text-headline-sm text-on-surface mb-1">Command Center</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">BRICS Agricultural Node</div>
</div>
<nav className="flex-1 overflow-y-auto py-2">
<a className="flex items-center gap-3 px-4 py-3 bg-on-surface dark:bg-on-surface text-surface dark:text-surface font-bold border-r-2 border-primary font-label-caps text-label-caps transition-all duration-150 ease-linear" href="#">
<span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>map</span>
                    Spatial Analysis
                </a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps hover:bg-surface-container-highest transition-all duration-150 ease-linear" href="#">
<span className="material-symbols-outlined">psychology</span>
                    AI Advisory
                </a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps hover:bg-surface-container-highest transition-all duration-150 ease-linear" href="#">
<span className="material-symbols-outlined">database</span>
                    Data Streams
                </a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps hover:bg-surface-container-highest transition-all duration-150 ease-linear" href="#">
<span className="material-symbols-outlined">description</span>
                    Policy Reports
                </a>
</nav>
<div className="p-4 border-t border-outline-variant">
<button className="w-full font-label-caps text-label-caps bg-on-surface text-surface py-2 font-bold hover:opacity-90 transition-opacity">New Analysis</button>
</div>
</aside>

<main className="flex-1 flex flex-col p-unit overflow-hidden gap-unit bg-primary-container">

<div className="grid grid-cols-4 gap-unit shrink-0 h-24">
<div className="tech-panel flex flex-col justify-between">
<div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Total Reg. Field Area</div>
<div className="flex items-end justify-between">
<div className="font-display-lg text-display-lg text-on-surface">1.2M</div>
<div className="font-mono-data text-mono-data text-trend-up mb-2">Hectares</div>
</div>
</div>
<div className="tech-panel flex flex-col justify-between">
<div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Active Disease Alerts</div>
<div className="flex items-end justify-between">
<div className="font-display-lg text-display-lg text-trend-down">14</div>
<div className="font-mono-data text-mono-data text-trend-down mb-2">High Risk</div>
</div>
</div>
<div className="tech-panel flex flex-col justify-between">
<div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Avg Regional NDVI</div>
<div className="flex items-end justify-between">
<div className="font-display-lg text-display-lg text-on-surface">0.72</div>
<div className="font-mono-data text-mono-data text-trend-up mb-2">+0.04 y/y</div>
</div>
</div>
<div className="tech-panel flex flex-col justify-between">
<div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Climate Adapt Index</div>
<div className="flex items-end justify-between">
<div className="font-display-lg text-display-lg text-on-surface">84<span className="text-on-surface-variant text-headline-sm">/100</span></div>
<div className="font-mono-data text-mono-data text-trend-warn mb-2">Stable</div>
</div>
</div>
</div>

<div className="flex-1 flex gap-unit overflow-hidden">

<div className="w-3/5 tech-panel p-0 map-container flex flex-col">
<div className="absolute inset-0 bg-primary-container z-0" style={{'background-image': 'radial-gradient(#1e293b 1px, transparent 1px)', 'background-size': '20px 20px', 'opacity': '0.5'}}></div>

<div className="absolute inset-0 z-0 flex items-center justify-center opacity-30">
<div className="grid grid-cols-12 gap-1 w-full h-full p-8 rotate-12 scale-150">

{Array.from({ length: 150 }).map((_, i) => (
<div key={i} style={{backgroundColor: Math.random() > 0.8 ? '#ef4444' : (Math.random() > 0.4 ? '#10b981' : '#1e293b'), aspectRatio: 1, clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', marginTop: i%2===0 ? '0' : '20px'}}></div>
))}
</div>
</div>
<div className="relative z-10 p-4 map-overlay m-4 border border-border-subtle backdrop-blur-sm self-start inline-block">
<div className="font-label-caps text-label-caps text-on-surface mb-2">Spatial Grid: Madhya Pradesh Sector</div>
<div className="flex gap-4 font-mono-data text-mono-data">
<span className="flex items-center gap-1"><span className="w-2 h-2 bg-trend-up inline-block"></span> High Vigor (NDVI &gt; 0.8)</span>
<span className="flex items-center gap-1"><span className="w-2 h-2 bg-trend-down inline-block"></span> Pathogen Stress</span>
</div>
</div>
</div>

<div className="w-2/5 flex flex-col gap-unit h-full">
<div className="tech-panel flex-1 flex flex-col overflow-hidden">
<div className="font-headline-sm text-headline-sm border-b border-border-subtle pb-2 mb-2 flex justify-between items-center shrink-0">
<span>AI Advisory Trend Feed</span>
<span className="material-symbols-outlined text-trend-up text-sm">wifi_tethering</span>
</div>
<div className="overflow-y-auto flex-1 font-body-sm text-body-sm pr-2">
<div className="data-row py-3 flex flex-col gap-1">
<div className="flex justify-between font-mono-data text-mono-data text-on-surface-variant">
<span>QRY-902A // Bhopal</span>
<span>Just now</span>
</div>
<div className="font-bold text-trend-down">Wheat Rust Detected in Sector 4</div>
<div className="text-on-surface-variant">Anonymized query pattern indicates 40% spike in rust pathology searches.</div>
</div>
<div className="data-row py-3 flex flex-col gap-1">
<div className="flex justify-between font-mono-data text-mono-data text-on-surface-variant">
<span>REC-IIFSR-22 // System</span>
<span>-12m</span>
</div>
<div className="font-bold text-trend-up">Regenerative Intervention Advised</div>
<div className="text-on-surface-variant">Deploy targeted bio-fungicide protocols; reduce synthetic nitrogen application by 15% in affected grid.</div>
</div>
<div className="data-row py-3 flex flex-col gap-1">
<div className="flex justify-between font-mono-data text-mono-data text-on-surface-variant">
<span>QRY-881B // Indore</span>
<span>-45m</span>
</div>
<div className="font-bold text-on-surface">Soil Moisture Deficit Warning</div>
<div className="text-on-surface-variant">Evapotranspiration rates exceeding historical average. Recommend drip irrigation schedule adjustment.</div>
</div>
<div className="data-row py-3 flex flex-col gap-1">
<div className="flex justify-between font-mono-data text-mono-data text-on-surface-variant">
<span>REC-IIFSR-21 // System</span>
<span>-1h</span>
</div>
<div className="font-bold text-trend-up">Cover Crop Planting Window</div>
<div className="text-on-surface-variant">Optimal conditions for Legume cover crop insertion identified in harvested sectors.</div>
</div>
</div>
</div>

<div className="tech-panel shrink-0 h-48 flex flex-col p-0 border border-border-subtle">
<div className="flex border-b border-border-subtle bg-[#020617] shrink-0">
<button className="tab-btn active font-label-caps text-label-caps px-4 py-2 uppercase">Copernicus Sentinel-2</button>
<button className="tab-btn font-label-caps text-label-caps px-4 py-2 uppercase text-on-surface-variant">Open-Meteo Trends</button>
<button className="tab-btn font-label-caps text-label-caps px-4 py-2 uppercase text-on-surface-variant">Regional Inputs</button>
</div>
<div className="p-4 flex-1 flex flex-col gap-2 justify-center bg-[#0f172a]">
<div className="flex justify-between items-center border-b border-border-subtle pb-2">
<span className="font-body-sm text-body-sm text-on-surface-variant">Last Pass (L2A Cloud Free)</span>
<span className="font-mono-data text-mono-data">2023-10-24 10:30 UTC</span>
</div>
<div className="flex justify-between items-center border-b border-border-subtle pb-2">
<span className="font-body-sm text-body-sm text-on-surface-variant">Band 8 (NIR) Reflectance Avg</span>
<span className="font-mono-data text-mono-data">0.45 ± 0.02</span>
</div>
<div className="flex justify-between items-center border-b border-border-subtle pb-2">
<span className="font-body-sm text-body-sm text-on-surface-variant">Band 4 (Red) Reflectance Avg</span>
<span className="font-mono-data text-mono-data">0.12 ± 0.01</span>
</div>
</div>
</div>
</div>
</div>
</main>
</div>

<footer className="flex justify-between items-center w-full px-margin-desktop py-1 h-8 bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-outline-variant dark:border-outline-variant shrink-0 z-50">
<div className="font-label-caps text-label-caps text-on-tertiary-container">OpenAgri Protocol v4.2 | BRICS Climate Taskforce</div>
<nav className="flex gap-4">
<a className="text-on-surface-variant dark:text-on-surface-variant font-mono-data text-mono-data hover:text-primary dark:hover:text-primary transition-colors" href="#">Sentinel-2</a>
<a className="text-on-surface-variant dark:text-on-surface-variant font-mono-data text-mono-data hover:text-primary dark:hover:text-primary transition-colors" href="#">Open-Meteo</a>
<a className="text-on-surface-variant dark:text-on-surface-variant font-mono-data text-mono-data hover:text-primary dark:hover:text-primary transition-colors" href="#">Crop Stocks</a>
<a className="text-on-surface-variant dark:text-on-surface-variant font-mono-data text-mono-data hover:text-primary dark:hover:text-primary transition-colors" href="#">API Docs</a>
</nav>
</footer>

    </>
  );
}
