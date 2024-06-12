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
				Department_Create();
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
		if (_datas.SelectDepartment) {
			$('#DepartmentLink').text(_datas.SelectDepartment.DepartmentName);
		}
		else {
			$('#DepartmentLink').text('');
		}
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
              <button type="button" data-id="${department.Id}" onclick="Department_Delete(this, event)" title="Delete" class="btn btn-sm btn-danger disabled"><i class="fa-duotone fa-trash"></i></button>
           </div>`;
}

/* Department Datatable Event */
function Department_Detail(elm, e) {
	try {
		let IdDepartment = $(elm).data('id');
		let selectDepartment = _datas.SelectCustomer.Departments.find((d) => { return d.Id === IdDepartment });

		if (selectDepartment) {
			_datas.SelectDepartment = selectDepartment;
			if (_datas.SelectDepartment) {
				$('#DepartmentLink').text(_datas.SelectDepartment.DepartmentName);				
			}
			else {
				$('#DepartmentLink').text('');
			}
			CreateUserDatatable();

		}

	} catch (e) {
		Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
		console.error(e);
	}
}

function Department_Create() {
	$('#DepartmentCreateModal-CustomerName').val(_datas.SelectCustomer.CustomerName);
	$('#DepartmentCreateModal-DepartmentName').val('');

	$('#DepartmentCreateModal').modal('show');
}
async function Department_CreateSave() {
	try {
		const Department = {
			IdCustomer: _datas.SelectCustomer.Id,
			DepartmentName: $('#DepartmentCreateModal-DepartmentName').val()
		}

		const result = await CreateDepartment(Department);

		if (result) {
			const rowData = CreateDepartmentDatatableRow(result);
			_DepartmentDatatable.row.add(rowData).draw(false);
			_datas.SelectCustomer.Departments.push(result);


			$('#DepartmentCreateModal').modal('hide');
			toastr['success'](`Department ${Department.DepartmentName} được tạo thành công!`);
		}
	} catch (e) {
		Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
		console.error(e);
	}
}

async function Department_Update(elm, e) {
	try {
		const IdDepartment = $(elm).data('id');
		_datas.Department = await GetDepartment(IdDepartment);

		$('#DepartmentUpdateModal-CustomerName').val(_datas.SelectCustomer.CustomerName);
		$('#DepartmentUpdateModal-DepartmentName').val(_datas.Department.DepartmentName);

		$('#DepartmentUpdateModal').modal('show');
	} catch (e) {
		Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
		console.error(e);
	}

}
async function Department_UpdateSave() {
	try {
		const Department = {
			Id: _datas.Department.Id,
			DepartmentName: $('#DepartmentUpdateModal-DepartmentName').val()
		}

		const result = await UpdateDepartment(Department);

		if (result) {
			// save success
			const rowData = CreateDepartmentDatatableRow(result);
			const rowIndex = $(`button[data-id="${Department.Id}"]`).closest('tr').data('index');
			_datas.SelectCustomer.Departments.find(d => { return d.Id == _datas.Department.Id }).DepartmentName = result.DepartmentName;

			_DepartmentDatatable.row(rowIndex).data(rowData).draw(false);
			$('#DepartmentUpdateModal').modal('hide');
			toastr['success'](`User ${Department.DepartmentName} được cập nhật thành công!`);
		}
	} catch (e) {
		Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
		console.error(e);
	}
}

async function Department_Delete(elm, e) {
	try {
		const IdDepartment = $(elm).data('id');
		_datas.Department = await GetDepartment(IdDepartment);

		Swal.fire({
			title: "Delete this Department?",
			html: Department_DeleteInfor(_datas.Department),
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: `<i class="fa-duotone fa-trash"></i> Delete`,
			cancelButtonText: `<i class="fa-duotone fa-x"></i> Cancel`,
			buttonsStyling: false,
			reverseButtons: true,
			customClass: {
				cancelButton: 'btn btn-sm btn-outline-secondary me-3',
				confirmButton: 'btn btn-sm btn-danger'
			},
		}).then(async function (confirm) {
			if (confirm.value) {
				let result = await DeleteDepartment(IdDepartment);

				if (result) {
					const rowIndex = $(`button[data-id="${IdDepartment}"]`).closest('tr').data('index');
					let customer = _datas.Customers.find(c => { return c.Id == _datas.SelectCustomer.Id });
					customer.Departments = customer.Departments.filter(d => d.Id !== IdDepartment);

					_DepartmentDatatable.row(rowIndex).remove().draw(false);
					toastr['success'](`Delete Department ${_datas.Department.DepartmentName} Success.`);
				}
			}
		});

	} catch (e) {
		Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
		console.error(e);
	}
}
function Department_DeleteInfor(Department) {
	return `<table class="table table-striped table-bordered align-middle fs-6">
                <tbody>
                    <tr>
                        <th class="text-theme text-nowrap">Department name</th>
                        <td>${Department.DepartmentName}</td>
                    </tr>
                </tbody>
            </table>`;
}