/* App.js */
import ReactSearchBox from 'react-search-box'
import React, { Component } from 'react'
var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


 
var dataPoints =[];


export default class App extends Component {

	constructor(props) {
		super(props)
		this.state = {address: "41 Cooper Square"}
		this.handleSelect = this.handleSelect.bind(this)
	}	
	handleSelect(event) {
		this.setState({address: event.value})
	}

	test_data = [
    {
      key: 'john',
      value: 'John Doe',
    },
    {
      key: 'jane',
      value: 'Jane Doe',
    },
    {
      key: 'mary',
      value: 'Mary Phillips',
    },
    {
      key: 'robert',
      value: 'Robert',
    },
    {
      key: 'karius',
      value: 'Karius',
    },
  ]
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
				xValueFormatString: "MMM YYYY",
				yValueFormatString: "$#,##0.00",
				dataPoints: dataPoints
			}]
		}
		return (

		<div> 
		<center>
		<h1> Real Estate Efficiency Calculator </h1>
		</center>

		<ReactSearchBox
        placeholder="Placeholder"
        value="41 Cooper Square"
        onSelect={this.handleSelect}
        data={this.test_data}
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
			chart.render();
		})
		this.getDataFromDb(11598).then((data)=>console.log(data.json()));
	}

	getDataFromDb = (zipCode) => {
		console.log("Going into getdata");

		var dat = fetch("http://localhost:3001/api/getPropertyTax/:"+zipCode);
		return dat;
		console.log('dat: ',dat)

		fetch("http://localhost:3001/api/getPropertyTax/:"+zipCode)
		  .then((data) => {
			  var dat2 = data.json();
			  console.log('dat2: ',dat2)
		  })
		  //.then((res) => this.setState({ data: res.data }));
		  //console.log('data: ',dat2)

	};
	  

}