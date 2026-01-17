(function () {
    document.querySelector("#result").value = "";
    
    var map = L.map('map').setView([37.8, -96], 1);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '<a href="https://www.liedman.net/leaflet-control-geocoder/docs/index.html">Leaflet Control Geocoder</a> | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let nominatim = new L.Control.Geocoder.Nominatim()

    document.querySelector("#geocode").addEventListener("click",async function(){
        let text = document.querySelector("#list").value.split("\n");

        if (text.length < 100){
            document.querySelector("#error").innerHTML = ""
            for (const x of text){
                await nominatim.geocode(x)
                    .then(function(data){
                        if (data[0]){
                            let coords = data[0].center
                            L.marker(coords).addTo(map)
                            document.querySelector("#result").value += x + ", " + coords.lat + ", " + coords.lng + "\n"
                        }
                        else{
                            document.querySelector("#result").value += x + ", Undefined, Undefined \n"
                        }
                    })
                    .catch(function(){
                        document.querySelector("#result").value += x + ", Undefined, Undefined \n"
                    })
            }
        }
        else{
            document.querySelector("#error").innerHTML = "Error: your query exceeds 100 features"
        }
        
    })
})();
