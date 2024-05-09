var _datas = {};
var _charts = {};
$(document).ready(function () { 

	GetAndInitData();
	
});

async function GetAndInitData() {
	try {
		_datas.HeaderData = await GetHeaderData();
		_datas.WeekData = await GetWeekData();
		CreateHeaderChart();

		_datas.DataByCustomer = await GetDataByCustomer();
		_datas.MonthOfYearData = await GetMonthOfYearData();
		CreateApplicationChart();

		_datas.MonthOfYearDataByDepartment = await GetMonthOfYearDataByDepartment();
		CreateDepartmentChart();
		
		_datas.Top10 = await GetTop10();
		CreateTop10Table();

		_datas.Top10Action = await GetTop10Action();
		CreateTop10ActionTable();

	} catch (e) {
		Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
		console.error(e);
    }
}

/* GET */
function GetHeaderData() {
	console.time("GetHeaderData");
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `/Dashboard/Dashboard/GetHeaderData`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				console.timeEnd("GetHeaderData");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("GetHeaderData");
				reject(error);
			}
		});
	});
}
function GetWeekData() {
	console.time("GetWeekData");
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `/Dashboard/Dashboard/GetWeekData`,
            type: "GET",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
			success: function (res) {
				console.timeEnd("GetWeekData");
				if (res.status) {
                    resolve(res.data);
                }
                else {
                    reject(res.message);
                }
            },
			error: function (error) {
				console.timeEnd("GetWeekData");
                reject(error);
            }
        });
    });
}
function GetDataByCustomer() {
	console.time("GetDataByCustomer");
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `/Dashboard/Dashboard/GetDataByCustomer`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				console.timeEnd("GetDataByCustomer");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("GetDataByCustomer");
				reject(error);
			}
		});
	});
}
function GetMonthOfYearData() {
	console.time("GetMonthOfYearData");
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `/Dashboard/Dashboard/GetMonthOfYearData`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				console.timeEnd("GetMonthOfYearData");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("GetMonthOfYearData");
				reject(error);
			}
		});
	});
}
function GetMonthOfYearDataByDepartment() {
	console.time("GetMonthOfYearDataByDepartment");
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `/Dashboard/Dashboard/GetMonthOfYearDataByDepartment`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				console.timeEnd("GetMonthOfYearDataByDepartment");
				if (res.status) {
					resolve(res.data);
				}
				else {
					console.timeEnd("GetMonthOfYearDataByDepartment");
					reject(res.message);
				}
			},
			error: function (error) {
				reject(error);
			}
		});
	});
}
function GetTop10() {
	console.time("GetTop10");
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `/Dashboard/Dashboard/GetTop10`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				console.timeEnd("GetTop10");
				if (res.status) {					
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("GetTop10");
				reject(error);
			}
		});
	});
}
function GetTop10Action() {
	console.time("GetTop10Action");
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `/Dashboard/Dashboard/GetTop10Action`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				console.timeEnd("GetTop10Action");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("GetTop10Action");
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
	$('#total-num').html(_datas.HeaderData.Total);

	if (_charts.TotalChartHeader) {
		_charts.TotalChartHeader.updateOptions({
			series: [{
				data: _datas.WeekData.Total
			}],
			xaxis: {
				categories: _datas.WeekData.Categories,
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
				data: _datas.WeekData.Total
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
				categories: _datas.WeekData.Categories,
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

		_charts.TotalChartHeader = new ApexCharts(document.querySelector("#total-chart"), options);
		_charts.TotalChartHeader.render();
	}
	
}
function CreatePendingChart() {
	$('#pending-num').html(_datas.HeaderData.Pending);

	if (_charts.PendingChartHeader) {
		_charts.PendingChartHeader.updateOptions({
			series: [{
				data: _datas.WeekData.Pending
			}],
			xaxis: {
				categories: _datas.WeekData.Categories,
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
				data: _datas.WeekData.Pending
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
				categories: _datas.WeekData.Categories,
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

		_charts.PendingChartHeader = new ApexCharts(document.querySelector("#pending-chart"), options);
		_charts.PendingChartHeader.render();
	}
	
}
function CreateApprovedChart() {
	$('#approved-num').html(_datas.HeaderData.Approved);

	if (_charts.ApprovedChartHeader) {
		_charts.ApprovedChartHeader.updateOptions({
			series: [{
				data: _datas.WeekData.Approved
			}],
			xaxis: {
				categories: _datas.WeekData.Categories,
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
				data: _datas.WeekData.Approved
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
				categories: _datas.WeekData.Categories,
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

		_charts.ApprovedChartHeader = new ApexCharts(document.querySelector("#approved-chart"), options);
		_charts.ApprovedChartHeader.render();
	}
	
}
function CreateRejectedChart() {
	$('#rejected-num').html(_datas.HeaderData.Rejected);

	if (_charts.RejectedChartHeader) {
		_charts.RejectedChartHeader.updateOptions({
			series: [{
				data: _datas.WeekData.Rejected
			}],
			xaxis: {
				categories: _datas.WeekData.Categories,
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
				data: _datas.WeekData.Rejected
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
				categories: _datas.WeekData.Categories,
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

		_charts.RejectedChartHeader = new ApexCharts(document.querySelector("#rejected-chart"), options);
		_charts.RejectedChartHeader.render();
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

		container.find('[per]').text(`${_datas.HeaderData.Pending} / ${_datas.HeaderData.Total}`);
		container.find('[rate]').css('width', `${parseFloat((_datas.HeaderData.Pending / _datas.HeaderData.Total) * 100).toFixed(2)}%`);

		var textContainer = container.find('[customer]');

		textContainer.empty();
		$(_datas.DataByCustomer).each(function (index, item) {
			var html = `<div class="d-flex align-items-center small">
                           <i class="bi bi-circle-fill fs-6px me-2 text-warning"></i>
                           <div class="flex-1">${item.Customer}</div>
                           <div>${item.Pending}</div>
                       </div>`;
			textContainer.append(html);

			sum.Pending += item.Pending;
		});

		if (sum.Pending != _datas.HeaderData.Pending) {
			var html = `<div class="d-flex align-items-center small">
						    <i class="bi bi-circle-fill fs-6px me-2 text-warning"></i>
						    <div class="flex-1">UNKNOWN</div>
						    <div>${_datas.HeaderData.Pending - sum.Pending}</div>
						</div>`;
			textContainer.append(html);
		}
	}

	// Approved
	{
		var container = $('#application-num-approved');

		container.find('[per]').text(`${_datas.HeaderData.Approved} / ${_datas.HeaderData.Total}`);
		container.find('[rate]').css('width', `${parseFloat((_datas.HeaderData.Approved / _datas.HeaderData.Total) * 100).toFixed(2)}%`);

		var textContainer = container.find('[customer]');


		textContainer.empty();
		$(_datas.DataByCustomer).each(function (index, item) {
			var html = `<div class="d-flex align-items-center small">
                           <i class="bi bi-circle-fill fs-6px me-2 text-success"></i>
                           <div class="flex-1">${item.Customer}</div>
                           <div>${item.Approved}</div>
                       </div>`;
			textContainer.append(html);

			sum.Approved += item.Approved;
		});

		if (sum.Approved != _datas.HeaderData.Approved) {
			var html = `<div class="d-flex align-items-center small">
						    <i class="bi bi-circle-fill fs-6px me-2 text-success"></i>
						    <div class="flex-1">UNKNOWN</div>
						    <div>${_datas.HeaderData.Approved - sum.Approved}</div>
						</div>`;
			textContainer.append(html);
		}
	}

	// Rejected
	{
		var container = $('#application-num-rejected');

		container.find('[per]').text(`${_datas.HeaderData.Rejected} / ${_datas.HeaderData.Total}`);
		container.find('[rate]').css('width', `${parseFloat((_datas.HeaderData.Rejected / _datas.HeaderData.Total) * 100).toFixed(2)}%`);

		var textContainer = container.find('[customer]');

		textContainer.empty();
		$(_datas.DataByCustomer).each(function (index, item) {
			var html = `<div class="d-flex align-items-center small">
                           <i class="bi bi-circle-fill fs-6px me-2 text-danger"></i>
                           <div class="flex-1">${item.Customer}</div>
                           <div>${item.Rejected}</div>
                       </div>`;
			textContainer.append(html);

			sum.Rejected += item.Rejected;
		});

		if (sum.Rejected != _datas.HeaderData.Rejected) {
			var html = `<div class="d-flex align-items-center small">
						    <i class="bi bi-circle-fill fs-6px me-2 text-danger"></i>
						    <div class="flex-1">UNKNOWN</div>
						    <div>${_datas.HeaderData.Rejected - sum.Rejected}</div>
						</div>`;
			textContainer.append(html);
		}
	}

	// Chart
	{
		if (_charts.ApplicationChart) {
			_charts.ApplicationChart.updateOptions({
				series: [
					{
						name: 'PENDING',
						data: _datas.MonthOfYearData.Pending
					},
					{
						name: 'APPROVED',
						data: _datas.MonthOfYearData.Approved
					},
					{
						name: 'REJECTED',
						data: _datas.MonthOfYearData.Rejected
					}],
				xaxis: {
					categories: _datas.MonthOfYearData.Date,
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
						data: _datas.MonthOfYearData.Pending
					},
					{
						name: 'APPROVED',
						data: _datas.MonthOfYearData.Approved
					},
					{
						name: 'REJECTED',
						data: _datas.MonthOfYearData.Rejected
					}],
				xaxis: {
					categories: _datas.MonthOfYearData.Date,
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
			_charts.ApplicationChart = new ApexCharts(document.querySelector('#application-chart'), options);
			_charts.ApplicationChart.render();
		}
		
	}
}

/* DEPARTMENT CHART */
function CreateDepartmentChart() {
	//let atLeastOneKept = false;

	//_datas.MonthOfYearDataByDepartment.Series = _datas.MonthOfYearDataByDepartment.Series.filter(serie => {
	//	if (Array.isArray(serie)) {
	//		const sum = serie.reduce((total, currentValue) => total + currentValue, 0);
	//		if (sum !== 0 || !atLeastOneKept) {
	//			atLeastOneKept = true;
	//			return true;
	//		}
	//	}
	//	return false;
	//});

	// Chart
	{
		if (_charts.DepartmentChart) {
			_charts.DepartmentChart.updateOptions({
				series: _datas.MonthOfYearDataByDepartment.Series,
				xaxis: {
					categories: _datas.MonthOfYearDataByDepartment.Categories,
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
				series: _datas.MonthOfYearDataByDepartment.Series,
				xaxis: {
					categories: _datas.MonthOfYearDataByDepartment.Categories,
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
			_charts.DepartmentChart = new ApexCharts(document.querySelector('#department-chart'), options);
			_charts.DepartmentChart.render();
		}
		
	}

	// Table
	{
		var sums = _datas.MonthOfYearDataByDepartment.Series.map(item => ({
			name: item.name,
			sum: item.data.reduce((acc, curr) => acc + curr, 0),
			ratio: 0
		}));
		sums.sort((a, b) => b.sum - a.sum);

		var totalSum = sums.reduce((acc, curr) => acc + curr.sum, 0);

		sums.forEach(item => {
			item.ratio = parseFloat((item.sum / totalSum) * 100).toFixed(2);
		});

		_datas.TotalDepartment = sums;



		_datas.Top5Department = sums.slice(0, 5);

		var table = $('#department-tbody');
		table.empty();
		$(_datas.Top5Department).each(function (index, item) {
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

		if (_charts.DepartmentDetailsChart) {
			_charts.DepartmentDetailsChart.updateOptions({
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

			_charts.DepartmentDetailsChart = new ApexCharts(document.querySelector("#department-details-chart"), options);
			_charts.DepartmentDetailsChart.render();
		}
		
	}
}

/* TABLE */
function CreateTop10Table() {
	var table = $('#top10-pcn-tbody');
	var tableWidth = table.width();

	var maxWidth = 0;

	table.empty();
	$(_datas.Top10).each(function (index, item) {
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

		tr.append(`<td>${item.Code}</td>`);
		tr.append(`<td>${moment(item.DateCreated).format('YYYY-MM-DD HH:mm')}</td>`);
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
			ApplicationDetail(item.Id);
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
	$(_datas.Top10Action).each(function (index, item) {
		var tr = $('<tr></tr>');

		switch (item.Status) {
			case -1:
				tr.append(`<td><span><i class="bi bi-circle-fill fs-6px text-danger"></i></span></td>`);
				break;
			case 1:
				tr.append(`<td><span><i class="bi bi-circle-fill fs-6px text-info"></i></span></td>`);
				break;
			case 2:
				tr.append(`<td><span><i class="bi bi-circle-fill fs-6px text-success"></i></span></td>`);
				break;
			default:
				tr.append(`<td><span><i class="bi bi-circle-fill fs-6px text-info"></i></span></td>`);
				break;
		}

		tr.append(`<td>${moment(item.Date).format('YYYY-MM-DD HH:mm')}</td>`);
		tr.append(`<td>${GetUserName(item.User)}</td>`);		
		tr.append(`<td title="${item.Code}">${item.Code}</td>`);

		switch (item.Status) {
			case -1:
				tr.append(`<td><span class="badge d-block bg-danger text-theme-900 rounded-0 pt-5px w-70px" style="min-height: 18px">Rejected</span></td>`);
				break;
			case 1:
				tr.append(`<td><span class="badge d-block bg-info text-theme-900 rounded-0 pt-5px w-70px" style="min-height: 18px">Create</span></td>`);
				break;
			case 2:
				tr.append(`<td><span class="badge d-block bg-success text-theme-900 rounded-0 pt-5px w-70px" style="min-height: 18px">Approved</span></td>`);
				break;
			default:
				tr.append(`<td><span class="badge d-block bg-info text-theme-900 rounded-0 pt-5px w-70px" style="min-height: 18px">Create</span></td>`);
				break;
		}

		var btnAction = $(`<a href="javascript:;" class="text-decoration-none text-white"><i class="bi bi-search"></i></a>`);
		btnAction.click(function () {
			ApplicationDetail(item.Id);
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

			var tdName = tr.find('td:nth-child(3)');
			tdName.css('max-width', `${maxWidth * 1.5}px`);
			tdName.addClass('text-table-ellipsis');
		}

	});
}