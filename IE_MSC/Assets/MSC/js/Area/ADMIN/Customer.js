
var formMode = "add";
var customerID_global;

$(document).ready(function () {
    loadDataTableCustomer();
    btnAddCustomerOnClick();
    btnEditCustomerOnClick();
    btnSaveCustomerOnClick();

    // search info
    searchAdmin();
})

function loadDataTableCustomer() {
    $.ajax({
        type: "Get",
        url: "/Customer/Get",
        success: function (response) {
            try {
                var jsonCustomers = JSON.parse(response);
                if (jsonCustomers) {
                    $('#tblCustomer').empty();
                    for (var item of jsonCustomers) {
                        var trHTML = $(`<tr>
                                    <td>${item.CustomerID}</td>
                                    <td>${item.CustomerName}</td>
                                    <td>${item.Description}</td>
                                    <td>${item.CreatedDate}</td>
                                    <td>${item.UpdatedDate}</td>
                                    <td>
                                        <button data-customerid="${item.CustomerID}" class="btn btn-sm btn-secondary btn-edit-Customer">Sửa</button>
                                        <button data-customerid="${item.CustomerID}" class="btn btn-sm btn-danger btn-delete-Customer">Xóa</button>
                                    </td>
                                </tr>`);
                        $('#tblCustomer').append(trHTML);
                    }
                }
                else {
                    Swal.fire("No data!", "Back end no data!", "warning");
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

function btnAddCustomerOnClick() {
    $(document).on('click', '#btnAddCustomer', function () {
        formMode = "add";
        $('#modalCustomer form').trigger("reset");
        $('#modalCustomer').modal('show');
    })
}

function btnEditCustomerOnClick() {
    $(document).on('click', '.btn-edit-Customer', function () {
        formMode = "edit";
        customerID_global = $(this).data("customerid");

        $.ajax({
            type: "GET",
            url: "/Customer/GetById",
            data: {
                customerID: customerID_global
            },
            dataType: "text",//Kieu du lieu tra ve
            contentType: "application/json",
            success: function (response) {
                if (response) {
                    var jsonCustomer = JSON.parse(response);
                    //binding
                    $('#customerName').val(jsonCustomer.CustomerName);
                    $('#customerDescription').val(jsonCustomer.Description);
                    $('#modalCustomer').modal('show');
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

function btnSaveCustomerOnClick() {
    $(document).on('click', '#btnSaveCustomer', function () {
        var customerName = $('#customerName').val();
        var customerDescription = $('#customerDescription').val();

        if (!customerName.trim()) {
            Swal.fire("Empty!", "Customer name is not empty!", "warning");
        }
        else {
            var data = {};
            data.customerName = customerName.trim();
            data.customerDescription = customerDescription;

            if (formMode == 'add') {
                $.ajax({
                    type: "POST",
                    url: "/ADMIN/Customer/SaveAfterCreate",
                    data: JSON.stringify(data),
                    dataType: "text",//Kieu du lieu tra ve
                    contentType: "application/json",
                    success: function (response) {
                        if (response == 1) {
                            Swal.fire("Success!", "Created!", "success");
                            $('#modalCustomer').modal('hide');
                            loadDataTableCustomer();
                        }
                        else if (response == 0) {
                            Swal.fire("Existed!", "Customer is existed!", "warning");

                        }
                        else {
                            Swal.fire("Server Error!", "Error!", "error");
                        }
                    },
                    error: function (res) {

                        Swal.fire("Data Input Error", "Error!", "error");
                    }
                });
            }
            if (formMode == 'edit') {
                data.customerId = customerID_global;
                $.ajax({
                    type: "POST",
                    url: "/ADMIN/Customer/SaveAfterEdit",
                    data: JSON.stringify(data),
                    dataType: "text",//Kieu du lieu tra ve
                    contentType: "application/json",
                    success: function (response) {
                        if (response == 1) {
                            Swal.fire("Success!", "Edited!", "success");
                            $('#modalCustomer').modal('hide');
                            loadDataTableCustomer();
                        }
                        else if (response == 0) {
                            Swal.fire("Existed!", "Customer is existed!", "warning");

                        }
                        else {
                            Swal.fire("Server Error!", "Error!", "error");
                        }
                    },
                    error: function (res) {

                        Swal.fire("Data Input Error!", "Error!", "error");
                    }
                });
            }
        }

    })
}


