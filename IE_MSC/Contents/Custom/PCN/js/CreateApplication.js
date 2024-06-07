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
            }).get()
        };

        // get file data
        let files = {
            beforeChangeFile: $('#ApplicationCreate-BeforeChangeFile').prop('files')[0],
            afterChangeFile: $('#ApplicationCreate-AfterChangeFile').prop('files')[0],

        };

        // get send boss
        let isSendBoss = $('#ApplicationCreate-SendBoss').is(':checked');

        // validate
        if (!ApplicationValidate(application, files)) return false;

        // send data to sv
        let result = await CreateApplication(application, files, isSendBoss);

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

/* Sign Event */
function AddCreateSign() {
    let container = $('#ApplicationCreate-Sign');
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
                                    return user.UserDepartments.some((userDept) => {
                                        return userDept.Department.Id === IdDepartment && userDept.Department.IdCustomer === IdCustomer;
                                    });
                                });
                                selectUser.empty();
                                selectUser.append(users.map(function (user) {
                                    return $(`<option value="${user.Id}">`).text(GetUserName(user));
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

/* Application Validate */
function ApplicationValidate(application, files) {
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
    if (!files.beforeChangeFile) {
        toastr['warning']('[ Tài liệu phương thức trước khi thay đổi ] Vui lòng chọn tài liệu!');
        $('#ApplicationCreate-BeforeChangeFile').focus();
        return false;
    }
    if (!files.afterChangeFile) {
        toastr['warning']('[ Tài liệu phương thức sau khi thay đổi ] Vui lòng chọn tài liệu!');
        $('#ApplicationCreate-AfterChangeFile').focus();
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