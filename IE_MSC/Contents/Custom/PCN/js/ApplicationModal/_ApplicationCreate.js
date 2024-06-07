$(document).ready(function () {
    InitCreateSumernote();   
});

/* Create Modal */
function ApplicationCreate() {

    // Information
    $('#ApplicationCreateModal-UserCreated').val(GetUserName(_datas.SessionUser));
    $('#ApplicationCreateModal-Department').val(GetUserDept(_datas.SessionUser));
    $('#ApplicationCreateModal-DateCreated').val(moment().format('YYYY-MM-DD HH:mm:ss'));

    $('#ApplicationCreateModal-Subject').val('');
    $('#ApplicationCreateModal-Process').val('');
    $('#ApplicationCreateModal-Model').val('');

    $('#ApplicationCreateModal-BeforeChange').summernote('reset');
    $('#ApplicationCreateModal-AfterChange').summernote('reset');
    $('#ApplicationCreateModal-Reason').summernote('reset');
    $('#ApplicationCreateModal-Cost').summernote('reset');
    $('#ApplicationCreateModal-Cost').summernote('disable');

    $('#ApplicationCreateModal-BeforeChangeFile').val('');
    $('#ApplicationCreateModal-AfterChangeFile').val('');

    // Sign
    $('#ApplicationCreateModal-SendBoss').prop('checked', false);
    $('#ApplicationCreateModal-Sign').empty();
    AddCreateSign();

    // Department
    if ($('#ApplicationCreateModal-Customer option').length === 0) {
        let customerSelect = $('#ApplicationCreateModal-Customer');
        customerSelect.empty();
        _datas.CustomerDepartments.forEach(function (customer) {
            customerSelect.append(`<option value="${customer.Id}">${customer.CustomerName}</option>`);
        });
        customerSelect.change(function () {
            let departments = _datas.CustomerDepartments.find(customer => { return customer.Id == customerSelect.val() }).Departments;
            let departmentSelect = $('#ApplicationCreateModal-Department');
            departmentSelect.empty();
            departments.forEach(function (department) {
                departmentSelect.append(`<option value="${department.Id}">${department.DepartmentName}</option>`);
            });
        });
    }
    $('#ApplicationCreateModal-Customer').change();
   

    // show modal
    $('#ApplicationCreateModal').modal('show');
}
$('#ApplicationCreateModal').on('shown.bs.modal', function () {
    $('#ApplicationCreateModal-Title').focus();
});
function InitCreateSumernote() {
    $('#ApplicationCreateModal-BeforeChange').summernote({
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
    $('#ApplicationCreateModal-AfterChange').summernote({
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
    $('#ApplicationCreateModal-Reason').summernote({
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
    $('#ApplicationCreateModal-Cost').summernote({
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
function AddCreateSign() {
    let container = $('#ApplicationCreateModal-Sign');
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

/* Save Event */
function ApplicationValidate(application, files) {
    if (application.Subject.length === 0) {
        toastr['warning']('[ 主題 / Chủ đề ] Không được để trống!');
        return false;
    }
    if (application.Process.length === 0) {
        toastr['warning']('[ 过程 / Process ] Không được để trống!');
        return false;
    }
    if (application.Model.length === 0) {
        toastr['warning']('[ 模型 / Model ] Không được để trống!');
        return false;
    }
    if (application.Subject.length > 250 ) {
        toastr['warning']('[ 主題 / Chủ đề ] quá dài (lớn hơn 250 ký tự)!');
        return false;
    }
    if (application.Process.length > 250) {
        toastr['warning']('[ 过程 / Process ] quá dài (lớn hơn 250 ký tự)!');
        return false;
    }
    if (application.Model.length > 250) {
        toastr['warning']('[ 模型 / Model ] quá dài (lớn hơn 250 ký tự)!');
        return false;
    }   
    if ($('#ApplicationCreateModal-BeforeChange').summernote('isEmpty')) {
        toastr['warning']('[ 現行作業方式 / Phương thức làm việc hiện hành ] Không được để trống!');
        return false;
    }
    if ($('#ApplicationCreateModal-AfterChange').summernote('isEmpty')) {
        toastr['warning']('[ 變更后的方式 / Phương thức sau khi thay đổi  ] Không được để trống!');
        return false;
    }
    if (!files.beforeChangeFile && !files.afterChangeFile) {
        toastr['warning']('[ Tài liệu phương thức TRƯỚC / SAU khi thay đổi ] Vui lòng chọn tài liệu!');
        return false;
    }
    if ($('#ApplicationCreateModal-Reason').summernote('isEmpty')) {
        toastr['warning']('[ 變更原因 / Nguyên nhân thay đổi ] Không được để trống!');
        return false;
    }
    if (application.Signs.length === 0) {
        toastr['warning']('[ 會簽 / Các bộ phận phê duyệt ] Không được để trống!');
        return false;
    }



    return true;
}