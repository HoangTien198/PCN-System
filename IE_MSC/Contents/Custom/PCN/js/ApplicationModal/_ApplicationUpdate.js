var InitApplicationUpdateFormCount = 0;
$(document).ready(function () {
    InitUpdateSumernote();   
});

/* Create Update Modal */
async function ApplicationUpdate(IdApplication) {
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

        $('#ApplicationUpdateModal-CalcCost').summernote('reset')
        $('#ApplicationUpdateModal-CalcCost').summernote('disable');

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
        $('#ApplicationUpdateModal-BeforeChangeFile-NEW').val('');
        $('#ApplicationUpdateModal-AfterChangeFile-NEW').val('');

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
    $('#ApplicationUpdateModal-CalcCost').summernote({
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
    _datas.CustomerDepartments.forEach((customer) => {
        selectCustomer.append(`<option value="${customer.Id}">${customer.CustomerName}</option>`);
    });
}
function SetupCustomerChangeEvent(selectCustomer, selectDepartment) {
    selectCustomer.change(() => {
        const customer = _datas.CustomerDepartments.find(customer => customer.Id === selectCustomer.val());
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
            selectUser.append(`<option value="${user.Id}">${GetUserNameObj(user)}</option>`);
        });
    });
}
function SetupWidgetReminderItempDeleteEvent(buttonDelete) {
    buttonDelete.click(function () {
        buttonDelete.closest('.widget-reminder-item').remove();
    });
}


/* Set sign function */
function SetUpdateSign(signs) {
    const container = $('#ApplicationUpdateModal-Sign');
    let count = 0;

    signs.forEach((sign) => {
        count++;
        const widgetReminderItem = CreateWidgetReminderItem(count);
        const inputIdSign = widgetReminderItem.find('[idsign]');
        const selectCustomer = widgetReminderItem.find('[customer]');
        const selectDepartment = widgetReminderItem.find('[department]');
        const selectUser = widgetReminderItem.find('[user]');
        const buttonDelete = widgetReminderItem.find('[delete]');

        inputIdSign.val(sign.Id);
        PopulateCustomerOptions(selectCustomer);
        SetupCustomerChangeEvent(selectCustomer, selectDepartment);
        SetupDepartmentChangeEvent(selectCustomer, selectDepartment, selectUser);
        SetupWidgetReminderItempDeleteEvent(buttonDelete);

        container.append(widgetReminderItem);

        SetInitialValues(sign, selectCustomer, selectDepartment, selectUser);
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

/* Add Sign Event */
function AddUpdateSign() {
    const container = $('#ApplicationUpdateModal-Sign');
    let count = parseInt($('#ApplicationUpdateModal-Sign').find('[order]').last().text()) + 1;
    if (isNaN(count)) count = 1;

    const widgetReminderItem = CreateWidgetReminderItem(count);
    const selectCustomer = widgetReminderItem.find('[customer]');
    const selectDepartment = widgetReminderItem.find('[department]');
    const selectUser = widgetReminderItem.find('[user]');
    const buttonDelete = widgetReminderItem.find('[delete]');

    PopulateCustomerOptions(selectCustomer);
    SetupCustomerChangeEvent(selectCustomer, selectDepartment);
    SetupDepartmentChangeEvent(selectCustomer, selectDepartment, selectUser);
    SetupWidgetReminderItempDeleteEvent(buttonDelete);

    container.append(widgetReminderItem);
    selectCustomer.change();
}


/* Save Event */
async function ApplicationUpdateSave() {
    try {
        let application = {
            Id: _datas.Application.Id,
            IdUserCreated: _datas.SessionUser.Id,
            IdCustomer: $('#ApplicationUpdateModal-Customer').val(),
            IdDepartment: $('#ApplicationUpdateModal-Department').val(),
            DateCreated: $('#ApplicationUpdateModal-DateCreated').val(),
            Subject: $('#ApplicationUpdateModal-Subject').val(),
            Process: $('#ApplicationUpdateModal-Process').val(),
            Model: $('#ApplicationUpdateModal-Model').val(),
            BeforeChange: $('#ApplicationUpdateModal-BeforeChange').summernote('code'),
            AfterChange: $('#ApplicationUpdateModal-AfterChange').summernote('code'),
            Reason: $('#ApplicationUpdateModal-Reason').summernote('code'),
            CalcCost: $('#ApplicationUpdateModal-CalcCost').summernote('code'),
            Signs: $('#ApplicationUpdateModal-Sign .widget-reminder-item').map((index, signItem) => {
                return {
                    Id: $(signItem).find('[idsign]').val(),
                    IdCustomer: $(signItem).find('[customer]').val(),
                    IdDepartment: $(signItem).find('[department]').val(),
                    IdUser: $(signItem).find('[user]').val(),
                    Order: $(signItem).find('[order]').text()
                };
            }).get(),
            Files: {
                BeforeChangeFile: $('#ApplicationUpdateModal-BeforeChangeFile-NEW').prop('files')[0],
                BfterChangeFile: $('#ApplicationUpdateModal-AfterChangeFile-NEW').prop('files')[0],

            },
            IsSendBoss: $('#ApplicationUpdateModal-SendBoss').is(':checked')
        }

        if (!ApplicationValidate(application)) return false;

        var result = await UpdateApplication(application);

        if (result) {
            _datas.Application = result;

            datatable.draw(false);
            $('#ApplicationUpdateModal').modal('hide');
            toastr['success']('Delete Application Success.');
        }


    } catch (e) {
        Swal.fire('Error!', `${GetAjaxErrorMessage(e)}`, 'error');
        console.error(e);
    }
}
function ApplicationValidate(application) {
    if (application.Subject.length === 0) {
        toastr['warning']('[ 主題 / Chủ đề ] Không được để trống!');
        $('#ApplicationUpdateModal-Subject').focus();
        return false;
    }
    if (application.Process.length === 0) {
        toastr['warning']('[ 过程 / Process ] Không được để trống!');
        $('#ApplicationUpdateModal-Process').focus();
        return false;
    }
    if (application.Model.length === 0) {
        toastr['warning']('[ 模型 / Model ] Không được để trống!');
        $('#ApplicationUpdateModal-Model').focus();
        return false;
    }

    if ($('#ApplicationUpdateModal-BeforeChange').summernote('isEmpty')) {
        toastr['warning']('[ 現行作業方式 / Phương thức làm việc hiện hành ] Không được để trống!');
        $('#ApplicationUpdateModal-BeforeChange').summernote('focus');
        return false;
    }
    if ($('#ApplicationUpdateModal-AfterChange').summernote('isEmpty')) {
        toastr['warning']('[ 變更后的方式 / Phương thức sau khi thay đổi  ] Không được để trống!');
        $('#ApplicationUpdateModal-AfterChange').summernote('focus');
        return false;
    }
    if ($('#ApplicationUpdateModal-Reason').summernote('isEmpty')) {
        toastr['warning']('[ 變更原因 / Nguyên nhân thay đổi ] Không được để trống!');
        $('#ApplicationUpdateModal-Reason').summernote('focus');
        return false;
    }

    if (application.Signs.length === 0) {
        toastr['warning']('[ 會簽 / Các bộ phận phê duyệt ] Không được để trống!');
        $('#ApplicationUpdateModal-Sign').focus();
        return false;
    }

    if (application.Signs.some((sign) => application.Signs.filter((item) => { return item.IdUser === sign.IdUser }).length > 1)) {
        toastr['warning']('Người ký không được thêm nhiều lần!');
        $('#ApplicationUpdateModal-Sign').focus();
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