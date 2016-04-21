
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var sync_request = require('sync-request');
var spawnSync = require('spawn-sync');
var app = express();

app.use(bodyParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//**********************************************************************************************

app.get('/get', function(req, res) {
        
        var title_specific = req.query["title_specific"];
        var reviews = req.query["reviews"];
        var title = req.query["title"];
        var http = "https://api.usergrid.com/jhockenberry/sandbox/movies?ql=select * where title='"+title+"'";
        var http2 = "http://api.usergrid.com/jhockenberry/sandbox/reviews?ql=select * where title='"+title+"'";
        var string;
        var info;
        var data;
       
    if (title_specific === "true")
    {        
        
        request(http, function(error, response, body)
        {
            info = JSON.parse(body);
            request(http2, function(error, response, body)
            {
                data = JSON.parse(body);
                
             var i;
             var j;
            
            for (i = 0; i < Object.keys(info.entities).length; i++)
            {
                string = "Title: "+ info.entities[i].title + "\n";
                string += "Year: "+ info.entities[i].year + "\n";
                string += "Actors: ";
                
                // now for actors
                for (j = 0; j < Object.keys(info.entities[i].actors).length; j++)
                {
                    string += info.entities[i].actors[j].fname + " "+ info.entities[i].actors[j].lname; 
                    if (j < Object.keys(info.entities[i].actors).length -1)
                    {
                        string += ", ";
                    }
                }
            }
           
            if (reviews === "true")
            {
                string += "\n\n**** Reviews ****\n\n";
                for (i = 0; i < Object.keys(data.entities).length; i++)
                {
                        string += "Review Written By: "+ data.entities[i].reviewer + "\n";
                        string += "Quote: "+ data.entities[i].quote + "\n";
                        string += "He/She gave \""+ data.entities[i].title + "\" "+data.entities[i].starsRating+" out of Five Stars\n\n";
                } 
            }
            
            res.send(string);
            });
        });     // end of request statement
    }    
        
    
    else if (title_specific === "false")
    {
        // query when title is being searched
        var segments = title.split(" ");
        var query_string = "";
        var a;
        
        for ( a = 0; a < segments.length; a++)
        {
            if ((a < segments.length - 1) && (segments.length >= 1))
            {
                query_string += "'" + segments[a] + "*'";
                query_string += "or title contains";
            }
            else
            {
                query_string += "'" + segments[a] + "*'";
            }
        }
        
    http3 = "https://api.usergrid.com/jhockenberry/sandbox/movies?ql=select * where title contains "+ query_string;
    request(http3, function(error, response, body)
        {
            info = JSON.parse(body);
            
            request(http2, function(error, response, body)
            {
                data = JSON.parse(body);
                
                var i;
                var j;   
        
                for (i = 0; i < Object.keys(info.entities).length; i++)
                {
                    string = "__Retrieved Entries__\n";
                    string += "Title: "+ info.entities[i].title + "\n";
                    string += "Year: "+ info.entities[i].year + "\n";
                    string += "Actors: ";
                
                    // now for actors
                    for (j = 0; j < Object.keys(info.entities[i].actors).length; j++)
                    {
                        string += info.entities[i].actors[j].fname + " "+ info.entities[i].actors[j].lname;
                        if (j < Object.keys(info.entities[i].actors).length -1)
                        {
                            string += ", ";
                        }
                    }
                
                    if (reviews === "true")
                    {
                        
                        if (Object.keys(data.entities).length !== 0)
                        {
                            string += "\n\n**** Reviews ****\n\n";
                            for (i = 0; i < Object.keys(data.entities).length; i++)
                            {
                                string += "Review Written By: "+ data.entities[i].reviewer + "\n";
                                string += "Quote: "+ data.entities[i].quote + "\n";
                                string += "He/She gave \""+ data.entities[i].title + "\" "+data.entities[i].starsRating+" out of Five Stars\n\n";
                            }
                        }
                        else
                        {
                            string += "\n\n ** Reviews could not be printed with partial title entered\n";
                            string += "    Please make correction and resubmit request";
                        }
                    }
            
                
                }
                res.send(string);
            });
        });   
    }
    else
    {
        string = "Error has occured";
        res.send(string);
    }

});


//**********************************************************************************************
app.delete('/delete',function(req,res){
    
    var title = req.query["title"];
    var http = "https://api.usergrid.com/jhockenberry/sandbox/movies?ql=select * where title= '" +title+"'";
    
    request.del(http,function(error, response, body){
            res.send(body);
    });
    
});


//**********************************************************************************************
app.post('/post', function(req, res) {
    
    var title = req.body["title"];
    var year = req.body["year"];
    var yearex = /^[0-9]{4}$/;
    var actors = [{fname:"", lname:""},{fname:"", lname:""},{fname:"", lname:""}];
    var movie = {"title": title, "year": year, "actors":actors};
    var http = "https://api.usergrid.com/jhockenberry/sandbox/movies?ql=select * where title= '" +title+"'";
    var i;
    
    if (title === undefined){
        res.send("Error: Title undefined");
    }
    
    if (title === ""){
        res.send("Error: No title");
    }

    if (year === undefined){
        res.send("Error: Year undefined");
    }
    
    if (!year.match(yearex)){
        fail = true;
        res.send("Error: improper year");
    }
    
    if (req.body["actors"] === undefined){
        res.send("Error: Movie undefined");
    }
    
    if (Object.keys(req.body["actors"]).length != 3){
        res.send("Error: Can only hold three actors");
    }
    
    for (i=0; i < Object.keys(req.body["actors"]).length; i++)
    {
        if (req.body["actors"][i].fname === undefined || req.body["actors"][i].lname === undefined)
        {
            res.send ("Error: invalid actor");
        }
        actors[i].fname = req.body["actors"][i].fname;
        actors[i].lname = req.body["actors"][i].lname;
    }
    
    request(http, function (error, response, body){
            if (Object.keys(JSON.parse(body).entities).length > 0)
            {
              res.send("Error: duplicate movies");
            }
            request.post({
            headers:    {"content-type":"application/json"},
            url:    'https://api.usergrid.com/jhockenberry/sandbox/movies',
            body:   JSON.stringify(movie)
            }, function (error, response, body){
        res.send(body);
        });
    });
});







app.listen(3000);