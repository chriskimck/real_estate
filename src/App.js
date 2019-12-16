/* App.js 
//11598 11559 11096
To Do:

- Incorporate all addresses to search bar, not only 11598


*/
import ReactSearchBox from 'react-search-box'
import React, { Component } from 'react'
var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var calc = require('./effCalc.js');


var addressPoints = []; 
var dataPoints =[];
var db_connection = [];
var address_connection = [];
var specific_address = [];


export default class App extends Component {

	constructor(props) {
		super(props)
		this.state = {address: "25 HICKORY RD, WOODMERE, NY 11598"}
		this.handleSelect = this.handleSelect.bind(this)
	}	
	handleSelect(event) {
		this.setState({address: event.value})
	}
	testMount(){
		fetch('./address-store.json')
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			for (var i = 0; i < data.length; i++) {
				addressPoints.push({
					key: data[i].key,
					value: data[i].value
				});
			}
		})
		//console.log(addressPoints);
	}

	getAddressFromDb = (zipCode) => {
		address_connection = [];
		var temp = [];

		fetch("http://localhost:3001/api/getPropertyTax/"+zipCode)
		.then(function(response) {
			return response.json();
		})
		.then(function(data1) {
			temp = [];
			for (var i = 0; i < data1.data.length; i++) {
				if (temp.indexOf(data1.data[i].address.oneLine) < 0) {
					address_connection.push({
					key: data1.data[i].address,
					value: data1.data[i].address.oneLine
				});
					temp.push(data1.data[i].address.oneLine);
				}
			}
		})
		fetch("http://localhost:3001/api/getPropertyTax/11559")
		.then(function(response) {
			return response.json();
		})
		.then(function(data1) {
			temp = [];
			for (var i = 0; i < data1.data.length; i++) {
				if (temp.indexOf(data1.data[i].address.oneLine) < 0) {
					address_connection.push({
					key: data1.data[i].address,
					value: data1.data[i].address.oneLine
				});
					temp.push(data1.data[i].address.oneLine);
				}
			}
		})
		console.log('Data got for addresses: ',address_connection);

	}


	getDataByAddress = (zipcode,line1) => {
		// (address_num<>street_name,<>town,<>state<>zipcode)
		// (326 barr ave, woodmere, ny 10025)
		// ave, rd .. NOT avenue,road
		//this.getDataByAddress(11598,'25 HICKORY RD, WOODMERE, NY 11598');
		specific_address = [];
		console.log('Fetching data by address for: ',line1,', ',zipcode);
		fetch("http://localhost:3001/api/getPropertyTaxByAddress/"+zipcode+'/'+line1)
		.then(function(response) {
			return response.json();
		})
		.then(function(data1) {
			var temp = [];
			var temp_month = 0;
			for (var i = data1.data.assessmenthistory.length-1; i > -1; i--) {
				if (temp.indexOf(data1.data.assessmenthistory[i].tax.taxyear) >= 0) {
					temp_month = 6;
				} else {
					temp.push(data1.data.assessmenthistory[i].tax.taxyear);
					temp_month = 0;
				}
				specific_address.push({
					x: new Date(data1.data.assessmenthistory[i].tax.taxyear,temp_month),
					y: data1.data.assessmenthistory[i].tax.taxamt
				});
			}
		})
		console.log('Specific Address: ', specific_address)
		

	}; 

	getDataFromDb = (zipCode) => {
		db_connection = [];

		fetch("http://localhost:3001/api/getPropertyTax/"+zipCode)
		.then(function(response) {
			return response.json();
		})
		.then(function(data1) {
			for (var i = 0; i < data1.data.length; i++) {
				db_connection.push({
					values: data1.data[i]
					//address: data1.data[i].address,
					//value: data1.data[i].address.oneLine
				});
			}
			return db_connection;
		})
		.then(function(db_connection) {
			calc.getAvg(db_connection);
		});
	}

	render() {	
		const options = {
			theme: "light2",
			title: {
				text: "Price per Sq Ft of " + this.state.address
			},
			axisY: {
				title: "Price in USD",
				prefix: "$",
				includeZero: false
			},
			data: [{
				type: "line",
				xValueFormatString: "YYYY",
				yValueFormatString: "$#,##0.00",
				dataPoints: dataPoints //change this to specific_address
			}]
		}
		//change these positionings
		this.getAddressFromDb(11598);
		this.getDataFromDb(11598);
		this.getDataByAddress(this.state.address.slice(-5),this.state.address);


		return (

		<div> 
		<center>
		<h1> Real Estate Efficiency Calculator </h1>
		</center>

		<ReactSearchBox
        placeholder="Placeholder"
        value="41 Cooper Square"
        onSelect={this.handleSelect}
        data={address_connection}
        callback={record => console.log(record)}
      />

		    
		<CanvasJSChart options = {options} 
			 onRef={ref => this.chart = ref}
		/>
		{/*You can get reference to the chart instance as shown above using onRef. 
		This allows you to access all chart properties and methods*/}


		<p> Avg Price of Zip Code</p>

      </div>
		);
	}
	
	componentDidMount(){
		/*
		var chart = this.chart;
		fetch('./nifty-stock-price.json')
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			for (var i = 0; i < data.length; i++) {
				dataPoints.push({
					x: new Date(data[i].x),
					y: data[i].y
				});
			}
			console.log(dataPoints);
			chart.render();
		})
		*/
		dataPoints = specific_address;
		var chart = this.chart;
		chart.render();
		//this.getDataByZip(11598);
	}

	/*

	getDataFromDb = (zipCode) => {
		console.log("Going into getdata");

		var dat = fetch("http://localhost:3001/api/getPropertyTax/"+zipCode);
		return dat;
		console.log('dat: ',dat)

		fetch("http://localhost:3001/api/getPropertyTax/:"+zipCode)
		  .then((data) => {
			  var dat2 = data.json();
			  console.log('dat2: ',dat2)
		  })
		  //.then((res) => this.setState({ data: res.data }));
		  //console.log('data: ',dat2)

	};*/

	getDataByZip = (zipcode) => {

		console.log('Fetching data by address for: ',zipcode);
		fetch("http://localhost:3001/api/getPropertyTaxByZip/"+zipcode)
		.then(function(response) {
			return response.json();
		})
		.then(function(data1) {
			for (var i = 0; i < data1.data.length; i++) {
				db_connection.push({
					address: data1.data[i].address,
					value: data1.data[i].address.oneLine
				});
			}
		})
		.then(function(db_connection) {
			calc.getAvg(db_connection);
		});
	};
}