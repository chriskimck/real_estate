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
var avg_Price_storage = [];
var queried_zipAvgPrice = {"11598":6.21, "11559":3.91, "11096":3.65};
var json_11598 = require('./11598.json');
var json_11559 = require('./11559.json');
var json_11096 = require('./11096.json');

export default class App extends Component {

	constructor(props) {
		super(props)	
		this.state = {address: "TBD", input_address_data:[], avg_Zip: 0, compare: 0, color: "blue", percent_diff:0}
		this.handleSelect = this.handleSelect.bind(this)
	}	
	handleSelect(event) {
		var update_comp = 0;
		var worth_it = 'green';
		var pcnt = 0;
		var zip = event.value.slice(-5);
		if (zip == "11598") {
			for (var i = 0; i < json_11598.data.length; i++) {
				if (event.value == json_11598.data[i].address.oneLine && update_comp==0) {
					console.log("hi");
					update_comp = json_11598.data[i].assessmenthistory[0].tax.taxamt / json_11598.data[i].building.size.grosssizeadjusted;
					update_comp = update_comp.toFixed(2);
				}
			}
		} else if (zip == "11559") {
			for (var i = 0; i < json_11559.data.length; i++) {
				if (event.value == json_11559.data[i].address.oneLine && update_comp==0) {
					console.log("hi");
					update_comp = json_11559.data[i].assessmenthistory[0].tax.taxamt / json_11559.data[i].building.size.grosssizeadjusted;
					update_comp = update_comp.toFixed(2);
				}
			}
		} else {
			for (var i = 0; i < json_11096.data.length; i++) {
				if (event.value == json_11096.data[i].address.oneLine && update_comp==0) {
					console.log("hi");
					update_comp = json_11096.data[i].assessmenthistory[0].tax.taxamt / json_11096.data[i].building.size.grosssizeadjusted;
					update_comp = update_comp.toFixed(2);
				}
			}
		}
		if (queried_zipAvgPrice[zip] > update_comp) {
			worth_it = 'red';
			pcnt = (((queried_zipAvgPrice[zip] - update_comp)/queried_zipAvgPrice[zip])*100).toFixed(2);

		} else {
			worth_it = 'green';
			pcnt = (((queried_zipAvgPrice[zip] - update_comp)/queried_zipAvgPrice[zip])*-100).toFixed(2);
		}
		console.log(update_comp);
		this.getDataByAddress(event.value.slice(-5),event.value);
		this.getDataFromDb(event.value.slice(-5));
		console.log("Stored avg Price ", avg_Price_storage);
		console.log(queried_zipAvgPrice)
		console.log(zip);
		console.log(queried_zipAvgPrice[zip]);
		this.setState({address: event.value,input_address_data:specific_address, compare: update_comp, color: worth_it, percent_diff: pcnt})
		this.setState({avg_Zip:queried_zipAvgPrice[zip], compare: update_comp});
		console.log("current avg price output: ", this.state.avg_Zip);
		console.log(this.state.compare);
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

		//fetch("http://localhost:3001/api/getPropertyTax/"+zipCode)
		fetch("./11598.json")
		.then(function(response) {
			return response.json();
		})
		.then(function(data1) {
			temp = [];
			for (var i = 0; i < data1.data.length; i++) {
				if (temp.indexOf(data1.data[i].address.oneLine) < 0) {
					address_connection.push({
					key: data1.data[i].address.oneLine,
					value: data1.data[i].address.oneLine
				});
					temp.push(data1.data[i].address.oneLine);
				}
			}
		})
		//fetch("http://localhost:3001/api/getPropertyTax/11559")
		fetch("./11559.json")
		.then(function(response) {
			return response.json();
		})
		.then(function(data1) {
			temp = [];
			for (var i = 0; i < data1.data.length; i++) {
				if (temp.indexOf(data1.data[i].address.oneLine) < 0) {
					address_connection.push({
					key: data1.data[i].address.oneLine,
					value: data1.data[i].address.oneLine
				});
					temp.push(data1.data[i].address.oneLine);
				}
			}
		})
		fetch("./11096.json")
		.then(function(response) {
			return response.json();
		})
		.then(function(data1) {
			temp = [];
			for (var i = 0; i < data1.data.length; i++) {
				if (temp.indexOf(data1.data[i].address.oneLine) < 0) {
					address_connection.push({
					key: data1.data[i].address.oneLine,
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
					y: data1.data.assessmenthistory[i].tax.taxamt / data1.data.building.size.grosssizeadjusted
				});
				if (data1.data.assessmenthistory[i].tax.taxyear == "2017") {
					specific_address.push({
						x: new Date(data1.data.assessmenthistory[i].tax.taxyear,temp_month),
						y: queried_zipAvgPrice[zipcode]
					});
				}

			}
		})
		console.log('Input Address Data: ', specific_address)
		

	}; 

	getDataFromDb = (zipCode) => {
		db_connection = [];
		avg_Price_storage = [];

		fetch("./"+zipCode + ".json")
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
			var avg_Price = calc.getAvg(db_connection);
			avg_Price_storage.push({x: "Avg", y: avg_Price});
			return avg_Price;
		});
	}

	render() {
		this.getAddressFromDb(11598);

		//change these positionings
		const options = {
			theme: "light2",
			title: {
				text: "Price per Sq Ft of: " + this.state.address
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
				dataPoints: this.state.input_address_data //specific_address //change this to specific_address
			}]
		}
		const styles = {
			color: this.state.color,
		};

		return (

		<div> 
		<center>
		<h1> Real Estate Efficiency Calculator </h1>
		</center>

		<ReactSearchBox
        placeholder="Placeholder"
        value="Please select an address"
        onSelect={this.handleSelect}
        data={address_connection}
        callback={record => console.log(record)}
      />

		
		<CanvasJSChart options = {options} 
			 onRef={ref => this.chart = ref}
		/>
		{/*You can get reference to the chart instance as shown above using onRef. 
		This allows you to access all chart properties and methods*/}

		<center>
		<p style={styles}> Average Price per Sq Ft of Zip Code {this.state.address.slice(-5)} in 2017: {this.state.avg_Zip} </p>
		<p style={styles}> Price per Sq Ft of {this.state.address} in 2017: {this.state.compare} </p>
		<p style={styles}> Percent Difference: {this.state.percent_diff}% from the Average Price</p>

		</center>

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
		//dataPoints = specific_address;

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