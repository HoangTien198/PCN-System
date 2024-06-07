async function ApplicationDelete(IdApplication, callback) {
    try {
        await GetDeleteApplication(IdApplication);

        Swal.fire({
            title: "Delete this application?",
            html: ApplicationDeleteInfor(_datas.Application),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `<i class="fa-duotone fa-trash"></i> Delete`,
            cancelButtonText: `<i class="fa-duotone fa-x"></i> Cancel`,
            buttonsStyling: false,
            reverseButtons: true,
            customClass: {
                cancelButton: 'btn btn-sm btn-outline-secondary me-3',
                confirmButton: 'btn btn-sm btn-danger'
            },
        }).then(async function (confirm) {
            if (confirm.value) {
                let result = await DeleteApplication(_datas.Application.Id);
                callback(result);
            }
        });

    } catch (e) {
        console.error(e);
        Swal.fire("Có lỗi xảy ra!", e, "error");
    }
}
function ApplicationDeleteInfor(application) {
    return `<table class="table table-striped table-bordered align-middle fs-6">
                <tbody>
                    <tr>
                        <th class="text-theme text-nowrap">PCN單號<br />Mã số</th>
                        <td>${application.Code}</td>
                    </tr>
                    <tr>
                        <th class="text-theme text-nowrap">日期<br />Ngày</th>
                        <td>${moment(application.DateCreated).format("YYYY-MM-DD HH:mm")}</td>
                    </tr>
                    <tr>
                        <th class="text-theme text-nowrap">制作人<br />Người đề nghị</th>
                        <td>${GetUserName(application.UserCreated)}</td>
                    </tr>
                    <tr>
                        <th class="text-theme text-nowrap">主題<br />Chủ đề</th>
                        <td>${application.Subject}</td>
                    </tr>
                </tbody>
            </table>`;
}
/* Other */
async function GetDeleteApplication(IdApplication) {
    if (!_datas.Application || _datas.Application.Id.toUpperCase() !== IdApplication.toUpperCase()) {
        _datas.Application = await GetApplication(IdApplication);
    }
}