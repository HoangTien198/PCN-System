var _datas = {};
var InitApplicationFormCount = 0;
$(document).ready(async function () {
    const [sessionUser, customerDepartments, users] = await Promise.all([
        GetSessionUser(),
        GetCustomerDepartments(),
        GetUsers()
    ]);

    _datas.SessionUser = sessionUser;
    _datas.CustomerDepartments = customerDepartments;
    _datas.Users = users;

    InitCreateSumernote();
    InitApplicationForm();
});

function InitCreateSumernote() {
    $('#ApplicationCreate-BeforeChange').summernote({
        height: 200,
        foreColor: 'White',
        fontName: 'Arial',
        focus: false,
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['fontsize', ['fontname', 'fontsize']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['color', ['color']],
            ['table', ['table']],
        ],
    });
    $('#ApplicationCreate-AfterChange').summernote({
        height: 200,
        foreColor: 'White',
        fontName: 'Arial',
        focus: false,
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['fontsize', ['fontname', 'fontsize']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['color', ['color']],
            ['table', ['table']],
        ],
    });
    $('#ApplicationCreate-Reason').summernote({
        height: 200,
        foreColor: 'White',
        fontName: 'Arial',
        focus: false,
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['fontsize', ['fontname', 'fontsize']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['color', ['color']],
            ['table', ['table']],
        ],
    });
    $('#ApplicationCreate-Cost').summernote({
        height: 200,
        foreColor: 'White',
        fontName: 'Arial',
        focus: false,
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['fontsize', ['fontname', 'fontsize']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['color', ['color']],
            ['table', ['table']],
        ],
    });
}
function InitApplicationForm() {
    // Information
    $('#ApplicationCreate-UserCreated').val(GetUserName(_datas.SessionUser));
    $('#ApplicationCreate-Department').val(GetUserDept(_datas.SessionUser));
    $('#ApplicationCreate-DateCreated').val(moment().format('YYYY-MM-DD HH:mm:ss'));

    $('#ApplicationCreate-Subject').val('');
    $('#ApplicationCreate-Process').val('');
    $('#ApplicationCreate-Model').val('');

    $('#ApplicationCreate-BeforeChange').summernote('reset');
    $('#ApplicationCreate-AfterChange').summernote('reset');
    $('#ApplicationCreate-Reason').summernote('reset');
    $('#ApplicationCreate-Cost').summernote('reset');
    $('#ApplicationCreate-Cost').summernote('disable');

    $('#ApplicationCreate-BeforeChangeFile').val('');
    $('#ApplicationCreate-AfterChangeFile').val('');

    // Sign process
    $('#ApplicationCreate-SendBoss').prop('checked', false);
    $('#ApplicationCreate-Sign').empty();
    AddCreateSign();

    // Department   
    if (InitApplicationFormCount == 0) {
        SetCreateCustomerDepartment();
        let department = _datas.SessionUser?.UserDepartments[0];
        if (department != null) {
            customer = department.Department.Customer;
            $('#ApplicationCreate-Customer').val(customer.Id);
            $('#ApplicationCreate-Department').val(department.IdDepartment);
        }
    }
   
    $('#ApplicationCreate-Customer').change();
}

