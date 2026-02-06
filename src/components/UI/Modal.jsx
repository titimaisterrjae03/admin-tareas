import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';

export function Modal({ isOpen, onClose, title, children }) {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => document.body.style.overflow = 'unset';
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border-t md:border border-slate-800 w-full max-w-md rounded-t-2xl md:rounded-xl shadow-2xl animate-in slide-in-from-bottom-10 duration-300 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
                    <h3 className="text-lg font-bold text-slate-100">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 -mr-2">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4 safe-area-bottom">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
