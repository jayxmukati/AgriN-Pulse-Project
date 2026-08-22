import React from 'react';
import axios from 'axios';

export default function DiagnosticResults() {
  return (
    <>
      

<header className="w-full top-0 sticky bg-surface dark:bg-surface-container-low border-b border-outline-variant dark:border-outline flat no shadows z-50">
<div className="flex items-center justify-between px-container-margin h-14 w-full">
<button aria-label="Go back" className="text-primary dark:text-primary-fixed hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors duration-200 active:scale-95 p-2 rounded-full -ml-2">
<span className="material-symbols-outlined">arrow_back</span>
</button>
<div className="flex flex-col items-center">
<h1 className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed">Diagnostic Results</h1>
<span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
<span className="material-symbols-outlined text-[12px]">verified_user</span> GPS/Photo Data Anonymized
                </span>
</div>
<button aria-label="Share" className="text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors duration-200 active:scale-95 p-2 rounded-full -mr-2">
<span className="material-symbols-outlined">share</span>
</button>
</div>
</header>
<main className="p-container-margin space-y-lg max-w-2xl mx-auto">

<section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm relative">
<div className="h-48 w-full relative bg-surface-variant">
<img alt="Scanned crop leaf" className="w-full h-full object-cover" data-alt="A close-up photograph of a tomato leaf showing signs of Early Blight (Alternaria solani). The image is captured in bright, natural daylight in a field setting, typical of a high-stakes agricultural environment. The focus is sharp on a specific dark, concentric ringed lesion on the vibrant green leaf. The overall aesthetic is scientific and documentarian, fitting for a modern diagnostic crop pathology tool." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBawbyBuEOtlCCYIvq1tsL6yrsVRCOf78mCmH_gutT5cUn-NrD5qabEIeOMTseMypxnflQCnvt6LM-1GzbaYdnI8wApHQEHBrYNRqd5tDnoR_xOHTcnNTwLbQm69sFQEIBv-ezcv0bXOfihdlwz7AEhbM_UdVFDNzg1v4adIyOeN9adopojux2fN1apxv4YIf_FsG7uFQGbaXcC1iCg9T2pbISgrCezD7lHz3BC_3mZbXSs1hFIIYQ"/>

<div className="absolute inset-0 flex items-center justify-center">
<div className="w-24 h-24 border-2 border-primary border-dashed rounded-DEFAULT relative">
<div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-primary"></div>
<div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-primary"></div>
<div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-primary"></div>
<div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-primary"></div>
<span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-surface/90 text-primary font-label-sm text-label-sm px-1 rounded-DEFAULT shadow-sm backdrop-blur-sm whitespace-nowrap">Detected Region</span>
</div>
</div>
</div>
<div className="p-md flex justify-between items-center border-t-4 border-tertiary">
<span className="font-label-md text-label-md text-tertiary flex items-center gap-2">
<span className="material-symbols-outlined icon-filled text-tertiary">warning</span>
                    Pathology Severity: Moderate
                </span>
<span className="font-data-mono text-data-mono text-on-surface-variant">ID: SCAN-8492</span>
</div>
</section>

<section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
<h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Tomato Early Blight</h2>
<p className="font-body-md text-body-md text-on-surface-variant italic mb-lg">Alternaria solani</p>
<div className="space-y-sm mb-lg">
<div className="flex justify-between items-end">
<span className="font-label-md text-label-md text-on-surface">Primary Match Confidence</span>
<span className="font-data-mono text-data-mono text-primary font-bold">94%</span>
</div>
<div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full" style={{'width': '94%'}}></div>
</div>
</div>
<div className="border-t border-outline-variant pt-md">
<h3 className="font-label-sm text-label-sm text-on-surface-variant mb-sm uppercase tracking-wider">Alternative Matches</h3>
<ul className="space-y-2">
<li className="flex items-center gap-3">
<span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
<span className="font-body-md text-body-md text-on-surface text-sm flex-1">Septoria Leaf Spot</span>
<span className="font-data-mono text-data-mono text-on-surface-variant text-xs">12%</span>
</li>
<li className="flex items-center gap-3">
<span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
<span className="font-body-md text-body-md text-on-surface text-sm flex-1">Late Blight</span>
<span className="font-data-mono text-data-mono text-on-surface-variant text-xs">4%</span>
</li>
</ul>
</div>
</section>

<section>
<h2 className="font-headline-sm text-headline-sm text-on-surface mb-md flex items-center gap-2">
<span className="material-symbols-outlined text-primary">eco</span> Regenerative Treatment Plan
            </h2>
<div className="border border-outline-variant rounded-xl overflow-hidden bg-surface-container-lowest divide-y divide-outline-variant">

<details className="group" open="">
<summary className="flex justify-between items-center p-md cursor-pointer font-label-md text-label-md text-on-surface bg-surface-container-lowest hover:bg-surface-container-low transition-colors min-h-[48px]">
                        Natural &amp; Low-Cost Treatments
                        <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-on-surface-variant">expand_more</span>
</summary>
<div className="p-md pt-0 bg-surface-container-lowest">
<ul className="list-disc pl-5 space-y-2 font-body-md text-body-md text-on-surface-variant mt-sm">
<li>Apply <strong className="text-on-surface">Bio-fungicide sprays</strong> (e.g., Bacillus subtilis based) immediately to surrounding healthy plants.</li>
<li>Use <strong className="text-on-surface">Neem oil</strong> at a dosage of 2 tablespoons per gallon of water, applied weekly in the early morning or late evening.</li>
<li>Remove and securely dispose of infected lower leaves to reduce spore spread.</li>
</ul>
</div>
</details>

<details className="group">
<summary className="flex justify-between items-center p-md cursor-pointer font-label-md text-label-md text-on-surface bg-surface-container-lowest hover:bg-surface-container-low transition-colors min-h-[48px]">
                        Soil &amp; Water Management Rules
                        <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-on-surface-variant">expand_more</span>
</summary>
<div className="p-md pt-0 bg-surface-container-lowest">
<ul className="list-disc pl-5 space-y-2 font-body-md text-body-md text-on-surface-variant mt-sm">
<li><strong className="text-on-surface">Adjust irrigation based on upcoming rainfall:</strong> Switch entirely to drip irrigation to keep foliage dry. Avoid overhead watering.</li>
<li><strong className="text-on-surface">Increase spacing for airflow:</strong> Ensure a minimum of 24 inches between plants if possible, pruning excess dense foliage in the lower canopy.</li>
<li>Apply a thick layer of organic mulch to prevent soil-borne spores from splashing onto lower leaves during heavy rain.</li>
</ul>
</div>
</details>
</div>
</section>

<section className="space-y-sm pt-sm pb-lg">

<div className="bg-surface-container-low border border-outline-variant rounded-xl p-sm flex items-center gap-md">
<button aria-label="Play audio advisory" className="w-12 h-12 flex-shrink-0 bg-primary text-on-primary rounded-full flex items-center justify-center hover:bg-surface-tint transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
<span className="material-symbols-outlined icon-filled text-[28px]">play_circle</span>
</button>
<div className="flex-1 flex flex-col justify-center">
<span className="font-label-sm text-label-sm text-on-surface mb-1">Listen to Audio Advisory</span>
<div className="flex items-center gap-2">
<span className="font-data-mono text-data-mono text-on-surface-variant text-[10px]">0:00</span>
<div className="h-1.5 flex-1 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full w-0"></div>
</div>
<span className="font-data-mono text-data-mono text-on-surface-variant text-[10px]">2:15</span>
</div>
</div>
</div>

<button className="w-full min-h-[48px] flex items-center justify-center gap-2 border border-outline text-on-surface font-label-md text-label-md rounded-xl hover:bg-surface-container-low transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-surface-container-lowest">
<span className="material-symbols-outlined">share</span>
                Share with Regional Extension Agent
            </button>
</section>
</main>


    </>
  );
}
