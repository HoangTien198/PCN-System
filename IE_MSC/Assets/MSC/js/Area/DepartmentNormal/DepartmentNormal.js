var lstSubmit = [];

var jqteEditor = [];
var formMode = "add";
var jqteItem;
var mscIdEdit;
$(document).ready(function () {
    setInterval(function () {
        checkSession();
    }, 5000);    

    

    onload();
    loadDataTableMSC();
    //searchMSC();
    loadQuillEditor();

    btnAddMSCOnClick();
    btnEditMSCOnClick();
    btnSaveOnClick();
    btnDetailMSCOnClick();

    btnSignOnClick();
    btnRejectMSCOnclick();
    navItemOnClick();

    // on change
    onChangeCboCustomer();
    onChangeCboDepartment();
    onChangeCboEmployee();

    // drag and drop
    btnAddToTblSubmit();
    btnDeleteDragItemOnClick();

    
})


function loadQuillEditor() {
    var Editors = ['#editorBeforeChangeDescription', '#editorAfterChangeDescription', '#editorReason', '#editorCalculateCost'];
    
    for (var item of Editors) {
        jqteItem = $(`${item}`).jqte();
        jqteEditor.push(jqteItem);
    }
    
}

function btnAddMSCOnClick() {
    $(document).on('click', '#addMSC', function () {
        //gán formMode:
        formMode = "add";
        //reset các giá trị input
        $('#formMSC').trigger('reset');

        //load Customer
        loadCboCustomer();

        $(".jqte_editor").jqteVal("");
        $('.loadFileBefore').empty();
        $('.loadFileAfter').empty();

        $('.departmentBinding').text()
        //show modal:
        $('#add-msc-modal').modal('show');
        
    })
}

function btnEditMSCOnClick() {
    $(document).on('click', '.btn-edit-msc', function () {
        formMode = 'edit';
        //gán id:
        mscIdEdit = $(this).data('mscid');
        //reset các giá trị input
        $('#formMSC').trigger('reset');
        //binding data:
        var mscID = $(this).data('mscid');
        //gán id:
        mscIdEdit = $(this).data('mscid');
        $.ajax({
            type: "GET",
            url: "/MSC/GetById",
            data: {
                pcnID: mscID
            },
            dataType: "text",//Kieu du lieu tra ve
            contentType: "application/json",
            success: function (response) {
                var jsonResult = JSON.parse(response);
                // binding data lên modal
                $('.recommendedByName').empty(); $('.recommendedByName').append(`${jsonResult.RecommendedByName}`)
                $('.mscCodeDetail').empty(); $('.mscCodeDetail').append(`${jsonResult.MSCCode}`)
                $('.recommendedDate').empty(); $('.recommendedDate').append(`${jsonResult.DatetimeYYYYMMDD}`)
                $('.userDepartment').empty(); $('.userDepartment').append(jsonResult.RecommendedByDepartment);
                $('#subject').val(jsonResult.Subject);
                //$('.mscCodeDetail').empty(); $('.mscCodeDetail').append(`${jsonResult.MSCCode}`)
                $('.loadFileBefore').empty(); (jsonResult.BeforeChangeFile) ? $('.loadFileBefore').append(`<a target="_blank" href="/Assets/Media/FileMSC/${jsonResult.BeforeChangeFile}">${jsonResult.BeforeChangeFile}</a>`) : $('.loadFileBefore').append('No file!');
                $('.loadFileAfter').empty(); (jsonResult.AfterChangeFile) ? $('.loadFileAfter').append(`<a target="_blank" href="/Assets/Media/FileMSC/${jsonResult.AfterChangeFile}">${jsonResult.AfterChangeFile}</a>`) : $('.loadFileAfter').append('No file!');

                $('#processTitle').val(jsonResult.ProcessTitle);
                $('#modelTitle').val(jsonResult.ModelTitle);
                $("#editorBeforeChangeDescription").jqteVal(`${jsonResult.BeforeChangeDescription}`)
                $("#editorAfterChangeDescription").jqteVal(`${jsonResult.AfterChangeDescription}`)
                $("#editorCalculateCost").jqteVal(`${jsonResult.CalculateCost}`);
                $("#editorReason").jqteVal(`${jsonResult.Reason}`)

                //binding drag:
                loadCboCustomer();
                loadCboDepartment();
                loadCboEmployee();

                $('.drag-sort-enable').empty();
                lstSubmit = [];
                onload();
                for (var item of jsonResult.LstOwnerStatus) {
                    lstSubmit.push({
                        EmployeeID: item.EmployeeID,
                        EmployeeName: item.EmployeeCNName + "-" + item.EmployeeVNName 
                    })
                }

                for (var item of lstSubmit) {
                    $('.drag-sort-enable').append(`<li data-employeeid="${item.EmployeeID}">${item.EmployeeName}
                                                        <span class="btn-drag-li">
                                                            <button title="Delete" class="btn btn-sm btn-danger btn-delete-drop"><i class="bi bi-trash"></i></button>
                                                        </span>
                                                    </li>`);
                }
                enableDragSort('drag-sort-enable');
                endload();
                $('#add-msc-modal').modal('show');
            },
            error: function (res) {
                Swal.fire("Data input Error!", "Please, Contact CPD-TE_Auto to support! (Phone: 31746)", "error");
            }
        });
    })
}

