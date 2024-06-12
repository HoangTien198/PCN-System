/* User Datatable */
function InitUserDatatable() {
	var calHeight = CalTableHeight();

	var config = {
		scrollY: calHeight.tableHeight,
		scrollX: true,
		lengthMenu: calHeight.lengthMenu,
		dom: "<'row mb-3'<'d-none'lf><'col-md-12 text-end'<'d-flex justify-content-end'B>>>t<'row align-items-center'<'mr-auto col-md-6'i><'mb-0 col-md-6'p>>",
		columnDefs: [
			{ targets: ["_all"], orderable: false },
			{ targets: [0], visible: false },
			{ targets: [5], width: 80 },
		],
		buttons: [{
			text: '<i class="fa-duotone fa-plus"></i> Create User',
			className: 'btn btn-secondary btn-sm disabled',
			attr: {
				id: 'CreateUserButton',
			},
			action: function () {
				Customer_Create();
			}
		}],
		createdRow: function (row, data, dataIndex) {
			$(row).data('id', data[0]);
			$(row).data('index', dataIndex);
		},
	};

	_datatable = $('#user-datatable').DataTable(config);
}
function CreateUserDatatable() {
	try {
		_datatable.clear().draw();
		if (_datas.SelectDepartment) {
			_datas.SelectUsers = _datas.Users.filter((u) => { return u.UserDepartments.some((ud) => { return ud.IdDepartment === _datas.SelectDepartment.Id }) });

			let rowDatas = [];
			_datas.SelectUsers.forEach((user) => {
				let rowData = CreateUserDatatableRow(user);
				rowDatas.push(rowData);
			});

			_datatable.rows.add(rowDatas)
			_datatable.columns.adjust().draw();
		}
	} catch (e) {
		Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
		console.error(e);
	}
}
function CreateUserDatatableRow(user) {
	return [
		user.Id,
		user.Username,
		user.VnName ? user.VnName : '',
		user.CnName ? user.CnName : '',
		user.Email ? user.Email : '',
		CreateUserDatatableCellAction(user),
	];
}
function CreateUserDatatableCellAction(user) {
	return `<div class="btn-group">
              <button type="button" data-id="${user.Id}" onclick="User_Update(this, event)" title="Update" class="btn btn-sm btn-warning"><i class="fa-duotone fa-pen"></i></button>
              <button type="button" data-id="${user.Id}" onclick="User_Delete(this, event)" title="Delete" class="btn btn-sm btn-danger disabled"><i class="fa-duotone fa-trash"></i></button>
           </div>`;
}

function User_Update(elm, e) {
	const IdUser = $(elm).data('id');
	Update_User(IdUser);
	$('#UserUpdateModal .modal-body hr.mb-3').remove();
	$('#UserUpdateModal .modal-body div.d-flex').remove();
	$('#UserUpdateModal .modal-body div.card').hide();
}
function User_Delete(elm, e) {
	const IdUser = $(elm).data('id');
	Delete_User(IdUser);
}

/* DYNAMIC DEPARTMENT */
function User_CreateWidgetReminderItem(count) {
	return $(`<div class="widget-reminder-item">
			     <div class="widget-reminder-time"><span class="text-info fw-bold" order>${count}</span></div>
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
			             </div>
			             <button class="btn btn-danger ms-2" delete><i class="fa-duotone fa-trash"></i></button>
			         </div>
			     </div>
			 </div>`);
}
function User_PopulateCustomerOptions(selectCustomer) {
	_datas.Customers.forEach((customer) => {
		selectCustomer.append(`<option value="${customer.Id}">${customer.CustomerName}</option>`);
	});
}
function User_SetupCustomerChangeEvent(selectCustomer, selectDepartment) {
	selectCustomer.change(() => {
		const customer = _datas.Customers.find(customer => customer.Id === selectCustomer.val());
		selectDepartment.empty();
		customer.Departments.forEach((department) => {
			selectDepartment.append(`<option value="${department.Id}">${department.DepartmentName}</option>`);
		});
		selectDepartment.change();
	});
}
function User_SetupWidgetReminderItempDeleteEvent(buttonDelete) {
	buttonDelete.click(function () {
		buttonDelete.closest('.widget-reminder-item').remove();
	});
}
function User_SetInitialValues(department, selectCustomer, selectDepartment) {
	const initialCustomerId = department.Department.IdCustomer;
	const initialDepartmentId = department.IdDepartment;

	selectCustomer.val(initialCustomerId).change();
	selectDepartment.val(initialDepartmentId).change();
}