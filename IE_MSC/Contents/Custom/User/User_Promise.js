
/* GET */
function GetUserInformation(CardID) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: "/User/Management/GetUserInformation?username=" + CardID,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				if (res.status) {
					resolve(JSON.parse(res.data));
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				reject(GetAjaxErrorMessage(error));
			}
		});
	});
}
function GetUsers() {
	console.time("GetUsers");
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/User/Management/GetUsers`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			async: false,
			success: function (res) {
				console.timeEnd("GetUsers");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("GetUsers");
				reject(error);
			}
		});
	});
}
function GetUser(Id) {
	console.time("GetUser");
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/User/Management/GetUser?Id=${Id}`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				console.timeEnd("GetUser");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("GetUser");
				reject(error);
			}
		});
	});
}
function GetSessionUser() {
	console.time("GetSessionUser");
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/User/Management/GetSessionUser`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				console.timeEnd("GetSessionUser");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("GetSessionUser");
				reject(error);
			}
		});
	});
}

/* POST */
function CreateUser(user) {
	console.time("CreateUser");
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/User/Management/CreateUser`,
			type: "POST",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			data: JSON.stringify({ user }),
			success: function (res) {
				console.timeEnd("CreateUser");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("CreateUser");
				reject(error);
			}
		});
	});
}
function UpdateUser(user) {
	console.time("UpdateUser");
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/User/Management/UpdateUser`,
			type: "POST",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			data: JSON.stringify({ user }),
			success: function (res) {
				console.timeEnd("UpdateUser");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("UpdateUser");
				reject(error);
			}
		});
	});
}
function DeleteUser(IdUser) {
	console.time("DeleteUser");
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/User/Management/DeleteUser`,
			type: "POST",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			data: JSON.stringify({ IdUser }),
			success: function (res) {
				console.timeEnd("DeleteUser");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("DeleteUser");
				reject(error);
			}
		});
	});
}