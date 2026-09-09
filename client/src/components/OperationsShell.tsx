import { useEffect, useState } from "react";
import { Activity, BarChart3, Box, ChevronRight, Command, LayoutGrid, Mic, Package, Radio, Settings2, TriangleAlert, Users, Wifi } from "lucide-react";
import { Link, useLocation } from "wouter";

const nav = [
  { label: "Operator", href: "/", icon: LayoutGrid },
  { label: "Orders", href: "/orders", icon: Package, badge: "12" },
  { label: "Workers", href: "/workers", icon: Users },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

export default function OperationsShell({ children, eyebrow = "SPATIAL OPERATIONS" }: { children: React.ReactNode; eyebrow?: string }) {
  const [location] = useLocation();
  const [voice, setVoice] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setNotice("Command palette is ready for your next operational action");
        window.setTimeout(() => setNotice(""), 2400);
      }
      if (event.key.toLowerCase() === "v" && !event.target) setVoice((value) => !value);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="app-shell">
      <aside className="side-rail">
        <Link href="/" className="app-mark" aria-label="SnapAR Picker home">
          <div className="mark-symbol"><span /><span /><span /><span /></div>
          <div><strong>SnapAR</strong><span>Picker</span></div>
        </Link>
        <div className="rail-divider" />
        <nav className="side-nav" aria-label="Primary navigation">
          {nav.map(({ label, href, icon: Icon, badge }) => (
            <Link key={href} href={href} className={`nav-item ${location === href ? "active" : ""}`}>
              <Icon size={17} /><span>{label}</span>{badge && <b>{badge}</b>}
            </Link>
          ))}
          <button className="nav-item" onClick={() => setNotice("Exception queue is available from Orders") }><TriangleAlert size={17} /><span>Exceptions</span><b className="amber">03</b></button>
        </nav>
        <div className="side-spacer" />
        <button className="nav-item subtle" onClick={() => setNotice("Settings are a prototype placeholder")}><Settings2 size={17} /><span>Settings</span></button>
        <div className="edge-chip"><span className="pulse-dot" />EDGE ACTIVE</div>
      </aside>
      <main className="main-stage">
        <header className="topbar">
          <div className="crumb"><span className="crumb-live" /> Yiwu / Hall C4 <ChevronRight size={13} /> <strong>{eyebrow}</strong></div>
          <div className="top-actions">
            <button className="command-hint" onClick={() => setNotice("Command palette: try ⌘K") }><Command size={13} /><span>Command</span><kbd>⌘K</kbd></button>
            <div className="system-state"><Wifi size={15} /><span>LOCAL LINK</span><i /></div>
            <button className={`voice-toggle ${voice ? "listening" : ""}`} onClick={() => { setVoice(!voice); setNotice(voice ? "Voice channel closed" : "Listening for an operational command"); }}><Mic size={15} />{voice ? "Listening" : "Voice"}</button>
            <button className="avatar" onClick={() => setNotice("Worker profile: Mei Lin / Shift A")}>ML</button>
          </div>
        </header>
        <div className="content-wrap">{children}</div>
      </main>
      {notice && <div className="toast"><Activity size={15} /> {notice}</div>}
    </div>
  );
}
