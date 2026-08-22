import React from 'react';
import axios from 'axios';

export default function FarmerApp() {
  return (
    <>
      

<div className="fixed top-0 w-full h-[40px] bg-surface-container-high flex items-center justify-center z-[60]">
<span className="material-symbols-outlined text-[16px] mr-2 text-primary">sync</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Synced 2m ago</span>
</div>

<header className="fixed top-[40px] w-full z-50 bg-surface flex justify-between items-center px-container-margin h-touch-target-min border-b border-surface-container-high shadow-sm">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[24px]">agriculture</span>
<h1 className="font-headline-md text-headline-md-mobile font-bold text-primary">AgriSafe</h1>
</div>
<div className="flex items-center">
<button className="flex items-center gap-1 hover:bg-surface-container-high transition-colors px-2 py-1 rounded-full text-on-surface-variant active:scale-95 transition-transform h-[36px]">
<span className="font-label-lg text-label-lg">English</span>
<span className="material-symbols-outlined text-[20px]">expand_more</span>
</button>
</div>
</header>

<main className="pt-[104px] px-container-margin max-w-[600px] mx-auto space-y-stack-lg pb-stack-lg">

<section className="grid grid-cols-2 gap-gutter">
<button className="bg-primary text-on-primary rounded-xl p-4 flex flex-col items-center justify-center gap-3 h-[120px] shadow-ambient active:scale-95 transition-transform">
<span className="material-symbols-outlined text-[32px]" style={{fontVariationSettings: "'FILL' 1", fontWeight: "600"}}>photo_camera</span>
<span className="font-label-lg text-label-lg text-center leading-tight">Scan Leaf<br/>Disease</span>
</button>
<button className="bg-surface-container-lowest border-2 border-primary text-primary rounded-xl p-4 flex flex-col items-center justify-center gap-3 h-[120px] shadow-ambient active:scale-95 transition-transform">
<span className="material-symbols-outlined text-[32px]" style={{fontWeight: "600"}}>mic</span>
<span className="font-label-lg text-label-lg text-center leading-tight">Ask Voice<br/>Advisory</span>
</button>
</section>

<section className="bg-surface-container-lowest rounded-card shadow-ambient overflow-hidden">
<div className="p-4 border-b border-surface-container-low flex justify-between items-center">
<h2 className="font-headline-sm text-headline-sm text-on-surface">Field Status</h2>
<button className="text-primary font-label-lg text-label-lg flex items-center">View All <span className="material-symbols-outlined text-[18px] ml-1">chevron_right</span></button>
</div>
<div className="relative w-full h-[200px] bg-surface-variant">

<img className="w-full h-full object-cover" data-alt="A highly detailed satellite view of a lush green agricultural farm divided into neat rectangular plots. The map is viewed from directly above in bright daylight, showing variations in crop growth. A subtle white UI overlay marks a specific field boundary. The overall aesthetic is clean, modern, and high-contrast, fitting a professional agricultural application." src="https://lh3.googleusercontent.com/aida-public/AB6AXuClhQKul4AoWQjSTblGc5NR8MjLLyCXQoVTa84MXMxv-XK2zgqddtm2IoPURYQ5BR0Vj5LxdRddRkPDABP07vwycTTTpkZdRdRaFkXp4JmC_n8f71_N0-HCnm8oUzhjx_b1B75ENJmra3y2u_OgBO3Os-gUIVQKDdkl3TaWulvoHhu-1L9X6t8SFZnWCb_AQZ1IMW8zZZV8LxgHdwBu_JvXIKRNx0yjIx_1ztt9YbEgcK0v7VbX1LM"/>
<div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/90 backdrop-blur-sm rounded-lg p-3 shadow-md flex justify-between items-center">
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant mb-1">North Plot A</p>
<p className="font-headline-sm text-[16px] text-on-surface">Field Health: 0.72</p>
</div>
<div className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">check_circle</span> Good
                    </div>
</div>
</div>
</section>

<section className="bg-surface-container-lowest rounded-card shadow-ambient p-4">
<div className="flex justify-between items-center mb-4">
<h2 className="font-headline-sm text-headline-sm text-on-surface">Micro-Climate</h2>
<span className="material-symbols-outlined text-on-surface-variant">thermostat</span>
</div>
<div className="flex overflow-x-auto no-scrollbar gap-4 pb-2">

<div className="flex flex-col items-center min-w-[70px] bg-surface-container-low rounded-lg p-3 border border-outline-variant">
<span className="font-label-sm text-label-sm text-on-surface-variant mb-2">Today</span>
<span className="material-symbols-outlined text-secondary-fixed-dim text-[24px] mb-1">wb_sunny</span>
<span className="font-body-md text-body-md font-semibold text-on-surface">28°</span>
<div className="mt-2 text-center">
<span className="font-label-sm text-label-sm text-primary block">Soil: 42%</span>
<span className="font-label-sm text-label-sm text-secondary block mt-1">THI: Low</span>
</div>
</div>

<div className="flex flex-col items-center min-w-[70px] bg-surface-container-low rounded-lg p-3 border border-outline-variant">
<span className="font-label-sm text-label-sm text-on-surface-variant mb-2">Tomorrow</span>
<span className="material-symbols-outlined text-secondary-fixed-dim text-[24px] mb-1">partly_cloudy_day</span>
<span className="font-body-md text-body-md font-semibold text-on-surface">26°</span>
<div className="mt-2 text-center">
<span className="font-label-sm text-label-sm text-primary block">Soil: 38%</span>
<span className="font-label-sm text-label-sm text-secondary block mt-1">THI: Low</span>
</div>
</div>

<div className="flex flex-col items-center min-w-[70px] bg-surface-container-low rounded-lg p-3 border border-outline-variant">
<span className="font-label-sm text-label-sm text-on-surface-variant mb-2">Wed</span>
<span className="material-symbols-outlined text-primary text-[24px] mb-1">rainy</span>
<span className="font-body-md text-body-md font-semibold text-on-surface">24°</span>
<div className="mt-2 text-center">
<span className="font-label-sm text-label-sm text-primary block">Soil: 55%</span>
<span className="font-label-sm text-label-sm text-secondary block mt-1">THI: Low</span>
</div>
</div>

<div className="flex flex-col items-center min-w-[70px] bg-surface-container-low rounded-lg p-3 border border-outline-variant">
<span className="font-label-sm text-label-sm text-on-surface-variant mb-2">Thu</span>
<span className="material-symbols-outlined text-secondary-fixed-dim text-[24px] mb-1">wb_sunny</span>
<span className="font-body-md text-body-md font-semibold text-on-surface">31°</span>
<div className="mt-2 text-center">
<span className="font-label-sm text-label-sm text-error block">Soil: 20%</span>
<span className="font-label-sm text-label-sm text-error block mt-1">THI: High</span>
</div>
</div>
</div>
</section>
</main>

<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-surface border-t border-outline-variant shadow-lg md:hidden pb-safe">
<button className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-highest active:scale-90 transition-all duration-200 p-2 rounded-lg group active">
<div className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1">
<span className="material-symbols-outlined text-[24px]" style={{fontVariationSettings: "'FILL' 1"}}>home</span>
</div>
<span className="font-label-sm text-label-sm mt-1 text-on-surface">Home</span>
</button>
<button className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-highest active:scale-90 transition-all duration-200 p-2 rounded-lg group">
<span className="material-symbols-outlined text-[24px]">potted_plant</span>
<span className="font-label-sm text-label-sm mt-1">Fields</span>
</button>
<button className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-highest active:scale-90 transition-all duration-200 p-2 rounded-lg group">
<span className="material-symbols-outlined text-[24px]">photo_camera</span>
<span className="font-label-sm text-label-sm mt-1">Scan</span>
</button>
<button className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-highest active:scale-90 transition-all duration-200 p-2 rounded-lg group">
<span className="material-symbols-outlined text-[24px]">psychology</span>
<span className="font-label-sm text-label-sm mt-1">Advisories</span>
</button>
</nav>


    </>
  );
}
