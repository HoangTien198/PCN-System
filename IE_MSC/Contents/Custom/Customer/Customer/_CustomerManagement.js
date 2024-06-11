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
              <button type="button" data-id="${customer.Id}" onclick="Customer_Delete(this, event)" title="Delete" class="btn btn-sm btn-danger"><i class="fa-duotone fa-trash"></i></button>
           </div>`;
}

/* Customer Datatable Event */
function Customer_Detail(elm, e) {
    try {
		let IdCustomer = $(elm).data('id');
		let selectCustomer = _datas.Customers.find((c) => { return c.Id === IdCustomer });

		if (selectCustomer) {
			_datas.SelectCustomer = selectCustomer;
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

}