/* Save Event */
$('#ApplicationCreate-Save').click(async function () {
    try {
        // get application data
        let application = {
            IdUserCreated: $('#SessionUser').data('id'),
            DateCreated: $('#ApplicationCreate-DateCreated').val(),
            Subject: $('#ApplicationCreate-Subject').val(),
            Process: $('#ApplicationCreate-Process').val(),
            Model: $('#ApplicationCreate-Model').val(),
            BeforeChange: $('#ApplicationCreate-BeforeChange').summernote('code'),
            AfterChange: $('#ApplicationCreate-AfterChange').summernote('code'),
            Reason: $('#ApplicationCreate-Reason').summernote('code'),
            IdCustomer: $('#ApplicationCreate-Customer').val(),
            IdDepartment: $('#ApplicationCreate-Department').val(),
            Signs: $('#ApplicationCreate-Sign .widget-reminder-item').map((index, signItem) => {
                return {
                    IdCustomer: $(signItem).find('[customer]').val(),
                    IdDepartment: $(signItem).find('[department]').val(),
                    IdUser: $(signItem).find('[user]').val(),
                    Order: $(signItem).find('[order]').text()
                };
            }).get(),
            Files: {
                BeforeChangeFile: $('#ApplicationCreate-BeforeChangeFile').prop('files')[0],
                AfterChangeFile: $('#ApplicationCreate-AfterChangeFile').prop('files')[0],

            },
            IsSendBoss: $('#ApplicationCreate-SendBoss').is(':checked')
        };

        // validate
        if (!ApplicationValidate(application)) return false;

        // send data to sv
        let result = await CreateApplication(application);

        if (result) {
            // save success
            InitApplicationFormCount += 1;
            InitApplicationForm();
            toastr['success']('Create application success!<br />Tạo đơn thành công!');
        }

    } catch (e) {
        Swal.fire('Error!', `${GetAjaxErrorMessage(e)}`, 'error');
        console.error(e);
    }
});  


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

/* Sign Event */
function AddCreateSign() {
    const container = $('#ApplicationCreate-Sign');
    let count = parseInt($('#ApplicationCreate-Sign').find('[order]').last().text()) + 1;
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

/* Application Validate */
function ApplicationValidate(application) {
    if (application.Subject.length === 0) {
        toastr['warning']('[ 主題 / Chủ đề ] Không được để trống!');
        $('#ApplicationCreate-Subject').focus();
        return false;
    }
    if (application.Process.length === 0) {
        toastr['warning']('[ 过程 / Process ] Không được để trống!');
        $('#ApplicationCreate-Process').focus();
        return false;
    }
    if (application.Model.length === 0) {
        toastr['warning']('[ 模型 / Model ] Không được để trống!');
        $('#ApplicationCreate-Model').focus();
        return false;
    }
   
    if ($('#ApplicationCreate-BeforeChange').summernote('isEmpty')) {
        toastr['warning']('[ 現行作業方式 / Phương thức làm việc hiện hành ] Không được để trống!');
        $('#ApplicationCreate-BeforeChange').summernote('focus');
        return false;
    }
    if ($('#ApplicationCreate-AfterChange').summernote('isEmpty')) {
        toastr['warning']('[ 變更后的方式 / Phương thức sau khi thay đổi  ] Không được để trống!');
        $('#ApplicationCreate-AfterChange').summernote('focus');
        return false;
    }
    if ($('#ApplicationCreate-Reason').summernote('isEmpty')) {
        toastr['warning']('[ 變更原因 / Nguyên nhân thay đổi ] Không được để trống!');
        $('#ApplicationCreate-Reason').summernote('focus');
        return false;
    }    

    if (application.Signs.length === 0) {
        toastr['warning']('[ 會簽 / Các bộ phận phê duyệt ] Không được để trống!');
        $('#ApplicationCreate-Sign').focus();
        return false;
    }

    if (application.Signs.some((sign) => application.Signs.filter((item) => { return item.IdUser === sign.IdUser }).length > 1)) {
        toastr['warning']('Người ký không được thêm nhiều lần!');
        $('#ApplicationCreate-Sign').focus();
        return false;
    }

    return true;
}

/* Other */
function SetCreateCustomerDepartment() {
    if ($('#ApplicationCreate-Customer option').length === 0) {
        let customerSelect = $('#ApplicationCreate-Customer');
        customerSelect.empty();
        _datas.CustomerDepartments.forEach(function (customer) {
            customerSelect.append(`<option value="${customer.Id}">${customer.CustomerName}</option>`);
        });
        customerSelect.change(function () {
            let departments = _datas.CustomerDepartments.find(customer => { return customer.Id == customerSelect.val() }).Departments;
            let departmentSelect = $('#ApplicationCreate-Department');
            departmentSelect.empty();
            departments.forEach(function (department) {
                departmentSelect.append(`<option value="${department.Id}">${department.DepartmentName}</option>`);
            });
        });
    }
}