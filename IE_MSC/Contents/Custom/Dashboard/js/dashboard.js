var _data = {};
var _chart = {};
$(document).ready(function () { 

	GetAndInitData();
	
});

async function GetAndInitData() {
	try {

		_data.PcnData = await GetPcnData();
		_data.PcnWeekData = await GetPcnWeekData();
		_data.PcnDataByCustomer = await GetPcnDataByCustomer();
		_data.PcnMonthOfYearData = await GetPcnMonthOfYearData();
		_data.PcnMonthOfYearDataByDepartment = await GetPcnMonthOfYearDataByDepartment();
		_data.Top10Pcn = await GetTop10Pcn();
		_data.Top10Action = await GetTop10Action();

		CreateHeaderChart();
		CreateApplicationChart();
		CreateDepartmentChart();
		CreateTop10PcnTable();
		CreateTop10ActionTable();

	} catch (e) {
		Swal.fire('error', `${e}`, 'error');
		console.error(e);
    }
}

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
function GetPcnDataByCustomer() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `/Dashboard/Dashboard/GetPcnDataByCustomer`,
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
function GetPcnMonthOfYearData() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `/Dashboard/Dashboard/GetPcnMonthOfYearData`,
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
function GetPcnMonthOfYearDataByDepartment() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `/Dashboard/Dashboard/GetPcnMonthOfYearDataByDepartment`,
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
function GetTop10Pcn() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `/Dashboard/Dashboard/GetTop10Pcn`,
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
function GetTop10Action() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `/Dashboard/Dashboard/GetTop10Action`,
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

/* Header Chart */
function CreateHeaderChart() {
	CreateTotalChart();
	CreatePendingChart();
	CreateApprovedChart();
	CreateRejectedChart();
}
function CreateTotalChart() {
	$('#total-num').html(_data.PcnData.Total);

	if (_chart.TotalChartHeader) {
		_chart.TotalChartHeader.updateOptions({
			series: [{
				data: _data.PcnWeekData.Total
			}],
			xaxis: {
				categories: _data.PcnWeekData.Categories,
			},
		});
	}
	else {
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
				data: _data.PcnWeekData.Total
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
				categories: _data.PcnWeekData.Categories,
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

		_chart.TotalChartHeader = new ApexCharts(document.querySelector("#total-chart"), options);
		_chart.TotalChartHeader.render();
	}
	
}
function CreatePendingChart() {
	$('#pending-num').html(_data.PcnData.Pending);

	if (_chart.PendingChartHeader) {
		_chart.PendingChartHeader.updateOptions({
			series: [{
				data: _data.PcnWeekData.Pending
			}],
			xaxis: {
				categories: _data.PcnWeekData.Categories,
			},
		});
	}
	else {
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
			colors: [app.color.yellow],
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
				data: _data.PcnWeekData.Pending
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
				categories: _data.PcnWeekData.Categories,
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

		_chart.PendingChartHeader = new ApexCharts(document.querySelector("#pending-chart"), options);
		_chart.PendingChartHeader.render();
	}
	
}
function CreateApprovedChart() {
	$('#approved-num').html(_data.PcnData.Approved);

	if (_chart.ApprovedChartHeader) {
		_chart.ApprovedChartHeader.updateOptions({
			series: [{
				data: _data.PcnWeekData.Approved
			}],
			xaxis: {
				categories: _data.PcnWeekData.Categories,
			},
		});
	}
	else {
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
			colors: [app.color.green],
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
				data: _data.PcnWeekData.Approved
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
				categories: _data.PcnWeekData.Categories,
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

		_chart.ApprovedChartHeader = new ApexCharts(document.querySelector("#approved-chart"), options);
		_chart.ApprovedChartHeader.render();
	}
	
}
function CreateRejectedChart() {
	$('#rejected-num').html(_data.PcnData.Rejected);

	if (_chart.RejectedChartHeader) {
		_chart.RejectedChartHeader.updateOptions({
			series: [{
				data: _data.PcnWeekData.Rejected
			}],
			xaxis: {
				categories: _data.PcnWeekData.Categories,
			},
		});
	}
	else {
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
			colors: [app.color.red],
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
				data: _data.PcnWeekData.Rejected
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
				categories: _data.PcnWeekData.Categories,
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

		_chart.RejectedChartHeader = new ApexCharts(document.querySelector("#rejected-chart"), options);
		_chart.RejectedChartHeader.render();
	}
	
}

