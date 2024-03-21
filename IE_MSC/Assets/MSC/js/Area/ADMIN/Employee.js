var formMode = "add";
var deptID_global;
var empAppoint_global;

var checkEmployee;

// Thông tin hữu ích từ API
var empAPI;
var employeeCNNameAPI;
var deptAPI;
var hireDateAPI;
var genderAPI;

var empIDEdit;
$(document).ready(function () {

    loadDataTableEmployee();
    btnCheckEmployeeCodeOnClick();
    btnAddEmployeeOnClick();
    btnEditEmployeeOnClick();
    btnSaveEmployeeOnClick();

    // search info
    searchAdmin();

    // bổ nhiệm
    btnAppointEmployeeOnclick();
    btnSaveAppointEmployeeOnClick();
})

// Manage Employee //
function loadDataTableEmployee() {
    $.ajax({
        type: "Get",
        url: "/Employee/GetAllEmployee",
        success: function (response) {
            try {
                endload();
                var jsonEmployees = JSON.parse(response);
                $('#tblEmployee').empty();
                for (var item of jsonEmployees) {
                    var trHTML = $(`<tr>
                                        <td>${item.EmployeeID}</td>
                                        <td>${item.EmployeeCode}</td>
                                        <td>${item.EmployeeCNName}</td>
                                        <td>${item.EmployeeVNName}</td>
                                        <td>${item.HireDate}</td>
                                        <td>${(item.Email) ? item.Email : `chưa có email`}</td>
                                        <td>${(item.IsAdmin) ? `Admin` : ((item.IsBoss) ? `Boss` : ``)}</td>
                                        <td>${(item.LstDepartment.length == 0) ? `N/A` : ((item.LstDepartment.map(a => a.DepartmentName).toString()))}</td>
                                        <td>
                                            <button data-employeeid="${item.EmployeeID}" class="btn btn-sm btn-success btn-appoint-employee">Bổ nhiệm</button>
                                            <button data-employeeid="${item.EmployeeID}" class="btn btn-sm btn-secondary btn-edit-employee">Sửa</button>
                                            <button data-employeeid="${item.EmployeeID}" class="btn btn-sm btn-danger btn-delete-employee">Xóa</button>
                                        </td>
                                    </tr>`);
                    $('#tblEmployee').append(trHTML);
                }
            }
            catch (ex) {
                endload();
            }

        },
        error: function (err) {
            Swal.fire("Chưa lấy được dữ liệu đầu vào! (Input Data Error!)", "Please, Contact CPD-TE_Auto to support. (Phone: 31746)", "error");
        }
    });
}

function employeeCodeOnChange() {
    $("#employeeCode").on('change', function () {
        getInforByEmployeeCode();
    })

}

function btnCheckEmployeeCodeOnClick() {
    $('#btn-check-employeeCode').click(function () {
        getInforByEmployeeCode();
    })
}

function btnAddEmployeeOnClick() {
    $(document).on('click', '#btn-add-employee', function () {
        formMode = 'add';
        $('#modalEmployee form').trigger('reset');
        $('#employeeCode').prop("disabled", false);
        $('#btn-check-employeeCode').show();
        $('.apiDeptName').empty();
        $('.apiGender').empty();
        $('.apiHireDate').empty();
    })
}

function btnEditEmployeeOnClick() {
    $(document).on('click', '.btn-edit-employee', function () {
        formMode = "edit";
        empIDEdit = $(this).data('employeeid');
        $('#btnSaveEmployee').attr('data-employeeid', empIDEdit);
        $.ajax({
            type: "POST",
            url: "/Employee/GetById",
            data: {
                employeeID: empIDEdit
            },
            success: function (response) {
                try {
                    employee = JSON.parse(response);
                    if (employee) {
                        //binding:
                        $('#employeeCode').val(employee.EmployeeCode); $('#employeeCode').prop("disabled", true);
                        $('#btn-check-employeeCode').hide();
                        $('.apiDeptName').text(employee.DepartmentByAPI);
                        $('#employeeVNName').val(employee.EmployeeVNName);
                        $('#username').val(employee.Username);
                        $('#password').val(employee.Password);
                        $('#email').val(employee.Email);
                        $('#deskphone').val(employee.DeskPhone);
                        $('#selectDepartment').val(employee.DepartmentId);
                        $('#selectPosition').val(employee.Position);

                        //show modal:
                        $('#modalEmployee').modal('show');
                        //$('.apiDeptName').empty(); $('.apiDeptName').append(empAPI.DEPARTMENT_NAME);
                        $('.apiGender').empty(); (employee.Gender == 1) ? $('.apiGender').append('Nam') : $('.apiGender').append('Nữ');
                        $('.apiHireDate').empty(); $('.apiHireDate').append(employee.HireDate);

                        // binding
                        hireDateAPI = employee.HireDate;
                        employeeCNName = employee.EmployeeCNName;
                        genderAPI = (employee.Gender == 1) ? '男' : '女';
                    }
                    else {
                        Swal.fire("Error!", "Mã thẻ không hợp lệ!", "error");
                    }
                }
                catch (ex) {

                }

            },
            error: function (err) {
                Swal.fire("Chưa lấy được dữ liệu đầu vào! (Input Data Error!)", "Please, Contact CPD-TE_Auto to support. (Phone: 31746)", "error");
            }
        });
    });
}

