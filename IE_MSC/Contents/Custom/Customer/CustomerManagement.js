var _CustomerDatatable, _DepartmentDatatable, _UserDatatable, _datas = {};

$(document).ready(async function () {
	_datas.Customers = await GetCustomers();
	_datas.Users = await GetUsers();

	InitCustomerDatatable();
	InitDepartmentDatatable();
	InitUserDatatable();

	CreateCustomerDatatable();
});