/* APPLICATION CHART */
function CreateApplicationChart() {
	var sum = {
		Approved: 0,
		Pending: 0,
		Rejected: 0
	}

	// Pending
	{
		var container = $('#application-num-pending');

		container.find('[per]').text(`${_data.PcnData.Pending} / ${_data.PcnData.Total}`);
		container.find('[rate]').css('width', `${parseFloat((_data.PcnData.Pending / _data.PcnData.Total) * 100).toFixed(2)}%`);

		var textContainer = container.find('[customer]');

		textContainer.empty();
		$(_data.PcnDataByCustomer).each(function (index, item) {
			var html = `<div class="d-flex align-items-center small">
                           <i class="bi bi-circle-fill fs-6px me-2 text-warning"></i>
                           <div class="flex-1">${item.Customer}</div>
                           <div>${item.Pending}</div>
                       </div>`;
			textContainer.append(html);

			sum.Pending += item.Pending;
		});

		if (sum.Pending != _data.PcnData.Pending) {
			var html = `<div class="d-flex align-items-center small">
						    <i class="bi bi-circle-fill fs-6px me-2 text-warning"></i>
						    <div class="flex-1">UNKNOWN</div>
						    <div>${_data.PcnData.Pending - sum.Pending}</div>
						</div>`;
			textContainer.append(html);
		}
	}

	// Approved
	{
		var container = $('#application-num-approved');

		container.find('[per]').text(`${_data.PcnData.Approved} / ${_data.PcnData.Total}`);
		container.find('[rate]').css('width', `${parseFloat((_data.PcnData.Approved / _data.PcnData.Total) * 100).toFixed(2)}%`);

		var textContainer = container.find('[customer]');


		textContainer.empty();
		$(_data.PcnDataByCustomer).each(function (index, item) {
			var html = `<div class="d-flex align-items-center small">
                           <i class="bi bi-circle-fill fs-6px me-2 text-success"></i>
                           <div class="flex-1">${item.Customer}</div>
                           <div>${item.Approved}</div>
                       </div>`;
			textContainer.append(html);

			sum.Approved += item.Approved;
		});

		if (sum.Approved != _data.PcnData.Approved) {
			var html = `<div class="d-flex align-items-center small">
						    <i class="bi bi-circle-fill fs-6px me-2 text-success"></i>
						    <div class="flex-1">UNKNOWN</div>
						    <div>${_data.PcnData.Approved - sum.Approved}</div>
						</div>`;
			textContainer.append(html);
		}
	}

	// Rejected
	{
		var container = $('#application-num-rejected');

		container.find('[per]').text(`${_data.PcnData.Rejected} / ${_data.PcnData.Total}`);
		container.find('[rate]').css('width', `${parseFloat((_data.PcnData.Rejected / _data.PcnData.Total) * 100).toFixed(2)}%`);

		var textContainer = container.find('[customer]');

		textContainer.empty();
		$(_data.PcnDataByCustomer).each(function (index, item) {
			var html = `<div class="d-flex align-items-center small">
                           <i class="bi bi-circle-fill fs-6px me-2 text-danger"></i>
                           <div class="flex-1">${item.Customer}</div>
                           <div>${item.Rejected}</div>
                       </div>`;
			textContainer.append(html);

			sum.Rejected += item.Rejected;
		});

		if (sum.Rejected != _data.PcnData.Rejected) {
			var html = `<div class="d-flex align-items-center small">
						    <i class="bi bi-circle-fill fs-6px me-2 text-danger"></i>
						    <div class="flex-1">UNKNOWN</div>
						    <div>${_data.PcnData.Rejected - sum.Rejected}</div>
						</div>`;
			textContainer.append(html);
		}
	}

	// Chart
	{
		if (_chart.ApplicationChart) {
			_chart.ApplicationChart.updateOptions({
				series: [
					{
						name: 'PENDING',
						data: _data.PcnMonthOfYearData.Pending
					},
					{
						name: 'APPROVED',
						data: _data.PcnMonthOfYearData.Approved
					},
					{
						name: 'REJECTED',
						data: _data.PcnMonthOfYearData.Rejected
					}],
				xaxis: {
					categories: _data.PcnMonthOfYearData.Date,
				},
			});
		}
		else {
			var options = {
				chart: {
					height: '100%',
					type: 'bar',
					toolbar: {
						show: false
					},
					foreColor: 'rgba(' + app.color.whiteRgb + ', .5)',
				},
				foreColor: '#FFF',
				plotOptions: {
					bar: {
						horizontal: false,
						columnWidth: '55%',
						endingShape: 'rounded',
					},
				},
				zoom: {
					enabled: false
				},

				dataLabels: {
					enabled: false
				},
				grid: {
					show: true,
					borderColor: 'rgba(' + app.color.whiteRgb + ', .15)',
				},
				stroke: {
					width: 1,
					colors: undefined
				},
				colors: [app.color.yellow, app.color.green, app.color.red],
				series: [
					{
						name: 'PENDING',
						data: _data.PcnMonthOfYearData.Pending
					},
					{
						name: 'APPROVED',
						data: _data.PcnMonthOfYearData.Approved
					},
					{
						name: 'REJECTED',
						data: _data.PcnMonthOfYearData.Rejected
					}],
				xaxis: {
					categories: _data.PcnMonthOfYearData.Date,
					labels: {
						rotate: -45,
						rotateAlways: true
					}
				},
				fill: {
					opacity: 0.3
				},
				legend: {
					show: false
				}
			};
			_chart.ApplicationChart = new ApexCharts(document.querySelector('#application-chart'), options);
			_chart.ApplicationChart.render();
		}
		
	}
}

