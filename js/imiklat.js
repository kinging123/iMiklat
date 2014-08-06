﻿
function setMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
                        function(position) {
                            centerMap(position.coords.latitude, position.coords.longitude);
                        },
                        function(error){
                            alert(error.message);
                        }, {
                            enableHighAccuracy: true,
                            timeout : 5000
                        }
                );
    } else { 
        alert("not supported");
    }
}


function centerMap (latitude, longitude, Markers) {
    // alert("hello");
    // alert(position);
    alert("the function was called");
    $("#map").goMap({
        latitude: 32.0853,
        longitude: 34.781768,
        zoom: 12,
        scaleControl: false, 
        maptype: 'ROADMAP',
        /*markers: [{  
            address: 'Adanyahu Hacohen 43, Jerusalem',
            title: 'Shelter1' 
        },{ 
            address: 'ישא ברכה 21, ירושלים', 
            title: 'marker title 1' 
        },{ 
            address: "פישל אהרון 10, ירושלים"
        }], */
        markers: Markers,
        icon: 'img/imiklat_sm.png?v=2' 

    });
    alert("The map has been registered.");
    $.goMap.fitBounds(); 
    alert("The map had been fitBounded.");
    
}
position = {
    coords : {
        "latitude": 32.0853,
        "longitude": 34.781768
    }
}
var json_locs, Markers = new Array, 
    otherText = "אחר",
    defaultCity = "ירושלים",
    defaultNbrhd = "בקעה";

$(function(){
    alert("Page loaded");
    $("#send").click(function(event) {
        alert("#send button was clicked.");
        cityPass = $("select#city").val();
        alert("city was readden from inputs.");
        nbrhdPass = $("select#nbrhd").val();
        alert("nbrhd was readden from inputs.");

        if(cityPass == otherText)cityPass = $("#inputforcity").val();
        if(nbrhdPass == otherText)nbrhdPass = $("#inputfornbrhd").val();


        if(cityPass.length < 3)cityPass=defaultCity;
        if(nbrhdPass.length < 3)nbrhdPass=defaultNbrhd;

        alert("starting AJAX.");
        $.ajax({
            url: "http://projects.karasik.org/imiklat/functions/getLocations.php",
            type: "get",
            dataType: "jsonp",
            data: {"city":cityPass, "nbrhd": nbrhdPass},
            crossDomain: true,
            complete: function(json_locs, status){
                alert("AJAX returned");
                console.log(json_locs.responseJSON);
                alert("status: \n" +status);
                json_locs = json_locs.responseJSON;
                
                json_locs = $.parseJSON(json_locs);

                alert("json_locs was parsed, here's a street: " +json_locs[0]["street"]);
                $.each(json_locs, function(locindex, location){
                    alert("a location is being readden.");
                    AddressTexttm = location.street + " " + location.house + ", " + location.city;
                    tempAdress = {address: AddressTexttm, title: AddressTexttm};
                    Markers.push(tempAdress);
                    alert("a location has been added to markers array.");
                });

                alert("The map is about to be set.");
                centerMap(11, 11, Markers);
                alert("The map has been set and the function is complete.");
                var markers = [];


                setInterval(function(){
                    for (var i in $.goMap.markers) {
                        var temp = $($.goMap.mapId).data($.goMap.markers[i]);
                        markers.push(temp);
                    }

                    alert("The markers array was generated for the MarkerClusterer.");
                    var markerclusterer = new MarkerClusterer($.goMap.map, markers);
                    alert("the markerclusterer was registered.");

                }, 5000);

                alert("done.");
            }
        // alert("AJAX was sent.");
        });
        
    });


    $("select").change(function(event) {
        id = $(this).attr('id');
        if($(this).val() == otherText)$("#inputfor"+id).show();
        else $("#inputfor"+id).hide();

        console.log(id, $(this).val());
        if($(this).val() == "הכל" && id == "city")$("select#nbrhd").attr('disabled', 'disabled').val("הכל");
        else $("select#nbrhd").removeAttr('disabled');
    });

    $(".inputfors").hide();
});




