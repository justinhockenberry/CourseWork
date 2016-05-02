var express = require('express');
var request = require('request');

var app = express();

// \n for new line to appear when inspecting html on actual page, additional \ for multi line string, weird spacing so html looks formatted
var html_top = '<!DOCTYPE html>\n\
<html>\n\
  <head>\n\
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">\n\
    <meta charset="utf-8">\n\
    <title>Cougar Peek Transactions</title>\n\
    <style>\n\
      html, body {\n\
        height: 100%;\n\
        margin: 0;\n\
        padding: 0;\n\
      }\n\
      #map {\n\
        height: 100%;\n\
      }\n\
    </style>\n\
  </head>\n\
  <body>\n\
    <div id="information"><header><h1>Cougar Peek Transactions</h1></header></div>\n    ';
//Any additional div should be added in between html_top and html_middle when sending the complete webpage back
//For stuff in between Cougar Peek Transactions and The actual google map add stuff in between these two variables
//after key= and before &callback... add your own googleapi key for google maps on src="https://maps.googleapis.com/maps/api/js?key= in html_bottom
//To Do Later: break function initMap to place several values for markers from collection to show previous access locations for payment service
var html_middle = '\
    <div id=\'map\'></div>\n\
    <script>\n\
      function initMap() {\n        ';//Extra space for normal formatting on html
var html_bottom = '\n        var map = new google.maps.Map(document.getElementById(\'map\'), {\n\
          zoom: 11,\n\
          center: myLatLng\n\
        });\n\
        var marker = new google.maps.Marker({\n\
          position: myLatLng,\n\
          map: map,\n\
          title: \'You are here\'\n\
        });\n\
      }\n\
    </script>\n\
    <script async defer\n\
    src="https://maps.googleapis.com/maps/api/js?key={Add_your_own_key}&callback=initMap">\n\
    </script>\n\
  </body>\n\
</html>';


app.get('/payment', function(req, res) {
    //Get the client's ip address
    var ip = req.headers['x-forwarded-for'];

    //URL format for ip-api request for ip look up
    var URL_ip_look_up = 'http://ip-api.com/json/';
    URL_ip_look_up += ip;
    request(URL_ip_look_up, function (error, response, body)
        {
            if (!error && response.statusCode == 200)
            {
                var client_loc_info = JSON.parse(body);
                if (client_loc_info['status'] == "fail")
                {
                    //Failed to get the look up
                    var ERROR_failed_response;
                    ERROR_failed_response = "<html><body>Failed to verify IP address as a permitted country</body></html>"
                    res.send(ERROR_failed_response);
                }
                //To Do Later: Create a json object with IP, lat, long, and time, add to a collection, should prevent duplicates based off IP address
                //              Query collection for the last 20 entries based off time and generate javascript code for it to plot on the map
                //              Compare client IP against valid IP address and give invalid message if it is not viable

                //client_loc_info fields: status, country, countryCode, region, regionName, city, zip, lat, lon, timezone,isp, org, as
                var country_info = "<div id = \"country\">You are in " + client_loc_info['country'] + "</div>\n";
                var sendThisHTML = html_top + country_info + html_middle + "myLatLng = {lat: " + client_loc_info['lat']+ ", lng: " + client_loc_info['lon'] + "};" + html_bottom;
                res.send(sendThisHTML);
            }
            else
            {
                //Failed to get the look up
                var ERROR_failed_lookup;
                ERROR_failed_lookup = "<html><body>Failed to verify IP address as a permitted country</body></html>"
                res.send(ERROR_failed_lookup);
            }
        }
    )
});

app.listen(3000);