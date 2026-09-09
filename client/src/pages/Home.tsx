import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  AudioLines,
  Box,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Crosshair,
  Database,
  Eye,
  Gauge,
  LayoutGrid,
  LocateFixed,
  MapPin,
  Mic,
  MoveUpRight,
  PackageCheck,
  Radio,
  ScanLine,
  ShieldCheck,
  Signal,
  Sparkles,
  Target,
  TerminalSquare,
  Timer,
  TriangleAlert,
  Truck,
  Users,
  WifiOff,
  Zap,
} from "lucide-react";

const workflow = [
  { label: "Order", icon: ClipboardIcon },
  { label: "Scan", icon: ScanLine },
  { label: "Detect", icon: Crosshair },
  { label: "Navigate", icon: LocateFixed },
  { label: "Pick", icon: PackageCheck },
  { label: "Verify", icon: ShieldCheck },
  { label: "Complete", icon: CircleCheck },
];

const detections = [
  { sku: "SKU-2048", name: "Citrus drink / 500ml", confidence: 98, qty: "5 units", status: "Target", tone: "target" },
  { sku: "SKU-2049", name: "Citrus drink / 330ml", confidence: 84, qty: "12 units", status: "Similar", tone: "similar" },
  { sku: "BIN-C4-21", name: "Shelf label / nearby", confidence: 71, qty: "—", status: "Context", tone: "context" },
];

function ClipboardIcon(props: { size?: number; strokeWidth?: number }) {
  return <Box {...props} />;
}

