var InitApplicationUpdateFormCount = 0;
$(document).ready(function () {
    InitUpdateSumernote();   
});

/* Create Update Modal */
async function ApplicationUpdate(IdApplication, callback) {
    try {
        await GetUpdateApplication(IdApplication);

        // Information
        $('#ApplicationUpdateModal-UserCreated').val(GetUserName(_datas.Application.UserCreated));
        $('#ApplicationUpdateModal-DateCreated').val(moment(_datas.Application.DateCreated).format('YYYY-MM-DD HH:mm'));

        $('#ApplicationUpdateModal-Subject').val(_datas.Application.Subject);
        $('#ApplicationUpdateModal-Process').val(_datas.Application.Process);
        $('#ApplicationUpdateModal-Model').val(_datas.Application.Model);

        // Editor
        try { $('#ApplicationUpdateModal-BeforeChange').summernote('code', decodeURIComponent(_datas.Application.BeforeChange)) }
        catch { $('#ApplicationUpdateModal-BeforeChange').summernote('code', _datas.Application.BeforeChange) }

        try { $('#ApplicationUpdateModal-AfterChange').summernote('code', decodeURIComponent(_datas.Application.AfterChange)) }
        catch { $('#ApplicationUpdateModal-AfterChange').summernote('code', _datas.Application.AfterChange) }

        try { $('#ApplicationUpdateModal-Reason').summernote('code', decodeURIComponent(_datas.Application.Reason)) }
        catch { $('#ApplicationUpdateModal-Reason').summernote('code', _datas.Application.Reason) }

        $('#ApplicationUpdateModal-Cost').summernote('reset')
        $('#ApplicationUpdateModal-Cost').summernote('disable');

        // File
        if (_datas.Application.BeforeChangeFile) {
            $('#ApplicationUpdateModal-BeforeChangeFile-OLD').text(_datas.Application.BeforeChangeFile);
            $('#ApplicationUpdateModal-BeforeChangeFile-OLD').attr('href', `/Data/Files/${_datas.Application.BeforeChangeFile}`);
        }
        else {
            $('#ApplicationUpdateModal-BeforeChangeFile-OLD').attr('href', 'javascript:;');
            $('#ApplicationUpdateModal-BeforeChangeFile-OLD').text('No file');
        }

        if (_datas.Application.AfterChangeFile) {
            $('#ApplicationUpdateModal-AfterChangeFile-OLD').text(_datas.Application.AfterChangeFile);
            $('#ApplicationUpdateModal-AfterChangeFile-OLD').attr('href', `/Data/Files/${_datas.Application.AfterChangeFile}`);
        }
        else {
            $('#ApplicationUpdateModal-AfterChangeFile-OLD').attr('href', 'javascript:;');
            $('#ApplicationUpdateModal-AfterChangeFile-OLD').text('No file');
        }

        // Sign
        $('#ApplicationUpdateModal-SendBoss').prop('checked', false);
        $('#ApplicationUpdateModal-Sign').empty();
        SetUpdateSign(_datas.Application.Signs);

        // Customer Departments
        if (InitApplicationUpdateFormCount == 0) {
            SetUpdateCustomerDepartment();
            let department = _datas.SessionUser?.UserDepartments[0];
            if (department != null) {
                customer = department.Department.Customer;
                $('#ApplicationUpdateModal-Customer').val(customer.Id);
                $('#ApplicationUpdateModal-Department').val(department.IdDepartment);
            }
            $('#ApplicationUpdateModal-Customer').change();
        }

        $('#ApplicationUpdateModal').modal('show');
        InitApplicationUpdateFormCount++;
    } catch (e) {
        Swal.fire('Error!', `${GetAjaxErrorMessage(e)}`, 'error');
        console.error(e);
    }
}
function InitUpdateSumernote() {
    $('#ApplicationUpdateModal-BeforeChange').summernote({
        height: 200,
        foreColor: 'White',
        fontName: 'Arial',
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['fontsize', ['fontname', 'fontsize']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['color', ['color']],
            ['table', ['table']],
        ],
    });
    $('#ApplicationUpdateModal-AfterChange').summernote({
        height: 200,
        foreColor: 'White',
        fontName: 'Arial',
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['fontsize', ['fontname', 'fontsize']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['color', ['color']],
            ['table', ['table']],
        ],
    });   
    $('#ApplicationUpdateModal-Reason').summernote({
        height: 200,
        foreColor: 'White',
        fontName: 'Arial',
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['fontsize', ['fontname', 'fontsize']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['color', ['color']],
            ['table', ['table']],
        ],
    });  
    $('#ApplicationUpdateModal-Cost').summernote({
        height: 200,
        foreColor: 'White',
        fontName: 'Arial',
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['fontsize', ['fontname', 'fontsize']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['color', ['color']],
            ['table', ['table']],
        ],
    });
}

