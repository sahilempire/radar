import React, { useEffect, useRef, useState } from 'react';

const AddressInput = ({ value, onChange, error, placeholder }) => {
  const inputRef = useRef(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Initialize autocomplete when Google Maps is loaded
    const initAutocomplete = () => {
      if (window.google && inputRef.current && !autocomplete) {
        const newAutocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['address'],
        });

        // Style the dropdown to match our UI
        const style = document.createElement('style');
        style.textContent = `
          .pac-container {
            background-color: white;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid rgba(0, 0, 0, 0.1);
            padding: 0.5rem;
          }
          .pac-item {
            padding: 0.5rem;
            cursor: pointer;
            border-radius: 0.25rem;
          }
          .pac-item:hover {
            background-color: rgba(0, 0, 0, 0.05);
          }
          .pac-item-query {
            color: #1a1a1a;
            font-size: 0.875rem;
          }
          .pac-matched {
            font-weight: 500;
          }
        `;
        document.head.appendChild(style);

        newAutocomplete.addListener('place_changed', () => {
          const place = newAutocomplete.getPlace();
          if (place.formatted_address) {
            const newValue = place.formatted_address;
            setInputValue(newValue);
            // Create a synthetic event to match the form's onChange handler
            const event = {
              target: {
                name: 'ownerAddress',
                value: newValue,
                type: 'text'
              }
            };
            onChange(event);
          }
        });

        setAutocomplete(newAutocomplete);
      }
    };

    // Check if Google Maps is loaded every 100ms
    const interval = setInterval(() => {
      if (window.google) {
        clearInterval(interval);
        initAutocomplete();
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [autocomplete, onChange]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    // Create a synthetic event to match the form's onChange handler
    const event = {
      target: {
        name: 'ownerAddress',
        value: newValue,
        type: 'text'
      }
    };
    onChange(event);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className={`w-full px-4 py-3 rounded-lg border ${
          error ? 'border-red-500' : 'border-primary/20'
        } bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background`}
        placeholder={placeholder}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default AddressInput; 