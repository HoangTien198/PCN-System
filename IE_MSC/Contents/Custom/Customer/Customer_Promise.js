
/* GET */
function GetCustomer(IdCustomer) {
	console.time("GetCustomer");
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/Customer/Management/GetCustomer?IdCustomer=${IdCustomer}`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				console.timeEnd("GetCustomer");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("GetCustomer");
				reject(error);
			}
		});
	});
}
function GetCustomers() {
	console.time("GetCustomers");
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/Customer/Management/GetCustomers`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				console.timeEnd("GetCustomers");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("GetCustomers");
				reject(error);
			}
		});
	});
}

/* POST */
function CreateCustomer(customer) {
	console.time("CreateCustomer");
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/Customer/Management/CreateCustomer`,
			type: "POST",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			data: JSON.stringify({ customer }),
			success: function (res) {
				console.timeEnd("CreateCustomer");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("CreateCustomer");
				reject(error);
			}
		});
	});
}
function UpdateCustomer(customer) {
	console.time("UpdateCustomer");
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/Customer/Management/UpdateCustomer`,
			type: "POST",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			data: JSON.stringify({ customer }),
			success: function (res) {
				console.timeEnd("UpdateCustomer");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("UpdateCustomer");
				reject(error);
			}
		});
	});
}
function DeleteCustomer(IdCustomer) {
	console.time("DeleteCustomer");
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/Customer/Management/DeleteCustomer`,
			type: "POST",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			data: JSON.stringify({ IdCustomer }),
			success: function (res) {
				console.timeEnd("DeleteCustomer");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("DeleteCustomer");
				reject(error);
			}
		});
	});
}