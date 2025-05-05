import React, { useState, useRef, useEffect } from 'react';

const CustomSelect = ({ 
  name, 
  value, 
  onChange, 
  options, 
  placeholder = 'Select an option',
  className = '',
  error = null,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    setSelectedValue(option);
    onChange({ target: { name, value: option } });
    setIsOpen(false);
  };

  return (
    <div 
      ref={wrapperRef}
      className={`relative ${className}`}
    >
      <div
        className={`
          w-full px-4 py-3 rounded-lg border
          ${error ? 'border-red-500' : 'border-[#C67B49]/20'}
          bg-white focus:outline-none focus:ring-2 focus:ring-[#C67B49]/40
          text-gray-700 cursor-pointer
          flex items-center justify-between
          ${isOpen ? 'ring-2 ring-[#C67B49]/40' : ''}
        `}
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(!isOpen);
          }
        }}
      >
        <span className={selectedValue ? 'text-gray-700' : 'text-gray-400'}>
          {selectedValue || placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="
          absolute w-full mt-1 bg-white rounded-lg shadow-lg
          border border-gray-200 max-h-60 overflow-y-auto
          z-[9999]
        ">
          {options.map((option) => (
            <div
              key={option}
              className={`
                px-4 py-2 cursor-pointer
                ${selectedValue === option ? 'bg-[#C67B49]/10 text-[#C67B49]' : 'hover:bg-gray-100'}
                transition-colors duration-150
              `}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={selectedValue === option}
            >
              {option}
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}

      {/* Hidden select element for form submission */}
      <select
        name={name}
        value={selectedValue}
        onChange={onChange}
        required={required}
        className="hidden"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomSelect; 