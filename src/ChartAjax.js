function ChartAjax(elem, chartType, url) {

	var self = this;

	this.ctx = elem.getContext("2d");
	this.url = url;
	this.chartType = chartType;

	this.apiResult = {};

	this.chartConfig = {
		labels: [],
		data: [],
		backgroundColor: [],
		borderColor: [],
		label: undefined,
		options: {}
	};

	this.chart;

	this.onloadCallback = function() {
		// ...
	}

	this.getData = function() { //ES6 syntax: this.getData = () => {... this. ....
		$.ajax({

			url: self.url,

			contentType: "application/json; charset=utf-8",
  			dataType: 'json',

			success: function(result){

				self.apiResult = result;

				self.chartConfig = self.handleData(result);
				self.render();
				self.onloadCallback();

			},

			error: function (request, status, error) {
				alert(request.responseText);
			},

		});
	}

	this.setData = function(chartConfig) {
		self.chartConfig = self.handleData(chartConfig);
		self.render();
	}

	this.handleData = function(apiResult) {
		// To impletent when the ChartAjax obj is created
	}

	this.render = function() {
		console.log(self.chartConfig)

		if (self.chart !== undefined)
			self.chart.destroy();

		self.chart = new Chart(self.ctx, {
			type: self.chartType,
			data: {
				labels: self.chartConfig.labels,
				datasets: [{
					label: self.chartConfig.label,
					data: self.chartConfig.data,
					backgroundColor: self.chartConfig.backgroundColor,
					borderColor: self.chartConfig.borderColor,
					borderWidth: 2
				}]
			},
			options: self.chartConfig.options
		});

	}

}

ChartAjax.getManager = function() {

	return {

		charts: {},

		/**
		 * 
		 * Initialize a chart and draws it
		 *
		 * @param string chartName - The name to assign to the chart (key in charts: {})
		 * @param elem canvas - The canvas element where the chart will be drawn
		 *
		 */
		initChart: function(chartName, canvas, type, url, handleDataMethod) {
			this.charts[chartName] = new ChartAjax(canvas, type, url);
			this.charts[chartName].handleData = handleDataMethod;
			//this.charts[chartName].getData();
		},

		updateChart: function(chartName, url) {
			this.charts[chartName].url = url;
			this.charts[chartName].getData();
		},

		setChartData: function(chartName, data) {
			this.charts[chartName].setData(data);
		},

		setChartCallback: function(chartName, callback) {
			this.charts[chartName].onloadCallback = callback;	
		}

	}

}
