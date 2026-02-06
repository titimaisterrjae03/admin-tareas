import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import React from 'react';

export const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
    return (
        <div className="flex flex-col space-y-1">
            {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
            <input
                ref={ref}
                className={twMerge(clsx(
                    'bg-slate-800 border-slate-700 text-slate-100 rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-500 p-2 outline-none transition-all',
                    error && 'border-red-500 focus:ring-red-500',
                    className
                ))}
                {...props}
            />
            {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
    );
});
