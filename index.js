/* API-Sample take-away */
const requestPromise = require('request-promise');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const API_KEY = 'u0brlcvusf-cnYQxnG8Bfvgux6hKLRx0rtFlpba5kDIESX2qAllNk8=';
const API_URI = 'https://console.kaleido.io/api/v1/consortia';

let consort_id ='';

function getConsortium(req,res){
    requestPromise({
        uri : API_URI,
        headers : {
            'Authorization' : `Bearer ${API_KEY}`,
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods' : 'GET'
        },
        json :true
    }).then((resp)=>{
        res.json(resp);
        consort_id = resp[0]._id;
    }).catch((error)=>{
        if(error.statusCode && error.message) res.status(error.statusCode).send(error.message);
        else res.status(500).send('Internal Error');
        throw(error);
    })
}
/* API-Sample take-away END */

app.use(express.static('public'));
app.post('/', (req, res)=>{
   res.sendFile('index.html');
});
app.get('/consortium', bodyParser.json(), getConsortium);
app.get('/consortium_id', bodyParser.json(), function(req, res){
    if(req.body){
        consort_id = req.body.consort_id;
    }
});

app.get('/environments', bodyParser.json(), function (req, res){
    requestPromise({
        uri : API_URI + '/'+ consort_id+'/environments',
        headers : {
            'Authorization' : `Bearer ${API_KEY}`,
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods' : 'GET'
        },
        json :true
    }).then((resp)=>{
        res.json(resp);
    }).catch((error)=>{
        if(error.statusCode && error.message) res.status(error.statusCode).send(error.message + consort_id);
        else res.status(500).send('Internal Error');
        throw(error);
    })
});


app.listen(3500,()=>{
    console.log('Sample API Listening on Port 3500');
});
