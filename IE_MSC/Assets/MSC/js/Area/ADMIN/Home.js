var filterReworkSelected = "today";
$(document).ready(function () {
    //binding4Card();
    bindingChartByStatus(filterReworkSelected);
    bindingChartOverviewAccount();
    liSelectFilterOnClick();


    setInterval(function () {
        //binding4Card();
        bindingChartByStatus(filterReworkSelected);
        bindingChartOverviewAccount();
    }, 60000);
})


function binding4Card() {
    onload();
    $.ajax({
        type: "GET",
        url: "/Rework/Get",
        dataType: "text",
        success: function (response) {
            endload();
            var dt = JSON.parse(response);
            var lstAllApplication = groupBy(dt, i => i.Status);
            var lstApproved = (lstAllApplication.get(1)) ? lstAllApplication.get(1).length : 0;
            var lstRejected = (lstAllApplication.get(-1)) ? lstAllApplication.get(-1).length : 0;
            var lstWaiting = (lstAllApplication.get(0)) ? lstAllApplication.get(0).length : 0;
            $('.totalApplication').text(dt.length);
            $('.totalApproved').text(lstApproved);
            $('.totalRejected').text(lstRejected);
            $('.totalPending').text(lstWaiting);
        },
        error: function (res) {
            endload();
            Swal.fire("Error", "Do not get input data", "warning");
        }
    });
}

function bindingChartByStatus(type) {
    onload();
    $.ajax({
        type: "GET",
        url: "/MSC/GetByFilter",
        data: {
            type: type
        },
        dataType: "text",
        success: function (response) {
            endload();
            var dt = JSON.parse(response);
            var lstAllApplication = groupBy(dt, i => i.Status);
            var lstApproved = (lstAllApplication.get(2)) ? lstAllApplication.get(2).length : 0;
            var lstRejected = (lstAllApplication.get(-1)) ? lstAllApplication.get(-1).length : 0;
            var lstWaiting = (lstAllApplication.get(1)) ? lstAllApplication.get(1).length : 0;

            Highcharts.chart('pcnByStatus', {
                title: {
                    text: `Total Application: <b>${dt.length}</b>`,
                    align: 'center'
                },
                subtitle: {
                    text: `Source: <a style="color: #0d6efd" href="https://10.220.130.117/AboutUs/Index" target="_blank">MBD-IOT</a>`,
                    align: 'center'
                },
                xAxis: {
                    categories: ['Approved', 'Rejected', 'Pending']
                },
                exporting: { enabled: false },
                yAxis: {
                    visible: false
                },
                plotOptions: {
                    column: {
                        stacking: "normal"
                    },
                    series: {
                        borderWidth: 0,
                        //hiện số trên cột
                        dataLabels: {
                            enabled: true,
                            format: '{point.y}'//'{point.y} pcs'
                        }
                    }
                },
                series: [{
                    type: 'column',
                    name: 'Rework Application Quantity',
                    colors: ['#157347', '#dc3545', '#6c757d'],
                    colorByPoint: true,
                    data: [lstApproved, lstRejected, lstWaiting],
                    showInLegend: false
                }]
            });
        },
        error: function (res) {
            endload();
            Swal.fire("Error", "Do not get input data", "warning");
        }
    });

}

function bindingChartOverviewAccount() {
    onload();
    $.ajax({
        type: "GET",
        url: "/Employee/GetAllEmployee",
        success: function (response) {
            endload();
            var dt = JSON.parse(response);
            var lstAllAccount = groupBy(dt, i => i.Status);

            var lstApproved = (lstAllAccount.get(1)) ? lstAllAccount.get(1) : null;
            var lstPending = (lstAllAccount.get(0)) ? lstAllAccount.get(0) : null;

            var lstGroupByDepartment = groupBy(dt, i => i.OwnerDepartmentName);
            var ctgDept = [];
            var seriesCount = [];
            for (var item of lstGroupByDepartment) {
                (item[0]) ? ctgDept.push(item[0]) : ctgDept.push('Admin');
                (item[1]) ? seriesCount.push(item[1].length) : seriesCount.push(0);
            }
            $('.totalAccount').text(dt.length);


            Highcharts.chart('overviewAccount', {
                title: {
                    text: `Total Account: <b>${dt.length}</b>`,
                    align: 'center'
                },
                subtitle: {
                    text: `Source: <a style="color: #0d6efd" href="https://10.220.130.117/AboutUs/Index" target="_blank">MBD-IOT</a>`,
                    align: 'center'
                },
                xAxis: {
                    categories: ctgDept
                },
                exporting: { enabled: false },
                yAxis: {
                    visible: false
                },
                plotOptions: {
                    column: {
                        stacking: "normal"
                    },
                    series: {
                        borderWidth: 0,
                        //hiện số trên cột
                        dataLabels: {
                            enabled: true,
                            format: '{point.y}'//'{point.y} pcs'
                        }
                    }
                },
                series: [{
                    type: 'column',
                    name: 'Quantity user',
                    //colors: ['#157347', '#dc3545', '#6c757d'],
                    colorByPoint: true,
                    data: seriesCount,
                    showInLegend: false
                }]
            });
        },
        error: function (res) {
            endload();
            Swal.fire("Error", "Do not get input data", "warning");
        }
    });
}

function liSelectFilterOnClick() {
    $(document).on('click', '.li-select-filter', function () {
        filterReworkSelected = $(this).data('selected');
        bindingChartByStatus(filterReworkSelected);
        $('.filter-rework-selected').empty();
        (filterReworkSelected == "today") ? $('.filter-rework-selected').append('Today') : ((filterReworkSelected == "last7day") ? $('.filter-rework-selected').append('Last 7 days') : ((filterReworkSelected == "month") ? $('.filter-rework-selected').append('This month') : $('.filter-rework-selected').append('This year')));
    });
}

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}