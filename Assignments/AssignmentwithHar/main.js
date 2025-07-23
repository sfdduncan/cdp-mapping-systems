// Initialize the map
const map = new maplibregl.Map({
  container: 'map', // ID of the map container in your HTML
  style: './mapStyleStuff.json', // Path to your custom style
  center: [-73.97144, 40.70491], // Initial center [lng, lat]
  zoom: 12 // Initial zoom level
});

// Add zoom and rotation controls to the map
map.addControl(new maplibregl.NavigationControl());

// Fetch the GeoJSON file
fetch("ip_locations.geojson")
  .then((response) => response.json())
  .then((data) => {
    // Wait for map to load before adding source and layer
    if (map.loaded()) {
      addGeojsonLayer(data);
    } else {
      map.on('load', () => addGeojsonLayer(data));
    }
  })
  .catch((error) => {
    console.error("Error loading GeoJSON:", error);
  });

// Function to add the GeoJSON data to the map
function addGeojsonLayer(data) {
  map.addSource('points', {
    type: 'geojson',
    data: data
  });

  map.addLayer({
    id: 'points',
    type: 'circle',
    source: 'points',
    paint: {
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-color': '#faf9f6',
      'circle-stroke-color': 'red'
    }
  });
}

// Popup on click
map.on("click", "points", (e) => {
  const coordinates = e.features[0].geometry.coordinates.slice();
  const props = e.features[0].properties;

  const description = `
    <strong>IP:</strong> ${props.ip}<br>
    <a href="${props.url}" target="_blank">Visit URL</a>
  `;

  new maplibregl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
});

// Change cursor on hover
map.on("mouseenter", "points", () => {
  map.getCanvas().style.cursor = "pointer";
});

map.on("mouseleave", "points", () => {
  map.getCanvas().style.cursor = "";
});
