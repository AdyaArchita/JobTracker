import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className = '', id, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-[10px] font-bold text-surface-500 uppercase tracking-widest ml-1"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`w-full px-4 py-3 rounded-xl border bg-white outline-none transition-all duration-200
                     focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
                     dark:bg-surface-950 dark:border-surface-800 dark:focus:ring-brand-500/10 dark:text-surface-100
                     placeholder:text-surface-400 dark:placeholder:text-surface-600 ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
