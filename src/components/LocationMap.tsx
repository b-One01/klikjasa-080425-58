
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, MapPinOff, LocateFixed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LocationMapProps {
  defaultLocation?: { lat: number; lng: number };
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  height?: string;
  readOnly?: boolean;
}

const LocationMap = ({ 
  defaultLocation = { lat: -6.2088, lng: 106.8456 }, // Default to Jakarta
  onLocationSelect,
  height = "300px",
  readOnly = false
}: LocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [error, setError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps) {
      setError("Google Maps API tidak tersedia. Pastikan Anda terhubung ke internet.");
      return;
    }

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 15,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: true,
    });

    const markerInstance = new window.google.maps.Marker({
      position: defaultLocation,
      map: mapInstance,
      draggable: !readOnly,
      animation: window.google.maps.Animation.DROP,
    });

    if (!readOnly) {
      // Update marker position when clicked on map
      mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng && markerInstance) {
          markerInstance.setPosition(e.latLng);
          if (onLocationSelect) {
            onLocationSelect({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            });
          }
        }
      });

      // Update location when marker is dragged
      markerInstance.addListener('dragend', () => {
        const position = markerInstance.getPosition();
        if (position && onLocationSelect) {
          onLocationSelect({
            lat: position.lat(),
            lng: position.lng(),
          });
        }
      });
    }

    setMap(mapInstance);
    setMarker(markerInstance);

    // Check for location permission
    navigator.permissions?.query({ name: 'geolocation' })
      .then((result) => {
        setLocationPermission(result.state as 'granted' | 'denied' | 'prompt');
        
        // Listen for permission changes
        result.onchange = () => {
          setLocationPermission(result.state as 'granted' | 'denied' | 'prompt');
        };
      })
      .catch(() => {
        // Fallback if permissions API not supported
        setLocationPermission('prompt');
      });

  }, [defaultLocation, onLocationSelect, readOnly]);

  // Handle user location request
  const handleGetCurrentLocation = () => {
    if (!map || !marker) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          // Update map and marker
          map.setCenter(userLocation);
          marker.setPosition(userLocation);
          
          // Call the callback
          if (onLocationSelect) {
            onLocationSelect(userLocation);
          }
          
          setLocationPermission('granted');
        },
        (err) => {
          if (err.code === 1) {
            setLocationPermission('denied');
            setError("Izin lokasi ditolak. Silakan aktifkan akses lokasi di pengaturan browser Anda.");
          } else {
            setError(`Tidak dapat mendapatkan lokasi Anda: ${err.message}`);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser Anda.");
    }
  };

  return (
    <div className="w-full">
      <div 
        ref={mapRef} 
        className="rounded-md border overflow-hidden"
        style={{ height, width: '100%' }}
      >
        {error && (
          <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <p className="text-sm text-red-500 text-center px-4">{error}</p>
          </div>
        )}
      </div>
      
      {!readOnly && (
        <div className="mt-2">
          <Button 
            type="button"
            onClick={handleGetCurrentLocation}
            variant="outline"
            className="w-full flex items-center justify-center"
            size="sm"
          >
            {locationPermission === 'denied' ? (
              <>
                <MapPinOff size={16} className="mr-2" />
                Izin Lokasi Ditolak
              </>
            ) : (
              <>
                <LocateFixed size={16} className="mr-2" />
                Gunakan Lokasi Saat Ini
              </>
            )}
          </Button>
          
          {locationPermission === 'denied' && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription className="text-xs">
                Izin lokasi ditolak. Untuk menggunakan lokasi Anda, aktifkan izin lokasi di pengaturan browser.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationMap;
