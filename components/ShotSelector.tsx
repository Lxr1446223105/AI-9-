
import React from 'react';
import { ShotType, StoryboardShot } from '../types';
import { SHOT_TYPES, SHOT_TYPES_MAP } from '../constants';
import { RefreshCw } from 'lucide-react';

interface ShotSelectorProps {
  shots: StoryboardShot[];
  onChange: (index: number, updates: Partial<StoryboardShot>) => void;
  onRefresh: (index: number) => void;
  refreshingShots: Record<number, boolean>;
  language: 'english' | 'chinese';
  shotEditLang: 'en' | 'cn';
  t: any;
}

export const ShotSelector: React.FC<ShotSelectorProps> = ({ 
  shots, 
  onChange, 
  onRefresh, 
  refreshingShots, 
  language,
  shotEditLang,
  t
}) => {
  const ui = {
    slot: language === 'english' ? 'Shot' : '镜头',
    placeholder: language === 'english' ? 'Action/details...' : '描述分镜动作或视觉细节...',
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {shots.map((shot, idx) => (
          <div key={idx} className="flex flex-col gap-2 p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl hover:border-zinc-700 transition-all group/card shadow-lg hover:shadow-blue-500/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-500 border border-zinc-700/50">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                  {ui.slot}
                </label>
              </div>
              <div className="flex items-center gap-2">
                 <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${shotEditLang === 'en' ? 'text-blue-400 border-blue-400/20 bg-blue-400/5' : 'text-purple-400 border-purple-400/20 bg-purple-400/5'} uppercase tracking-tighter`}>
                   {shotEditLang}
                 </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <select
                  value={shot.type}
                  onChange={(e) => onChange(idx, { type: e.target.value as ShotType })}
                  className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-300 text-[11px] font-bold rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all cursor-pointer hover:bg-zinc-900 shadow-inner"
                >
                  {SHOT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {language === 'english' ? SHOT_TYPES_MAP[type].en : SHOT_TYPES_MAP[type].cn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <textarea
                  value={shot[shotEditLang]}
                  onChange={(e) => onChange(idx, { [shotEditLang]: e.target.value })}
                  placeholder={ui.placeholder}
                  rows={4}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-400 text-[11px] rounded-xl pl-3 pr-10 py-3 focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-700 resize-none leading-relaxed custom-scrollbar shadow-inner"
                />
                <button
                  onClick={() => onRefresh(idx)}
                  disabled={refreshingShots[idx]}
                  className={`absolute right-2 top-2.5 p-2 text-zinc-600 hover:text-blue-400 hover:bg-blue-400/10 transition-all rounded-lg ${refreshingShots[idx] ? 'animate-spin' : ''}`}
                  title={t.refreshShot}
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
