var _datas = {};
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

    $('#ApplicationCreate-SendBoss').prop('checked', false);
    $('#ApplicationCreate-Sign').empty();

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
    $('#ApplicationCreate-Customer').change();

    AddCreateSign();
}


/* Add Sign Event */
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