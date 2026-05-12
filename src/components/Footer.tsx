import React from 'react';
import { Settings } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-8 text-[11px] uppercase tracking-widest font-bold">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 text-white text-lg font-black tracking-tight normal-case">
               <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <Settings size={16} />
               </div>
            </div>
            <p className="text-slate-500 normal-case tracking-normal">© 2026 — Ремонт бытовой техники на дому</p>
          </div>
          <div className="text-center md:text-right text-slate-500 normal-case tracking-normal max-w-xs">
            Выезжаем по городам Крыма каждый день. Диагностика, согласование цены и ремонт без лишних обещаний.
          </div>
        </div>
      </div>
    </footer>
  );
};
