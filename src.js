
var express = require('express')
var app = express()
var path = require("path");
const bodyParser = require('body-parser')
app.use(express.static(path.join(__dirname, 'public')));

/**
* This call sends an email to one recipient, using a validated sender address
* Do not forget to update the sender address used in the sample
*/
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/sms', function (req, res) {
  const body = req.body.Body
  console.log(req.body)
  res.set('Content-Type', 'text/plain')
  res.send("a")
})

const mailjet = require ('node-mailjet')
  .connect('APIKEY' , 'SECRET')
const request = mailjet
  .post("send", {'version': 'v3.1'})
  .request({
    "Messages":[
        {
            "From": {
                "Email": "angiurgila@gmail.com",
                "Name": "Super"
            },
            "To": [
                {
                    "Email": "angiurgila@gmail.com",
                    "Name": "Passenger"
                }
            ],
            "Subject": "Your email flight plan!",
            "TextPart": "Dear passenger, welcome to Mailjet! May the delivery force be with you!",
            "HTMLPart": "<h3>Dear passenger, welcome to Mailjet!</h3><br />May the delivery force be with you!",
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

myVar= "ana"

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});
app.get('/main.html', function(req, res) {
    res.render(path.join(__dirname+'/main.html'), {name:myVar});

   // res.sendFile(path.join(__dirname+'/main.html'));
});
app.listen(8000);
console.log("Running at Port 8000");