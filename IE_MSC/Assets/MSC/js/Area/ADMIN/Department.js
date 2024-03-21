
var formMode = "add";
var deptID_global;

$(document).ready(function () {
    loadCboCustomer();
    btnAddDepartmentOnClick();
    btnEditDepartmentOnClick();
    loadDataTableDepartment();
    btnSaveDepartmentOnClick();

    // search info
    searchAdmin();
})


function loadCboCustomer() {
    $.ajax({
        type: "Get",
        url: "/Customer/Get",
        success: function (response) {
            try {
                var jsonCustomers = JSON.parse(response);
                $('#customerName').empty();
                if (jsonCustomers) {
                    $('#tblCustomer').empty();
                    for (var item of jsonCustomers) {
                        var option = $(`<option value="${item.CustomerID}">${item.CustomerName}</option>`);
                        $('#customerName').append(option);
                    }
                }
                else {
                    Swal.fire("Load data fail!", "Load combobox Customer fail!", "warning");
                }
            }
            catch (ex) {
                Swal.fire("Call Server Error", "Chưa gọi được đến Server", "error");
            }

        },
        error: function (err) {
            Swal.fire("Chưa lấy được dữ liệu đầu vào! (Input Data Error!)", "Please, Contact CPD-TE_Auto to support. (Phone: 31746)", "error");
        }
    });
}

function loadDataTableDepartment() {
    $.ajax({
        type: "Get",
        url: "/Department/GetAllDepartment",
        success: function (response) {
            try {
                var jsonDepartments = JSON.parse(response);
                $('#tblDepartment').empty();
                for (var item of jsonDepartments) {
                    var trHTML = $(`<tr>
                                    <td>${item.DepartmentID}</td>
                                    <td>${item.DepartmentName}</td>
                                    <td>${item.CustomerName}</td>
                                    <td>${item.CreatedDate}</td>
                                    <td>${item.UpdatedDate}</td>
                                    <td>
                                        <button data-deptid="${item.DepartmentID}" class="btn btn-edit-dept btn-sm btn-secondary">Sửa</button>
                                        <button data-deptid="${item.DepartmentID}" class="btn btn-delete-dept btn-sm btn-danger">Xóa</button>
                                    </td>
                                </tr>`);
                    $('#tblDepartment').append(trHTML);
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

function btnSaveDepartmentOnClick() {
    $(document).on('click', '#btnSaveDepartment', function () {
        var deptName = $('#departmentName').val();
        var customerID = $('#customerName').val();
        if (!deptName.trim() || !customerID.trim()) {
            Swal.fire("Empty!", "Data input is not empty!", "warning");
        }
        else {
            var data = {};
            data.departmentName = deptName;
            data.customerID = customerID;

            if (formMode == 'add') {
                $.ajax({
                    type: "POST",
                    url: "/ADMIN/Department/SaveAfterCreate",
                    data: JSON.stringify(data),
                    dataType: "text",//Kieu du lieu tra ve
                    contentType: "application/json",
                    success: function (response) {
                        if (response == 1) {
                            Swal.fire("Success!", "Created!", "success");
                            $('#modalDepartment').modal('hide');
                            loadDataTableDepartment();

                        }
                        else if (response == 0) {
                            Swal.fire("Existed!", "Department is existed!", "warning");

                        }
                        else {
                            Swal.fire("Server Error!", "Error!", "error");
                        }
                    },
                    error: function (res) {

                        Swal.fire("Data input error", "Error!", "error");
                    }
                });
            }
            if (formMode == 'edit') {
                data.DepartmentID = deptID_global;
                $.ajax({
                    type: "POST",
                    url: "/ADMIN/Department/SaveAfterEdit",
                    data: JSON.stringify(data),
                    dataType: "text",//Kieu du lieu tra ve
                    contentType: "application/json",
                    success: function (response) {
                        if (response == 1) {
                            Swal.fire("Success!", "Edited!", "success");
                            $('#modalDepartment').modal('hide');
                            loadDataTableDepartment();

                        }
                        else if (response == 0) {
                            Swal.fire("Existed!", "Department is existed!", "warning");

                        }
                        else {
                            Swal.fire("Server Error!", "Error!", "error");
                        }
                    },
                    error: function (res) {

                        Swal.fire("Data input error!", "Error!", "error");
                    }
                });
            }
        }

    })
}

function btnAddDepartmentOnClick() {
    $(document).on('click', '#btn-add-dept', function () {
        formMode = "add";
        $('#modalDepartment form').trigger("reset");
        $('#modalDepartment').modal('show');
    });
}

function btnEditDepartmentOnClick() {
    $(document).on('click', '.btn-edit-dept', function () {
        formMode = "edit";
        deptID_global = $(this).data("deptid");

        $.ajax({
            type: "GET",
            url: "/Department/GetById",
            data: {
                departmentID: deptID_global
            },
            dataType: "text",//Kieu du lieu tra ve
            contentType: "application/json",
            success: function (response) {
                if (response) {
                    var jsonDepartment = JSON.parse(response);
                    //binding
                    $('#customerName').val(jsonDepartment.CustomerID);
                    $('#departmentName').val(jsonDepartment.DepartmentName);
                    $('#modalDepartment').modal('show');
                }
                else {
                    Swal.fire("Server Error!", "Error!", "error");
                }
            },
            error: function (res) {

                Swal.fire("Error!", "Error!", "error");
            }
        });
    })
}