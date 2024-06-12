/* GET */
function GetDepartment(IdDepartment) {
	console.time("GetDepartment");
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/Department/Management/GetDepartment?IdDepartment=${IdDepartment}`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				console.timeEnd("GetDepartment");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("GetDepartment");
				reject(error);
			}
		});
	});
}
function GetDepartments() {
	console.time("GetDepartments");
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/User/Management/GetDepartments`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				console.timeEnd("GetDepartments");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("GetDepartments");
				reject(error);
			}
		});
	});
}

/* POST */
function CreateDepartment(department) {
	console.time("CreateDepartment");
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/Department/Management/CreateDepartment`,
			type: "POST",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			data: JSON.stringify({ department }),
			success: function (res) {
				console.timeEnd("CreateDepartment");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("CreateDepartment");
				reject(error);
			}
		});
	});
}
function UpdateDepartment(department) {
	console.time("UpdateDepartment");
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/Department/Management/UpdateDepartment`,
			type: "POST",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			data: JSON.stringify({ department }),
			success: function (res) {
				console.timeEnd("UpdateDepartment");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("UpdateDepartment");
				reject(error);
			}
		});
	});
}
function DeleteDepartment(IdDepartment) {
	console.time("DeleteDepartment");
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/Department/Management/DeleteDepartment`,
			type: "POST",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			data: JSON.stringify({ IdDepartment }),
			success: function (res) {
				console.timeEnd("DeleteDepartment");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("DeleteDepartment");
				reject(error);
			}
		});
	});
}