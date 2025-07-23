  var map = new maplibregl.Map({
        container: 'map', // container id
        style: './mapStyleStuff.json', // style URL for basemap
        center: [-73.97144, 40.70491], // starting position [lng, lat]
        zoom: 12 // starting zoom
    });


map.addControl(new maplibregl.NavigationControl());


// Fetch pizza restaurant data from the NYC Open Data API
const jsonFeatures =  fetch(
  "https://data.cityofnewyork.us/resource/43nn-pn8j.geojson?cuisine_description=Pizza&$limit=10000"
)
  .then((response) => response.json())
  .then((data) => {
    data.features.forEach((feature) => {
  feature.geometry = {
    type: "Point",
    coordinates: [
      Number(feature.properties.longitude),
      Number(feature.properties.latitude),
    ],
  };
});

    map.on('load', () => {        
      map.addSource('restaurants', {
          type: 'geojson',
          data: data
      });

      map.addLayer({
          'id': 'restaurants-layer',
          'type': 'circle',
          'source': 'restaurants',
          'paint': {
            "circle-radius": 3, 
            "circle-stroke-width": .5, 
            "circle-color": '#faf9f6',
            "circle-stroke-color": 'red'

          }
      });
    })
  })
  .catch((error) => console.error("Error fetching data:", error));

    map.on("click", "restaurants-layer", (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.dba
      new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    });

    map.on('mouseenter', "restaurants-layer", (e) => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on("mouseleave", "restaurants-layer", (e) => {
  map.getCanvas().style.cursor = ""; // resets to default cursor
});
