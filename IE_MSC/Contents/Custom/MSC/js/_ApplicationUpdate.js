$(document).ready(function () {
    InitUpdateSumernote();   
});

/* Create Update Modal */
async function ApplicationUpdate(IdApplication, callback) {
    try {
        await GetUpdateApplication(IdApplication);

        CreateUpdateModal(_datas.Application);

        callback(true);
    } catch (e) {
        Swal.fire('Error!', `${GetAjaxErrorMessage(e)}`, 'error');
        console.error(e);
    }

    

    //$('#ApplicationCreateModal-Save').click(async function () {
    //    let result = await ApplicationCreateSave();

    //    if (result) {
    //        $('#ApplicationCreateModal').modal('hide');
    //        callback(result);
    //    }
    //});
}
function CreateUpdateModal(application) {
    $('#ApplicationUpdateModal-UserCreated').val(GetUserName(application.UserCreated));
    $('#ApplicationUpdateModal-Department').val(GetUserDept(application.UserCreated));
    $('#ApplicationUpdateModal-DateCreated').val(moment().format('YYYY-MM-DD HH:mm'));

    $('#ApplicationUpdateModal-Subject').val('');
    $('#ApplicationUpdateModal-Process').val('');
    $('#ApplicationUpdateModal-Model').val('');

    $('#ApplicationUpdateModal-BeforeChange').summernote('reset');
    $('#ApplicationUpdateModal-AfterChange').summernote('reset');
    $('#ApplicationUpdateModal-Reason').summernote('reset');
    $('#ApplicationUpdateModal-Cost').summernote('reset');
    $('#ApplicationUpdateModal-Cost').summernote('disable');

    $('#ApplicationUpdateModal-BeforeChangeFile').val('');
    $('#ApplicationUpdateModal-AfterChangeFile').val('');

    $('#ApplicationUpdateModal-SendBoss').prop('checked', false);
    $('#ApplicationUpdateModal-Sign').empty();
    AddUpdateSign();

    $('#ApplicationUpdateModal').modal('show');
}
$('#ApplicationCreateModal').on('shown.bs.modal', function () {
    $('#ApplicationCreateModal-Title').focus();
});
function InitUpdateSumernote() {
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
function AddUpdateSign() {
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
                RecommendedDate: $('#ApplicationCreateModal-DateCreated').val(),
                Subject: $('#ApplicationCreateModal-Subject').val(),
                ProcessTitle: $('#ApplicationCreateModal-Process').val(),
                ModelTitle: $('#ApplicationCreateModal-Model').val(),
                BeforeChangeDescription: $('#ApplicationCreateModal-BeforeChange').summernote('code'),
                AfterChangeDescription: $('#ApplicationCreateModal-AfterChange').summernote('code'),
                Reason: $('#ApplicationCreateModal-Reason').summernote('code'),
                PCNConfirms: $('#ApplicationCreateModal-Sign .widget-reminder-item').map((index, signItem) => {
                    return {
                        EmployeeID: $(signItem).find('[user]').val(),
                        SortOrder: $(signItem).find('[order]').text()
                    };
                }).get()
            },
            beforeChangeFile: $('#ApplicationCreateModal-BeforeChangeFile').prop('files')[0],
            afterChangeFile: $('#ApplicationCreateModal-AfterChangeFile').prop('files')[0],
            sendToBoss: $('#ApplicationCreateModal-SendBoss').is(':checked'),
        }

        if (!ApplicationValidate(applicationData)) return false;

        return await CreateApplication(applicationData);

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
    if ($('#ApplicationCreateModal-BeforeChange').summernote('isEmpty')) {
        toastr['warning']('[ 現行作業方式 / Phương thức làm việc hiện hành ] Không được để trống!');
        return false;
    }
    if ($('#ApplicationCreateModal-AfterChange').summernote('isEmpty')) {
        toastr['warning']('[ 變更后的方式 / Phương thức sau khi thay đổi  ] Không được để trống!');
        return false;
    }
    if (!applicationData.beforeChangeFile && !applicationData.afterChangeFile) {
        toastr['warning']('[ Tài liệu phương thức TRƯỚC / SAU khi thay đổi ] Vui lòng chọn tài liệu!');
        return false;
    }
    if ($('#ApplicationCreateModal-Reason').summernote('isEmpty')) {
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
        _datas.Application = _datas.Applications.find(application => { application.Id.toUpperCase() === IdApplication.toUpperCase() });
        if (!_datas.Application) {
            _datas.Application = await GetApplication(IdApplication);
        }
    }
}