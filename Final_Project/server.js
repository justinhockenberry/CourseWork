var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();


app.use(bodyParser.urlencoded(
    {extended: true}));
    
app.use(bodyParser.json());

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
        height: 50%;\n\
      }\n\
    </style>\n\
  </head>\n\
  <body>\n\
    <div id="information" align="center"><header><h1>Cougar Peek Transactions</h1></header></div>\n    ';
    
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
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD-qsc35wxqwHR4XvKHdXFeYyf3qW_yTJ8&callback=initMap">\n\
    </script>\n\
  </body>\n\
</html>';

app.post('/payment', function(req, res) {
    //Get the client's ip address
    var ip = req.headers['x-forwarded-for'];
    var payment = JSON.stringify(req.body);
    
    //res.send(payment);
    
    //URL format for ip-api request for ip look up
    var URL_ip_look_up = 'http://ip-api.com/json/';
    URL_ip_look_up += ip;
    request(URL_ip_look_up, function (error, response, body) 
    {
        
        
        if (!error && response.statusCode == 200)
        {
            
            //Garrett
            //var name = req.body['name'];
            //var address = req.body['address'];
            //var city = req.body['city'];
            //var zipcode = req.body['zipcode'];
            //var country = req.body['country'];
            //var cardnumber = req.body['cardnumber'];
            //var state = req.body['state'];
            //var cvv = req.body['cvv'];
            //var expmonth = req.body['exp_month'];
            //var expyear = req.body['exp_year'];
            
            //Garrett
            
            var client_loc_info = JSON.parse(body);
            
            var blacklist = 'https://api.usergrid.com/garrettschwartz/sandbox/bannedcountries?ql=select * where name=\'' + client_loc_info['country'] +'\'';
            
            if (client_loc_info['status'] == "fail")
            {
                //Failed to get the look up
                var ERROR_failed_response;
                ERROR_failed_response = "Failed to verify IP address as a permitted country"
                res.send(ERROR_failed_response);
            }
            
            var country_info = "<div id = \"country\" align=\"center\">You are in " + client_loc_info['country'] + "</div>\n";
            
            //To Do Later: Create a json object with IP, lat, long, and time, add to a collection, should prevent duplicates based off IP address
            //              Query collection for the last 20 entries based off time and generate javascript code for it to plot on the map
            //              Compare client IP against valid IP address and give invalid message if it is not viable
            
            //client_loc_info fields: status, country, countryCode, region, regionName, city, zip, lat, lon, timezone,isp, org, as
            
            //Make the call to the backend and 
            request(blacklist, function(error, innerresponse, innerbody){
                
                var backend_info = JSON.parse(innerbody);
                
                //Country is blacklisted, add the record to the back-end
                if (Object.keys(backend_info.entities).length > 0)
                {
                    var user_info = '{"ip":"' + ip + '","lat":"' + client_loc_info['lat'] + '","lon":"' + client_loc_info['lon'] + '","country":"' + client_loc_info['country'] + '"}';
                    
                    //Create the json to send to the backend
                    var bad_transaction = {
                        country:client_loc_info['country'],
                        lat:client_loc_info['lat'],
                        lon:client_loc_info['lon'],
                        ip:ip
                    };
                    
                    var bad_trans_json = JSON.stringify(bad_transaction);
                    
                    request.post({ 
                                    headers:    {"content-type":"application/json"},
                                    url:        'https://api.usergrid.com/garrettschwartz/sandbox/badtrans',
                                    body:       bad_trans_json
                                }, function (beerror, beresponse, bebody){
                                    
                                    //var response_
                                    var response_string = '<div align="center">Invalid country, your location at longitude: ' + client_loc_info['lon'] + ' latitude: ' + client_loc_info['lat'] + ' has been recorded<br></div>';
                                    var what_to_send = html_top + country_info + response_string + html_middle + "myLatLng = {lat: " + client_loc_info['lat']+ ", lng: " + client_loc_info['lon'] + "};" + html_bottom;
                                    res.send(what_to_send);
                                }
                        );
                    
                    
                        
                 
                }
               
                else
                {
                    
                    
                    //Make a request to vantiv
                    request.post({
                       headers: {'content-type':'application/json',
                                'Authorization':'VANTIV license="05175a6e48184701b51e8fdc6b085ff4$$#$$srESu0UDFlTODjCjLD5Mg918U6SbWXNt$$#$$2017-03-08$$#$$cert_key$$#$$SHA512withRSA$$#$$RSA$$#$$1$$#$$8FA52E8A5BA768320C02FEF4265A67C590881A8508840C00BE129A36A5A9CC8FEB69331FD940F8C3AEE527FA966C844F8573CA11325C294ECC3BEAAD3FB3390E49953A29478F31619E92CC63F64E42852802C504B06F482806FC3D2497447B90E435F21B96C4BBA90948D521BC2B058E0EF14258AD2EB3FA5F7192C57AE56611CBB1C621E28062DADCC2D1EBD76C633D04EF6B866DF0B8AD411ED2DB1599529CD333AFB3EF24011773E891BA399319C95FE02ED235367F4178422D60E49BADCBF5DEB4D67BB0E1189C044F18A7E4E2783698E434E1AFB264686AC350338B4CC6E9C8521B314F2A8E863C6AAD5FAE4954808D3B5783A0A26295D23B3BECA3C13E"'
                       },
                       url: 'https://apis.cert.vantiv.com/payment/sp2/credit/v1/authorization',
                       body:payment
                    }, function(verror, vresponse, vbody){
                        
                        
                        var vantiv_info = vbody;
                        
                        var transaction_id;
                        
                        if (vbody === undefined)
                        {
                            transaction_id = "Transaction could not be processed";
                        }
                        else
                        {
                            transaction_id = JSON.parse(vantiv_info)['litleOnlineResponse']['authorizationResponse']['TransactionID'];
                        }
                         
                        
                        //res.send(transaction_id);
                        
                        var tid_string = "<div align=\"center\">Your transaction ID: " + transaction_id + "</div>";
                        var sendThisHTML = html_top + tid_string + country_info + html_middle + "myLatLng = {lat: " + client_loc_info['lat']+ ", lng: " + client_loc_info['lon'] + "};" + html_bottom;
                        res.send(sendThisHTML);
                    });
                    
                    
                }
                
            });
        }
        else
        {
            //Failed to get the look up
            var ERROR_failed_lookup;
            ERROR_failed_lookup = "Failed to verify IP address as a permitted country"
            
            
            
            res.send(ERROR_failed_lookup);
        }
    }
    )
});

