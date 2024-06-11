 async function Delete_User(IdUser) {
    try {
        _datas.User = await GetUser(IdUser);

        Swal.fire({
            title: "Delete this application?",
            html: Delete_UserInfor(_datas.User),
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
                let result = await DeleteUser(_datas.User.Id);

                if (result) {
                    const rowIndex = $(`button[data-id="${_datas.User.Id}"]`).closest('tr').data('index');

                    _datatable.row(rowIndex).remove().draw(false);
                    toastr['success'](`Delete User ${_datas.User.Username} Success.`);
                }
            }
        });

    } catch (e) {
        Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
        console.error(e);
    }
}

function Delete_UserInfor(user) {
    return `<table class="table table-striped table-bordered align-middle fs-6">
                <tbody>
                    <tr>
                        <th class="text-theme text-nowrap">Username</th>
                        <td>${user.Username}</td>
                    </tr>
                    <tr>
                        <th class="text-theme text-nowrap">Name</th>
                        <td>${user.VnName ? user.VnName : user.CnName}</td>
                    </tr>
                    <tr>
                        <th class="text-theme text-nowrap">Date Created</th>
                        <td>${moment(user.CreatedDate).format("YYYY-MM-DD HH:mm:ss") }</td>
                    </tr>
                    <tr>
                        <th class="text-theme text-nowrap">Status</th>
                        <td>${CreateUserDatatableCellStatus(user)}</td>
                    </tr>
                </tbody>
            </table>`;
}