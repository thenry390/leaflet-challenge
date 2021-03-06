// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

d3.json(queryUrl, function (data) {
  
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 40,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    clickableIcons: false,
    layers: [streetmap, ]
  });

  // loop through the JSON and create markers for all circuits

  for (var i = 0; i < data.features.length; i++) {
    let d = data.features[i];
    
    var depth = d.geometry.coordinates[2] * 1;//ensure number
    
    // Conditionals for countries points
    var color = "";
    if (depth < 10) {
        color = "#00ff00";
    }
    else if (depth >= 10 && depth < 30) {
        color = "#ccff99";
    }
    else if (depth >= 30 && depth < 50) {
        color = "#ffff00";
    }
    else if (depth >= 50 && depth < 70) {
        color = "#ffcc99";
    }
    else if (depth >= 70 && depth < 90) {
        color = "#ff6600";
    }
    else {
        color = "#cc0000";
    }
    var magnitude = d.properties.mag * 1; 
    var latlng = L.latLng(d.geometry.coordinates);
    var lat = d.geometry.coordinates[0]*1;
    var lng = d.geometry.coordinates[1]*1;
    var latlng = L.latLng([lng, lat]);
    //console.log("latlng: ", latlng);

    var marker = L.circleMarker(latlng, {
      fillOpacity: 1,
      title: d.properties.title,
      radius: magnitude * 5,
      color: color
    }).addTo(myMap).on('click', onClick)
    
    function onClick(e) {
      //alert(e.latlng);
      e.target.bindPopup(`<p>Date: "${new Date(d.properties.time)}" </p>
        <p> Magnitude: "${d.properties.mag}" </p>
        <p> Latitude: "${d.geometry.coordinates[0]}"</p>
        <p> Longitude: "${d.geometry.coordinates[1]}"</p>
        <p> Depth: "${d.geometry.coordinates[2]}"</p>`).openPopup();
    }
  }

  function getColor(a) {
    return a === '-10-10'  ? "#00ff00" :
           a === '10-30'  ? "#ccff99" :
           a === '30-50' ? "#ffff00" :
           a === '50-70' ? "#ffcc99" :
           a === '70-90' ? "#ff6600" :
           a === '90+' ?  "#cc0000" :
           "#cc0000";
  }

  function style(feature) {
      return {
          weight: 1.5,
          opacity: 1,
          fillOpacity: 1,
          radius: 6,
          fillColor: getColor(feature.properties.TypeOfIssue),
          color: "grey"

      };
  }

  var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong> </strong>'],
    categories = ['-10-10','10-30','30-50','50-70','70-90','90+'];

    for (var i = 0; i < categories.length; i++) {

            div.innerHTML += 
            labels.push(
                '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' +
            (categories[i] ? categories[i] : '+'));

        }
        div.innerHTML = labels.join('<br>');
    return div;
    };
    legend.addTo(myMap);
});