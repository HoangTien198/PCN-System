async function Update_User(IdUser) {
    try {
        _datas.User = await GetUser(IdUser);

        $('#UserUpdateModal-Username').val(_datas.User.Username);
        $('#UserUpdateModal-Password').val(_datas.User.Password);
        $('#UserUpdateModal-Status').val(_datas.User.Status);
        $('#UserUpdateModal-CnName').val(_datas.User.CnName);
        $('#UserUpdateModal-VnName').val(_datas.User.VnName);
        $('#UserUpdateModal-Email').val(_datas.User.Email);
        $('#UserUpdateModal-IsAdmin').val(`${_datas.User.IsAdmin}`);
        $('#UserUpdateModal-CreatedDate').val(moment(_datas.User.CreatedDate).format('YYYY-MM-DDTHH:mm:ss'));

        Update_SetUserDepartment();

        $('#UserUpdateModal').modal('show');
    } catch (e) {
        Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
        console.error(e);
    }
}
async function Update_UserSave() {
    try {
        let user = {
            Id: _datas.User.Id,
            Username: $('#UserUpdateModal-Username').val(),
            Password: $('#UserUpdateModal-Password').val(),
            CnName: $('#UserUpdateModal-CnName').val(),
            VnName: $('#UserUpdateModal-VnName').val(),
            Email: $('#UserUpdateModal-Email').val(),
            CreatedDate: $('#UserUpdateModal-CreatedDate').val(),
            IsAdmin: $('#UserUpdateModal-IsAdmin').val(),
            Status: $('#UserUpdateModal-Status').val(),
            UserDepartments: $('#UserUpdateModal-Departments .widget-reminder-item').map((index, deptItem) => {
                return {
                    IdDepartment: $(deptItem).find('[department]').val(),
                };
            }).get(),
        };

        // validate
        if (!Update_UserValidate(user)) return false;

        // send data to sv
        let result = await UpdateUser(user);

        if (result) {
            // save success
            const rowData = CreateUserDatatableRow(result);
            const rowIndex = $(`button[data-id="${result.Id}"]`).closest('tr').data('index');

            _datas.User = result;

            _datatable.row(rowIndex).data(rowData).draw(false);
            $('#UserUpdateModal').modal('hide');
            toastr['success'](`User ${user.Username} được cập nhật thành công!`);
        }

    } catch (e) {
        Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
        console.error(e);
    }
}
function Update_UserValidate(user) {
    if (!user.Username || user.Username.length < 1) {
        toastr['warning']('Username không được để trống!');
        $('#UserUpdateModal-Username').focus();
        return false;
    }
    if (!user.Password || user.Password.length < 1) {
        toastr['warning']('Password không được để trống!');
        $('#UserUpdateModal-Username').focus();
        return false;
    }
    if (user.UserDepartments.some((userDept) => user.UserDepartments.filter((item) => { return item.IdDepartment === userDept.IdDepartment }).length > 1)) {
        toastr['warning']('Bộ phận không được trùng nhau!');
        $('#UserUpdateModal-Departments').focus();
        return false;
    }

    return true;
}

function Update_SetUserDepartment() {
    const container = $('#UserUpdateModal-Departments');
    container.empty();
    let count = 0;

    _datas.User.UserDepartments.forEach((userDept) => {
        count++;
        const widgetReminderItem = User_CreateWidgetReminderItem(count);
        const selectCustomer = widgetReminderItem.find('[customer]');
        const selectDepartment = widgetReminderItem.find('[department]');
        const buttonDelete = widgetReminderItem.find('[delete]');

        User_PopulateCustomerOptions(selectCustomer);
        User_SetupCustomerChangeEvent(selectCustomer, selectDepartment);
        User_SetupWidgetReminderItempDeleteEvent(buttonDelete);

        container.append(widgetReminderItem);

        User_SetInitialValues(userDept, selectCustomer, selectDepartment);
    });
}
/* Dynamic epartment */
function Update_UserDepartmentAdd() {
    const container = $('#UserUpdateModal-Departments');
    let count = parseInt($('#UserUpdateModal-Departments').find('[order]').last().text()) + 1;
    if (isNaN(count)) count = 1;

    const widgetReminderItem = User_CreateWidgetReminderItem(count);
    const selectCustomer = widgetReminderItem.find('[customer]');
    const selectDepartment = widgetReminderItem.find('[department]');
    const buttonDelete = widgetReminderItem.find('[delete]');

    User_PopulateCustomerOptions(selectCustomer);
    User_SetupCustomerChangeEvent(selectCustomer, selectDepartment);
    User_SetupWidgetReminderItempDeleteEvent(buttonDelete);

    container.append(widgetReminderItem);
    selectCustomer.change();
}