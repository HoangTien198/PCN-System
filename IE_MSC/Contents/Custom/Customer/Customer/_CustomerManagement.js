/* Customer Datatable */
function InitCustomerDatatable() {
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
			text: '<i class="fa-duotone fa-plus"></i> Create Customer',
			className: 'btn btn-theme btn-sm',
			attr: {
				id: 'CreateCustomerButton',
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

	_CustomerDatatable = $('#customer-datatable').DataTable(config);
}
function CreateCustomerDatatable() {
	try {

		let rowDatas = [];
		_datas.Customers.forEach((customer) => {
			let rowData = CreateCustomerDatatableRow(customer);
			rowDatas.push(rowData);
		});

		_CustomerDatatable.rows.add(rowDatas)
		_CustomerDatatable.columns.adjust().draw();

		_datas.SelectCustomer = _datas.Customers[0];
		$('#CustomerLink').text(_datas.SelectCustomer.CustomerName);
		CreateDepartmentDatatable();

	} catch (e) {
		Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
		console.error(e);
	}
}
function CreateCustomerDatatableRow(customer) {
	return [
		customer.Id,
		customer.CustomerName,
		CreateCustomerDatatableCellAction(customer),
	];
}
function CreateCustomerDatatableCellAction(customer) {
	return `<div class="btn-group">
		      <button type="button" data-id="${customer.Id}" onclick="Customer_Detail(this, event)" title="Detail" class="btn btn-sm btn-info"><i class="fa-duotone fa-info"></i></button>
              <button type="button" data-id="${customer.Id}" onclick="Customer_Update(this, event)" title="Update" class="btn btn-sm btn-warning"><i class="fa-duotone fa-pen"></i></button>
              <button type="button" data-id="${customer.Id}" onclick="Customer_Delete(this, event)" title="Delete" class="btn btn-sm btn-danger disabled"><i class="fa-duotone fa-trash"></i></button>
           </div>`;
}

/* Customer Datatable Event */
function Customer_Detail(elm, e) {
    try {
		let IdCustomer = $(elm).data('id');
		let selectCustomer = _datas.Customers.find((c) => { return c.Id === IdCustomer });

		if (selectCustomer) {
			_datas.SelectCustomer = selectCustomer;
			$('#CustomerLink').text(_datas.SelectCustomer.CustomerName);
			CreateDepartmentDatatable();
		}

    } catch (e) {
		Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
		console.error(e);
    }
}

function Customer_Create() {
	$('#CustomerCreateModal-CustomerName').val('');

	$('#CustomerCreateModal').modal('show');
}
async function Customer_CreateSave(){
	try {
		const customer = {
			CustomerName: $('#CustomerCreateModal-CustomerName').val()
		}

		const result = await CreateCustomer(customer);

		if (result) {
			const rowData = CreateCustomerDatatableRow(result);
			_CustomerDatatable.row.add(rowData).draw(false);
			$('#CustomerCreateModal').modal('hide');
			toastr['success'](`Customer ${customer.CustomerName} được tạo thành công!`);
		}
    } catch (e) {
		Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
		console.error(e);
    }
}

async function Customer_Update(elm, e) {
	try {
		const IdCustomer = $(elm).data('id');
		_datas.Customer = await GetCustomer(IdCustomer);


		$('#CustomerUpdateModal-CustomerName').val(_datas.Customer.CustomerName);

		$('#CustomerUpdateModal').modal('show');
    } catch (e) {
		Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
		console.error(e);
    }
	
}
async function Customer_UpdateSave() {
	try {
		const customer = {
			Id: _datas.Customer.Id,
			CustomerName: $('#CustomerUpdateModal-CustomerName').val()
		}

		const result = await UpdateCustomer(customer);

		if (result) {
			// save success
			const rowData = CreateCustomerDatatableRow(result);
			const rowIndex = $(`button[data-id="${customer.Id}"]`).closest('tr').data('index');

			_CustomerDatatable.row(rowIndex).data(rowData).draw(false);
			$('#CustomerUpdateModal').modal('hide');
			toastr['success'](`User ${customer.CustomerName} được cập nhật thành công!`);
		}
	} catch (e) {
		Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
		console.error(e);
	}
}

async function Customer_Delete(elm, e) {
	try {
		const IdCustomer = $(elm).data('id');
		_datas.Customer = await GetCustomer(IdCustomer);

		Swal.fire({
			title: "Delete this customer?",
			html: Customer_DeleteInfor(_datas.Customer),
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
				let result = await DeleteCustomer(IdCustomer);

				if (result) {
					const rowIndex = $(`button[data-id="${IdCustomer}"]`).closest('tr').data('index');

					_CustomerDatatable.row(rowIndex).remove().draw(false);
					toastr['success'](`Delete Customer ${_datas.Customer.CustomerName} Success.`);
				}
			}
		});

	} catch (e) {
		Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
		console.error(e);
	}
}
function Customer_DeleteInfor(customer) {
	return `<table class="table table-striped table-bordered align-middle fs-6">
                <tbody>
                    <tr>
                        <th class="text-theme text-nowrap">Customer name</th>
                        <td>${customer.CustomerName}</td>
                    </tr>
                </tbody>
            </table>`;
}