function btnSaveEmployeeOnClick() {
    $(document).on('click', '#btnSaveEmployee', function () {
        // lấy từ API mapping với backend:

        var employeeCode = $('#employeeCode').val().trim();
        var username = $('#username').val().trim();
        var password = $('#password').val().trim();
        var email = $('#email').val().trim();
        var deskphone = $('#deskphone').val().trim();
        var position = $('#selectPosition').val();//1: Director, 0: Admin, 2: (Normal: ViceDirector, Leader, Employee)
        //var customerID = $('#selectCustomer').val();
        //var departmentID = $('#selectDepartment').val();
        var employeeCNName = employeeCNNameAPI;
        var employeeVNName = $('#employeeVNName').val();
        var gender = (genderAPI == '男') ? 1 : 0;
        var hireDate = hireDateAPI;
        var departmentAPI = deptAPI;
        

        if (!username) {
            Swal.fire("Error!", "Press your username, please!", "error");
        }
        else if (!password) {
            Swal.fire("Error!", "Press your password, please!", "error");
        }
        else {
            var data = {};
            data.EmployeeCode = employeeCode;
            data.EmployeeCNName = employeeCNName;
            data.Username = username;
            data.Password = password;
            data.Email = email;
            data.DeskPhone = deskphone;
            //data.DepartmentID = departmentID;
            data.Position = position;
            data.EmployeeVNName = (employeeVNName.trim()) ? (employeeVNName.trim()):"";
            data.Gender = gender;
            data.HireDate = hireDate;
            data.DepartmentAPI = departmentAPI;
            //data.CustomerID = customerID;

            if (formMode == 'add') {
                if (checkEmployee == true) {
                    $.ajax({
                        type: "POST",
                        url: "/ADMIN/Employee/SaveEmployeeAfterCreate",
                        data: JSON.stringify(data),
                        dataType: "text",//Kieu du lieu tra ve
                        contentType: "application/json",
                        success: function (response) {
                            if (response == 1) {
                                Swal.fire("Success!", "Created!", "success");
                                $('#modalEmployee').modal('hide');
                                loadDataTableEmployee();
                            }
                            else if (response == 0) {
                                Swal.fire("Create Fail!", "Đã có mã thẻ trong hệ thống!", "warning");
                            }
                            else {
                                Swal.fire("Error!", "Server Error!", "error");
                            }
                        },
                        error: function (res) {


                        }
                    });
                }
                else {
                    Swal.fire("Error!", "Mã thẻ không hợp lệ!", "error");
                }
            }
            if (formMode == 'edit') {
                data.EmployeeID = empIDEdit;
                $.ajax({
                    type: "POST",
                    url: "/ADMIN/Employee/SaveEmployeeAfterEdit",
                    data: JSON.stringify(data),
                    dataType: "text",//Kieu du lieu tra ve
                    contentType: "application/json",
                    success: function (response) {
                        if (response == 1) {
                            Swal.fire("Success!", "Edited!", "success");
                            $('#modalEmployee').modal('hide');
                            formMode = "add";
                            loadDataTableEmployee();
                        }
                        else {
                            Swal.fire("Error!", "Server Error!", "error");
                        }
                    },
                    error: function (res) {


                    }
                });
            }
        }

    })
} 


// Bổ nhiệm:
function btnAppointEmployeeOnclick() {
    $(document).on('click', '.btn-appoint-employee', function () {
        empAppoint_global = $(this).data('employeeid');
        $.ajax({
            type: "POST",
            url: "/Employee/GetById",
            data: {
                employeeID: empAppoint_global
            },
            success: function (response) {
                try {
                    employee = JSON.parse(response);
                    if (employee) {
                        //binding:
                        $('.appoint-code').text(employee.EmployeeCode);
                        $('.appoint-CNName').text(employee.EmployeeCNName);
                        $('.appoint-VNName').text(employee.EmployeeVNName);
                        if (employee.IsBoss == true) {
                            loadSelectCustomer();
                            $('.displayCustomerAppoint').show();
                            $('.displayDepartmentAppoint').hide();

                        } else {
                            if (employee.IsAdmin == true) {
                                $('.displayCustomerAppoint').hide();
                                $('.displayDepartmentAppoint').hide();
                            } else {
                                loadSelectDepartment();
                                $('.displayCustomerAppoint').hide();
                                $('.displayDepartmentAppoint').show();
                            }
                        }
                        
                        //show modal:
                        $('#modalAppoint').modal('show');

                    }
                    else {
                        Swal.fire("Error!", "Không lấy được thông tin employee!", "error");
                    }
                }
                catch (ex) {

                }

            },
            error: function (err) {
                Swal.fire("Chưa lấy được dữ liệu đầu vào! (Input Data Error!)", "Please, Contact CPD-TE_Auto to support. (Phone: 31746)", "error");
            }
        });
    })
}

