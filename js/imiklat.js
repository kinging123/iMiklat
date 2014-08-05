
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
	$.goMap.fitBounds(); 
	
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

    $("#send").click(function(event) {
        cityPass = $("select#city").val();
        nbrhdPass = $("select#nbrhd").val();

        if(cityPass == otherText)cityPass = $("#inputforcity").val();
        if(nbrhdPass == otherText)nbrhdPass = $("#inputfornbrhd").val();


        if(cityPass.length < 3)cityPass=defaultCity;
        if(nbrhdPass.length < 3)nbrhdPass=defaultNbrhd;

        $.ajax({
            url: "http://projects.karasik.org/imiklat/functions/getLocations.php",
            type: "get",
            dataType: "jsonp",
            data: {"city":cityPass, "nbrhd": nbrhdPass},
            complete: function(json_locs, status){
                json_locs = json_locs.responseText;
                
                json_locs = $.parseJSON(json_locs);

                $.each(json_locs, function(locindex, location){
                    AddressTexttm = location.street + " " + location.house + ", " + location.city;
                    tempAdress = {address: AddressTexttm, title: AddressTexttm};
                    Markers.push(tempAdress);
                });

                centerMap(11, 11, Markers);
                var markers = [];


                setInterval(function(){
                    for (var i in $.goMap.markers) {
                        var temp = $($.goMap.mapId).data($.goMap.markers[i]);
                        markers.push(temp);
                    }

                    var markerclusterer = new MarkerClusterer($.goMap.map, markers);

                }, 5000);
            }
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




