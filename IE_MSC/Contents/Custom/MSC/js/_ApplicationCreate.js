$(document).ready(async function () {
    InitSumernote();   
});

/* Create Modal */
function ApplicationCreate() {
    $('#ApplicationCreateModal-UserCreated').val(GetUserNameObj(_datas.SessionUser));
    $('#ApplicationCreateModal-Department').val(GetUserDeptObj(_datas.SessionUser));
    $('#ApplicationCreateModal-DateCreated').val(moment().format('YYYY-MM-DD HH:mm'));

    $('#ApplicationCreateModal-Title').val('');
    $('#ApplicationCreateModal-Process').val('');
    $('#ApplicationCreateModal-Model').val('');

    $('#ApplicationCreateModal-BeforeChange').summernote('reset');
    $('#ApplicationCreateModal-AfterChange').summernote('reset');
    $('#ApplicationCreateModal-Reason').summernote('reset');
    $('#ApplicationCreateModal-Cost').summernote('reset');

    $('#ApplicationCreateModal-sign').empty();
    AddSign();

    $('#ApplicationCreateModal').modal('show');
}
$('#ApplicationCreateModal').on('shown.bs.modal', function () {
    $('#ApplicationCreateModal-Title').focus();
});
function InitSumernote() {
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
function AddSign() {
    let container = $('#ApplicationCreateModal-sign');
    let count = container.find('.widget-reminder-item').length;

    var widgetReminderItem = $('<div class="widget-reminder-item">').append(
        $('<div class="widget-reminder-time">').append(
            $('<span class="text-info fw-bold">').text(count + 1)
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
$('#ApplicationCreateModal-Save').click(function () {
    try {
        let applicationData = {

        }
    } catch (e) {

    }
})