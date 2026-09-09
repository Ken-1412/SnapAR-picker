import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, AlertTriangle, CheckCircle, Volume2, ShieldAlert, Cpu, WifiOff, ArrowRight } from 'lucide-react';
import { visionService } from '../../services/visionService';
import { MOCK_ORDERS, MOCK_SKUS } from '../../data/mockData';

export default function ARPickerFeature() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [simulationMode, setSimulationMode] = useState<'normal' | 'wrong_sku' | 'offline'>('normal');
  const [pickedQty, setPickedQty] = useState<number>(2);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [voiceCommandText, setVoiceCommandText] = useState<string>('');

  const currentOrder = MOCK_ORDERS[0];
  const targetItem = currentOrder.items[0];

  const workflowSteps = [
    { id: 0, title: 'ORDER RECEIVED', subtitle: '#20481 Dispatched', status: 'active' },
    { id: 1, title: 'ENVIRONMENT SCAN', subtitle: 'NPU Spatial Scan', status: 'pending' },
    { id: 2, title: 'SKU DETECTED', subtitle: 'Target SKU-2048 Locked', status: 'pending' },
    { id: 3, title: 'WAYFINDING', subtitle: 'Aisle 7 -> Rack C4-18', status: 'pending' },
    { id: 4, title: 'PICK & QUANTITY', subtitle: 'Confirm Physical Pick', status: 'pending' },
    { id: 5, title: 'AI VERIFICATION', subtitle: 'Edge NPU Audit', status: 'pending' },
    { id: 6, title: 'COMPLETE', subtitle: 'Next Item Dispatched', status: 'pending' }
  ];

  // Voice Command Listener Simulation
  const triggerVoiceCommand = (cmd: string) => {
    setIsVoiceActive(true);
    setVoiceCommandText(cmd);
    setTimeout(() => {
      if (cmd === '"Start order"' || cmd === '"Scan environment"') setActiveStep(1);
      if (cmd === '"Show route"') setActiveStep(3);
      if (cmd === '"Confirm pick"') handleConfirmPick();
      setIsVoiceActive(false);
    }, 1500);
  };

  const handleConfirmPick = () => {
    const scannedSku = simulationMode === 'wrong_sku' ? 'SKU-2049' : 'SKU-2048';
    const result = visionService.verifyPick('SKU-2048', scannedSku, pickedQty, 5);
    setVerificationResult(result);
    setActiveStep(5);
  };

  // Automated Demo Run (30s Presentation Mode)
  const runAutomatedDemo = () => {
    setIsDemoRunning(true);
    setActiveStep(0);
    setSimulationMode('normal');

    const timeline = [
      { step: 1, delay: 1000 },
      { step: 2, delay: 3500 },
      { step: 3, delay: 6000 },
      { step: 4, delay: 8500 },
      { step: 5, delay: 11000, action: () => handleConfirmPick() },
      { step: 6, delay: 13500 }
    ];

    timeline.forEach((item) => {
      setTimeout(() => {
        if (item.action) item.action();
        setActiveStep(item.step);
        if (item.step === 6) setIsDemoRunning(false);
      }, item.delay);
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="intro-row">
        <div>
          <div className="kicker">
            <span className="pulse-dot"></span>
            <span>EDGE AI AR WORKFLOW</span>
          </div>
          <h1>
            Spatial AR <em>Picking HUD</em>
          </h1>
          <p className="lede">
            Contextual spatial intelligence for wholesale logistics. Powered by Snapdragon Hexagon NPU edge inference.
          </p>
        </div>

        <div className="run-control flex flex-col gap-2">
          <div className="run-meta">
            <span>MODE: {simulationMode === 'offline' ? 'OFFLINE LOCAL' : 'EDGE ACTIVE'}</span>
            <strong>TARGET: {targetItem.rack} ({targetItem.name})</strong>
          </div>
          <div className="flex gap-2">
            <button
              onClick={runAutomatedDemo}
              disabled={isDemoRunning}
              className="primary-action flex-1"
            >
              <span>{isDemoRunning ? 'RUNNING DEMO...' : 'START DEMO MODE'}</span>
              <Play className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setActiveStep(0);
                setVerificationResult(null);
                setSimulationMode('normal');
              }}
              className="px-3 py-2 border border-slate-700 rounded text-slate-400 hover:text-white"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Simulation Preset Selector Bar */}
      <div className="flex items-center gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs font-mono">
        <span className="text-slate-500">SIMULATION PRESETS:</span>
        <button
          onClick={() => setSimulationMode('normal')}
          className={`px-3 py-1.5 rounded transition ${
            simulationMode === 'normal'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          Normal Verified Flow
        </button>
        <button
          onClick={() => setSimulationMode('wrong_sku')}
          className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
            simulationMode === 'wrong_sku'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Exception: Wrong SKU Scan
        </button>
        <button
          onClick={() => setSimulationMode('offline')}
          className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
            simulationMode === 'offline'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <WifiOff className="w-3.5 h-3.5" />
          Offline Edge Mode (No Cloud)
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => triggerVoiceCommand('"Confirm pick"')}
            className={`px-3 py-1.5 border rounded flex items-center gap-2 ${
              isVoiceActive
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/20 animate-pulse'
                : 'border-slate-700 text-slate-400 hover:text-emerald-400'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isVoiceActive ? `VOICE: ${voiceCommandText}` : 'SIMULATE VOICE CMD'}</span>
          </button>
        </div>
      </div>

      {/* Main Spatial AR Layout Grid */}
      <div className="hero-grid relative rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
        {/* Left Workflow Steps Rail */}
        <div className="workflow-rail">
          <div className="rail-label">WORKFLOW STATE</div>
          <div className="workflow-list">
            {workflowSteps.map((step) => {
              const isActive = activeStep === step.id;
              const isComplete = activeStep > step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`workflow-step ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}
                >
                  <span className="step-index">0{step.id + 1}</span>
                  <div className="flex flex-col text-left">
                    <strong className="text-xs font-semibold">{step.title}</strong>
                    <span className="text-[10px] opacity-60">{step.subtitle}</span>
                  </div>
                  {isComplete && <CheckCircle className="w-3.5 h-3.5 ml-auto text-emerald-400" />}
                </button>
              );
            })}
          </div>
          <div className="rail-footnote mt-auto pt-4 border-t border-slate-800/60">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>NPU: 10.7ms | 60 FPS</span>
          </div>
        </div>

        {/* Center Canvas / AR HUD Simulation Viewport */}
        <div className="vision-panel min-h-[460px] relative flex items-center justify-center">
          {/* Simulated Warehouse AR Video/Camera Feed Image */}
          <div
            className="vision-image"
            style={{
              backgroundImage: `url('file:///C:/Users/ketan/.gemini/antigravity-ide/brain/82fd0d33-41b3-4bf5-bb6b-3e41f71b199a/assets/media_1788976873863.png')`
            }}
          />
          <div className="vision-shade" />

          {/* AR HUD OVERLAYS BASED ON ACTIVE STEP */}

          {/* Top Line Telemetry Overlay */}
          <div className="vision-topline">
            <div className="live-badge">
              <span className="pulse-dot" />
              <span>SNAPAR HUD v2.4</span>
            </div>
            <div className="vision-time font-mono">
              <span>LATENCY: {simulationMode === 'offline' ? '9.4ms (LOCAL NPU)' : '10.7ms'}</span>
            </div>
          </div>

          {/* AR Target Scanning Brackets (Step 1 & 2) */}
          {(activeStep === 1 || activeStep === 2) && (
            <>
              <div className="scan-bracket bracket-tl" />
              <div className="scan-bracket bracket-tr" />
              <div className="scan-bracket bracket-bl" />
              <div className="scan-bracket bracket-br" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-emerald-950/80 border border-emerald-400 text-emerald-300 font-mono text-xs rounded backdrop-blur animate-pulse">
                {activeStep === 1 ? 'SCANNED 12 OBJECTS... MATCHING SKU-2048' : 'SKU-2048 CONFIDENCE: 98% MATCH'}
              </div>
            </>
          )}

          {/* Spatial Wayfinding Floor Route Ribbon (Step 3) */}
          {activeStep === 3 && (
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full">
                <path
                  d="M 200 400 Q 350 280, 500 220 T 700 180"
                  fill="none"
                  stroke="#4ADE80"
                  strokeWidth="4"
                  strokeDasharray="8 6"
                  className="animate-dash"
                />
              </svg>
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-emerald-400/60 p-3 rounded-lg backdrop-blur text-center text-xs font-mono">
                <div className="text-emerald-400 font-bold">SPATIAL WAYFINDING ACTIVE</div>
                <div className="text-slate-300">DESTINATION: Rack C4-18 (8m ahead)</div>
              </div>
            </div>
          )}

          {/* Pick Verification Bounding Box Overlay (Step 4 & 5) */}
          {(activeStep === 4 || activeStep === 5) && (
            <div
              className={`absolute border-2 transition-all duration-300 p-3 rounded backdrop-blur ${
                verificationResult?.success === false
                  ? 'border-rose-500 bg-rose-950/60 text-rose-300'
                  : 'border-emerald-400 bg-emerald-950/60 text-emerald-300'
              }`}
              style={{ top: '30%', left: '42%', width: '220px' }}
            >
              <div className="flex justify-between items-center text-xs font-bold font-mono">
                <span>{simulationMode === 'wrong_sku' ? 'SKU-2049' : 'SKU-2048'}</span>
                <span className="px-1.5 py-0.5 bg-emerald-500/30 rounded">{pickedQty}/5 PICKED</span>
              </div>
              <div className="text-[10px] mt-1 opacity-80 font-mono">
                {verificationResult
                  ? verificationResult.message
                  : 'READY FOR VERIFICATION SCAN'}
              </div>
            </div>
          )}

          {/* Complete State Overlay (Step 6) */}
          {activeStep === 6 && (
            <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
              <CheckCircle className="w-16 h-16 text-emerald-400 animate-bounce" />
              <h2 className="text-2xl font-bold text-emerald-300 font-mono">ITEM VERIFIED & RECORDED</h2>
              <p className="text-xs text-emerald-200/80 font-mono">Dispatched to Order #20481 Staging Container</p>
              <button
                onClick={() => setActiveStep(0)}
                className="mt-2 px-4 py-2 bg-emerald-400 text-slate-950 font-mono text-xs font-bold rounded hover:bg-emerald-300"
              >
                PROCEED TO NEXT ITEM
              </button>
            </div>
          )}
        </div>

        {/* Right Order Spec & Interaction Control Panel */}
        <div className="order-panel bg-slate-900/50 p-6 flex flex-col justify-between">
          <div>
            <div className="panel-heading flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-slate-400 tracking-wider">ACTIVE ORDER</span>
                <h2 className="text-lg font-bold font-mono text-slate-100">{currentOrder.orderNumber}</h2>
              </div>
              <span className="px-2 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-mono rounded">
                {currentOrder.priority}
              </span>
            </div>

            <div className="order-rule my-4 border-b border-slate-800" />

            <div className="destination space-y-2">
              <span className="text-[10px] font-mono text-slate-400">TARGET LOCATION</span>
              <strong className="block text-sm text-emerald-400 font-mono">{targetItem.rack}</strong>
              <small className="block text-slate-400 text-xs font-mono">{targetItem.name}</small>
            </div>

            <div className="pick-spec mt-6 space-y-2">
              <span className="text-[10px] font-mono text-slate-400">REQUIRED QUANTITY</span>
              <div className="flex items-baseline gap-2">
                <strong className="text-3xl font-mono font-bold text-slate-100">{targetItem.qtyRequired}</strong>
                <span className="text-xs text-slate-400 font-mono">units</span>
              </div>
            </div>

            {/* Quantity Stepper Control for Simulation */}
            <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400">SIMULATED PICK QUANTITY:</span>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => setPickedQty(Math.max(1, pickedQty - 1))}
                  className="w-8 h-8 bg-slate-800 rounded font-mono font-bold text-slate-300 hover:bg-slate-700"
                >
                  -
                </button>
                <span className="font-mono text-lg font-bold text-emerald-400">{pickedQty}</span>
                <button
                  onClick={() => setPickedQty(pickedQty + 1)}
                  className="w-8 h-8 bg-slate-800 rounded font-mono font-bold text-slate-300 hover:bg-slate-700"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="panel-actions space-y-2 mt-6">
            <button
              onClick={handleConfirmPick}
              className="confirm-action w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-mono font-bold text-xs rounded flex items-center justify-center gap-2"
            >
              <span>CONFIRM PHYSICAL PICK</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
