const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const MongoClient = require('mongodb').MongoClient;
//const Data = require('./data');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute =
  "mongodb+srv://christopherkim511:realEstate@cluster0-owylp.mongodb.net/test?retryWrites=true&w=majority";


const dbconn = MongoClient.connect(dbRoute, function(err, conn) {
    if(err) {
        console.log("Error");
    }
    else{
        console.log('Successfully connected to the db');

        //const col = conn.db("RealEstate").collection("PropertyTaxAssessments11096");
        //const curs = col.find({})
        //console.log(curs.count())

        conn.db("RealEstate").collection('PropertyTaxAssessments11096').find({}).count()
            .then(function(numItems) {
            console.log('Number of items found is: ',numItems); // Use this to debug
        });    
    }
    return conn;
});

router.get('/getPropertyTax/:zipcode', (req, res) => {
    let zipCode = req.params.zipcode;

    console.log("In get Data route, zipcode: "+zipCode);

    MongoClient.connect(dbRoute, function (err, conn){
        conn.db("RealEstate").collection('PropertyTaxAssessments'+zipCode).find().toArray((err, data) => {

            console.log('Returns: ',data);
            if (err){
                conn.close();
                return res.json({ success: false, error: err });
            } 
            res.json({ success: true, data: data });
            conn.close();
        });
        
    });

    
});

router.get('/getPropertyTaxByAddress/:zipcode/:address1', (req, res) => {
    let zipcode = req.params.zipcode;
    let line1 = req.params.address1.toUpperCase;

    console.log('zipcode:',zipcode);
    console.log('line1:',line1);

    console.log('In get tax assess by address route for: ',line1,', ',zipcode);

    MongoClient.connect(dbRoute, function (err, conn){
        conn.db("RealEstate").collection('PropertyTaxAssessments'+zipcode).find({"address.oneLine":line1}).toArray((err, data) => {

            //console.log('Returns: ',data);
            if (err){
                conn.close();
                return res.json({ success: false, error: err });
            } 
            conn.close();
            res.json({ success: true, data: data });
        });
    });
});

/*router.get('/getPropertyTaxByZip/:zipcode', (req, res) => {
    let zipcode = req.params.zipcode;

    console.log('zipcode:',zipcode);

    console.log('In get tax assess by address route for: ',zipcode);

    MongoClient.connect(dbRoute, function (err, conn){
        conn.db("RealEstate").collection('PropertyTaxAssessments'+zipcode).find({}).toArray({}, function(err,data) {

            //console.log('Returns: ',data);
            if (err){
                console.log("Error with db call");
                conn.close();
                return res.json({ success: false, error: err });
            } 
            console.log('Success!');
            conn.close();
            res.json({ success: true, data: data });
        });
    });
});*/

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
