var userProfile;
$(document).ready(function () {
    loadProfileUser();
    btnChangePasswordOnClick();
})

function loadProfileUser() {
    $.ajax({
        type: "Get",
        url: "/DepartmentNormal/Profile/GetProfileUser",
        success: function (response) {
            try {
                userProfile = JSON.parse(response);// user theo database
                var URL = `http://10.224.69.100:8080/postman/api/hr/getEmpObj?id=${userProfile.EmployeeCode}`;
                $.ajax({
                    type: "POST",
                    url: "/Employee/GetByAPI",
                    data: {
                        url: URL
                    },
                    success: function (response) {
                        try {
                            empAPI = JSON.parse(response);// user theo api
                            if (empAPI) {
                                $('.profile-card').empty();
                                var profileCard = $(`${(userProfile.Gender == 0) ? `<img style="height: 150px;" src="/Assets/MSC/images/nu-preview.png" alt="Profile" class="rounded-circle">` :`<img style="height: 150px;" src="/Assets/MSC/images/nam-preview.png" alt="Profile" class="rounded-circle">`}
                                                    <h2 class="profileCode">${empAPI.USER_ID}</h2>
                                                    <h3 class="profileCNName">${empAPI.USER_NAME}</h3>`);
                                $('.profile-card').append(profileCard);

                                $('.empCode').text(`${empAPI.USER_ID}`);
                                $('.empPosition').text(`${empAPI.JOB_TITLE}`);
                                $('.empDept').text(`${empAPI.DEPARTMENT_NAME}`);
                                $('.empFactory').text(`${empAPI.LOCATION}`);
                                $('.empEmail').text(`${(userProfile.Email) ? userProfile.Email : "N/A"}`);
                            }
                            else {
                                Swal.fire("Error!", "Employee Code Input Error!", "error");
                            }
                        }
                        catch (ex) {

                        }

                    },
                    error: function (err) {
                        Swal.fire("Chưa lấy được dữ liệu đầu vào! (Input Data Error!)", "Please, Contact CPD-TE_Auto to support. (Phone: 31746)", "error");
                    }
                });
            } catch (e) {
                Swal.fire("Server Error", "Please, Contact CPD-TE_Auto to support. (Phone: 31746)", "error");
            }
            
        },
        error: function (res) {

            Swal.fire("Data Input Error", "Please, Contact CPD-TE_Auto to support. (Phone: 31746)", "error");
        }
    });
}

function btnChangePasswordOnClick() {
    $(document).on('click', '#btnChangePassword', function () {
        onload();
        //get data input:
        var currentPassword = $('#currentPassword').val();
        var newPassword = $('#newPassword').val();
        var renewPassword = $('#renewPassword').val();

        if (newPassword.trim() == renewPassword.trim()) {
            var data = {};
            data.currentPassword = currentPassword.trim();
            data.newPassword = newPassword.trim();
            data.renewPassword = renewPassword.trim();

            $.ajax({
                type: "POST",
                url: "/DepartmentNormal/Profile/ChangePassword",
                data: JSON.stringify(data),
                dataType: "text",//Kieu du lieu tra ve
                contentType: "application/json",
                success: function (response) {
                    endload();
                    if (response == 1) {
                        Swal.fire("Success", "Change password Success", "success");
                        $('#formChangePassword').trigger('reset');

                        loadProfileUser();
                    }
                    if (response == 0) {
                        Swal.fire("Server Error", "old password is not correct", "error");
                    }
                    if (response == -1) {
                        Swal.fire("Data Input Error", "2 New Password are not the same ", "error");
                    }
                    if (response == -2) {
                        Swal.fire("Server Error", "Please, Contact CPD-TE_Auto to support. (Phone: 31746)", "error");
                    }
                },
                error: function (res) {
                    endload();
                    alert("fail");
                }
            });
        }
        else {
            endload();
            Swal.fire("Data Input Error", "2 New Password are not the same ", "error");
        }
    })
}