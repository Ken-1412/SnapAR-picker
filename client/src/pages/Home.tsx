import React, { useState } from 'react';
import ARPickerFeature from '../features/ar-picker/ARPickerFeature';
import CommandCenterFeature from '../features/command-center/CommandCenterFeature';
import InventoryFeature from '../features/inventory/InventoryFeature';
import QualityFeature from '../features/quality/QualityFeature';
import NavigationFeature from '../features/navigation/NavigationFeature';
import TranslationFeature from '../features/translation/TranslationFeature';
import TelemetryFeature from '../features/telemetry/TelemetryFeature';
import { Eye, Shield, Boxes, Apple, MapPin, Languages, Cpu, Play } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'ar' | 'command' | 'inventory' | 'quality' | 'navigation' | 'translation' | 'telemetry'>('ar');

  const navItems = [
    { id: 'ar', label: '1. HERO AR HUD', icon: Eye },
    { id: 'command', label: '2. COMMAND CENTER', icon: Shield },
    { id: 'inventory', label: '3. DIGITAL INVENTORY', icon: Boxes },
    { id: 'quality', label: '4. PRODUCE QUALITY', icon: Apple },
    { id: 'navigation', label: '5. SPATIAL NAV', icon: MapPin },
    { id: 'translation', label: '6. AR TRANSLATE', icon: Languages },
    { id: 'telemetry', label: '7. EDGE NPU MATRIX', icon: Cpu }
  ];

  return (
    <div className="app-shell min-h-screen bg-[#0B0F17] text-slate-100 font-sans flex">
      {/* Tactical Side Rail Navigation */}
      <aside className="side-rail w-64 border-r border-slate-800 bg-slate-950 p-5 flex flex-col justify-between">
        <div>
          <div className="app-mark flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-sm shadow-lg shadow-emerald-500/20">
              AR
            </div>
            <div>
              <strong className="block text-sm font-mono tracking-tight text-slate-100">SnapAR Picker</strong>
              <span className="text-[10px] font-mono text-emerald-400">EDGE ACTIVE</span>
            </div>
          </div>

          <div className="rail-divider my-4 border-b border-slate-800" />

          <nav className="side-nav space-y-1 font-mono text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="edge-chip p-3 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-mono flex items-center gap-2 text-emerald-400">
          <span className="pulse-dot" />
          <span>SNAPDRAGON HEXAGON NPU</span>
        </div>
      </aside>

      {/* Main Content Stage */}
      <main className="main-stage flex-1 p-8 overflow-y-auto">
        {activeTab === 'ar' && <ARPickerFeature />}
        {activeTab === 'command' && <CommandCenterFeature />}
        {activeTab === 'inventory' && <InventoryFeature />}
        {activeTab === 'quality' && <QualityFeature />}
        {activeTab === 'navigation' && <NavigationFeature />}
        {activeTab === 'translation' && <TranslationFeature />}
        {activeTab === 'telemetry' && <TelemetryFeature />}
      </main>
    </div>
  );
}
