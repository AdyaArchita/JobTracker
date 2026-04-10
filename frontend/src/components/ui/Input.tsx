import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = '', id, ...props }, ref) => {
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
        <div className="relative group">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-brand-500 transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`w-full ${icon ? 'pl-11' : 'px-4'} py-3 rounded-xl border bg-white outline-none transition-all duration-200
                       focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
                       dark:bg-surface-950 dark:border-surface-800 dark:focus:ring-brand-500/10 dark:text-surface-100
                       placeholder:text-surface-400 dark:placeholder:text-surface-600 ${error ? 'border-red-500' : 'border-surface-200 dark:border-surface-800'} ${className}`}
            {...props}
          />
        </div>
        {hint && !error && (
          <p className="text-xs text-surface-500">{hint}</p>
        )}
        {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-surface-300 dark:text-surface-300"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`input-base resize-none ${
            error
              ? 'border-red-500/70 focus:ring-red-500/40 focus:border-red-500'
              : ''
          } ${className}`}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-surface-500">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
