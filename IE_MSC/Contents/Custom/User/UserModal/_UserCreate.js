function Create_User() {
	$('#UserCreateModal-CreatedDate').val(moment().format('YYYY-MM-DD HH:mm:ss'));

	$('#UserCreateModal-Departments').empty();
	Create_UserDepartmentAdd();

    $('#UserCreateModal').modal('show');
}
async function Create_UserSave() {
    try {
		let user = {
			Username: $('#UserCreateModal-Username').val(),
			Password: $('#UserCreateModal-Password').val(),
			CnName: $('#UserCreateModal-CnName').val(),
			VnName: $('#UserCreateModal-VnName').val(),
			Email: $('#UserCreateModal-Email').val(),
			CreatedDate: $('#UserCreateModal-CreatedDate').val(),
			IsAdmin: $('#UserCreateModal-IsAdmin').val(),
			Status: $('#UserCreateModal-Status').val(),
			UserDepartments: $('#UserCreateModal-Departments .widget-reminder-item').map((index, deptItem) => {
				return {				
					IdDepartment: $(deptItem).find('[department]').val(),
				};
			}).get(),
		};

		// validate
		if (!Create_UserValidate(user)) return false;

		// send data to sv
		let result = await CreateUser(user);

		if (result) {
			// save success
			const rowData = CreateUserDatatableRow(result);
			_datatable.row.add(rowData).draw(false);
			$('#UserCreateModal').modal('hide');
			toastr['success'](`User ${user.Username} được tạo thành công!`);
		}

    } catch (e) {
		Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
		console.error(e);
    }
}
function Create_UserValidate(user) {
	if (!user.Username || user.Username.length < 1) {
		toastr['warning']('Username không được để trống!');
		$('#UserCreateModal-Username').focus();
		return false;
	}
	if (!user.Password || user.Password.length < 1) {
		toastr['warning']('Password không được để trống!');
		$('#UserCreateModal-Username').focus();
		return false;
	}

	if (user.UserDepartments.some((userDept) => user.UserDepartments.filter((item) => { return item.IdDepartment === userDept.IdDepartment }).length > 1)) {
		toastr['warning']('Bộ phận không được trùng nhau!');
		$('#UserCreateModal-Departments').focus();
		return false;
	}

	return true;
}

/* Dynamic epartment */
function Create_UserDepartmentAdd() {
	const container = $('#UserCreateModal-Departments');
	let count = parseInt($('#UserCreateModal-Departments').find('[order]').last().text()) + 1;
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

/* Get Info Event */
$('#UserCreateModal-Username').keydown(async function (e) {
	if (e.keyCode === 13) {
		const CardId = $('#UserCreateModal-Username').val();
		const userInfo = await GetUserInformation(CardId);

		if (userInfo) {
			$('#UserCreateModal-CnName').val(userInfo.USER_NAME);
			$('#UserCreateModal-Email').val(userInfo.NOTES_ID);
		}
		else {
			toastr['error']('User does not exists.');
		}
	}
});
$('#UserCreateModal-Username').blur(async function (e) {
	const CardId = $('#UserCreateModal-Username').val();
	const userInfo = await GetUserInformation(CardId);

	if (userInfo) {
		$('#UserCreateModal-CnName').val(userInfo.USER_NAME);
		$('#UserCreateModal-Email').val(userInfo.NOTES_ID);
	}
	else {
		toastr['error']('User does not exists.');
	}
});