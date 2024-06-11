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
			className: 'btn btn-theme btn-sm',
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

	_UserDatatable = $('#user-datatable').DataTable(config);
}
function CreateUserDatatable() {
	try {
		_UserDatatable.clear();

		_datas.SelectUsers = _datas.Users.filter((u) => { return u.UserDepartments.some((ud) => { return ud.IdDepartment === _datas.SelectDepartment.Id }) });

		let rowDatas = [];
		_datas.SelectUsers.forEach((user) => {
			let rowData = CreateUserDatatableRow(user);
			rowDatas.push(rowData);
		});

		_UserDatatable.rows.add(rowDatas)
		_UserDatatable.columns.adjust().draw();

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
		      <button type="button" data-id="${user.Id}" onclick="User_Detail(this, event)" title="Detail" class="btn btn-sm btn-info"><i class="fa-duotone fa-info"></i></button>
              <button type="button" data-id="${user.Id}" onclick="User_Update(this, event)" title="Update" class="btn btn-sm btn-warning"><i class="fa-duotone fa-pen"></i></button>
              <button type="button" data-id="${user.Id}" onclick="User_Delete(this, event)" title="Delete" class="btn btn-sm btn-danger"><i class="fa-duotone fa-trash"></i></button>
           </div>`;
}