import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'alert';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastContextType {
  showToast: (title: string, message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (title: string, message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [ { id, type, title, message }, ...prev.slice(0, 4) ]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const getIcon = () => {
              switch (toast.type) {
                case 'success': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
                case 'warning': return <AlertCircle className="w-5 h-5 text-amber-400" />;
                case 'alert': return <AlertCircle className="w-5 h-5 text-pink-500" />;
                default: return <Info className="w-5 h-5 text-cyan-400" />;
              }
            };

            const getBorder = () => {
              switch (toast.type) {
                case 'success': return 'border-emerald-500/40 bg-emerald-950/40 shadow-emerald-500/10';
                case 'warning': return 'border-amber-500/40 bg-amber-950/40 shadow-amber-500/10';
                case 'alert': return 'border-pink-500/40 bg-pink-950/40 shadow-pink-500/10';
                default: return 'border-cyan-500/40 bg-slate-900/90 shadow-cyan-500/10';
              }
            };

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                className={`pointer-events-auto flex items-start p-4 rounded-xl border backdrop-blur-md shadow-lg ${getBorder()}`}
              >
                <div className="mr-3 mt-0.5">{getIcon()}</div>
                <div className="flex-1 pr-2">
                  <h4 className="text-sm font-bold text-white tracking-wide">{toast.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{toast.message}</p>
                </div>
                <button 
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
