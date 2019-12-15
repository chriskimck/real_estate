var mongoose = require('mongoose');
var express = require('express');
const dbroute = 'mongodb+srv://quotes:quotes_master@cluster0-uo6n9.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(dbroute, { useNewUrlParser : true });