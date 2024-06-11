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