garrett_html_page = 

' <html> \n\
	<body>\n\
	Payment Information<br>\
	<form action="payment" method="post">\n\
	Name:<br>\n\
	<input type="text" name="name"><br>\n\
	\
	Address:<br>\n\
	<input type="text" name="address"><br>\n\
	\
	Country:<br>\n\
	<input type="text" name="country"><br>\n\
	\
	City:<br>\n\
	<input type="text" name="city"><br>\n\
	\
	Zipcodes:<br>\n\
	<input type="text" name="zip"><br>\n\
	\
	State:<br>\n\
	<input type="text" name="state"><br>\n\
	\
	Card Number:<br>\n\
	<input type="text" name="cardnumber"><br>\n\
	\
	CVV:<br>\n\
	<input type="text" name="cvv"><br>\n\
	\
	Expiration Month:<br>\n\
	<input type="text" name="exp_month"><br>\n\
	\
	Expiration Year:<br>\
	<input type="text" name="exp_year"><br>\n\
	<input type="submit" value="Submit">\n\
	</form>\n\
	</body>\n\
</html>';


//Garrett: Wirting an expirimental front end here
app.get('/order', function(req, res) {
	
	res.send(garrett_html_page);
	
	});
/*
app.post('/payment',function(req, res){
	
});*/
	
app.listen(3000);
