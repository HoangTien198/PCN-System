var _datatable, _datas = {};

$(document).ready(async function () {
	_datas.Customers = await GetCustomers();

	InitUserDatatable();
	CreateUserDatatable();
});

/* DATATABLE */
function InitUserDatatable() {
	var calHeight = CalTableHeight();

	var config = {
		order: [0, 'desc'],
		scrollY: calHeight.tableHeight,
		lengthMenu: calHeight.lengthMenu,
		dom: "<'row mb-3'<'col-md-4 mb-3 mb-md-0'l><'col-md-8 text-right'<'d-flex justify-content-end'fB>>>t<'row align-items-center'<'mr-auto col-md-6 mb-3 mb-md-0 mt-n2 'i><'mb-0 col-md-6'p>>",
		columnDefs: [
			{ targets: ["_all"], orderable: false },
			{ targets: [0, 1], visible: false },
			{ targets: [5], className: 'fw-bold' },
			{ targets: [7], className: 'text-center' },
			{ targets: [8], width: 80 },
		],
		buttons: [{
			text: '<i class="fa-duotone fa-plus"></i> Create User',
			className: 'btn btn-theme btn-sm ms-2 disabled',
			attr: {
				id: 'CreateUserButton',
			},		
			action: function () {
				Create_User();
			}
		}],
		language: {
			search: "<i class='fa fa-search'></i>",
			paginate: {
				previous: '<i class="fa-duotone fa-backward"></i>',
				next: '<i class="fa-duotone fa-forward"></i>'
			}
		},
		createdRow: function (row, data, dataIndex) {
			$(row).data('id', data[1]);
			$(row).data('index', dataIndex);
		},
	};

	_datatable = $('#datatable').DataTable(config);
}
async function CreateUserDatatable() {
	try {
		_datas.Users = await GetUsers();

		let rowDatas = [];
		_datas.Users.forEach((user) => {
			let rowData = CreateUserDatatableRow(user);
			rowDatas.push(rowData);
		});

		_datatable.rows.add(rowDatas);
		_datatable.columns.adjust().draw();
		$('#CreateUserButton').removeClass('disabled');

	} catch (e) {
		Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
		console.error(e);
    }
}

/* DATATABLE ROW */
function CreateUserDatatableRow(user) {
	return [
		moment(user.CreatedDate).format('YYYY-MM-DD HH:mm:ss.SSS'),
		user.Id,
		CreateUserDatatableCellDot(user),
		user.CnName ? user.CnName : '',
		user.VnName ? user.VnName : '',
		user.Username,
		user.Password,
		CreateUserDatatableCellStatus(user),
		CreateUserDatatableCellAction(user),
	]
}
function CreateUserDatatableCellDot(user) {
	switch (user.Status) {
		case 1:
			return `<span><i class="bi bi-circle-fill fs-6px text-success"></i></span>`
		case -1:
			return `<span><i class="bi bi-circle-fill fs-6px text-danger"></i></span>`
			break;
		default:
			return `<span><i class="bi bi-circle-fill fs-6px text-secondary"></i></span>`
			break;
	}
}
function CreateUserDatatableCellStatus(user) {
	switch (user.Status) {
		case 1:
			return `<span class="badge bg-success text-theme-900 rounded-0 pt-5px w-70px">ACTIVED</span>`;
		case -1:
			return `<span class="badge bg-danger text-theme-900 rounded-0 pt-5px w-70px">NO ACTIVE</span>`;
			break;
		default:
			return `<span class="badge bg-secondary text-theme-900 rounded-0 pt-5px w-70px">OTHER</span>`;
			break;
	}
}
function CreateUserDatatableCellAction(user) {
	return `<div class="btn-group">
              <button type="button" data-id="${user.Id}" onclick="Update(this, event)" title="Update" class="btn btn-sm btn-warning"><i class="fa-duotone fa-pen"></i></button>
              <button type="button" data-id="${user.Id}" onclick="Delete(this, event)" title="Delete" class="btn btn-sm btn-danger"><i class="fa-duotone fa-trash"></i></button>
           </div>`
}

/* DATATABLE EVENT */
function Update(elm, e) {
	const IdUser = $(elm).data('id');
	Update_User(IdUser);
}
function Delete(elm, e) {
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