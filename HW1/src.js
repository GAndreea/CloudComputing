
var express = require('express')
var app = express()
var path = require("path");

const bodyParser = require('body-parser')
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({ extended: false }))

app.post('/', function (req, res) {
  console.log(typeof(req.body.movies))
  var myStr= " "
  var mymovies=req.body.movies
  for (var i=0; i<mymovies.length; i++) {
  	myStr=myStr+mymovies[i] + ", "
  }
  const mailjet = require ('node-mailjet')
  .connect('<API_KEY>' , '<SECRET_KEY>')
  const request = mailjet
  .post("send", {'version': 'v3.1'})
  .request({
    "Messages":[
        {
            "From": {
                "Email": "email@gmail.com",
                "Name": "Movies"
            },
            "To": [
                {
                    "Email": req.body.email,
                    "Name": "You"
                }
            ],
            "Subject": "Movies to watch",
            "TextPart": myStr,
            "HTMLPart": "<h3>Here are some movies you've found interesting!</h3><p>" + myStr +"</p><br />Thank you!"
        }
    ]
  })
request
  .then((result) => {
    console.log(result.body)
  })
  .catch((err) => {
    console.log(err.statusCode)
  })
  const body = req.body.Body
  console.log("---REQ & ANSW --")
  console.log(req)
  //console.log(res)
  res.set('Content-Type', 'text/plain')
  res.send("Mail Succesfully send!")
})


app.use(express.static(path.join(__dirname, "static")));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/details', function(req, res) {
    res.sendFile(path.join(__dirname+'/details.html'));
});
   // res.sendFile(path.join(__dirname+'/main.html'));
app.listen(8000);
console.log("Running at Port 8000");