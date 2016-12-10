var path    = require("path");
var express = require('express');
var app = express();

app.get('/',function(req,res){
    //console.log(req);
    res.sendFile('index.html', { root: __dirname });
    console.log(__dirname);
    var parameter = req.url.slice(1);
    console.log(parameter);
    if (parameter === 'favicon.ico') {
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end();
        //console.log('favicon requested');
        return;
    }
    else
    {
     //need to first determine if the url works
     //if the url works, then I need to convert it to a code
     //would need to store the code in something like a database
     //then, if the person enters the code, i need to look up the database and try to go
     //but this work would be a lot easier if I didn't have to parse the URL, but could 
     //actually, take in a field 
        //res.sendFile(path.join(__dirname+'/index.html'));
        
        res.end(JSON.stringify(parameter));    
    }
});




    
    


/*
User Story: I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.

User Story: If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.

User Story: When I visit that shortened URL, it will redirect me to my original link.
*/

app.listen(process.env.PORT, function(){
    console.log("Server listening on: "+ process.env.PORT);
});

/*
var http = require("http")
var server = http.createServer(function(req,res){
    //IP address, language and operating system for my browser.
    //console.log(req.connection)
    var ip_address = req.headers['x-forwarded-for'];
    var language = req.headers['accept-language'];
    var os = req.headers['user-agent'];
    var output = {
        "ipaddress": ip_address,
        "language": language,
        "software": os
    }
    output = JSON.stringify(output)
    res.end(output)
})


server.listen(process.env.PORT, function(){
    console.log("Server listening on: "+ process.env.PORT);
});
*/


