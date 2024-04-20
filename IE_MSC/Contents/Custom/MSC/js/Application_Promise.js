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