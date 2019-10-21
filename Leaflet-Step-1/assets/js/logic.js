// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
const map = L.map("map", {
  center: [0, 0],
  zoom: 2
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
const streetLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  minZoom: 1,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

const satelliteLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  minZoom: 1,
  id: "mapbox.satellite",
  accessToken: API_KEY
}).addTo(map);

url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

function getColor(d) {
  return d > 6 ? '#800026' :
    d > 5 ? '#BD0026' :
      d > 4 ? '#FC4E2A' :
        d > 3 ? '#FEB24C' :
          d > 2 ? '#FFEDA0' : "none";
}

const earthquakes = d3.json(url, d => {
  let geojsonFeature = d.features
  console.log(geojsonFeature)
  let title = d.metadata.title
  console.log(title)

  d3.select(".card-title")
    .text(title)

  onEachFeature = (feature, layer) => {
    layer.bindPopup("<h5>" + feature.properties.place +
      "</h5><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "<p>Magnitute: " + feature.properties.mag + "</p>");
  }

  geojsonFeature.forEach(d => {
    let mag = +d.properties.mag;

    var geojsonMarkerOptions = {
      radius: mag * 2,
      fillColor: getColor(mag),
      color: getColor(mag),
      weight: 1,
      opacity: .6,
      fillOpacity: 0.6
    };

    L.geoJSON(d, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, geojsonMarkerOptions);
      },
      onEachFeature: onEachFeature

    }).addTo(map);
  });
});

const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

  const div = L.DomUtil.create('div', 'info legend'),
    grades = [2, 3, 4, 5, 6],
    labels = [2, 3, 4, 5, 6];

  // loop through our density intervals and generate a label with a colored square for each interval
  for (let i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

var baseMaps = {
  "Satellite": satelliteLayer,
  "Streets": streetLayer
};

var overlayMaps = {
  "Earthquakes": earthquakes
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

legend.addTo(map);


