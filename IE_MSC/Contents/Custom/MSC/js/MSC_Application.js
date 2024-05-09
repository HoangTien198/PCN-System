var datatable, _datas = {};
$(document).ready(async function () {
	InitDatatable();

	const [sessionUser, customerDepartments, users] = await Promise.all([
		GetSessionUser(),
		GetCustomerDepartments(),
		GetUsers()
	]);

	_datas.SessionUser = sessionUser;
	_datas.CustomerDepartments = customerDepartments;
	_datas.Users = users;

	$('.dt-buttons button').removeClass('disabled');
});

/* Datatable */
function InitDatatable() {
	var calHeight = CalTableHeight();

	var config = {
		ajax: {
			url: "/MSC/Management/GetApplicationsServerSide",
			type: "POST",
		},
		processing: true,
		serverSide: true,
		filter: true,
		columns: [
			{ data: 'Id' },
			{ data: 'Dot' },
			{ data: 'Code' },
			{ data: 'Date' },
			{ data: 'UserCreated' },
			{ data: 'Subject' },
			{ data: 'Status' },
			{ data: 'Button' },
		],
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
			className: 'btn btn-theme btn-sm ms-2 disabled',
			action: function () {
				CreateMSC();
			}
		}],
		language: {
			search: "<i class='fa fa-search'></i>",
		},
		createdRow: function (row, data, dataIndex) {
			$(row).data('id', data['Id']);
			var cells = $(row).children('td');
			$(cells[4]).attr('title', data['Subject']);

			$(row).dblclick(function () {
				ApplicationDetail(data['Id']);
			});
		},
	};

	datatable = $('#datatable').DataTable(config);

}
function CreateDatatableRow(application) {
	return [
		application.Id,
		CreateDatatableCellDot(application),
		application.Code,
		moment(application.DateCreated).format('YYYY-MM-DD HH:mm:ss'),
		GetUserName(application.UserCreated),
		application.Subject,
		CreateDatatableCellStatus(application),
		CreateDatatableCellAction(application)
	]
}
function CreateDatatableCellDot(application) {
	switch (application.Status) {
		case -1:
			return `<td><span><i class="bi bi-circle-fill fs-6px text-danger"></i></span></td>`;
		case 1:
			return `<td><span><i class="bi bi-circle-fill fs-6px text-warning"></i></span></td>`;
		case 2:
			return `<td><span><i class="bi bi-circle-fill fs-6px text-success"></i></span></td>`;
	}
}
function CreateDatatableCellStatus(application) {
	switch (application.Status) {
		case -1:
			return `<td><span class="badge d-block bg-danger text-theme-900 rounded-0 pt-5px w-70px" style="min-height: 18px">Rejected</span></td>`;
		case 1:
			return `<td><span class="badge d-block bg-warning text-theme-900 rounded-0 pt-5px w-70px" style="min-height: 18px">Pending</span></td>`;
		case 2:
			return `<td><span class="badge d-block bg-success text-theme-900 rounded-0 pt-5px w-70px" style="min-height: 18px">Approved</span></td>`;
	}
}
function CreateDatatableCellAction(application) {
	try {		
		//const isSigned = application.Signs.length !== application.Signs.filter(sign => sign.Status === 'Pending').length;
		//const isCreatedCurrentUser = sessionUserId === application.UserCreated.EmployeeID;
		//const isApproved = application.Signs.length === application.Signs.filter(sign => sign.Status === 'Approved').length;
		//const isRejected = application.Signs.filter(sign => sign.Status === 'Rejected').length > 0;
		//const isPendingSignUser = sessionUserId === application.Signs.find(sign => sign.Status === 'Pending')?.User.CardId;
		//const sessionUserId = $('#SessionUser').data('id');

		const buttons = CreateDatatableCellActionButton(application.Id);


		return `<div class="btn-group">${buttons.detailButton} ${buttons.updateDisabledButton} ${buttons.deleteDisabledButton}</div>`;
	} catch (e) {
		console.error(e);
		return `<div class="btn-group">${button.detailButton} ${button.updateDisabledButton} ${button.deleteDisabledButton}</div>`;
	}

}
function CreateDatatableCellActionButton(IdApplicaion) {
	return {
		detailButton: `<button type="button" data-id="${IdApplicaion}" onclick="DetailMSC(this, event)" title="Detail" class="btn btn-sm btn-primary"><i class="fa-duotone fa-info"></i></button>`,
		updateButton: `<button type="button" data-id="${IdApplicaion}" onclick="UpdateMSC(this, event)" title="Update" class="btn btn-sm btn-warning"><i class="fa-duotone fa-pen"></i></button>`,
		deleteButton: `<button type="button" data-id="${IdApplicaion}" onclick="DeleteMSC(this, event)" title="Delete" class="btn btn-sm btn-danger"><i class="fa-duotone fa-trash"></i></button>`,
		approvButton: `<button type="button" data-id="${IdApplicaion}" onclick="ApprovMSC(this, event)" title="Approv" class="btn btn-sm btn-success"><i class="fa-duotone fa-check"></i></button>`,
		rejectButton: `<button type="button" data-id="${IdApplicaion}" onclick="RejectMSC(this, event)" title="Reject" class="btn btn-sm btn-danger "><i class="fa-duotone fa-x"></i></button>`,
		updateDisabledButton: `<button type="button" class="btn btn-sm btn-default" disabled><i class="fa-duotone fa-pen"></i></button>`,
		deleteDisabledButton: `<button type="button" class="btn btn-sm btn-default" disabled><i class="fa-duotone fa-trash"></i></button>`,
	}
}
/* Datatable Event */
function CreateMSC() {
	ApplicationCreate(function (result) {
		_datas.Application = result;
		datatable.draw(false);
		toastr['success']('Create Application Success.');
	});
}
function DetailMSC(elm, e) {
	let Id = $(elm).data('id');
	ApplicationDetail(Id);
}
function UpdateMSC(elm, e) {
	let Id = $(elm).data('id');
	ApplicationUpdate(Id, function (result) {
		console.log(result);
	});
}
function DeleteMSC(elm, e) {
	let Id = $(elm).data('id');
	let rowIndex = datatable.row($(elm).closest('tr')).index();
	ApplicationDelete(Id, function (result) {
		if (result) {		    
			datatable.draw(false);
		    toastr['success']('Delete Application Success.');
		}
	});
}

/* Other */