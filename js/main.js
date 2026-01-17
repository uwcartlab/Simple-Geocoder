(function () {
    //reset input and output
    document.querySelector("#result").value = "";
    document.querySelector("#list").value = "";
    //create map 
    var map = L.map('map').setView([37.8, -96], 1);
    //add basemap
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '<a href="https://www.liedman.net/leaflet-control-geocoder/docs/index.html">Leaflet Control Geocoder</a> | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    //load nomanitim geocoding server
    let nominatim = new L.Control.Geocoder.Nominatim()
    //listener for the geocode button
    document.querySelector("#geocode").addEventListener("click",async function(){
        //get list of features from text box and split each line into a new array time
        let text = document.querySelector("#list").value.split("\n");
        //reset results box
        document.querySelector("#result").value = "";
        //activate function if less than 100 features
        if (text.length < 100){
            //reset error
            document.querySelector("#error").innerHTML = ""
            //add loading spinner
            document.querySelector("#input").insertAdjacentHTML("beforeend","<div class='loader'></div>")
            //add index listener
            let index = 0
            for (const x of text){
                //geocode item
                await nominatim.geocode(x)
                    .then(function(data){
                        //add item to results if result exists
                        if (data[0]){
                            //set delay for 1 second to comply with public server limits
                            setTimeout(() => {
                                //set coordinates based on results
                                let coords = data[0].center
                                //add marker to map
                                L.marker(coords).addTo(map)
                                //add result to list
                                document.querySelector("#result").value += x + ", " + coords.lat + ", " + coords.lng + "\n";
                                //increase index value and compare to list legnth
                                index++;
                                //remove loading spinner if index equals list length
                                if (index == text.length)
                                    document.querySelector(".loader").remove()
                                
                            }, 1000);
                        }
                        else{
                            //if no result, post feature name with undefined values
                            document.querySelector("#result").value += x + ", Undefined, Undefined \n"
                            index++;
                            if (index == text.length)
                                document.querySelector(".loader").remove()
                        }
                    })
                    .catch(function(){
                        //if no result, post feature name with undefined values
                        document.querySelector("#result").value += x + ", Undefined, Undefined \n"
                    })
            }
        }
        else{
            //if list of features exceeds 100, post error message
            document.querySelector("#error").innerHTML = "Error: your query exceeds 100 features"
        }
        
    })
})();
