// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

d3.json(queryUrl, function (data) {
  
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  var circuits = L.geoJSON(data, {
    onEachFeature: onEachFeature

  });

  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 2.5,
    layers: [streetmap, circuits]
  });
  // 
  var redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // loop through the JSON and create markers for all circuits

  for (var i = 0; i < data.features.length; i++) {
    let d = data.features[i];
    
    var magnitude = d.properties.mag * 1; //ensure number
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
        color = "##ffcc99";
    }
    else if (depth >= 70 && depth < 90) {
        color = "###ff6600";
    }
    else {
        color = "#cc0000";
    }
    //console.log("magnitude: ",magnitude);
    //console.log("depth: ", depth)
    //var latlng = L.latLng(d.geometry.coordinates);
    var lat = d.geometry.coordinates[0]*1;
    var lng = d.geometry.coordinates[1]*1;
    var latlng = L.latLng([lng, lat]);
    //console.log("latlng: ", latlng);

    var marker = L.circleMarker(latlng, {
    //  fillOpacity: 1,
      title: d.properties.title,
      radius: magnitude * 2,
      color: color
    }).addTo(myMap)
    // Add circles to map
  //   L.circleMarker(latlng, {
  //     fillOpacity: depth,
  //     color: "white",
  // //    fillColor: color,
  //     // Adjust radius
  //     radius: magnitude * 1500
  //   }).addTo(myMap);
  }

  //   for(let i=0;i < data.length;i++ ){
  //     let d = data[i];
  //     var marker = L.marker([d.lat, d.lng], {
  //       draggable: true,
  //       title: d.name, 
  //       win_url: d.url, 
  //       icon: redIcon
  //     }).addTo(myMap).on('click', onClick)
  // //    });

  //     function onClick(e) {
  //       //alert(e.latlng);
  //       var audio = new Audio('RACECAR.mp3');
  //       audio.play();
  //       sleep(2000);

  //       window.open(this.options.win_url,"_self");
  //       // window.open('http://127.0.0.1:5000/dashboard/'+e.sourceTarget.options.title,"_self");
  //     }
  //     function sleep(ms) {
  //       var now = new Date().getTime();
  //       while(new Date().getTime() < now + ms){ /* do nothing */ } 
  //    }
  //     marker.on('mouseover', function(e){
  //       e.target.bindPopup(`<img src="${d.url}">`).openPopup();
  //       start = new Date().getTime();
  //     });        

  //     marker.on('mouseout', function(e){  
  //       var end = new Date().getTime();
  //       var time = end - start;
  //       if(time > 700){
  //        e.target.closePopup();
  //       };
  //     });
  //   }
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