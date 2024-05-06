$(document).ready(function () {
    ToartsConfig();
});
function ToartsConfig() {
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
}
function GetAjaxErrorMessage(error) {
    var regex = new RegExp(`<title>(.*?)<\/title>`);
    var match = regex.exec(error.responseText);

    if (match && match.length >= 2) {
        var extractedContent = match[1];
        return extractedContent;
    } else {
        return "Something went wrong, please contact to system admin.";
    }
}
function CalTableHeight() {
    var windowHeight = $(window).height();
    var result = {
        lengthMenu: [[], []],
        tableHeight: 0,
    };

    if (windowHeight <= 768) {
        result.tableHeight = 45 * 7;
        result.lengthMenu = [[6, 15, 25, 50, -1], [6, 15, 25, 50, "All"]];
    }
    else if (windowHeight > 768 && windowHeight < 900) {
        result.tableHeight = 45 * 9;
        result.lengthMenu = [[8, 15, 25, 50, -1], [8, 15, 25, 50, "All"]];
    }
    else if (windowHeight == 900) {
        result.tableHeight = 45 * 11;
        result.lengthMenu = [[10, 15, 25, 50, -1], [10, 15, 25, 50, "All"]]
    }
    else if (windowHeight > 900 && windowHeight < 1080) {
        result.tableHeight = 45 * 13;
        result.lengthMenu = [[12, 15, 25, 50, -1], [12, 15, 25, 50, "All"]]
    }
    else {
        result.tableHeight = 45 * 16;
        result.lengthMenu = [[15, 25, 50, -1], [15, 25, 50, "All"]]
    }
    return result;
}
function GetUserName(user) {
    if (user) {
        return `${user.EmployeeCode}${user.EmployeeVNName ? ' - ' + user.EmployeeVNName : ' - ' + user.EmployeeCNName}`;
    }
    else {
        return 'Unknown';
    }
}
function GetUserNameObj(user) {
    if (user) {
        return `${user.CardID}${user.VnName ? ' - ' + user.VnName : ' - ' + user.CnName}`;
    }
    else {
        return 'Unknown';
    }
} function GetUserDeptObj(user) {
    var depts = [];
    user.Departments.forEach(function (department) {
        depts.push(`${department.Customer.CustomerName} - ${department.Department.DepartmentName}`);
    });
    return depts.join(', ');
}