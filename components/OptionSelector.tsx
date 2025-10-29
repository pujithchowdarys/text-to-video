
import React from 'react';

interface OptionSelectorProps<T extends string> {
  label: string;
  options: T[];
  selectedValue: T;
  onChange: (value: T) => void;
}

const OptionSelector = <T extends string,>({
  label,
  options,
  selectedValue,
  onChange,
}: OptionSelectorProps<T>) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="flex space-x-2 rounded-lg bg-gray-800 p-1">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none ${
              selectedValue === option
                ? 'bg-cyan-500 text-white shadow'
                : 'bg-transparent text-gray-300 hover:bg-gray-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};


export default OptionSelector;
