const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function ColorCode(depth) {
   
    let color = ""
    if (depth < 10) {
        color = "#FED8B1";
    }
    else if (depth < 30) {
        color = "#D1B496";
    }
    else if (depth < 50) {
        color = "#A5917B";
    }
    else if (depth < 70) {
        color = "#786D60";
    }
    else if (depth < 90) {
        color = "#4C4A45";
    }
    else {
        color = "#1F262A";
    }
    return color;
}

d3.json(url).then(function(data){
    let features = data.features;
    console.log(features)
    for (let i=0; i < features.length; i++) {
        let earthquake = features[i];
        let coordinates = earthquake.geometry.coordinates;
        lon = coordinates[1];
        lat = coordinates[0];
        console.log(coordinates[2])
        L.circle([lon,lat], {
            color: "black",
            weight: 1,
            fillColor: ColorCode(coordinates[2]),
            fillOpacity: 0.75,
            radius: earthquake.properties.mag*10000
          }).bindPopup(`<h3>${earthquake.properties.place}</h3><hr><p>${new Date(earthquake.properties.time)}</p>`).addTo(myMap);
    } 

    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10,10,30,50,70,90],
        labels = [];

    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + ColorCode(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}

    return div;
};

  legend.addTo(myMap);
});