import React, { useState } from 'react';
import { Compass, Navigation, MapPin } from 'lucide-react';

export default function NavigationFeature() {
  const [distance, setDistance] = useState(12);

  const simulateApproach = () => {
    if (distance > 2) {
      setDistance(distance - 3);
    } else {
      setDistance(12);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="kicker">
          <span className="pulse-dot" />
          <span>2.5D SPATIAL WAYFINDING</span>
        </div>
        <h1>Warehouse Spatial Navigation</h1>
        <p className="lede">
          Real-time floor path planning guiding pickers through high-density aisles and multi-tiered racks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        <div className="lg:col-span-2 p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">ACTIVE ROUTE MAP</span>
            <button
              onClick={simulateApproach}
              className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded hover:bg-emerald-500/30"
            >
              SIMULATE WORKER MOVEMENT
            </button>
          </div>

          <div className="h-80 bg-slate-900 border border-slate-800 rounded-lg relative overflow-hidden flex items-center justify-center">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />

            <svg className="w-full h-full absolute inset-0">
              <path
                d="M 100 250 L 300 250 L 300 120 L 550 120"
                fill="none"
                stroke="#4ADE80"
                strokeWidth="4"
                strokeDasharray="6 4"
              />
              <circle cx="100" cy="250" r="8" fill="#4ADE80" />
              <circle cx="550" cy="120" r="10" fill="#EF4444" className="animate-ping" />
            </svg>

            <div className="absolute bottom-6 left-6 p-3 bg-slate-950/90 border border-emerald-400/60 rounded text-emerald-300 backdrop-blur">
              <div className="text-xs font-bold">NEXT WAYPOINT: Aisle 7 / Rack C4-18</div>
              <div className="text-xl font-bold text-slate-100">{distance} METERS REMAINING</div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
          <span className="text-slate-400 block">NAVIGATION DIRECTIVES</span>
          <div className="space-y-3">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded">
              <span className="text-slate-500 block text-[10px]">STEP 1</span>
              <strong className="text-slate-200">Proceed straight down Aisle 7 (8m)</strong>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded">
              <span className="text-slate-500 block text-[10px]">STEP 2</span>
              <strong className="text-slate-200">Turn Right at Bay C4</strong>
            </div>
            <div className="p-3 bg-slate-900 border border-emerald-500/50 rounded bg-emerald-950/20">
              <span className="text-emerald-400 block text-[10px]">DESTINATION</span>
              <strong className="text-emerald-300">Locate Shelf Tier 3 (Eye Level)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