/* DEPARTMENT CHART */
function CreateDepartmentChart() {
	// Chart
	{
		if (_chart.DepartmentChart) {
			_chart.DepartmentChart.updateOptions({
				series: _data.PcnMonthOfYearDataByDepartment.Series,
				xaxis: {
					categories: _data.PcnMonthOfYearDataByDepartment.Categories,
				},
			});
		}
		else {
			var options = {
				chart: {
					height: '100%',
					type: 'area',
					toolbar: {
						show: false
					},
					foreColor: 'rgba(' + app.color.whiteRgb + ', .5)',
				},
				foreColor: '#FFF',
				plotOptions: {
					bar: {
						horizontal: false,
						columnWidth: '55%',
						endingShape: 'rounded',
					},
				},
				zoom: {
					enabled: false
				},

				dataLabels: {
					enabled: false
				},
				grid: {
					show: true,
					borderColor: 'rgba(' + app.color.whiteRgb + ', .15)',
				},
				stroke: {
					width: 1,
					colors: undefined
				},
				series: _data.PcnMonthOfYearDataByDepartment.Series,
				xaxis: {
					categories: _data.PcnMonthOfYearDataByDepartment.Categories,
					labels: {
						rotate: -45,
						rotateAlways: true
					}
				},
				fill: {
					opacity: 0.5
				},
				legend: {
					show: false
				},
			};
			_chart.DepartmentChart = new ApexCharts(document.querySelector('#department-chart'), options);
			_chart.DepartmentChart.render();
		}
		
	}

	// Table
	{
		var sums = _data.PcnMonthOfYearDataByDepartment.Series.map(item => ({
			name: item.name,
			sum: item.data.reduce((acc, curr) => acc + curr, 0),
			ratio: 0
		}));
		sums.sort((a, b) => b.sum - a.sum);

		var totalSum = sums.reduce((acc, curr) => acc + curr.sum, 0);

		sums.forEach(item => {
			item.ratio = parseFloat((item.sum / totalSum) * 100).toFixed(2);
		});

		_data.TotalDepartment = sums;



		_data.Top5Department = sums.slice(0, 5);

		var table = $('#department-tbody');
		table.empty();
		$(_data.Top5Department).each(function (index, item) {
			var html = `<tr>
                            <td class="">${item.name}</td>
                            <td class="text-end">${item.sum}</td>
                            <td class="text-end">${item.ratio}%</td>
                        </tr>`;
			table.append(html);
		});
	}

	// Chart 2
	{
		Categories = [];
		Series = [];
		sums.forEach(item => {
			Categories.push(item.name);
			Series.push(item.sum);
		});

		if (_chart.DepartmentDetailsChart) {
			_chart.DepartmentDetailsChart.updateOptions({
				series: Series,
				labels: Categories,
			});
		}
		else {
			var options = {
				chart: {
					height: '100%',
					type: 'pie',
					foreColor: '#FFF',
					sparkline: {
						enabled: true,
					}
				},
				series: Series,
				labels: Categories,
				dataLabels: {
					enabled: false,
					style: {
						fontSize: '12px',
						fontWeight: 'bold',
					},
				},
				fill: {
					opacity: .5
				},
				legend: {
					show: false
				},
				stroke: {
					width: 1,
					colors: undefined
				},
				
			};

			_chart.DepartmentDetailsChart = new ApexCharts(document.querySelector("#department-details-chart"), options);
			_chart.DepartmentDetailsChart.render();
		}
		
	}
}

