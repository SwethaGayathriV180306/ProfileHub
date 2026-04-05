import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
          {label}
        </label>
      )}
      {props.disabled ? (
        <p className={`text-slate-900 font-medium py-2 dark:text-white ${className}`}>
          {props.value ? String(props.value) : <span className="text-slate-400 italic">Not provided</span>}
        </p>
      ) : (
        <>
          <input
            className={`w-full px-4 py-2.5 border rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-slate-900 placeholder-slate-400 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 ${
              error ? 'border-red-500 dark:border-red-500 text-red-900 dark:text-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
            } ${className}`}
            disabled={props.disabled}
            {...props}
          />
          {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">{error}</p>}
        </>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
          {label}
        </label>
      )}
      {props.disabled ? (
        <p className={`text-slate-900 font-medium py-2 dark:text-white ${className}`}>
          {props.value 
            ? options.find(o => o.value === props.value)?.label || props.value 
            : <span className="text-slate-400 italic">Not provided</span>}
        </p>
      ) : (
        <>
          <select
            className={`w-full px-4 py-2.5 border rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 transition-all dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-100 ${
              error ? 'border-red-500 dark:border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
            } ${className}`}
            disabled={props.disabled}
            {...props}
          >
            <option value="" disabled className="dark:bg-slate-800 dark:text-slate-400">Select an option</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="dark:bg-slate-800 dark:text-slate-100">
                {opt.label}
              </option>
            ))}
          </select>
          {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">{error}</p>}
        </>
      )}
    </div>
  );
};