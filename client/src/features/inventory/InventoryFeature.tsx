import React, { useState } from 'react';
import { MOCK_SKUS } from '../../data/mockData';
import { Layers, AlertCircle, Scan, Check, ShieldAlert } from 'lucide-react';

export default function InventoryFeature() {
  const [skus, setSkus] = useState(MOCK_SKUS);
  const [selectedSku, setSelectedSku] = useState(MOCK_SKUS[0]);
  const [isScanning, setIsScanning] = useState(false);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="kicker">
          <span className="pulse-dot" />
          <span>DIGITAL TWIN INVENTORY SCANNING</span>
        </div>
        <h1>Physical vs Digital Stock Alignment</h1>
        <p className="lede">
          Computer vision spatial scanning detects misplaced items, discrepancies, and real-time inventory updates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>REGISTERED WAREHOUSE SKUS ({skus.length})</span>
            <button
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded flex items-center gap-2 hover:bg-emerald-500/30"
            >
              <Scan className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'SCANNING RACKS...' : 'TRIGGER AUDIT SCAN'}</span>
            </button>
          </div>

          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">SKU</th>
                  <th className="p-3">NAME & CATEGORY</th>
                  <th className="p-3">LOCATION</th>
                  <th className="p-3 text-right">DIGITAL STOCK</th>
                  <th className="p-3 text-right">PHYSICAL SCAN</th>
                  <th className="p-3 text-center">SYNC STATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {skus.map((item) => {
                  const isMismatch = item.digitalStock !== item.physicalStock;
                  return (
                    <tr
                      key={item.sku}
                      onClick={() => setSelectedSku(item)}
                      className={`cursor-pointer hover:bg-slate-900/60 transition ${
                        selectedSku.sku === item.sku ? 'bg-slate-900/80' : ''
                      }`}
                    >
                      <td className="p-3 font-bold text-emerald-400">{item.sku}</td>
                      <td className="p-3">
                        <div className="text-slate-200">{item.name}</div>
                        <div className="text-[10px] text-slate-500">{item.category}</div>
                      </td>
                      <td className="p-3 text-slate-400">{item.rack}</td>
                      <td className="p-3 text-right text-slate-300">{item.digitalStock}</td>
                      <td className={`p-3 text-right font-bold ${isMismatch ? 'text-amber-400' : 'text-slate-300'}`}>
                        {item.physicalStock}
                      </td>
                      <td className="p-3 text-center">
                        {isMismatch ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            <AlertCircle className="w-3 h-3" /> MISMATCH
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <Check className="w-3 h-3" /> IN SYNC
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Item Detail */}
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-4 font-mono text-xs">
          <span className="text-slate-400 text-[10px] block">SKU SPATIAL PROFILE</span>
          <h2 className="text-lg font-bold text-emerald-400">{selectedSku.sku}</h2>
          <p className="text-slate-300">{selectedSku.name}</p>

          <div className="p-3 bg-slate-900 rounded-lg space-y-2 border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">MULTILINGUAL CHINESE:</span>
              <span className="text-slate-200">{selectedSku.languageLabels?.cn || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">INDONESIAN LABEL:</span>
              <span className="text-slate-200">{selectedSku.languageLabels?.id || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">CONFIDENCE RATING:</span>
              <span className="text-emerald-400 font-bold">{(selectedSku.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
