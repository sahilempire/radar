import React, { useEffect, useRef, useState } from 'react';

const AddressInput = ({ value, onChange, error, placeholder }) => {
  const inputRef = useRef(null);
  const [autocomplete, setAutocomplete] = useState(null);

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
          componentRestrictions: { country: ['us'] },
        });

        newAutocomplete.addListener('place_changed', () => {
          const place = newAutocomplete.getPlace();
          if (place.formatted_address) {
            onChange({ target: { value: place.formatted_address } });
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

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
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