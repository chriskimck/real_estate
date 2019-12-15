/* App.js */
import ReactSearchBox from 'react-search-box'
import React, { Component } from 'react'
var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


 
var dataPoints =[];


export default class App extends Component {

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
				text: "Stock Price of NIFTY 50"
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
		<h1> Hello </h1>
		<ReactSearchBox
        placeholder="Placeholder"
        value="Doe"
        data={this.test_data}
        callback={record => console.log(record)}
      />
    
			<CanvasJSChart options = {options} 
				 onRef={ref => this.chart = ref}
			/>
			{/*You can get reference to the chart instance as shown above using onRef. 
			This allows you to access all chart properties and methods*/}

		
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
		.then(this.getDataFromDb());
	}

	getDataFromDb = () => {
		console.log("Going into getdata");

		fetch("http://localhost:3001/api/getData")
		  .then((data) => data.json())
		  .then((res) => this.setState({ data: res.data }));
	  };

}