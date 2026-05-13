import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubmitted: boolean;
  isSubmitting: boolean;
  submitError: string;
  formData: { name: string; phone: string; problem: string };
  onFormChange: (data: { name: string; phone: string; problem: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  isSubmitted,
  isSubmitting,
  submitError,
  formData,
  onFormChange,
  onSubmit
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-8"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-all hover:scale-110 active:scale-90"
            >
              <X size={24} />
            </button>

            {isSubmitted ? (
              <div className="py-12 text-center">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Заявка принята!</h3>
                <p className="text-slate-500">Скоро перезвоним, уточним поломку и время выезда.</p>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">Оставить заявку</h3>
                  <p className="text-slate-500 text-sm">Оставьте телефон. Мы уточним поломку, район и удобное время.</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Ваше имя <span className="text-blue-600">*</span>
                    </label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => onFormChange({...formData, name: e.target.value})}
                      placeholder="Как к вам обращаться?"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Номер телефона <span className="text-blue-600">*</span>
                    </label>
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => onFormChange({...formData, phone: e.target.value})}
                      placeholder="+7 (___) ___-__-__"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Запрос
                    </label>
                    <div className="relative">
                      <textarea 
                        rows={3}
                        maxLength={150}
                        value={formData.problem}
                        onChange={(e) => onFormChange({...formData, problem: e.target.value})}
                        placeholder="Что у вас сломалось?"
                        className="w-full px-5 pt-4 pb-10 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-sm resize-none"
                      />
                      <div className="absolute bottom-4 right-5 pointer-events-none">
                        <span className={`text-[10px] font-medium ${formData.problem.length >= 150 ? 'text-red-500' : 'text-slate-400'}`}>
                          {formData.problem.length}/150
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting || !formData.name.trim() || !formData.phone.trim()}
                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-100 mt-4 flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Отправить заявку'
                    )}
                  </button>
                  {submitError && (
                    <p className="text-sm text-red-600 text-center leading-snug px-3">
                      {submitError}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 text-center px-4 leading-normal mt-4">
                    Нажимая на кнопку, вы соглашаетесь с политикой конфиденциальности и обработки персональных данных.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