function btnSaveOnClick() {
    $(document).on('click', '#btn-save-MSC', function () {
        //data input:
        var subject = $('#subject').val();
        var processTitle = $('#processTitle').val();
        var modelTitle = $('#modelTitle').val();
        var beforeChangeDescription = $("#editorBeforeChangeDescription").val();
        var afterChangeDescription = $("#editorAfterChangeDescription").val();
        var reason = $("#editorReason").val();

        //get list owner selected:
        var lstOwnerSelected = [];//các phòng ban liên quan
        var arrDagAndDrop = $('.drag-sort-enable li');
        var stt = 0;
        for (var cb of arrDagAndDrop) {
            stt++;
            var item1 = {};
            item1.EmployeeID = $(cb).data("employeeid");
            item1.SortOrder = parseInt(stt);
            lstOwnerSelected.push(item1)
        }
        var beforeChangeFile = $('#beforeFile').get(0).files;
        var afterChangeFile = $('#afterFile').get(0).files;

        //validate data:
        if (!subject.trim()) {
            Swal.fire("Input data error!", "Check again input 主題 Chủ đề!", "warning");
        }
        else {
            if (!processTitle.trim()) {
                Swal.fire("Input data error!", "Check again input Process!", "warning");
            }
            else {
                if (!modelTitle.trim()) {
                    Swal.fire("Input data error!", "Check again input Model!", "warning");
                }
                else {
                    if (beforeChangeDescription.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
                        Swal.fire("Input data error!", "Check again 現行作業方式 Phương thức làm việc hiện hành!", "warning");
                    }
                    else {
                        if (afterChangeDescription.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
                            Swal.fire("Input data error!", "Check again 變更后的方式 Phương thức sau khi thay đổi!", "warning");
                        }
                        else {
                            if (!reason.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
                                Swal.fire("Input data error!", "Check again 變更原因 Nguyên nhân thay đổi!", "warning");
                            }
                            else {
                                var data = new FormData;

                                if (beforeChangeFile) {
                                    data.append("BeforeChangeFile", beforeChangeFile[0]);
                                }
                                if (afterChangeFile) {
                                    data.append("AfterChangeFile", afterChangeFile[0]);
                                }
                                data.append("Subject", subject);
                                data.append("ProcessTitle", processTitle);
                                data.append("ModelTitle", modelTitle);
                                data.append("BeforeChangeDescription", btoa(unescape(encodeURIComponent(beforeChangeDescription))));
                                data.append("AfterChangeDescription", btoa(unescape(encodeURIComponent(afterChangeDescription))));
                                data.append("Reason", btoa(unescape(encodeURIComponent(reason))));

                                data.append("LstOwnerSelected", JSON.stringify({ "LstOwnerSelected": lstOwnerSelected }));
                                if ($('#selectedSendToBoss').prop("checked")) {
                                    data.append("SendToBoss", true);
                                }   
                                onload();

                                // post data
                                if (formMode == "add") {
                                    debugger
                                    //Ajax:
                                    $.ajax({
                                        type: "Post",
                                        url: "/DepartmentNormal/MSC/SaveMSCAfterCreate",
                                        data: data,
                                        contentType: false,
                                        processData: false,
                                        success: function (response) {
                                            if (response) {
                                                // thành công
                                                endload();
                                                $('#add-msc-modal #formMSC').trigger("reset");
                                                $('#add-msc-modal').modal("hide");
                                                loadDataTableMSC();
                                                if (response == '1') {
                                                    Swal.fire("Success!", `Create and Send Mail success`, "success");
                                                }
                                                else {
                                                    Swal.fire("Error!", `Error Send Mail`, "error");
                                                }
                                                lstSubmit = [];
                                            }
                                            else {
                                                endload();
                                                Swal.fire("Error!", `Create MSC Error! Press CTRL + F5 and submit form again or Contact CPD-TE_Auto to support! (Phone: 31746)`, "error");
                                            }
                                        },
                                        error: function (xhr, status, error) {

                                            endload();
                                            Swal.fire("Server Error!", "Please, Contact CPD-TE_Auto to support! (Phone: 31746)", "error");
                                        }
                                    });
                                }

                                // bấm Save sau khi sửa:
                                if (formMode == "edit") {
                                    data.append("PCNID", mscIdEdit);
                                    $.ajax({
                                        type: "Post",
                                        url: "/DepartmentNormal/MSC/SaveMSCAfterEdit",
                                        data: data,
                                        contentType: false,
                                        processData: false,
                                        success: function (response) {
                                            if (response) {
                                                // thành công
                                                endload();
                                                $('#add-msc-modal #formMSC').trigger("reset");
                                                $('#add-msc-modal').modal("hide");
                                                loadDataTableMSC();
                                                if (response == '1') {
                                                    Swal.fire("Success!", `Edited success`, "success");
                                                } else
                                                if (response == 'Not authorized') {
                                                    Swal.fire("Warning!", `You are not allowed to edit`, "warning");
                                                }
                                                else {
                                                    Swal.fire("Error!", `Send Mail Error`, "error");
                                                }
                                            }
                                            else {
                                                endload();
                                                Swal.fire("Error!", `Edit MSC Error! Press CTRL + F5 and submit form again or Contact CPD-TE_Auto to support! (Phone: 31746)`, "error");
                                            }
                                        },
                                        error: function (xhr, status, error) {

                                            endload();
                                            Swal.fire("Server Error!", "Please, Contact CPD-TE_Auto to support! (Phone: 31746)", "error");
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

function loadCboCustomer() {
    $.ajax({
        type: "Get",
        url: "/Customer/Get",
        success: function (response) {
            try {
                var jsonCustomers = JSON.parse(response);

                $('#customerCbo').empty();
                if (jsonCustomers) {
                    for (const item of jsonCustomers) {
                        var opt = $(`<option value="${item.CustomerID}">${item.CustomerName}</option>`);
                        $('#customerCbo').append(opt);
                        $("#customerCbo").selectpicker("refresh");
                    }
                    $('.selectpicker').selectpicker("reder");
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

function loadCboDepartment() {
    var cusID = $('#customerCbo').val();
    $.ajax({
        type: "Get",
        url: "/Department/GetByCustomerID",
        data: {
            customerID: cusID
        },
        async: false,
        success: function (response) {
            try {
                var jsonDepartments = JSON.parse(response);
                $('#departmentCbo').empty();
                if (jsonDepartments) {
                    for (const item of jsonDepartments) {
                        var opt = $(`<option value="${item.DepartmentID}">${item.DepartmentName}</option>`);
                        $('#departmentCbo').append(opt);
                        $("#departmentCbo").selectpicker("refresh");
                    }
                    $('.selectpicker').selectpicker("reder");
                }
                else {
                    Swal.fire("Load data fail!", "Load combobox Department fail!", "warning");
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

function loadCboEmployee(){
    var deptID = $('#departmentCbo').val();
    $.ajax({
        type: "Get",
        url: "/Employee/GetByDepartmentID",
        data: {
            departmentID: deptID
        },
        async: false,
        success: function (response) {
            try {
                var jsonEmployees = JSON.parse(response);
                $('#employeeCbo').empty();
                if (jsonEmployees) {
                    for (const item of jsonEmployees) {
                        if (item.Position < 4) {
                            var opt = $(`<option value="${item.EmployeeID}">${item.EmployeeCNName}-${item.EmployeeVNName}</option>`);
                            $('#employeeCbo').append(opt);
                            $("#employeeCbo").selectpicker("refresh");
                        }
                    }
                    $('.selectpicker').selectpicker("reder");
                }
                else {
                    Swal.fire("Load data fail!", "Load combobox employee fail!", "warning");
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

function loadLabelMailTo() {
    var empID = $('#employeeCbo').val();
    $.ajax({
        type: "Get",
        url: "/Employee/GetById",
        data: {
            employeeID: empID
        },
        async: false,
        success: function (response) {
            try {
                var jsonEmployee = JSON.parse(response);
                if (jsonEmployee) {
                    $('#mailTo').empty();
                    $('#mailTo').text(jsonEmployee.Email);
                }
                else {
                    Swal.fire("Load data fail!", "Load combobox employee fail!", "warning");
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

// onchange:
function onChangeCboCustomer() {
    $('#customerCbo').on('change', function () {
        loadCboDepartment();
    });
}
function onChangeCboDepartment() {
    $('#departmentCbo').on('change', function () {
        loadCboEmployee();
    });
}
function onChangeCboEmployee() {
    $('#employeeCbo').on('change', function () {
        loadLabelMailTo();
    });
}

// add drag and drop:
function btnAddToTblSubmit() {
    $(document).on('click', '.btnAddToTblSubmit', function () {
        var checkDR = 0;
        var item = {};
        item.CustomerID = $('#customerCbo').val();
        item.CustomerName = $('#customerCbo option:selected').text();
        item.DepartmentID = $('#departmentCbo').val();
        item.DepartmentName = $('#departmentCbo option:selected').text();
        item.EmployeeID = $('#employeeCbo').val();
        item.EmployeeName = $('#employeeCbo option:selected').text();
        //item.EmployeeID = $('#employeeCbo').val();
        //item.EmployeeName = $('#employeeCbo option:selected').text();

        if (item.EmployeeID) {
            //reset combobox:
            $('#customerCbo').selectpicker('val', "");
            $('#departmentCbo').selectpicker('val', "");
            $('#employeeCbo').selectpicker('val', "");
            $('#mailTo').empty();

            for (var dr of lstSubmit) {
                if (dr.EmployeeID == item.EmployeeID) {
                    checkDR = 1;
                    break;
                }
            }
            if (lstSubmit.length == 0) {
                lstSubmit.push(item);
                //binding lên bảng:
                $('.drag-sort-enable').empty();
                for (const item of lstSubmit) {
                    $('.drag-sort-enable').append(`<li data-employeeid="${item.EmployeeID}">${item.EmployeeName}
                                                        <span class="btn-drag-li">
                                                            <button title="Delete" data-stationid="${item.StationId}" class="btn btn-sm btn-danger btn-delete-drop"><i class="bi bi-trash"></i></button>
                                                        </span>
                                                    </li>`);
                }
                enableDragSort('drag-sort-enable');
            }
            else {
                if (checkDR == 0) {
                    lstSubmit.push(item);
                    //binding lên bảng:
                    $('.drag-sort-enable').empty();
                    for (const item of lstSubmit) {
                        $('.drag-sort-enable').append(`<li data-departmentid="${item.DepartmentID}" data-employeeid="${item.EmployeeID}">${item.EmployeeName}
                                                        <span class="btn-drag-li">
                                                            <button title="Delete" data-stationid="${item.StationId}" class="btn btn-sm btn-danger btn-delete-drop"><i class="bi bi-trash"></i></button>
                                                        </span>
                                                    </li>`);
                    }
                    enableDragSort('drag-sort-enable');
                }
                else {

                }
            }
        }
        else {

        }
    });
}

function btnDeleteDragItemOnClick() {
    $(document).on('click', '.btn-delete-drop', function () {
        var employeeIDDrop = $($(this).parent().parent()).data("employeeid");
        for (var dropItem of lstSubmit) {
            if (dropItem.EmployeeID == employeeIDDrop) {
                lstSubmit.splice(lstSubmit.indexOf(dropItem), 1);
            }
        }

        // binding
        $('.drag-sort-enable').empty();
        for (const item of lstSubmit) {
            $('.drag-sort-enable').append(`<li data-employeeid="${item.EmployeeID}">${item.EmployeeName}
                                                        <span class="btn-drag-li">
                                                            <button title="Delete" class="btn btn-sm btn-danger btn-delete-drop"><i class="bi bi-trash"></i></button>
                                                        </span>
                                                    </li>`);
        }
        enableDragSort('drag-sort-enable');
    })
}

function SetTrigger(id) {
    $('#' + id).trigger('click')
    $('#' + id).blur();
    $('#searchMSC').val("");
    $('#searchMSC').keyup();
    $('#searchMSC').focus();
    //$('#searchMSC').on('keyup');
    //$('#searchMSC').val("");
}

function navItemOnClick() {
    $(document).on('click', 'button.nav-link', function () {
        $('#searchMSC').val("");
        $('#searchMSC').keyup();
        $('#searchMSC').focus();
    })
}

function loadDataTableMSC() {
    try {
        onload();
        $.ajax({
            type: "GET",
            url: "/DepartmentNormal/MSC/GetMSCByAccount",
            success: function (response) {
                var dt = JSON.parse(response);
                var lstWaitToSign = dt[0].LstPCN;
                var lstWaitForApproval = dt[1].LstPCN;
                var lstApproved = dt[2].LstPCN;
                var lstRejected = dt[3].LstPCN;
                (lstWaitToSign) ? $('.waitingToSignQty').text(lstWaitToSign.length) : $('.waitingToSignQty').text(0);
                (lstWaitForApproval) ? $('.waitingForApprovalQty').text(lstWaitForApproval.length) : $('.waitingForApprovalQty').text(0);
                (lstApproved) ? $('.approvedQty').text(lstApproved.length) : $('.approvedQty').text(0);
                (lstRejected) ? $('.rejectedQty').text(lstRejected.length) : $('.rejectedQty').text(0);

                if (dt) {
                    if (lstWaitToSign) {
                        // data table
                        var t1 = $('#tblDataMSCWaitToSign').DataTable({
                            fixedHeader: true,
                            dom: 'Bfrtip',
                            //buttons: [
                            //    'excel'
                            //],
                            buttons: [
                                /*{ extend: 'Thêm lỗi', className: 'btn btn-primary btn-add-IPQC' },*/
                                /*{ extend: 'excel', className: 'excelButton btn btn-outline-primary', text: '<i class="ri-file-excel-2-line"></i> Export Excel' },*/
                                //{
                                //    text: '<i class="ri-add-line"></i> Add new record',
                                //    attr: { id: 'btn-add-IPQC', class: 'btn btn-outline-primary' },
                                //    action: function (e, dt, node, config) {
                                //        btnAddIPQCOnClick();
                                //    }
                                //}
                            ],
                            destroy: true,
                            autoWidth: false,
                            //columnDefs: [
                            //    {
                            //        target: [0, 1, 3, 4, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 22],
                            //        visible: false,
                            //        searchable: false,
                            //    },
                            //],
                            bLengthChange: false,
                            order: [[2, 'desc']],
                            responsive: true,
                        });
                        t1.clear();
                        for (var item of lstWaitToSign) {
                            var checkToBindingButton = 1;
                            for (var checkConfirmDept of item.LstOwnerStatus) {
                                if (checkConfirmDept.Status != 1) {
                                    checkToBindingButton = 0;
                                    break;
                                }
                            }
                            t1.row.add([
                                item.PCNCode,//0
                                item.RecommendedByName,
                                item.DatetimeYYYYMMDD,
                                item.LstOwnerStatus.map(s => (s.EmployeeCNName + "-" + s.EmployeeVNName)).toString(),
                                `${(item.Status == -1) ? `<span class="badge bg-danger">Rejected</span>` :
                                    ((item.Status == 1) ? `<span class="badge bg-warning">Pending</span>` :
                                        `<span class="badge bg-success">Approved</span>`)}`,//5
                                `${(checkToBindingButton == 1) ?
                                    `<td>
                                        <button type="button" data-mscid="${item.PCNID}" title="detail" class="btn btn-primary btn-detail-msc"><i class="bi bi-eye"></i></button>
                                        <button type="button" data-mscid="${item.PCNID}" title="edit" class="btn btn-warning btn-edit-msc"><i class="bi bi-pencil"></i></button>
                                    </td>`:
                                    `<td>
                                        <button type="button" data-mscid="${item.PCNID}" title="detail" class="btn btn-primary btn-detail-msc"><i class="bi bi-eye"></i></button>
                                    </td>`}`]).draw(false)
                        }
                        //end data table


                    }
                    if (lstWaitForApproval) {
                        // data table
                        var t2 = $('#tblDataMSCWaitForApproval').DataTable({
                            fixedHeader: true,
                            dom: 'Bfrtip',
                            //buttons: [
                            //    'excel'
                            //],
                            buttons: [
                                /*{ extend: 'Thêm lỗi', className: 'btn btn-primary btn-add-IPQC' },*/
                                /*{ extend: 'excel', className: 'excelButton btn btn-outline-primary', text: '<i class="ri-file-excel-2-line"></i> Export Excel' },*/
                                //{
                                //    text: '<i class="ri-add-line"></i> Add new record',
                                //    attr: { id: 'btn-add-IPQC', class: 'btn btn-outline-primary' },
                                //    action: function (e, dt, node, config) {
                                //        btnAddIPQCOnClick();
                                //    }
                                //}
                            ],
                            destroy: true,
                            autoWidth: false,
                            //columnDefs: [
                            //    {
                            //        target: [0, 1, 3, 4, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 22],
                            //        visible: false,
                            //        searchable: false,
                            //    },
                            //],
                            bLengthChange: false,
                            order: [[2, 'desc']],
                            responsive: true,
                        });
                        t2.clear();
                        for (var item of lstWaitForApproval) {
                            var checkToBindingButton = 1;
                            for (var checkConfirmDept of item.LstOwnerStatus) {
                                if (checkConfirmDept.Status != 1) {
                                    checkToBindingButton = 0;
                                    break;
                                }

                            }
                            t2.row.add([
                                item.PCNCode,//0
                                item.RecommendedByName,
                                item.DatetimeYYYYMMDD,
                                item.LstOwnerStatus.map(s => (s.EmployeeCNName + "-" + s.EmployeeVNName)).toString(),
                                `${(item.Status == -1) ? `<span class="badge bg-danger">Rejected</span>` :
                                    ((item.Status == 1) ? `<span class="badge bg-warning">Pending</span>` :
                                        `<span class="badge bg-success">Approved</span>`)}`,//5
                                `${(checkToBindingButton == 1) ?
                                    `<td>
                                        <button type="button" data-mscid="${item.PCNID}" title="detail" class="btn btn-primary btn-detail-msc"><i class="bi bi-eye"></i></button>
                                        <button type="button" data-mscid="${item.PCNID}" title="edit" class="btn btn-warning btn-edit-msc"><i class="bi bi-pencil"></i></button>
                                    </td>`:
                                    `<td>
                                        <button type="button" data-mscid="${item.PCNID}" title="detail" class="btn btn-primary btn-detail-msc"><i class="bi bi-eye"></i></button>
                                    </td>`}`]).draw(false)
                        }
                        //end data table
                    }
                    if (lstApproved) {
                        // data table
                        var t3 = $('#tblDataMSCApproved').DataTable({
                            fixedHeader: true,
                            dom: 'Bfrtip',
                            //buttons: [
                            //    'excel'
                            //],
                            buttons: [
                                /*{ extend: 'Thêm lỗi', className: 'btn btn-primary btn-add-IPQC' },*/
                                /*{ extend: 'excel', className: 'excelButton btn btn-outline-primary', text: '<i class="ri-file-excel-2-line"></i> Export Excel' },*/
                                //{
                                //    text: '<i class="ri-add-line"></i> Add new record',
                                //    attr: { id: 'btn-add-IPQC', class: 'btn btn-outline-primary' },
                                //    action: function (e, dt, node, config) {
                                //        btnAddIPQCOnClick();
                                //    }
                                //}
                            ],
                            destroy: true,
                            autoWidth: false,
                            //columnDefs: [
                            //    {
                            //        target: [0, 1, 3, 4, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 22],
                            //        visible: false,
                            //        searchable: false,
                            //    },
                            //],
                            bLengthChange: false,
                            order: [[2, 'desc']],
                            responsive: true,
                        });
                        t3.clear();
                        for (var item of lstApproved) {
                            var checkToBindingButton = 1;
                            for (var checkConfirmDept of item.LstOwnerStatus) {
                                if (checkConfirmDept.Status != 1) {
                                    checkToBindingButton = 0;
                                    break;
                                }
                            }
                            t3.row.add([
                                item.PCNCode,//0
                                item.RecommendedByName,
                                item.DatetimeYYYYMMDD,
                                item.LstOwnerStatus.map(s => (s.EmployeeCNName + "-" + s.EmployeeVNName)).toString(),
                                `${(item.Status == -1) ? `<span class="badge bg-danger">Rejected</span>` :
                                    ((item.Status == 1) ? `<span class="badge bg-warning">Pending</span>` :
                                        `<span class="badge bg-success">Approved</span>`)}`,//5
                                `${(checkToBindingButton == 1) ?
                                    `<td>
                                        <button type="button" data-mscid="${item.PCNID}" title="detail" class="btn btn-primary btn-detail-msc"><i class="bi bi-eye"></i></button>
                                        <button type="button" data-mscid="${item.PCNID}" title="edit" class="btn btn-warning btn-edit-msc"><i class="bi bi-pencil"></i></button>
                                    </td>`:
                                    `<td>
                                        <button type="button" data-mscid="${item.PCNID}" title="detail" class="btn btn-primary btn-detail-msc"><i class="bi bi-eye"></i></button>
                                    </td>`}`]).draw(false)
                        }
                        //end data table
                    }
                    if (lstRejected) {
                        
                        // data table
                        var t4 = $('#tblDataMSCRejected').DataTable({
                            fixedHeader: true,
                            dom: 'Bfrtip',
                            //buttons: [
                            //    'excel'
                            //],
                            buttons: [
                                /*{ extend: 'Thêm lỗi', className: 'btn btn-primary btn-add-IPQC' },*/
                                /*{ extend: 'excel', className: 'excelButton btn btn-outline-primary', text: '<i class="ri-file-excel-2-line"></i> Export Excel' },*/
                                //{
                                //    text: '<i class="ri-add-line"></i> Add new record',
                                //    attr: { id: 'btn-add-IPQC', class: 'btn btn-outline-primary' },
                                //    action: function (e, dt, node, config) {
                                //        btnAddIPQCOnClick();
                                //    }
                                //}
                            ],
                            destroy: true,
                            autoWidth: false,
                            //columnDefs: [
                            //    {
                            //        target: [0, 1, 3, 4, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 22],
                            //        visible: false,
                            //        searchable: false,
                            //    },
                            //],
                            bLengthChange: false,
                            order: [[2, 'desc']],
                            responsive: true,
                        });
                        t4.clear();
                        for (var item of lstRejected) {
                            var checkToBindingButton = 1;
                            for (var checkConfirmDept of item.LstOwnerStatus) {
                                if (checkConfirmDept.Status != 1) {
                                    checkToBindingButton = 0;
                                    break;
                                }
                            }
                            t4.row.add([
                                item.PCNCode,//0
                                item.RecommendedByName,
                                item.DatetimeYYYYMMDD,
                                item.LstOwnerStatus.map(s => (s.EmployeeCNName + "-" + s.EmployeeVNName)).toString(),
                                `${(item.Status == -1) ? `<span class="badge bg-danger">Rejected</span>` :
                                    ((item.Status == 1) ? `<span class="badge bg-warning">Pending</span>` :
                                        `<span class="badge bg-success">Approved</span>`)}`,//5
                                `${(checkToBindingButton == 1) ?
                                    `<td>
                                        <button type="button" data-mscid="${item.PCNID}" title="detail" class="btn btn-primary btn-detail-msc"><i class="bi bi-eye"></i></button>
                                        <button type="button" data-mscid="${item.PCNID}" title="edit" class="btn btn-warning btn-edit-msc"><i class="bi bi-pencil"></i></button>
                                    </td>`:
                                    `<td>
                                        <button type="button" data-mscid="${item.PCNID}" title="detail" class="btn btn-primary btn-detail-msc"><i class="bi bi-eye"></i></button>
                                    </td>`}`]).draw(false)
                        }
                        //end data table
                    }
                    endload();
                }
                else {
                    endload();
                    Swal.fire("No data", "No data", "warning");
                }
                
            },
            error: function (res) {
                endload();
                Swal.fire("Error", "Do not get input data", "warning");
            }
        });
    } catch (e) {
        endload();
        Swal.fire("Server Error!", "Please, Contact CPD-TE_Auto to support! (Phone: 31746)", "error");
    }

}

function btnDetailMSCOnClick() {
    $(document).on('click', '.btn-detail-msc', function () {
        try {
            onload();
            var mscID = $(this).data('mscid');
            $.ajax({
                type: "GET",
                url: "/MSC/GetById",
                data: {
                    pcnID: mscID
                },
                dataType: "text",//Kieu du lieu tra ve
                contentType: "application/json",
                success: function (response) {
                    var jsonResult = JSON.parse(response);
                    // binding data lên modal
                    $('.recommendedByName').empty(); $('.recommendedByName').append(`${jsonResult.RecommendedByName}`)
                    $('.mscCodeDetail').empty(); $('.mscCodeDetail').append(`${jsonResult.PCNCode}`)
                    $('.recommendedDate').empty(); $('.recommendedDate').append(`${jsonResult.DatetimeYYYYMMDD}`)
                    $('.userDepartment').empty(); $('.userDepartment').text(jsonResult.DeptNameCreated);
                    $('.statusMSC').empty(); 
                    (jsonResult.Status == -1) ? ($('.statusMSC').append(`<span class="badge bg-danger"><i class="ri-close-circle-line"></i> Rejected</span>`)) : ((jsonResult.Status == 2) ? $('.statusMSC').append(`<span class="badge bg-success"><i class="bi bi-check-circle me-1"></i> Approved</span>`) : $('.statusMSC').append(`<span class="badge bg-warning"><i class="ri-error-warning-line"></i> Pending</span>`))
                    $('.subjectDetail').empty(); $('.subjectDetail').append(`${jsonResult.Subject}`)
                    $('.mscCodeDetail').empty(); $('.mscCodeDetail').append(`${jsonResult.PCNCode}`)
                    $('.processDetail').empty(); $('.processDetail').append(`${jsonResult.ProcessTitle}`)
                    $('.modelDetail').empty(); $('.modelDetail').append(`${jsonResult.ModelTitle}`)
                    $('.htmlDecodeBeforeChange').empty(); (jsonResult.BeforeChangeDescription) ? $('.htmlDecodeBeforeChange').append(`${jsonResult.BeforeChangeDescription}`) : $('.htmlDecodeBeforeChange').append(``);
                    $('.htmlDecodeAfterChange').empty(); (jsonResult.AfterChangeDescription) ? $('.htmlDecodeAfterChange').append(`${jsonResult.AfterChangeDescription}`) : $('.htmlDecodeAfterChange').append(``);
                    $('.htmlDecodeReason').empty(); (jsonResult.Reason) ? $('.htmlDecodeReason').append(`${jsonResult.Reason}`) : $('.htmlDecodeReason').append(``);
                    $('.htmlDecodeCalculateCost').empty(); (jsonResult.CalculateCost) ? $('.htmlDecodeCalculateCost').append(`${jsonResult.CalculateCost}`) : $('.htmlDecodeCalculateCost').append(``);
                    $('.okStatusMSC').empty(); (jsonResult.Status == 2) ? $('.okStatusMSC').append(`Approved`) : ``;
                    $('.okEffectiveDate').empty(); (jsonResult.EffectiveDate != null) ? ($('.okEffectiveDate').append(formartDateSQLToyyyyMMdd(jsonResult.EffectiveDate))) : ($('.okEffectiveDate').append(``));
                    $('.loadFileBefore').empty(); (jsonResult.BeforeChangeFile) ? $('.loadFileBefore').append(`<a target="_blank" href="/Assets/Media/FileMSC/${jsonResult.BeforeChangeFile}">${jsonResult.BeforeChangeFile}</a>`) : $('.loadFileBefore').append('No file!');
                    $('.loadFileAfter').empty(); (jsonResult.AfterChangeFile) ? $('.loadFileAfter').append(`<a target="_blank" href="/Assets/Media/FileMSC/${jsonResult.AfterChangeFile}">${jsonResult.AfterChangeFile}</a>`) : $('.loadFileAfter').append('No file!');
                    $('.reasonReject').empty(); (jsonResult.RejectReason) ? $('.reasonReject').append(`<span>${jsonResult.RejectReason}</span>`) : $('.reasonReject').append("");
                    //binding phòng ban
                    $('.allDepartmentDetail').empty();
                    if (jsonResult.Status == -1 && (jsonResult.BossRejectBy != null)) {
                        for (var ownerStatus of jsonResult.LstOwnerStatus.sort(x => x.Status)) {
                            if (ownerStatus.Status == -1) {//rejected
                                var divKy = $(`<div class="col-12 mt-2 row align-items-center">
                                                    <span class="col-10"><span class="text-danger">Rejected by ${ownerStatus.EmployeeCNName}-${ownerStatus.EmployeeVNName}</span></span>
                                                </div>`);
                                $('.allDepartmentDetail').append(divKy);
                                break;
                            }
                            else {
                                if (ownerStatus.Status == 1) {//chờ ký
                                    var divKy = $(`<div class="col-12 mt-2 row align-items-center">
                                            <span class="col-2">${ownerStatus.EmployeeCNName}-${ownerStatus.EmployeeVNName}</span>
                                            <span class="col-10">
                                                <button data-employeeid="${ownerStatus.EmployeeID}" data-mscid="${mscID}" type="button" class="btn btn-primary btnSign"><i class="bi bi-pencil-square"></i> Signed</button>
                                                <button data-employeeid="${ownerStatus.EmployeeID}" data-mscid="${mscID}" type="button" class="btn btn-danger btnRejectMSC"><i class="ri-close-fill"></i> Rejected</button>
                                            </span>
                                        </div>`)
                                }
                                if (ownerStatus.Status == 2) {//đã ký=>Show tên người ký
                                    var divKy = $(`<div class="col-12 mt-2 row align-items-center">
                                            <span class="col-2"></span>
                                            <span class="col-10"><span class="text-success">${ownerStatus.EmployeeCNName}-${ownerStatus.EmployeeVNName}</span></span>
                                        </div>`)
                                }
                                $('.allDepartmentDetail').append(divKy);
                            }
                        }
                    }
                    else {
                        for (var ownerStatus of jsonResult.LstOwnerStatus.sort(x => x.Status)) {
                            if (ownerStatus.Status == -1) {//rejected
                                var divKy = $(`<div class="col-12 mt-2 row align-items-center">
                                            <span class="col-2">${ownerStatus.EmployeeCNName}-${ownerStatus.EmployeeVNName}</span>
                                            <span class="col-10"><span class="text-danger">Rejected by ${ownerStatus.EmployeeCNName}-${ownerStatus.EmployeeVNName}</span></span>
                                        </div>`);
                                $('.allDepartmentDetail').append(divKy);
                                $('.reasonReject').empty();
                                $('.reasonReject').append(`<span>${jsonResult.RejectReason}</span></br>`);
                                break;
                            }
                            else {
                                if (ownerStatus.Status == 1) {//chờ ký
                                    var divKy = $(`<div class="col-12 mt-2 row align-items-center">
                                            <span class="col-2">${ownerStatus.EmployeeCNName}-${ownerStatus.EmployeeVNName}</span>
                                            <span class="col-10">
                                                <button data-employeeid="${ownerStatus.EmployeeID}" data-mscid="${mscID}" type="button" class="btn btn-primary btnSign"><i class="bi bi-pencil-square"></i> Signed</button>
                                                <button data-employeeid="${ownerStatus.EmployeeID}" data-mscid="${mscID}" type="button" class="btn btn-danger btnRejectMSC"><i class="ri-close-fill"></i> Rejected</button>
                                            </span>
                                        </div>`)
                                }
                                if (ownerStatus.Status == 2) {//đã ký=>Show tên người ký
                                    var divKy = $(`<div class="col-12 mt-2 row align-items-center">
                                            <span class="col-2">${ownerStatus.EmployeeCNName}-${ownerStatus.EmployeeVNName}</span>
                                            <span class="col-10"><span class="text-success">${ownerStatus.EmployeeCNName}-${ownerStatus.EmployeeVNName}</span></span>
                                        </div>`)
                                }
                                $('.reasonReject').empty(); $('.reasonReject').append(`N/A`);
                                $('.allDepartmentDetail').append(divKy);

                            }
                        }
                    }

                    // show modal details

                    $('#detail-msc-modal').modal('show');

                },
                error: function (res) {
                    Swal.fire("Data input Error!", "Please, Contact CPD-TE_Auto to support! (Phone: 31746)", "error");
                }
            });
            endload();
        } catch (e) {
            endload();
        }
        
        
    })
}

function btnSignOnClick() {
    $(document).on('click', '.btnSign', function () {
        onload();
        // binding data
        var data = {};
        data.MSCID = $(this).data('mscid');
        data.EmployeeID = $(this).data('employeeid');
        // post data
        $.ajax({
            type: "POST",
            url: "/DepartmentNormal/MSC/ConfirmMSC",
            data: JSON.stringify(data),
            dataType: "text",//Kieu du lieu tra ve
            contentType: "application/json",
            success: function (response) {
                endload();
                if (response == 0) {
                    Swal.fire("Warning!", "You are not authorized to sign", "warning");
                }
                else if (response == 1) {
                    Swal.fire("Success!", "Signed", "success");
                    $('#detail-msc-modal').modal('hide');
                    loadDataTableMSC();
                }
                else if (response == 2) {
                    Swal.fire("Warning!", "Please Wait for other departments to confirm", "warning");
                }
                else {
                    Swal.fire("Server Error!", "Please, Contact CPD-TE_Auto to support! (Phone: 31746)", "error");
                }
            },
            error: function (res) {
                endload();
                Swal.fire("Data input Error!", "Please, Contact CPD-TE_Auto to support! (Phone: 31746)", "error");
            }
        });
    })
}

//click btnRejectMSC
function btnRejectMSCOnclick() {
    $(document).on('click', '.btnRejectMSC', function () {
        var mscID = $(this).data('mscid');
        var empID = $(this).data('employeeid');
        
        Swal.fire({
            html: true,
            title: 'Reason ?',
            icon: "warning",
           // html: "<input id='lineLeaderReasonReject' class='swal2-input' required/>",
            html: `<textarea id="deptReasonReject" class='swal2-textarea' required rows="6" cols="30">`,
            confirmButtonText: 'Gửi',
            showCancelButton: true,
            cancelButtonText: "Hủy bỏ!",
            reverseButtons: true,
            preConfirm: () => { 
                if (document.getElementById('deptReasonReject').value) {
                    var reasonReject = document.getElementById('deptReasonReject').value;
                    var data = {};
                    data.EmployeeID = empID;
                    data.PCNID = mscID;
                    data.ReasonReject = reasonReject;
                    $.ajax({
                        type: "POST",
                        url: "/DepartmentNormal/MSC/RejectMSC",
                        data: JSON.stringify(data),
                        dataType: "text",
                        contentType: "application/json",
                        success: function (response) {
                            try {
                                if (response == 1) {
                                    Swal.fire("Success", "Rejected!", "success");
                                    //nếu modal đang mở
                                    $("#detail-msc-modal").modal('hide');//đóng modal
                                    loadDataTableMSC();
                                }
                                else if (response == 0) {
                                    Swal.fire("Warning!", "You are not authorized to reject", "warning");
                                }
                                else if (response == 2) {
                                    Swal.fire("Warning!", "Please Wait for other departments to confirm", "warning");
                                }
                                else {
                                    Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận CPD-AIOT để được trợ giúp. Số máy: 31746", "error");
                                }
                            }
                            catch (ex) {
                                Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận CPD-AIOT để được trợ giúp. Số máy: 31746", "error");
                            }

                        },
                        error: function (err) {
                            Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận CPD-AIOT để được trợ giúp. Số máy: 31746", "error");
                        }
                    });

                } else {
                    Swal.showValidationMessage('Press your reason!');
                }
            }
        })
    })
}
