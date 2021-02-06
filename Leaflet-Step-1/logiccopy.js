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
    
    var latlng = L.latLng(d.geometry.coordinates);
    var magnitude = d.properties.mag;
    var depth = d.geometry.coordinates[2];
    
    var marker = L.circleMarker(latlng, {
       radius: 10,
       fillOpacity: depth,
       title: d.properties.title,
       radius: magnitude 
    }).addTo(myMap)

    // Conditionals for countries points
    // var color = "";
    // if (countries[i].points > 200) {
    //   color = "yellow";
    // }
    // else if (countries[i].points > 100) {
    //   color = "blue";
    // }
    // else if (countries[i].points > 90) {
    //   color = "green";
    // }
    // else {
    // }
    //console.log("magnitude: ",magnitude);
    //console.log("depth: ", depth)


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
});