function btnSaveAppointEmployeeOnClick() {
    $(document).on('click', '#btnSaveAppointEmployee', function () {
        var employeeID = empAppoint_global;
        var departmentID = $('#selectDepartmentAppoint').val();

        $.ajax({
            type: "POST",
            url: "/Admin/Employee/AppointToDepartment",
            data: {
                employeeID: employeeID,
                departmentID: departmentID
            },
            success: function (response) {
                try {
                    if (response == 1) {
                        Swal.fire("Success!", "Appointed!", "success");
                        $('#modalAppoint').modal('hide');
                        loadDataTableEmployee();
                    }
                    else if (response == 0) {
                        Swal.fire("Appoint Fail!", "Đã có trong phòng ban!", "warning");
                    }
                    else {
                        Swal.fire("Error!", "Server Error!", "error");
                    }
                }
                catch (ex) {
                    Swal.fire("Server Error!", "Server Error!", "error");
                }

            },
            error: function (err) {
                Swal.fire("Chưa lấy được dữ liệu đầu vào! (Input Data Error!)", "Please, Contact CPD-TE_Auto to support. (Phone: 31746)", "error");
            }
        });
    })
}


// Hàm lấy thông tin employee từ api
function getInforByEmployeeCode() {
    var empCode = $('#employeeCode').val();
    var URL = `http://10.224.69.100:8080/postman/api/hr/getEmpObj?id=${empCode}`;
    $.ajax({
        type: "POST",
        url: "/Employee/GetByAPI",
        data: {
            url: URL
        },
        success: function (response) {
            try {
                empAPI = JSON.parse(response);
                if (empAPI) {
                    checkEmployee = true;
                    $('.apiDeptName').empty(); $('.apiDeptName').append(empAPI.DEPARTMENT_NAME);
                    $('.apiGender').empty(); $('.apiGender').append(empAPI.SEX);
                    $('.apiHireDate').empty(); $('.apiHireDate').append(empAPI.HIREDATE);
                    employeeCNNameAPI = empAPI.USER_NAME;
                    deptAPI = empAPI.DEPARTMENT_NAME;
                    hireDateAPI = empAPI.HIREDATE;
                    genderAPI = empAPI.SEX;
                }
                else {
                    checkEmployee = false;
                    $('.apiDeptName').empty();
                    $('.apiGender').empty(); 
                    $('.apiHireDate').empty();
                    Swal.fire("Error!", "Mã thẻ không hợp lệ!", "error");
                }
            }
            catch (ex) {

            }

        },
        error: function (err) {
            Swal.fire("Chưa lấy được dữ liệu đầu vào! (Input Data Error!)", "Please, Contact CPD-TE_Auto to support. (Phone: 31746)", "error");
        }
    });
}


// load select customer, department:
function loadSelectCustomer() {
    $.ajax({
        type: "Get",
        url: "/Customer/Get",
        async: false,
        success: function (response) {
            try {
                var jsonCustomers = JSON.parse(response);
                $('#selectCustomerAppoint').empty();
                for (var item of jsonCustomers) {
                    var option = $(`<option value="${item.CustomerID}">${item.CustomerName}</option>`);
                    $('#selectCustomerAppoint').append(option);
                }
            }
            catch (ex) {

            }

        },
        error: function (err) {
            Swal.fire("Chưa lấy được dữ liệu đầu vào! (Input Data Error!)", "Please, Contact CPD-TE_Auto to support. (Phone: 31746)", "error");
        }
    });
}

function loadSelectDepartment() {
    $.ajax({
        type: "Get",
        url: "/Department/GetAllDepartment",
        async: false,
        success: function (response) {
            try {
                var jsonDepartments = JSON.parse(response);
                $('#selectDepartmentAppoint').empty();
                for (var item of jsonDepartments) {
                    var option = $(`<option value="${item.DepartmentID}">${item.DepartmentName} - ${item.CustomerName}</option>`);
                    $('#selectDepartmentAppoint').append(option);
                }
            }
            catch (ex) {

            }

        },
        error: function (err) {
            Swal.fire("Chưa lấy được dữ liệu đầu vào! (Input Data Error!)", "Please, Contact CPD-TE_Auto to support. (Phone: 31746)", "error");
        }
    });
}