var datatable, _datas = {};
$(document).ready(function () {
	InitDatatable();
	
});

/* Datatable */
function InitDatatable() {
	var calHeight = CalTableHeight();

	var config = {	
		order: [3, 'desc'],
		scrollY: calHeight.tableHeight,
		lengthMenu: calHeight.lengthMenu,
		dom: "<'row mb-3'<'col-md-4 mb-3 mb-md-0'l><'col-md-8 text-right'<'d-flex justify-content-end'fB>>>t<'row align-items-center'<'mr-auto col-md-6 mb-3 mb-md-0 mt-n2 'i><'mb-0 col-md-6'p>>",		
		columnDefs: [
			{ targets: [0, 1, 2, 4, 5, 6, 7], orderable: false },
			{ targets: [0], visible: false },
			{ targets: [4], className: 'fw-bold' },
        ],
		buttons: [{
			text: '<i class="fa-duotone fa-plus"></i> Create Application',
			className: 'btn btn-theme btn-sm ms-2',			
			action: function () {
				CreateMSC();
			}
		}],
		language: {
			search: "<i class='fa fa-search'></i>",
		},
		createdRow: function (row, data, dataIndex) {
			$(row).data('id', data[0]);

			var cells = $(row).children('td');
			$(cells[4]).attr('title', data[5]);
		},
	};

	datatable = $('#datatable').DataTable(config);

	CreateDatatable();
}
async function CreateDatatable() {
	try {
		_datas.Applications = await GetApplications();
		_datas.SessionUser = await GetSessionUser();
		_datas.CustomerDepartments = await GetCustomerDepartments();
		_datas.Users = await GetUsers();

		let rows = [];
		_datas.Applications.forEach(function (application) {
			rows.push(CreateDatatableRow(application));
		});

		datatable.rows.add(rows);
		datatable.columns.adjust().draw(false);

	} catch (e) {
		Swal.fire('Error!', `${e}`, 'error');
		console.error(e);
    }
}
function CreateDatatableRow(application) {
	return [
		application.Id,
		CreateDatatableCellDot(application),
		application.CodeMSC,
		moment(application.DateCreated).format('YYYY-MM-DD HH:mm'),
		GetUserName(application.UserCreated),
		application.Title,
		CreateDatatableCellStatus(application),
		CreateDatatableCellAction(application)
	]
}
function CreateDatatableCellDot(application) {
	switch (application.ApplicationStatus) {
		case 'Rejected':
			return `<td><span><i class="bi bi-circle-fill fs-6px text-danger"></i></span></td>`;
		case 'Pending':
			return `<td><span><i class="bi bi-circle-fill fs-6px text-warning"></i></span></td>`;
		case 'Approved':
			return `<td><span><i class="bi bi-circle-fill fs-6px text-success"></i></span></td>`;
	}
}
function CreateDatatableCellStatus(application) {
	switch (application.ApplicationStatus) {
		case 'Rejected':
			return `<td><span class="badge d-block bg-danger text-theme-900 rounded-0 pt-5px w-70px" style="min-height: 18px">Rejected</span></td>`;
		case 'Pending':
			return `<td><span class="badge d-block bg-warning text-theme-900 rounded-0 pt-5px w-70px" style="min-height: 18px">Pending</span></td>`;
		case 'Approved':
			return `<td><span class="badge d-block bg-success text-theme-900 rounded-0 pt-5px w-70px" style="min-height: 18px">Approved</span></td>`;
	}
}
function CreateDatatableCellAction(application) {
	if (application.ApplicationStatus == 'Approved') {
		return `
		<div class="btn-group">
			<button type="button" data-id="${application.Id}" onclick="DetailMSC(this, event)" title="Detail" class="btn btn-sm btn-primary"><i class="fa-duotone fa-info"></i></button>
			<button type="button" data-id="${application.Id}" onclick="UpdateMSC(this, event)" title="Update" class="btn btn-sm btn-default" disabled><i class="fa-duotone fa-pen"></i></button>
			<button type="button" data-id="${application.Id}" onclick="DeleteMSC(this, event)" title="Delete" class="btn btn-sm btn-default" disabled><i class="fa-duotone fa-trash"></i></button>
		</div>`;
	}
	else {
		if ($('#SessionUser').data('card') == application.UserCreated.EmployeeCode) {
			return `
			<div class="btn-group">
				<button type="button" data-id="${application.Id}" onclick="DetailMSC(this, event)" title="Detail" class="btn btn-sm btn-primary"><i class="fa-duotone fa-info"></i></button>
				<button type="button" data-id="${application.Id}" onclick="UpdateMSC(this, event)" title="Update" class="btn btn-sm btn-default" disabled><i class="fa-duotone fa-pen"></i></button>
				<button type="button" data-id="${application.Id}" onclick="DeleteMSC(this, event)" title="Delete" class="btn btn-sm btn-danger"><i class="fa-duotone fa-trash"></i></button>
			</div>`;
		}
		else {
			return `
			<div class="btn-group">
				<button type="button" data-id="${application.Id}" onclick="DetailMSC(this, event)" title="Detail" class="btn btn-sm btn-primary"><i class="fa-duotone fa-info"></i></button>
				<button type="button" data-id="${application.Id}" onclick="UpdateMSC(this, event)" title="Update" class="btn btn-sm btn-default" disabled><i class="fa-duotone fa-pen"></i></button>
				<button type="button" data-id="${application.Id}" onclick="DeleteMSC(this, event)" title="Delete" class="btn btn-sm btn-default" disabled><i class="fa-duotone fa-trash"></i></button>
			</div>`;
		}
	}
}

/* Datatable Event */
function CreateMSC() {
	ApplicationCreate();
}
function DetailMSC(elm, e) {
	let Id = $(elm).data('id');
	ApplicationDetail(Id);
}
function UpdateMSC(elm, e) {
	let Id = $(elm).data('id');
}
function DeleteMSC(elm, e) {
	let Id = $(elm).data('id');
}