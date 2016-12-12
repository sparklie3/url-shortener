var request = require('request');
var express = require('express');
var mongo = require('mongodb').MongoClient
const mongodb_url = process.env.MONGOLAB_URI;
const url = 'mongodb://localhost:27017/data';      
var app = express();


// need to change url to mongodb_url when in production
function storeData(val){
    mongo.connect(mongodb_url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Connection established to', mongodb_url);
        var data = db.collection('data');
        data.insert(val,function (err,dataResponse) {
          if (err){ 
              throw err;
            }
            console.log(JSON.stringify(val));
          });
        db.close();
      }
    }); 
};


function checkData(val, cb){
  mongo.connect(mongodb_url,function (err, db){
       if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Connection established to', mongodb_url);
        var data = db.collection('data');
        console.log('what is val: '+val);
        data.find({
            'shortened_url':val
        },{
            _id:0,
            'shortened_url':0
        }).toArray(function (err,documents) {
            if (err) {
                throw err // throw err causes the end It is a little like return console.log(err), except here I don't have the return
            }    
            console.log(documents[0].original_url);
            console.log(documents);
            return cb(documents[0].original_url.toString());
          });
      }
      db.close();
  });  
};


app.use('/new',function(req,res){
    var final_response={};
    var parameter = req.url.slice(1);
    console.log('parameter: '+parameter);
    if (parameter === 'favicon.ico') {
        console.log('favicon requested');
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end();
    }
    else 
    {
        var original_url = parameter;
        request.get(original_url,function(err, response, body){
           if (!err && response.statusCode == 200){
               console.log('console code: '+ response.statusCode);
               var new_url = generateURL();
               final_response.original_url = original_url;
               final_response.shortened_url = new_url;
               storeData(final_response);
               res.end(JSON.stringify(final_response));                      
           } else {
                console.log('error log: '+err);
                final_response.error = 'Something wrong with the data';
                res.end(JSON.stringify(final_response));                      
           }
        });
        
    }
});

app.use(express.static( 'public' ) ) //this is to use a static file;
app.get('/',function(req,res){
   res.sendFile('index.html', {root: __dirname});
   res.end();
});

app.use('/visit',function(req,res){
   var parameter = req.url.slice(1);
   //res.redirect('http://www.techcrunch.com');
   if (!isNaN(parameter)){
       var outputURL = "";
        checkData(Number(parameter), function(cb){
           console.log(cb);
           res.redirect(cb);
        });
   }
   
});

function generateURL(){
    return Math.round((Math.random()*10000000))
}



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


