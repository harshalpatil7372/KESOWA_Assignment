import React, { useRef, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1Ijoia3VuYWxwYXRpbDIwMDIiLCJhIjoiY2xpeGU5NXJ2MDc2eTNqcGh3ZnZ4ZGc4eiJ9.sVDIOzQGbk9-m8PcB6JiSw';

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: zoom
      });
    } else {
      map.current.flyTo({
        center: [lng, lat],
        zoom: zoom
      });
    }
  }, [lng, lat, zoom]);

  const handleSearch = (value) => {
    setSearchLocation(value);
    if (value.trim() !== '') {
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          value
        )}.json?access_token=${mapboxgl.accessToken}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.features.length > 0) {
            const [newLng, newLat] = data.features[0].center;
            setLng(newLng);
            setLat(newLat);
            setZoom(13);
          }
        })
        .catch((error) => {
          console.log('Error:', error);
        });
    }
  };

  return (
    <div className="flex flex-row">
      <div className="max-w-maxContent w-11/12 h-100">
        <div ref={mapContainer} className="h-[100vh] w-[80vw]" />
      </div>

      <Sidebar
        onSearch={handleSearch}
        searchLocation={searchLocation}
        className="border"
      />
    </div>
  );
}
