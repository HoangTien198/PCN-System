var Update_InitApplicationCount = 0;
async function ApplicationUpdate(IdApplication) {
    try {
        await Update_GetApplication(IdApplication);

        Update_CreateApplicationModal(_datas.Application);

       
        
    } catch (e) {
        Swal.fire('Error!', `${GetAjaxErrorMessage(e)}`, 'error');
        console.error(e);
    }
}


/* Create Update Modal */
function Update_CreateApplicationModal(application) {
    Update_SetInformation(application);
    Update_SetDetails(application);
    Update_SetSign(application.Signs);

    Update_InitApplicationCount++;

    $('#ApplicationUpdateModal').modal('show');
}

// Information
function Update_SetInformation(application) {
    $('#ApplicationUpdateModal-UserCreated').val(GetUserName(application.UserCreated));
    $('#ApplicationUpdateModal-DateCreated').val(moment(application.DateCreated).format('YYYY-MM-DD HH:mm'));

    Update_SetDepartment();

    $('#ApplicationUpdateModal-Subject').val(application.Subject);
    $('#ApplicationUpdateModal-Process').val(application.Process);
    $('#ApplicationUpdateModal-Model').val(application.Model);
}
function Update_SetDepartment() {
    if (Update_InitApplicationCount == 0) {
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

        let department = _datas.SessionUser?.UserDepartments[0];
        if (department != null) {
            customer = department.Department.Customer;
            $('#ApplicationUpdateModal-Customer').val(customer.Id);
            $('#ApplicationUpdateModal-Department').val(department.IdDepartment);
        }

        $('#ApplicationUpdateModal-Customer').change();
    }
}

// Details
function Update_SetDetails(application) {
    if (Update_InitApplicationCount == 0) Update_InitSumernote();

    $('#ApplicationUpdateModal-BeforeChange').summernote('code', Update_DecodeContent(application.BeforeChange));
    $('#ApplicationUpdateModal-AfterChange').summernote('code', Update_DecodeContent(application.AfterChange));
    $('#ApplicationUpdateModal-Reason').summernote('code', Update_DecodeContent(application.Reason))
    $('#ApplicationUpdateModal-CalcCost').summernote('code', Update_DecodeContent(application.CalcCost))

    $('#ApplicationUpdateModal-CalcCost').summernote('reset')
    $('#ApplicationUpdateModal-CalcCost').summernote('disable');

    Update_SetFileLink('#ApplicationUpdateModal-BeforeChangeFile-OLD', application.BeforeChangeFile);
    Update_SetFileLink('#ApplicationUpdateModal-AfterChangeFile-OLD', application.AfterChangeFile);
    $('#ApplicationUpdateModal-BeforeChangeFile-NEW').val('');
    $('#ApplicationUpdateModal-AfterChangeFile-NEW').val('');
}
function Update_InitSumernote() {
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
function Update_DecodeContent(content) {
    try {
        if (content) return decodeURIComponent(content);
        else return '';
    } catch (e) {
        if (content) return content;
        else return ''
    }
}
function Update_SetFileLink(elementId, fileName) {
    const element = $(elementId);
    if (fileName) {
        element.text(fileName);
        element.attr('href', `/Data/Files/${fileName}`);
    } else {
        element.attr('href', 'javascript:;');
        element.text('No file');
    }
}

// Sign
function Update_SetSign(signs) {
    const container = $('#ApplicationUpdateModal-Sign');
    container.empty();
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
function Update_AddSign() {
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
async function Update_ApplicationSave() {
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

        if (!Update_ApplicationValidate(application)) return false;

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
function Update_ApplicationValidate(application) {
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
async function Update_GetApplication(IdApplication) {
    if (!_datas.Application || _datas.Application.Id.toUpperCase() !== IdApplication.toUpperCase()) {
        _datas.Application = await GetApplication(IdApplication);
    }
}