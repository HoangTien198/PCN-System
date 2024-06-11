
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