function Metric({ label, value, detail, positive, icon: Icon }: { label: string; value: string; detail: string; positive?: boolean; icon: typeof Activity }) {
  return (
    <div className="metric">
      <div className="metric-icon"><Icon size={16} /></div>
      <div className="metric-copy">
        <span className="eyebrow">{label}</span>
        <strong>{value}</strong>
        <span className={positive ? "trend positive" : "trend"}>{positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {detail}</span>
      </div>
    </div>
  );
}

function WorkflowRail({ activeStep, onStep }: { activeStep: number; onStep: (index: number) => void }) {
  return (
    <div className="workflow-rail">
      <div className="rail-label">LIVE PICK PATH</div>
      <div className="workflow-list">
        {workflow.map((step, index) => {
          const Icon = step.icon;
          const active = index === activeStep;
          const complete = index < activeStep;
          return (
            <button className={`workflow-step ${active ? "active" : ""} ${complete ? "complete" : ""}`} key={step.label} onClick={() => onStep(index)}>
              <span className="step-index">{complete ? <CircleCheck size={15} /> : `0${index + 1}`}</span>
              <Icon size={15} />
              <span>{step.label}</span>
              {active && <ChevronRight className="step-arrow" size={15} />}
            </button>
          );
        })}
      </div>
      <div className="rail-footnote"><Radio size={13} /> Edge engine online</div>
    </div>
  );
}

function AppMark() {
  return (
    <div className="app-mark" aria-label="SnapAR Picker">
      <div className="mark-symbol"><span /><span /><span /><span /></div>
      <div><strong>SnapAR</strong><span>Picker</span></div>
    </div>
  );
}

export default function Home() {
  const [activeStep, setActiveStep] = useState(3);
  const [activeView, setActiveView] = useState("operator");
  const [voice, setVoice] = useState(false);
  const [runStarted, setRunStarted] = useState(false);
  const [verified, setVerified] = useState(false);
  const [toast, setToast] = useState("");

  const currentStep = workflow[activeStep]?.label ?? "Navigate";
  const progress = useMemo(() => Math.round(((activeStep + 1) / workflow.length) * 100), [activeStep]);

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function advance() {
    setRunStarted(true);
    setVerified(false);
    setActiveStep((step) => Math.min(workflow.length - 1, step + 1));
    flash(activeStep >= 5 ? "Order complete — sync queued locally" : `Advanced to ${workflow[Math.min(workflow.length - 1, activeStep + 1)].label}`);
  }

  function handleView(view: string) {
    setActiveView(view);
    flash(`${view === "operator" ? "Operator view" : view === "inventory" ? "Inventory lattice" : "Exception queue"} loaded`);
  }

  return (
    <div className="app-shell">
      <aside className="side-rail">
        <AppMark />
        <div className="rail-divider" />
        <nav className="side-nav" aria-label="Primary navigation">
          <button className={activeView === "operator" ? "nav-item active" : "nav-item"} onClick={() => handleView("operator")}><LayoutGrid size={17} /><span>Operator</span></button>
          <button className={activeView === "inventory" ? "nav-item active" : "nav-item"} onClick={() => handleView("inventory")}><Database size={17} /><span>Inventory</span></button>
          <button className={activeView === "exceptions" ? "nav-item active" : "nav-item"} onClick={() => handleView("exceptions")}><TriangleAlert size={17} /><span>Exceptions</span><b>03</b></button>
        </nav>
        <div className="side-spacer" />
        <button className="nav-item subtle" onClick={() => flash("Supervisor mode is a prototype placeholder")}><Users size={17} /><span>Supervisor</span></button>
        <div className="edge-chip"><span className="pulse-dot" />EDGE ACTIVE</div>
      </aside>

      <main className="main-stage">
        <header className="topbar">
          <div className="crumb"><span className="crumb-live" /> Yiwu / Hall C4 <ChevronRight size={13} /> <strong>Worker 047</strong></div>
          <div className="top-actions">
            <div className="system-state"><Signal size={15} /><span>LOCAL LINK</span><i /></div>
            <button className={`voice-toggle ${voice ? "listening" : ""}`} onClick={() => { setVoice(!voice); flash(voice ? "Voice channel closed" : "Listening for an operational command"); }}><Mic size={15} />{voice ? "Listening" : "Voice"}</button>
            <button className="avatar" onClick={() => flash("Worker profile: Mei Lin / Shift A")}>ML</button>
          </div>
        </header>

        <div className="content-wrap">
          {activeView === "operator" && (
            <>
              <section className="intro-row">
                <div>
                  <div className="kicker"><Sparkles size={14} /> SPATIAL OPERATIONS / RUN 20481</div>
                  <h1>Pick with the<br /><em>world in view.</em></h1>
                  <p className="lede">SnapAR turns crowded aisles into a guided, verifiable workspace — even when the network drops.</p>
                </div>
                <div className="run-control">
                  <div className="run-meta"><span>ACTIVE ORDER</span><strong>#20481 · 12 lines</strong></div>
                  <button className="primary-action" onClick={() => { setRunStarted(true); setActiveStep(0); flash("Order 20481 started"); }}>{runStarted ? "Restart order" : "Start order"}<MoveUpRight size={17} /></button>
                </div>
              </section>

              <section className="hero-grid">
                <WorkflowRail activeStep={activeStep} onStep={setActiveStep} />
                <div className="vision-panel">
                  <div className="vision-image" style={{ backgroundImage: "url('/manus-storage/snapar_picker_hero_e0eb51ef.png')" }} />
                  <div className="vision-shade" />
                  <div className="vision-topline"><span className="live-badge"><span className="pulse-dot" /> LIVE FIELD VIEW</span><span className="vision-time"><Timer size={13} /> 00:42:18</span></div>
                  <div className="scan-bracket bracket-tl" /><div className="scan-bracket bracket-tr" /><div className="scan-bracket bracket-bl" /><div className="scan-bracket bracket-br" />
                  <div className="route-line"><span className="route-dot dot-a" /><span className="route-dot dot-b" /><span className="route-dot dot-c" /></div>
                  <div className="vision-target"><div className="target-crosshair"><span /><span /></div><div><small>TARGET ACQUIRED</small><strong>SKU-2048</strong><span>Rack C4-18 · 5 units</span></div></div>
                  <div className="vision-readout"><div className="readout-icon"><Eye size={16} /></div><div><small>VISION ENGINE</small><strong>98.4% match</strong></div></div>
                  <div className="vision-footer"><span><WifiOff size={13} /> Cloud optional</span><span><Zap size={13} /> 4.2ms edge latency</span></div>
                </div>
                <aside className="order-panel">
                  <div className="panel-heading"><div><span className="eyebrow">NEXT ACTION</span><h2>{currentStep === "Navigate" ? "Navigate to rack" : currentStep === "Complete" ? "Order complete" : currentStep}</h2></div><span className="step-count">{String(activeStep + 1).padStart(2, "0")} / 07</span></div>
                  <div className="destination"><div className="destination-icon"><MapPin size={18} /></div><div><span>DESTINATION</span><strong>Rack C4-18</strong><small>12m · aisle 04 · left turn</small></div></div>
                  <div className="order-rule" />
                  <div className="pick-spec"><span>Picking for</span><strong>Urban Market Co.</strong><span>Batch / beverages · priority normal</span></div>
                  <div className="quantity-row"><div><span className="eyebrow">QUANTITY</span><strong>05</strong><small>of 05 units</small></div><div className="quantity-meter"><span style={{ width: `${Math.max(20, progress)}%` }} /></div></div>
                  <div className="panel-actions"><button className="ghost-action" onClick={() => flash("Route recalculated around active aisle traffic")}>Show route <LocateFixed size={15} /></button><button className="confirm-action" onClick={() => { setVerified(true); setActiveStep(5); flash("Physical pick verified by edge vision"); }}>{verified ? "Verified" : "Confirm pick"}<CircleCheck size={15} /></button></div>
                </aside>
              </section>

              <section className="lower-grid">
                <div className="section-block detections-block"><div className="section-title"><div><span className="eyebrow">MACHINE PERCEPTION</span><h2>What the glasses see</h2></div><button className="text-button" onClick={() => flash("Detection stream refreshed")}>Refresh <Activity size={14} /></button></div><div className="detection-list">{detections.map((item) => <div className={`detection-row ${item.tone}`} key={item.sku}><div className="detection-glyph"><Box size={17} /></div><div className="detection-name"><strong>{item.sku}</strong><span>{item.name}</span></div><div className="detection-confidence"><span>CONFIDENCE</span><strong>{item.confidence}%</strong></div><div className="detection-qty"><span>{item.qty}</span><b>{item.status}</b></div></div>)}</div></div>
                <div className="section-block metrics-block"><div className="section-title"><div><span className="eyebrow">SHIFT PULSE</span><h2>Today, at a glance</h2></div><Gauge size={17} className="muted-icon" /></div><div className="metrics-grid"><Metric label="PICK ACCURACY" value="98.7%" detail="+4.2% vs manual" positive icon={Target} /><Metric label="ORDERS CLEARED" value="143" detail="+18 in last hour" positive icon={Truck} /><Metric label="EDGE INFERENCES" value="4.8k" detail="Offline-ready" icon={Zap} /></div></div>
              </section>
            </>
          )}

          {activeView === "inventory" && <section className="alternate-view"><div className="kicker"><Database size={14} /> SPATIAL INVENTORY / PHYSICAL-DIGITAL TWIN</div><h1>Stock, where it<br /><em>actually lives.</em></h1><p className="lede">A working view of the warehouse lattice. Select a zone to inspect the physical shelf, confidence, and last-seen edge scan.</p><div className="inventory-grid">{["A1 / Dry goods", "C4 / Beverages", "D2 / Produce", "F7 / Returns"].map((zone, index) => <button className={`inventory-zone ${index === 1 ? "selected" : ""}`} key={zone} onClick={() => flash(`${zone} selected`)}><div className="zone-map"><span className={`zone-pip pip-${index}`} /><span /><span /><span /></div><div><span>ZONE 0{index + 1}</span><strong>{zone}</strong><small>{index === 1 ? "12m from worker · 98% scanned" : "Last scan 14m ago"}</small></div><ChevronRight size={17} /></button>)}</div></section>}
          {activeView === "exceptions" && <section className="alternate-view"><div className="kicker"><TriangleAlert size={14} /> EXCEPTION QUEUE / SUPERVISOR REVIEW</div><h1>Only the moments<br /><em>that need a human.</em></h1><p className="lede">Edge AI handles the repetitive work. This is the short list of decisions worth escalating.</p><div className="exception-list">{[{label: "Similar SKU", detail: "SKU-2049 detected in C4-18", severity: "Review", icon: TriangleAlert}, {label: "Quality check", detail: "3 cartons in D2 need visual inspection", severity: "Queued", icon: CircleAlert}, {label: "Network", detail: "Remote node entered offline mode", severity: "Resolved", icon: WifiOff}].map((item) => { const Icon = item.icon; return <div className="exception-row" key={item.label}><div className="exception-icon"><Icon size={18} /></div><div><span>{item.label}</span><strong>{item.detail}</strong></div><b>{item.severity}</b><ChevronRight size={17} /></div>; })}</div></section>}
        </div>
      </main>
      {toast && <div className="toast"><CircleCheck size={15} /> {toast}</div>}
    </div>
  );
}
