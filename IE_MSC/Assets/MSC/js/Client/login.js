var filterReworkSelected = "";

$(document).ready(function () {
    //bindingChartByStatus(filterReworkSelected);
    //bindingChartCreatedByDept(filterReworkSelected);
    //btnShowLoginOnClick();
    //btnBackToDashBoardOnClick();
    //setInterval(function () {
    //    bindingChartByStatus(filterReworkSelected);
    //    bindingChartCreatedByDept(filterReworkSelected);
    //}, 60000);
    $(document).on('click', '#btn-login', function () {
        login();
    })

    //bấm nút enter đăng nhập:
    $('#username, #password').on('keydown', function (event) {
        if (event.keyCode == 13) {

            login();
        }
    });
})

function login() {
    //onload();
    var username = $("#username").val();
    var password = $("#password").val();
    if (!(username.trim())) {
        Swal.fire("Please check again Username!", "Username is not empty!", "warning");
    }
    else {
        if (!(password.trim())) {
            Swal.fire("Please check again Password!", "Password is not empty!", "warning");
        }
        else {

            //ajax calling:
            var data = {};
            data.username = username.trim();
            data.password = password.trim();
            //onload();
            $.ajax({
                type: "POST",
                url: "/Login/CheckLogin",
                data: JSON.stringify(data),
                dataType: "script",//Kieu du lieu tra ve
                contentType: "application/json",
                success: function (response) {
                    //endload();
                },
                error: function (res) {
                    //endload();
                }
            });
        }
    }
}

function bindingChartByStatus(type) {
    //onload();
    $.ajax({
        type: "GET",
        url: "/MSC/GetByFilter",
        data: {
            type: type
        },
        dataType: "text",
        success: function (response) {
            //endload();
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
            //endload();
            Swal.fire("Error", "Do not get input data", "warning");
        }
    });

}

function bindingChartCreatedByDept(type) {
    onload();
    $.ajax({
        type: "GET",
        url: "/MSC/GetCreatedByDept",
        data: {
            type: type
        },
        dataType: "text",
        success: function (response) {
            //endload();
            var dt = JSON.parse(response);
            var lstAllApplication = groupBy(dt, i => i.DeptNameCreated);
            var seriesArray = [];

            for (var item of lstAllApplication) {
                if (item[0].split(',').length<2) {
                    seriesItem = {};
                    seriesItem.name = item[0];
                    seriesItem.y = item[1].length;
                    seriesArray.push(seriesItem);
                }
            }
            Highcharts.chart('pcnByDept', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Created By All Departments',
                    align: 'center'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                accessibility: {
                    point: {
                        valueSuffix: '%'
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        }
                    }
                },
                series: [{
                    name: 'Brands',
                    colorByPoint: true,
                    data: seriesArray
                }]
            });
        },
        error: function (res) {
            //endload();
            Swal.fire("Error", "Do not get input data", "warning");
        }
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

function btnShowLoginOnClick() {
    $('.btn-show-login').click(function () {
        $('.showChart').hide();
        $('.login-showded').fadeIn(500);
    })
}

function btnBackToDashBoardOnClick() {
    $('.btn-back-to-dashboard').click(function () {
        $('.login-showded').hide();
        $('.showChart').fadeIn(500);
    })
}