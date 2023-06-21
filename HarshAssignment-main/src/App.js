import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { polygon, area, length } from '@turf/turf';


mapboxgl.accessToken = 'pk.eyJ1Ijoia3VuYWxwYXRpbDIwMDIiLCJhIjoiY2xqNGtwcHlmMDNjZDNybzN5a25pd3oybyJ9.CmQxfXpAhwZJ_vSQAVK1Cw';


const MapComponent = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const draw = useRef(null);
  const [geoJSON, setGeoJSON] = useState(null);
  const [areaValue, setAreaValue] = useState(null);
  const [perimeterValue, setPerimeterValue] = useState(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40], // Set initial center coordinates here
      zoom: 12, // Set initial zoom level here
    });

    draw.current = new MapboxDraw();
    map.current.addControl(draw.current);

    return () => map.current.remove();
  }, []);

  const handleDrawCreate = (event) => {//setgeojson state is filed with geojson and then use truf library to calculate area & perimeter
    const geojson = event.features[0].geometry;
    setGeoJSON(geojson);

    const turfPolygon = polygon(geojson.coordinates);
    const polygonArea = area(turfPolygon);
    const polygonPerimeter = length(turfPolygon, { units: 'kilometers' });

    setAreaValue(polygonArea);
    setPerimeterValue(polygonPerimeter);
  };

  const toggleDrawingMode = () => {
    if (!drawingMode) {//add event listner on drawingMode
      map.current.on('draw.create', handleDrawCreate);
      draw.current.changeMode('draw_polygon');
    } else {
      map.current.off('draw.create', handleDrawCreate);
      draw.current.deleteAll();
      setGeoJSON(null);
      setAreaValue(null);
      setPerimeterValue(null);
    }
    setDrawingMode(!drawingMode);
  };

  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSaveShape = () => {
    if (geoJSON) {//save the current shape or the polygon
      localStorage.setItem('savedShape', JSON.stringify(geoJSON));
      alert('Shape saved!');
    }
  };

  useEffect(() => {
    const searchLocations = async () => {
      try {//search location and flyto the given location
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            searchValue
          )}.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();
        if (data.features.length > 0) {
          const center = data.features[0].geometry.coordinates;
          map.current.flyTo({ center });
        }
      } catch (error) {
        console.error('Error searching for locations:', error);
      }
    };

    if (searchValue) {
      searchLocations();
    }
  }, [searchValue]);

  return ( //render the map 
    <div className="flex w-full h-full" >
      <div className="flex-1" ref={mapContainer} style={{ height: '100vh' }} />
      

      <div className="flex flex-col p-14 bg-black border">
        <input //take input from user to search location
          type="text"
          className="w-full mb-5 h-10 px-8 py-5 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search"
          value={searchValue}
          onChange={handleSearchInputChange}
        />
        <div className="flex mb-4" >
          <button //add buttons to draw , save and delete
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2  rounded"
          onClick={toggleDrawingMode}>{drawingMode ? 'Stop Drawing' : 'Draw Shape'}
          </button>
          <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
          onClick={handleSaveShape}
          disabled={!geoJSON}>Save Shape
          </button>
        </div>
        {areaValue && <p className="text-left text-gray-500 dark:text-gray-400">Area: {areaValue.toFixed(2)} Sqm</p>}
        {perimeterValue && (// print area and perimeter
          <p className="text-left text-gray-500 dark:text-gray-400">Perimeter: {perimeterValue.toFixed(2)} Km</p>
        )}
      </div>
    </div>
  );
};

export default MapComponent;