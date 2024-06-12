var datatable, _datas = {};
$(document).ready(async function () {
	InitDatatable();

	$('.dt-buttons button').removeClass('disabled');
});

/* Datatable */
function InitDatatable() {
	var calHeight = CalTableHeight();

	var config = {
		ajax: {
			url: "/PCN/Management/GetApplicationsServerSide",
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
		searchDelay: 100,
		scrollY: calHeight.tableHeight,
		lengthMenu: calHeight.lengthMenu,
		dom: "<'row mb-3'<'col-md-4 mb-3 mb-md-0'l><'col-md-8 text-right'<'d-flex justify-content-end'f>>>t<'row align-items-center'<'mr-auto col-md-6 mb-3 mb-md-0 mt-n2 'i><'mb-0 col-md-6'p>>",
		columnDefs: [
			{ targets: [0, 1, 2, 4, 5, 6, 7], orderable: false },		
			{ targets: [0], visible: false },
			{ targets: [4], className: 'fw-bold' },			
		],
		language: {
			search: "<i class='fa fa-search'></i>",
			paginate: {
				previous: '<i class="fa-duotone fa-backward"></i>',
				next: '<i class="fa-duotone fa-forward"></i>'
			}
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
/* Datatable Event */
function Detail(elm, e) {
	let Id = $(elm).data('id');
	ApplicationDetail(Id);
}