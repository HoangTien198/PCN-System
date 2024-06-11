/* Department Datatable */
function InitDepartmentDatatable() {
	var calHeight = CalTableHeight();

	var config = {
		scrollY: calHeight.tableHeight,
		lengthMenu: calHeight.lengthMenu,
		dom: "<'row mb-3'<'d-none'lf><'col-md-12 text-end'<'d-flex justify-content-end'B>>>t<'row align-items-center'<'mr-auto d-none'i><'mb-0 col-md-12'p>>",
		columnDefs: [
			{ targets: ["_all"], orderable: false },
			{ targets: [0], visible: false },
			{ targets: [2], width: 80 },
		],
		buttons: [{
			text: '<i class="fa-duotone fa-plus"></i> Create Department',
			className: 'btn btn-theme btn-sm',
			attr: {
				id: 'CreateDepartmentButton',
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

	_DepartmentDatatable = $('#department-datatable').DataTable(config);
}
function CreateDepartmentDatatable() {
	try {
		_DepartmentDatatable.clear();

		let rowDatas = [];
		_datas.SelectCustomer.Departments.forEach((department) => {
			let rowData = CreateDepartmentDatatableRow(department);
			rowDatas.push(rowData);
		});

		_DepartmentDatatable.rows.add(rowDatas)
		_DepartmentDatatable.columns.adjust().draw();

		_datas.SelectDepartment = _datas.SelectCustomer.Departments[0];
		$('#DepartmentLink').text(_datas.SelectDepartment.DepartmentName);
		CreateUserDatatable();

	} catch (e) {
		Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
		console.error(e);
	}
}
function CreateDepartmentDatatableRow(department) {
	return [
		department.Id,
		department.DepartmentName,
		CreateDepartmentDatatableCellAction(department),
	];
}
function CreateDepartmentDatatableCellAction(department) {
	return `<div class="btn-group">
		      <button type="button" data-id="${department.Id}" onclick="Department_Detail(this, event)" title="Detail" class="btn btn-sm btn-info"><i class="fa-duotone fa-info"></i></button>
              <button type="button" data-id="${department.Id}" onclick="Department_Update(this, event)" title="Update" class="btn btn-sm btn-warning"><i class="fa-duotone fa-pen"></i></button>
              <button type="button" data-id="${department.Id}" onclick="Department_Delete(this, event)" title="Delete" class="btn btn-sm btn-danger"><i class="fa-duotone fa-trash"></i></button>
           </div>`;
}

/* Department Datatable Event */
function Department_Detail(elm, e) {
	try {
		let IdDepartment = $(elm).data('id');
		let selectDepartment = _datas.SelectCustomer.Departments.find((d) => { return d.Id === IdDepartment });

		if (selectDepartment) {
			_datas.SelectDepartment = selectDepartment;
			$('#DepartmentLink').text(_datas.SelectDepartment.DepartmentName);
			CreateUserDatatable();
		}

	} catch (e) {
		Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
		console.error(e);
	}
}