/* TABLE */
function CreateTop10PcnTable() {
	var table = $('#top10-pcn-tbody');
	var tableWidth = table.width();

	var maxWidth = 0;

	table.empty();
	$(_data.Top10Pcn).each(function (index, item) {
		var tr = $('<tr></tr>');

		switch (item.Status) {
			case -1:
				tr.append(`<td><span><i class="bi bi-circle-fill fs-6px text-danger"></i></span></td>`);
				break;
			case 1:
				tr.append(`<td><span><i class="bi bi-circle-fill fs-6px text-warning"></i></span></td>`);
				break;
			case 2:
				tr.append(`<td><span><i class="bi bi-circle-fill fs-6px text-success"></i></span></td>`);
				break;
		}

		tr.append(`<td>${item.PCNCode}</td>`);
		tr.append(`<td>${moment(item.CreatedDate).format('YYYY-MM-DD HH:mm')}</td>`);
		tr.append(`<td title="${item.Subject}">${item.Subject}</td>`);

		switch (item.Status) {
			case -1:
				tr.append(`<td><span class="badge d-block bg-danger text-theme-900 rounded-0 pt-5px w-70px" style="min-height: 18px">Rejected</span></td>`);
				break;
			case 1:
				tr.append(`<td><span class="badge d-block bg-warning text-theme-900 rounded-0 pt-5px w-70px" style="min-height: 18px">Pending</span></td>`);
				break;
			case 2:
				tr.append(`<td><span class="badge d-block bg-success text-theme-900 rounded-0 pt-5px w-70px" style="min-height: 18px">Approved</span></td>`);
				break;
		}
	
		var btnAction = $(`<a href="javascript:;" class="text-decoration-none text-white"><i class="bi bi-search"></i></a>`);
		btnAction.click(function () {
			ApplicationDetail(item.PCNID);
		});
		tr.append($('<td></td>').append(btnAction));

		table.append(tr);

		var width = tr.width();
		maxWidth = parseInt(tableWidth * 0.2);
		var tdSubject = tr.find('td:nth-child(4)');
		tdSubject.css('max-width', `${maxWidth}px`);
		tdSubject.addClass('text-table-ellipsis');
		
	});
}
function CreateTop10ActionTable() {
	var table = $('#top10-action-tbody');
	var tableWidth = table.width();

	var maxWidth = 0;

	table.empty();
	$(_data.Top10Action).each(function (index, item) {
		var tr = $('<tr></tr>');

		switch (item.Status) {
			case -1:
				tr.append(`<td><span><i class="bi bi-circle-fill fs-6px text-danger"></i></span></td>`);
				break;
			case 1:
				tr.append(`<td><span><i class="bi bi-circle-fill fs-6px text-warning"></i></span></td>`);
				break;
			case 2:
				tr.append(`<td><span><i class="bi bi-circle-fill fs-6px text-success"></i></span></td>`);
				break;
		}

		tr.append(`<td>${moment(item.Date).format('YYYY-MM-DD HH:mm')}</td>`);
		tr.append(`<td>${item.User.CardId} - ${item.User.Name}</td>`);		
		tr.append(`<td title="${item.PCNCode}">${item.PCNCode}</td>`);

		switch (item.Status) {
			case -1:
				tr.append(`<td><span class="badge d-block bg-danger text-theme-900 rounded-0 pt-5px w-70px" style="min-height: 18px">Rejected</span></td>`);
				break;
			case 1:
				tr.append(`<td><span class="badge d-block bg-warning text-theme-900 rounded-0 pt-5px w-70px" style="min-height: 18px">Pending</span></td>`);
				break;
			case 2:
				tr.append(`<td><span class="badge d-block bg-success text-theme-900 rounded-0 pt-5px w-70px" style="min-height: 18px">Approved</span></td>`);
				break;
		}

		var btnAction = $(`<a href="javascript:;" class="text-decoration-none text-white"><i class="bi bi-search"></i></a>`);
		btnAction.click(function () {
			ApplicationDetail(item.PCNID);
		});
		tr.append($('<td></td>').append(btnAction));

		table.append(tr);

		var width = tr.width();
		if (width > tableWidth) {
			if (maxWidth == 0) {
				maxWidth = parseInt(tableWidth * 0.2);
			}
			var tdSubject = tr.find('td:nth-child(4)');
			tdSubject.css('max-width', `${maxWidth}px`);
			tdSubject.addClass('text-table-ellipsis');
		}

	});
}