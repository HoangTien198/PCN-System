/* GET */
function GetApplication(IdApplication) {
    return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/MSC/Management/GetApplication?IdApplication=${IdApplication}`,
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
function GetApplications() {
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/MSC/Management/GetApplications`,
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

/* POST */
function CreateApplication(applicationData) {
	return new Promise(function (resolve, reject) {
		var formData = new FormData();

		applicationData.data.BeforeChangeDescription = encodeURIComponent(applicationData.data.BeforeChangeDescription);
		applicationData.data.AfterChangeDescription = encodeURIComponent(applicationData.data.AfterChangeDescription);
		applicationData.data.Reason = encodeURIComponent(applicationData.data.Reason);

		// Thêm dữ liệu JSON vào FormData
		formData.append('data', JSON.stringify(applicationData.data));
		formData.append('sendToBoss', applicationData.sendToBoss);

		// Thêm tệp trước thay đổi (nếu có)
		if (applicationData.beforeChangeFile) {
			formData.append('beforeChangeFile', applicationData.beforeChangeFile);
		}

		// Thêm tệp sau thay đổi (nếu có)
		if (applicationData.afterChangeFile) {
			formData.append('afterChangeFile', applicationData.afterChangeFile);
		}

		// Gửi tới SV
		$.ajax({
			url: `/MSC/Management/CreateApplication`,
			type: "POST",
			processData: false,
			contentType: false,
			data: formData,
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

/* DELETE */
function DeleteApplication(IdApplication) {
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: `/MSC/Management/DeleteApplication?IdApplication=${IdApplication}`,
			type: "DELETE",
			success: function (res) {
				if (res.status) {
					resolve(res.status);
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