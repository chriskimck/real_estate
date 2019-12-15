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


// connects our back end code with the database
//mongoose.connect(dbRoute, { useNewUrlParser: true });

//let db = mongoose.connection;

//db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
//db.on('error', console.error.bind(console, 'MongoDB connection error:'));




// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
/*app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));*/

// this is our get method
// this method fetches all available data in our database

//mongoose.connect(dbRoute, { useNewUrlParser: true });

//Get the default connection
//var db = mongoose.connection;

//db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router.get('/getPropertyTax/:zipcode', (req, res) => {
    let zipCode = req.params.zipcode;

    console.log("In get Data route");

    MongoClient.connect(dbRoute, function (err, conn){
        conn.db("RealEstate").collection('PropertyTaxAssessments'+zipCode).find({}).toArray((err, data) => {

            //console.log(data);
            if (err) return res.json({ success: false, error: err });
            res.json({ success: true, data: data });
        });
    });
});

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));