/* Add Sign Event */
function SetUpdateSign(signs) {
    let container = $('#ApplicationUpdateModal-Sign');
    let count = 0;
    signs.forEach(function (sign) {
        count++;
        let widgetReminderItem = $(`<div class="widget-reminder-item">
                                      <div class="widget-reminder-time"><span class="text-info fw-bold" order="">${count }</span></div>
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
                                          <button class="btn btn-danger ms-2">
                                            <i class="fa-duotone fa-trash"></i>
                                          </button>
                                        </div>
                                      </div>
                                    </div>`);

        let selectCustomer = widgetReminderItem.find('[customer]');
        let selectDepartment = widgetReminderItem.find('[department]');
        let selectUser = widgetReminderItem.find('[user]');
   
        _datas.CustomerDepartments.forEach((customer) => {
            selectCustomer.append(`<option value="${customer.Id}">${customer.CustomerName}</option>`);
        });

        // select customer change event
        selectCustomer.change(function () {
            let customer = _datas.CustomerDepartments.find((customer) => { return customer.Id == selectCustomer.val(); });

            selectDepartment.empty();
            customer.Departments.forEach(function (department) {
                selectDepartment.append(`<option value="${department.Id}">${department.DepartmentName}</option>`);
            });
            selectDepartment.change();
        });

        // select department change envent
        selectDepartment.change(function () {
            var IdCustomer = selectCustomer.val(), IdDepartment = selectDepartment.val();
            var users = _datas.Users.filter(user => {
                return user.UserDepartments.some(dept => {
                    return dept.Department.Id === IdDepartment && dept.Department.IdCustomer === IdCustomer;
                });
            });

            selectUser.empty();
            users.forEach(function (user) {
                selectUser.append(`<option value="${user.Id}">${GetUserNameObj(user)}</option>`);
            })
        });

        // append to container
        container.append(widgetReminderItem);

        console.log(sign);
        // set customer
        if (sign.IdCustomer) {
            selectCustomer.val(IdCustomer);
        }
        else {
            selectCustomer.val(_datas.Application.IdCustomer);
        }
        selectCustomer.change();

        // set department
        if (sign.IdDepartment) {

        }
       
    });
}
function AddUpdateSign() {
    let container = $('#ApplicationUpdateModal-Sign');
    let count = container.find('.widget-reminder-item').length;

    var widgetReminderItem = $('<div class="widget-reminder-item">').append(
        $('<div class="widget-reminder-time">').append(
            $('<span class="text-info fw-bold" order>').text(count + 1)
        ),
        $('<div class="widget-reminder-divider bg-info">'),
        $('<div class="widget-reminder-content">').append(
            $('<div class="d-flex justify-content-between">').append(
                $('<div class="row w-100">').append(
                    $('<div class="col-12 mb-2">').append(
                        $('<div class="d-flex w-100">').append(
                            $('<select class="form-select me-2" customer>').append(
                                _datas.CustomerDepartments.map(function (customer) {
                                    return $(`<option value="${customer.Id}">`).text(customer.CustomerName);
                                })
                            ).change(function () {
                                let selectCust = widgetReminderItem.find('[customer]');
                                let selectDept = widgetReminderItem.find('[department]');
                                let customer = _datas.CustomerDepartments.find(customer => { return customer.Id == selectCust.val(); });

                                selectDept.empty();
                                selectDept.append(
                                    customer.Departments.map(function (department) {
                                        return $(`<option value="${department.Id}">`).text(department.DepartmentName);
                                    })
                                )
                                selectDept.change();
                            })
                        ).append(
                            $('<select class="form-select" department>').change(function () {
                                let selectCust = widgetReminderItem.find('[customer]');
                                let selectDept = widgetReminderItem.find('[department]');
                                let selectUser = widgetReminderItem.find('[user]');

                                var IdCustomer = selectCust.val(), IdDepartment = selectDept.val();
                                var users = _datas.Users.filter(user => {
                                    return user.Departments.some(dept => {
                                        return dept.Department.DepartmentID === IdDepartment && dept.Department.CustomerID === IdCustomer;
                                    });
                                });
                                selectUser.empty();
                                selectUser.append(users.map(function (user) {
                                    return $(`<option value="${user.Id}">`).text(GetUserNameObj(user));
                                }))
                            }))
                    )
                ).append(
                    $('<div class="col-12">').append(
                        $('<select class="form-select" user>')
                    )
                ),

            ).append(
                $('<button class="btn btn-danger ms-2">').append(
                    $('<i class="fa-duotone fa-trash">')
                ).click(function () {
                    widgetReminderItem.remove();
                })
            )
        )
    );

    container.append(widgetReminderItem);
    widgetReminderItem.find('[customer]').change();
}

