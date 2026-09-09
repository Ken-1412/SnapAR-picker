import React, { useState } from 'react';
import { Apple, ShieldCheck, AlertOctagon, ScanEye } from 'lucide-react';

export default function QualityFeature() {
  const [inspecting, setInspecting] = useState(false);
  const [qualityScore, setQualityScore] = useState(87);
  const [hasDefect, setHasDefect] = useState(false);

  const triggerScan = () => {
    setInspecting(true);
    setTimeout(() => {
      setQualityScore(Math.floor(Math.random() * 20) + 80);
      setHasDefect(Math.random() > 0.6);
      setInspecting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="kicker">
          <span className="pulse-dot" />
          <span>PRODUCE & PACKAGING QUALITY AI</span>
        </div>
        <h1>Computer Vision Defect Inspection</h1>
        <p className="lede">
          Real-time edge inspection for fresh produce, wet markets, and packaged goods across Indonesian distribution hubs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inspection Viewport */}
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-4 font-mono text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">VISION CAMERA FEED</span>
            <button
              onClick={triggerScan}
              disabled={inspecting}
              className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded flex items-center gap-2 hover:bg-emerald-500/30"
            >
              <ScanEye className={`w-3.5 h-3.5 ${inspecting ? 'animate-spin' : ''}`} />
              <span>{inspecting ? 'INSPECTING FRESHNESS...' : 'RUN QUALITY CHECK'}</span>
            </button>
          </div>

          <div className="h-64 bg-slate-900 border border-slate-800 rounded-lg relative overflow-hidden flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-40 bg-cover bg-center"
              style={{
                backgroundImage: `url('file:///C:/Users/ketan/.gemini/antigravity-ide/brain/82fd0d33-41b3-4bf5-bb6b-3e41f71b199a/assets/media_1788976874071.jpg')`
              }}
            />

            <div className={`p-4 border-2 rounded-xl backdrop-blur relative z-10 text-center space-y-2 ${
              hasDefect ? 'border-amber-400 bg-amber-950/70 text-amber-300' : 'border-emerald-400 bg-emerald-950/70 text-emerald-300'
            }`}>
              <div className="font-bold text-sm">
                {hasDefect ? 'DEFECT DETECTED: SURFACE BLEMISH' : 'GRADE A FRESHNESS PASSED'}
              </div>
              <div className="text-2xl font-bold">{qualityScore}% QUALITY CONFIDENCE</div>
              <div className="text-[10px] text-slate-300">SKU-9102 Cavendish Bananas (Pasar Hub)</div>
            </div>
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-4 font-mono text-xs flex flex-col justify-between">
          <div>
            <span className="text-slate-400 block mb-2">QUALITY INSPECTION PARAMETERS</span>
            <div className="space-y-3">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded flex justify-between items-center">
                <span>RIPENESS / COLOR ANALYSIS</span>
                <span className="text-emerald-400 font-bold">OPTIMAL GOLDEN</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded flex justify-between items-center">
                <span>SURFACE BRUISING DETECTION</span>
                <span className={hasDefect ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {hasDefect ? 'MINOR BRUISE (1.2 cm)' : 'NONE DETECTED'}
                </span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded flex justify-between items-center">
                <span>TEMPERATURE STABILITY</span>
                <span className="text-emerald-400 font-bold">14.2°C (COLD CHAIN OK)</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-900/50 border border-slate-800 rounded text-[10px] text-slate-400">
            NPU model running on Snapdragon Neural Processing Engine (SNPE) at 9.4 ms latency.
          </div>
        </div>
      </div>
    </div>
  );
}
