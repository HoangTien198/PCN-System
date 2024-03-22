$(document).ready(function () { 
	CreateChart();
});

/* GET */
function GetPcnData() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `/Dashboard/Dashboard/GetPcnData`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				reject(error);
			}
		});
	});
}
function GetPcnWeekData() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `/Dashboard/Dashboard/GetPcnWeekData`,
            type: "GET",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (res) {
                if (res.status) {
                    resolve(res.data);
                }
                else {
                    reject(res.message);
                }
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

async function CreateChart() {
	try {
		var numData = await GetPcnData();
		var chartData = await GetPcnWeekData();

		CreateTotalChart(chartData.Categories, chartData.Total, numData.Total);
		CreatePendingChart(chartData.Categories, chartData.Pending, numData.Pending);
		CreateApprovedChart(chartData.Categories, chartData.Approved, numData.Approved);
		CreateRejectedChart(chartData.Categories, chartData.Rejected, numData.Rejected)

	} catch (e) {
		console.error(e);
    }
}
function CreateTotalChart(categories, totalData, totalNum) {
	$('#total-num').html(totalNum);

	var options = {
		chart: {
			height: 35,
			type: 'bar',
			toolbar: {
				show: false
			},
			sparkline: {
				enabled: true
			},
		},
		dataLabels: {
			enabled: false
		},
		colors: [app.color.theme],
		stroke: {
			show: false
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '65%',
				endingShape: 'rounded'
			}
		},
		series: [{
			data: totalData
		}],
		grid: {
			show: false
		},
		tooltip: {
			theme: 'dark',
			y: {
				title: {
					formatter: function (seriesName) {
						return ''
					}
				},
				formatter: (value) => {
					return '' + value
				},
			}
		},
		xaxis: {
			categories: categories,
			labels: {
				show: false
			}
		},
		yaxis: {
			labels: {
				show: false
			}
		}
	};

	var totalChart = new ApexCharts(document.querySelector("#total-chart"), options);
	totalChart.render();
}
function CreatePendingChart(categories, pendingData, pendingNum) {
	$('#pending-num').html(pendingNum);

	var options = {
		chart: {
			height: 35,
			type: 'area',
			toolbar: {
				show: false
			},
			sparkline: {
				enabled: true
			},
		},
		dataLabels: {
			enabled: false
		},
		colors: [app.color.theme],
		stroke: {
			show: false
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '65%',
				endingShape: 'rounded'
			}
		},
		series: [{
			data: pendingData
		}],
		grid: {
			show: false
		},
		tooltip: {
			theme: 'dark',
			y: {
				title: {
					formatter: function (seriesName) {
						return ''
					}
				},
				formatter: (value) => {
					return '' + value
				},
			}
		},
		xaxis: {
			categories: categories,
			labels: {
				show: false
			}
		},
		yaxis: {
			labels: {
				show: false
			}
		}
	};

	var pendingChart = new ApexCharts(document.querySelector("#pending-chart"), options);
	pendingChart.render();
}
function CreateApprovedChart(categories, approvedData, approvedNum) {
	$('#approved-num').html(approvedNum);

	var options = {
		chart: {
			height: 35,
			type: 'area',
			toolbar: {
				show: false
			},
			sparkline: {
				enabled: true
			},
		},
		dataLabels: {
			enabled: false
		},
		colors: [app.color.success],
		stroke: {
			show: false
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '65%',
				endingShape: 'rounded'
			}
		},
		series: [{
			data: approvedData
		}],
		grid: {
			show: false
		},
		tooltip: {
			theme: 'dark',
			y: {
				title: {
					formatter: function (seriesName) {
						return ''
					}
				},
				formatter: (value) => {
					return '' + value
				},
			}
		},
		xaxis: {
			categories: categories,
			labels: {
				show: false
			}
		},
		yaxis: {
			labels: {
				show: false
			}
		}
	};

	var approvedChart = new ApexCharts(document.querySelector("#approved-chart"), options);
	approvedChart.render();
}
function CreateRejectedChart(categories, rejectedData, rejectedNum) {
	$('#rejected-num').html(rejectedNum);

	var options = {
		chart: {
			height: 35,
			type: 'area',
			toolbar: {
				show: false
			},
			sparkline: {
				enabled: true
			},
		},
		dataLabels: {
			enabled: false
		},
		colors: [app.color.danger],
		stroke: {
			show: false
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '65%',
				endingShape: 'rounded'
			}
		},
		series: [{
			data: rejectedData
		}],
		grid: {
			show: false
		},
		tooltip: {
			theme: 'dark',
			y: {
				title: {
					formatter: function (seriesName) {
						return ''
					}
				},
				formatter: (value) => {
					return '' + value
				},
			}
		},
		xaxis: {
			categories: categories,
			labels: {
				show: false
			}
		},
		yaxis: {
			labels: {
				show: false
			}
		}
	};

	var rejectedChart = new ApexCharts(document.querySelector("#rejected-chart"), options);
	rejectedChart.render();
}