/* Save Event */
async function ApplicationCreateSave() {
    try {
        let applicationData = {
            data: {
                RecommendedBy: $('#SessionUser').data('id'),
                RecommendedDate: $('#ApplicationUpdateModal-DateCreated').val(),
                Subject: $('#ApplicationUpdateModal-Subject').val(),
                ProcessTitle: $('#ApplicationUpdateModal-Process').val(),
                ModelTitle: $('#ApplicationUpdateModal-Model').val(),
                BeforeChangeDescription: $('#ApplicationUpdateModal-BeforeChange').summernote('code'),
                AfterChangeDescription: $('#ApplicationUpdateModal-AfterChange').summernote('code'),
                Reason: $('#ApplicationUpdateModal-Reason').summernote('code'),
                PCNConfirms: $('#ApplicationUpdateModal-Sign .widget-reminder-item').map((index, signItem) => {
                    return {
                        EmployeeID: $(signItem).find('[user]').val(),
                        SortOrder: $(signItem).find('[order]').text()
                    };
                }).get()
            },
            beforeChangeFile: $('#ApplicationUpdateModal-BeforeChangeFile').prop('files')[0],
            afterChangeFile: $('#ApplicationUpdateModal-AfterChangeFile').prop('files')[0],
            sendToBoss: $('#ApplicationUpdateModal-SendBoss').is(':checked'),
        }

        if (!ApplicationValidate(applicationData)) return false;

        return await UpdateApplication(applicationData);

    } catch (e) {
        Swal.fire('Error!', `${GetAjaxErrorMessage(e)}`, 'error');
        console.error(e);
    }
}
function ApplicationValidate(applicationData) {
    if (applicationData.data.Subject.length === 0) {
        toastr['warning']('[ 主題 / Chủ đề ] Không được để trống!');
        return false;
    }
    if (applicationData.data.ProcessTitle.length === 0) {
        toastr['warning']('[ 过程 / Process ] Không được để trống!');
        return false;
    }
    if (applicationData.data.ModelTitle.length === 0) {
        toastr['warning']('[ 模型 / Model ] Không được để trống!');
        return false;
    }
    if (applicationData.data.Subject.length > 250 ) {
        toastr['warning']('[ 主題 / Chủ đề ] quá dài (lớn hơn 250 ký tự)!');
        return false;
    }
    if (applicationData.data.ProcessTitle.length > 250) {
        toastr['warning']('[ 过程 / Process ] quá dài (lớn hơn 250 ký tự)!');
        return false;
    }
    if (applicationData.data.ModelTitle.length > 250) {
        toastr['warning']('[ 模型 / Model ] quá dài (lớn hơn 250 ký tự)!');
        return false;
    }   
    if ($('#ApplicationUpdateModal-BeforeChange').summernote('isEmpty')) {
        toastr['warning']('[ 現行作業方式 / Phương thức làm việc hiện hành ] Không được để trống!');
        return false;
    }
    if ($('#ApplicationUpdateModal-AfterChange').summernote('isEmpty')) {
        toastr['warning']('[ 變更后的方式 / Phương thức sau khi thay đổi  ] Không được để trống!');
        return false;
    }
    if (!applicationData.beforeChangeFile && !applicationData.afterChangeFile) {
        toastr['warning']('[ Tài liệu phương thức TRƯỚC / SAU khi thay đổi ] Vui lòng chọn tài liệu!');
        return false;
    }
    if ($('#ApplicationUpdateModal-Reason').summernote('isEmpty')) {
        toastr['warning']('[ 變更原因 / Nguyên nhân thay đổi ] Không được để trống!');
        return false;
    }
    if (applicationData.data.PCNConfirms.length === 0) {
        toastr['warning']('[ 會簽 / Các bộ phận phê duyệt ] Không được để trống!');
        return false;
    }

    return true;
}

/* Other */
async function GetUpdateApplication(IdApplication) {
    if (!_datas.Application || _datas.Application.Id.toUpperCase() !== IdApplication.toUpperCase()) {
        _datas.Application = await GetApplication(IdApplication);
    }
}
function SetUpdateCustomerDepartment() {
    // Department   
    if (InitApplicationUpdateFormCount == 0) {
        if ($('#ApplicationCreate-Customer option').length === 0) {
            let customerSelect = $('#ApplicationUpdateModal-Customer');
            customerSelect.empty();
            _datas.CustomerDepartments.forEach(function (customer) {
                customerSelect.append(`<option value="${customer.Id}">${customer.CustomerName}</option>`);
            });
            customerSelect.change(function () {
                let departments = _datas.CustomerDepartments.find(customer => { return customer.Id == customerSelect.val() }).Departments;
                let departmentSelect = $('#ApplicationUpdateModal-Department');
                departmentSelect.empty();
                departments.forEach(function (department) {
                    departmentSelect.append(`<option value="${department.Id}">${department.DepartmentName}</option>`);
                });
            });
        }
    }
}