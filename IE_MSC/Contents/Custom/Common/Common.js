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
        if (error.length < 300) {
            return error;
        }
        else {
            console.error(error);
            return `Something went wrong, please contact to system admin.`;
        }
        
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

/* PCN Common */
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
function GetUserSignDepartment(sign) {
    if (sign && sign.Customer && sign.Department) {
        return `[ ${sign.Customer.CustomerName} - ${sign.Department.DepartmentName} ]`;
    }
    else if (sign.User && sign.User.UserDepartments.length > 0) {
        return GetUserDept(sign.User);
    }
}
function IsUserHasDepartment(departmentName) {
    if (_datas.SessionUser.UserDepartments.some(dept => { return dept.Department.DepartmentName.toUpperCase().includes(departmentName) })) {
        return true;
    }
    else {
        return false;
    }
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
function GetApplicationActiveDate(application) {
    const validSigns = application.Signs.filter(sign => sign.Status == 2);

    if (validSigns.length === 0) {
        return '';
    } else {
        let newestSign = validSigns.reduce((latest, sign) => {
            return moment(sign.DateApproved).isAfter(moment(latest.DateApproved)) ? sign : latest;
        });

        return moment(newestSign.DateApproved).format('YYYY-MM-DD HH:mm');
    }
}



/* Dynamic sign */
function CreateWidgetReminderItem(count) {
    return $(`
        <div class="widget-reminder-item">
            <div class="widget-reminder-time">
                <span class="text-info fw-bold" order>${count}</span>
            </div>
            <div class="widget-reminder-divider bg-info"></div>
            <div class="widget-reminder-content">
                <div class="d-flex justify-content-between">
                    <div class="row w-100">
                        <div class="col-12 mb-2">
                            <div class="d-flex w-100">
                                <select class="form-select me-2" customer></select>
                                <select class="form-select" department></select>
                            </div>
                        </div>
                        <div class="col-12">
                            <select class="form-select" user></select>
                        </div>
                    </div>
                    <button class="btn btn-danger ms-2" delete>
                        <i class="fa-duotone fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `);
}
function PopulateCustomerOptions(selectCustomer) {
    _datas.Customers.forEach((customer) => {
        selectCustomer.append(`<option value="${customer.Id}">${customer.CustomerName}</option>`);
    });
}
function SetupCustomerChangeEvent(selectCustomer, selectDepartment) {
    selectCustomer.change(() => {
        const customer = _datas.Customers.find(customer => customer.Id === selectCustomer.val());
        selectDepartment.empty();
        customer.Departments.forEach((department) => {
            selectDepartment.append(`<option value="${department.Id}">${department.DepartmentName}</option>`);
        });
        selectDepartment.change();
    });
}
function SetupDepartmentChangeEvent(selectCustomer, selectDepartment, selectUser) {
    selectDepartment.change(() => {
        const IdCustomer = selectCustomer.val();
        const IdDepartment = selectDepartment.val();
        const users = _datas.Users.filter(user => {
            return user.UserDepartments.some(dept => {
                return dept.Department.Id === IdDepartment && dept.Department.IdCustomer === IdCustomer;
            });
        });

        selectUser.empty();
        users.forEach((user) => {
            selectUser.append(`<option value="${user.Id}">${GetUserName(user)}</option>`);
        });
    });
}
function SetupWidgetReminderItempDeleteEvent(buttonDelete) {
    buttonDelete.click(function () {
        buttonDelete.closest('.widget-reminder-item').remove();
    });
}
function SetInitialValues(sign, selectCustomer, selectDepartment, selectUser) {
    const initialCustomerId = sign.IdCustomer || sign.User.UserDepartments[0].Department.Customer.Id;
    const initialDepartmentId = sign.IdDepartment || sign.User.UserDepartments[0].Department.Id;
    const initialUserId = sign.IdUser;

    selectCustomer.val(initialCustomerId).change();
    selectDepartment.val(initialDepartmentId).change();
    if (initialUserId) {
        selectUser.val(initialUserId);
    }
}