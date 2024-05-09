/* GET */
function GetApplication(IdApplication) {
	console.time("GetApplication");
    return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/MSC/Management/GetApplication?IdApplication=${IdApplication}`,
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
			url: `/MSC/Management/GetApplications`,
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
function CreateApplication(application, files, isSendBoss) {
	console.time("CreateApplication");
	return new Promise(function (resolve, reject) {

		application.BeforeChange = encodeURIComponent(application.BeforeChange);
		application.AfterChange = encodeURIComponent(application.AfterChange);
		application.Reason = encodeURIComponent(application.Reason);

		let formData = new FormData();
		formData.append('IdUserCreated', application.IdUserCreated);
		formData.append('DateCreated', application.DateCreated);
		formData.append('Subject', application.Subject);
		formData.append('Process', application.Process);
		formData.append('Model', application.Model);
		formData.append('BeforeChange', application.BeforeChange);
		formData.append('AfterChange', application.AfterChange);
		formData.append('Reason', application.Reason);
		formData.append('IdCustomer', application.IdCustomer);
		formData.append('IdDepartment', application.IdDepartment);
		formData.append('IsSendBoss', isSendBoss);

		// Thêm dữ liệu cho các chữ ký
		application.Signs.forEach((sign, index) => {
			formData.append(`Signs[${index}].IdUser`, sign.IdUser);
			formData.append(`Signs[${index}].Order`, sign.Order);
		});

		// Thêm tệp nếu có
		if (files.beforeChangeFile) {
			formData.append('BeforeChangeFile', files.beforeChangeFile);
		}
		if (files.afterChangeFile) {
			formData.append('AfterChangeFile', files.afterChangeFile);
		}
		

		// Gửi tới SV
		$.ajax({
			url: `/MSC/Management/CreateApplication`,
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

/* DELETE */
function DeleteApplication(IdApplication) {
	console.time("DeleteApplication");
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/MSC/Management/DeleteApplication?IdApplication=${IdApplication}`,
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