import React, { useEffect, useRef, useState } from 'react';

const AddressInput = ({ value, onChange, error, placeholder }) => {
  const inputRef = useRef(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [inputValue, setInputValue] = useState(value || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load Google Maps script if not already loaded
    if (!window.google) {
      setIsLoading(true);
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoading(false);
        initAutocomplete();
      };
      document.head.appendChild(script);
    }

    // Initialize autocomplete when Google Maps is loaded
    const initAutocomplete = () => {
      if (window.google && inputRef.current && !autocomplete) {
        const newAutocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['address'],
          componentRestrictions: { country: ['us', 'ca', 'gb', 'au', 'in', 'sa', 'de', 'fr', 'it', 'es', 'nl', 'pl', 'pt', 'ru', 'tr', 'ua', 'vn'] },
          fields: ['formatted_address', 'address_components', 'geometry', 'name', 'place_id'],
        });

        // Style the dropdown to match our UI
        const style = document.createElement('style');
        style.textContent = `
          .pac-container {
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -5px rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(0, 128, 255, 0.2);
            padding: 8px 0;
            margin-top: 8px;
            z-index: 9999;
            font-family: inherit;
            max-height: 380px;
            overflow-y: auto;
            overflow-x: hidden;
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 128, 255, 0.5) transparent;
            backdrop-filter: blur(8px);
          }

          .pac-container::-webkit-scrollbar {
            width: 6px;
          }

          .pac-container::-webkit-scrollbar-track {
            background: transparent;
            border-radius: 3px;
          }

          .pac-container::-webkit-scrollbar-thumb {
            background-color: rgba(0, 128, 255, 0.5);
            border-radius: 3px;
            transition: background-color 0.2s;
          }

          .pac-container::-webkit-scrollbar-thumb:hover {
            background-color: rgba(0, 128, 255, 0.7);
          }

          .pac-item {
            padding: 12px 16px;
            cursor: pointer;
            margin: 2px 4px;
            border: none;
            border-radius: 8px;
            font-family: inherit;
            line-height: 1.5;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all 0.2s ease;
          }

          .pac-item:hover {
            background-color: rgba(0, 128, 255, 0.08);
            transform: translateX(4px);
          }

          .pac-item-query {
            color: #1a1a1a;
            font-size: 14px;
            font-weight: 500;
            padding-right: 8px;
            flex: 1;
          }

          .pac-matched {
            font-weight: 600;
            color: #0080ff;
            position: relative;
          }

          .pac-icon {
            margin: 0;
            width: 20px;
            height: 20px;
            opacity: 0.7;
          }

          .pac-item-selected, .pac-item-selected:hover {
            background-color: rgba(0, 128, 255, 0.12);
            transform: translateX(4px);
          }

          .pac-secondary-text {
            font-size: 13px;
            color: #666;
            opacity: 0.9;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 200px;
          }

          .pac-item > span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          @media (max-width: 640px) {
            .pac-container {
              max-height: 300px;
              margin-top: 4px;
              border-radius: 8px;
            }

            .pac-item {
              padding: 10px 12px;
              margin: 1px 2px;
            }

            .pac-secondary-text {
              max-width: 150px;
            }
          }
        `;
        document.head.appendChild(style);

        newAutocomplete.addListener('place_changed', () => {
          const place = newAutocomplete.getPlace();
          if (place) {
            let formattedAddress = '';
            let postalCode = '';
            
            // Extract postal code from address components
            if (place.address_components) {
              const postalComponent = place.address_components.find(
                component => component.types.includes('postal_code')
              );
              if (postalComponent) {
                postalCode = postalComponent.long_name;
              }
            }
            
            // Format the address with postal code
            if (place.name && place.formatted_address && !place.formatted_address.includes(place.name)) {
              formattedAddress = `${place.name}, ${place.formatted_address}`;
            } else {
              formattedAddress = place.formatted_address || place.name;
            }

            // Append postal code if not already in the address
            if (postalCode && !formattedAddress.includes(postalCode)) {
              formattedAddress = `${formattedAddress} ${postalCode}`;
            }

            setInputValue(formattedAddress);
            // Create a synthetic event to match the form's onChange handler
            const event = {
              target: {
                name: 'ownerAddress',
                value: formattedAddress,
                type: 'text'
              }
            };
            onChange(event);
          }
        });

        // Prevent form submission on enter
        inputRef.current.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        });

        setAutocomplete(newAutocomplete);
      }
    };

    // Check if Google Maps is loaded every 100ms
    if (window.google) {
      initAutocomplete();
    }

    return () => {
      if (autocomplete) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
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
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className={`w-full px-4 py-3 rounded-lg border ${
          error ? 'border-red-500' : 'border-[#0080ff]/20'
        } bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700`}
        placeholder={placeholder}
        disabled={isLoading}
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0080ff]/20 border-t-[#0080ff]"></div>
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default AddressInput; 