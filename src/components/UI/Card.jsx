import { twMerge } from 'tailwind-merge';

export function Card({ children, className }) {
    return (
        <div className={twMerge('bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm', className)}>
            {children}
        </div>
    );
}
