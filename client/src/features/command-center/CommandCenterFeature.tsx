import React from 'react';
import { Activity, ShieldAlert, Cpu, Wifi, Battery, CheckCircle2, User, Search, MapPin } from 'lucide-react';
import { MOCK_WORKERS, MOCK_ORDERS } from '../../data/mockData';

export default function CommandCenterFeature() {
  const [selectedWorker, setSelectedWorker] = React.useState(MOCK_WORKERS[0]);

  return (
    <div className="space-y-6">
      <div>
        <div className="kicker">
          <span className="pulse-dot" />
          <span>SPATIAL LOGISTICS COMMAND CENTER</span>
        </div>
        <h1>Operations & Live Worker Telemetry</h1>
        <p className="lede">
          Real-time spatial visibility across warehouse zones, Snapdragon AR telemetry, and active order pick rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Worker Cards Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-mono text-slate-400 tracking-wider">ACTIVE FIELD WORKERS ({MOCK_WORKERS.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_WORKERS.map((worker) => {
              const isSelected = selectedWorker.id === worker.id;
              return (
                <div
                  key={worker.id}
                  onClick={() => setSelectedWorker(worker)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/5'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold font-mono text-sm">
                        {worker.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-200 text-sm font-mono">{worker.name}</h3>
                        <span className="text-[10px] text-slate-400 font-mono">{worker.device}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {worker.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div>
                      <span className="text-[9px] text-slate-500 block">BATTERY</span>
                      <span className="text-slate-300 font-bold">{worker.battery}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block">NPU LATENCY</span>
                      <span className="text-emerald-400 font-bold">{worker.npuLatencyMs}ms</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block">TODAY'S PICKS</span>
                      <span className="text-slate-300 font-bold">{worker.itemsPickedToday}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Worker Detailed Telemetry Sidebar */}
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">WORKER STREAM TELEMETRY</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">{selectedWorker.id.toUpperCase()}</span>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>CURRENT ORDER:</span>
              <strong className="text-emerald-400">{selectedWorker.currentOrder}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>SPATIAL LOCATION:</span>
              <strong className="text-slate-200">{selectedWorker.location}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>PROCESSING CORE:</span>
              <strong className="text-emerald-400">{selectedWorker.edgeMode}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>AI ERROR RATE:</span>
              <strong className="text-slate-200">{(selectedWorker.errorRate * 100).toFixed(1)}%</strong>
            </div>
          </div>

          {/* Live Mini Map Grid */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-400">ZONE C SPATIAL POSITIONAL TRACKING</span>
            <div className="h-40 bg-slate-900 border border-slate-800 rounded-lg relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
              <div className="absolute left-1/3 top-1/2 -translate-y-1/2 p-2 bg-emerald-500/20 border border-emerald-400 rounded text-emerald-300 font-mono text-[10px] flex items-center gap-1.5 shadow-lg shadow-emerald-500/10">
                <MapPin className="w-3 h-3 text-emerald-400 animate-bounce" />
                <span>{selectedWorker.name} (Rack C4-18)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
