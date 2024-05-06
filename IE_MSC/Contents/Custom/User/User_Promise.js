function GetUsers() {
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/User/Management/GetUsers`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				reject(error);
			}
		});
	});
}
function GetUser(Id) {
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/User/Management/GetUser?Id=${Id}`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				reject(error);
			}
		});
	});
}
function GetSessionUser() {
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/User/Management/GetSessionUser`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				reject(error);
			}
		});
	});
}
function GetDepartments() {
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/User/Management/GetDepartments`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				reject(error);
			}
		});
	});
}
function GetCustomerDepartments() {
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/User/Management/GetCustomerDepartments`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				reject(error);
			}
		});
	});
}