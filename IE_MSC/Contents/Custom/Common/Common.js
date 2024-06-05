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
        result.lengthMenu = [[6, 15, 25, 50], [6, 15, 25, 50]];
    }
    else if (windowHeight > 768 && windowHeight < 900) {
        result.tableHeight = 45 * 9;
        result.lengthMenu = [[8, 15, 25, 50], [8, 15, 25, 50]];
    }
    else if (windowHeight == 900) {
        result.tableHeight = 45 * 11;
        result.lengthMenu = [[10, 15, 25, 50], [10, 15, 25, 50]]
    }
    else if (windowHeight > 900 && windowHeight < 1080) {
        result.tableHeight = 45 * 13;
        result.lengthMenu = [[12, 15, 25, 50], [12, 15, 25, 50]]
    }
    else {
        result.tableHeight = 45 * 16;
        result.lengthMenu = [[15, 25, 50], [15, 25, 50]]
    }
    return result;
}

/* MSC Common */
function GetUserName(user) {
    if (user) {
        return `${user.CardId}${user.VnName ? ' - ' + user.VnName : ' - ' + user.CnName}`;
    }
    else {
        return 'Unknown';
    }
}
function GetUserDept(user) {
    if (user && user.UserDepartments.length > 0) {
        var depts = [];
        user.UserDepartments.forEach(function (userDepartment) {
            let department = userDepartment.Department;
            depts.push(`[ ${department.Customer.CustomerName} - ${department.DepartmentName} ]`);
        });
        return depts.join(', ');
    }
    else return '';
   
}
function GetApplicationStatus(application) {
    if (!application || !application.Status) {
        return 'Unknown';
    }
    else {
        switch (application.Status) {
            case -1:
                return `Rejected`;
            case 1:
                return `Pending`;
            case 2:
                return `Approved`;
            default:
                return `Unknown`
        }
    }
}
function GetApplicationDepartment(application) {
    if (!application || !application.Department) {
        return 'Unknown (data of old version)';
    }
    else {
        return `${application.Department.DepartmentName} (${application.Customer.CustomerName})`;
    }
}
function GetApplicationActiveDate(application) {
    if (application.Signs.filter(sign => { return sign.Status != 2 }).length > 0) {
        return '';
    }
    else {
        let newestSign = application.Signs[application.Signs.length - 1];
        return moment(newestSign.DateApproved).format('YYYY-MM-DD HH:MM');
    }
}

function GetUserNameObj(user) {
    if (user) {
        return `${user.CardID}${user.VnName ? ' - ' + user.VnName : ' - ' + user.CnName}`;
    }
    else {
        return 'Unknown';
    }
}
function GetUserDeptObj(user) {
    var depts = [];
    user.Departments.forEach(function (department) {
        depts.push(`${department.Customer.CustomerName} - ${department.Department.DepartmentName}`);
    });
    return depts.join(', ');
}