// define the base map layer
let basemap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }
);

// create the map 
let map = L.map("mapid", {
  center: [
    35, -94.5
  ],
  zoom: 3.5
});

// add the base map layer to the map
basemap.addTo(map);

// read the data using url
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

 // create a function for styling of circles 
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: circleColors(feature.properties.mag),
      radius: radius(feature.properties.mag),
      weight: 0.5
    };
  }


  function radius(magnitude) {
    return magnitude * 3;
  }

  // Create a function to assign colors
  function circleColors(magnitude) {
    if (magnitude < 1) {
      return "steelblue"
    }
    else if (magnitude < 2) {
      return "gold"
    }
    else if (magnitude < 3) {
      return "orange"
    }
    else if (magnitude < 4) {
      return "darkorange"
    }
    else if (magnitude < 5) {
      return "coral"
    }
    else {
      return "Indianred"
    }
  }
 
  // load a GeoJSON layer  and popups with data to the map 
  L.geoJson(data, {

    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
   
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        "Earthquake Magnitude: " + feature.properties.mag
          + "<br>Depth: " + feature.geometry.coordinates[2]
          + "<br>Location: " + feature.properties.place
      );
    }
  }).addTo(map);

  // Here we create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");

    let grades = [-10, 10, 30, 50, 70, 90];
    let colors = ["steelblue","gold","orange","darkorange","coral", "Indianred"];

    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Finally, we our legend to the map.
  legend.addTo(map);
});
