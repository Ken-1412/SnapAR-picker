import React, { useState } from 'react';
import { Languages, Volume2, ArrowRightLeft } from 'lucide-react';

export default function TranslationFeature() {
  const [selectedPair, setSelectedPair] = useState<'cn-en' | 'id-en'>('cn-en');

  return (
    <div className="space-y-6">
      <div>
        <div className="kicker">
          <span className="pulse-dot" />
          <span>CROSS-BORDER AR TRANSLATION</span>
        </div>
        <h1>Multilingual Wholesale & Label Translation</h1>
        <p className="lede">
          Instantly convert Chinese factory labels and Indonesian vendor dialog into clear English AR HUD overlays.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        {/* Visual AR Label Scanner */}
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">AR PHYSICAL LABEL TRANSLATION</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPair('cn-en')}
                className={`px-2 py-1 rounded text-[10px] ${
                  selectedPair === 'cn-en' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400'
                }`}
              >
                中文 ➔ EN
              </button>
              <button
                onClick={() => setSelectedPair('id-en')}
                className={`px-2 py-1 rounded text-[10px] ${
                  selectedPair === 'id-en' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400'
                }`}
              >
                IND ➔ EN
              </button>
            </div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
            <div className="text-slate-500 text-[10px]">SCANNED PHYSICAL TEXT:</div>
            <div className="text-xl font-bold text-slate-100">
              {selectedPair === 'cn-en' ? '500克 特级绿茶礼盒 (义乌制造)' : 'Kotak Teh Hijau 500g (Pasar Utama Hub)'}
            </div>

            <div className="border-t border-slate-800 pt-3 text-slate-500 text-[10px]">AR HUD OVERLAY TRANSLATION:</div>
            <div className="text-lg font-bold text-emerald-400 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded">
              500g Premium Green Tea Gift Box (Made in Yiwu)
            </div>
          </div>
        </div>

        {/* Voice Dialog Translation */}
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
          <span className="text-slate-400 block">REAL-TIME VOICE DIALOG TRANSLATOR</span>

          <div className="space-y-3">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded">
              <span className="text-slate-500 text-[10px]">VENDOR (CHINESE VOICE):</span>
              <p className="text-slate-200 text-sm">"这箱绿茶一共有十二盒，请确认数量。"</p>
            </div>

            <div className="p-3 bg-slate-900 border border-emerald-500/40 rounded bg-emerald-950/20">
              <span className="text-emerald-400 text-[10px]">AR HEADSET TRANSLATION (ENGLISH):</span>
              <p className="text-emerald-300 text-sm font-bold">"This box contains 12 tea boxes, please confirm count."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
