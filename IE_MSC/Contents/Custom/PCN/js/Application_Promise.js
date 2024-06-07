/* GET */
function GetApplication(IdApplication) {
	console.time("GetApplication");
    return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/PCN/Management/GetApplication?IdApplication=${IdApplication}`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				console.timeEnd("GetApplication");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("GetApplication");
				reject(error);
			}
		});
    });
}
function GetApplications() {
	console.time("GetApplications");
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/PCN/Management/GetApplications`,
			type: "GET",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (res) {
				console.timeEnd("GetApplications");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("GetApplications");
				reject(error);
			}
		});
	});
}

/* POST */
function CreateApplication(application) {
	console.time("CreateApplication");
	return new Promise(function (resolve, reject) {
		let formData = CreateApplicationFormData(application);
		// Gửi tới SV
		$.ajax({
			url: `/PCN/Management/CreateApplication`,
			type: "POST",
			processData: false,
			contentType: false,
			data: formData,
			success: function (res) {
				console.timeEnd("CreateApplication");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("CreateApplication");
				reject(error);
			}
		});
	});
}
function UpdateApplication(application) {
	console.time("UpdateApplication");
	return new Promise(function (resolve, reject) {
		let formData = CreateApplicationFormData(application);
		// Gửi tới SV
		$.ajax({
			url: `/PCN/Management/UpdateApplication`,
			type: "POST",
			processData: false,
			contentType: false,
			data: formData,
			success: function (res) {
				console.timeEnd("UpdateApplication");
				if (res.status) {
					resolve(res.data);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("UpdateApplication");
				reject(error);
			}
		});
	});
}
function CreateApplicationFormData(application) {
	application.BeforeChange = encodeURIComponent(application.BeforeChange);
	application.AfterChange = encodeURIComponent(application.AfterChange);
	application.Reason = encodeURIComponent(application.Reason);
	application.CalcCost = encodeURIComponent(application.CalcCost);

	let formData = new FormData();
	formData.append('Id', application?.Id);
	formData.append('IdUserCreated', application.IdUserCreated);
	formData.append('DateCreated', application.DateCreated);
	formData.append('Subject', application.Subject);
	formData.append('Process', application.Process);
	formData.append('Model', application.Model);
	formData.append('BeforeChange', application.BeforeChange);
	formData.append('AfterChange', application.AfterChange);
	formData.append('Reason', application.Reason);
	formData.append('CalcCost', application.CalcCost);
	formData.append('IdCustomer', application.IdCustomer);
	formData.append('IdDepartment', application.IdDepartment);
	formData.append('IsSendBoss', application.IsSendBoss);

	// Thêm dữ liệu cho các chữ ký
	application.Signs.forEach((sign, index) => {
		formData.append(`Signs[${index}].IdCustomer`, sign.IdCustomer);
		formData.append(`Signs[${index}].IdDepartment`, sign.IdDepartment);
		formData.append(`Signs[${index}].IdUser`, sign.IdUser);
		formData.append(`Signs[${index}].Order`, sign.Order);
	});

	// Thêm tệp nếu có
	if (application.Files.BeforeChangeFile) {
		formData.append('BeforeChangeFile', application.Files.BeforeChangeFile);
	}
	if (application.Files.AfterChangeFile) {
		formData.append('AfterChangeFile', application.Files.AfterChangeFile);
	}

	return formData;
}

/* DELETE */
function DeleteApplication(IdApplication) {
	console.time("DeleteApplication");
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/PCN/Management/DeleteApplication?IdApplication=${IdApplication}`,
			type: "DELETE",
			success: function (res) {
				console.timeEnd("DeleteApplication");
				if (res.status) {
					resolve(res.status);
				}
				else {
					reject(res.message);
				}
			},
			error: function (error) {
				console.timeEnd("DeleteApplication");
				reject(error);
			}
		});
	});
}