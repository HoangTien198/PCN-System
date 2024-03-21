$(document).ready(function () {
    loadDataTableMSC();
    btnDetailMSCOnClick();
    btnDeleteMSCOnClick();

    // search info
    searchPCN();
})


function loadDataTableMSC() {
    try {
        onload();
        $.ajax({
            type: "GET",
            url: "/Admin/PCN/Get",
            success: function (response) {
                var dt = JSON.parse(response);

                if (dt) {
                    $("#tblDataMSC").empty();
                    for (var item of dt) {
                        var trHTML = $(`<tr class="trMSC" data-mscid="${item.PCNID}">
                                                <td scope="col">${item.PCNCode}</td>
                                                <td scope="col">${item.RecommendedByName}</td>
                                                <td scope="col">${item.DatetimeYYYYMMDD}</td>
                                                <td scope="col">${item.LstOwnerStatus.map(s => (s.EmployeeCNName + "-" + s.EmployeeVNName)).toString()}</td>
                                                <td scope="col">
                                                    ${(item.Status == -1) ? `<span class="badge bg-danger">Rejected</span>` :
                                                        ((item.Status == 1) ? `<span class="badge bg-warning">Pending</span>` :
                                                        `<span class="badge bg-success">Approved</span>`)}
                                                </td>
                                                <td>
                                                    <button type="button" data-mscid="${item.PCNID}" title="detail" class="btn btn-primary btn-detail-msc"><i class="bi bi-eye"></i></button>
                                                    <button type="button" data-mscid="${item.PCNID}" title="delete" class="btn btn-danger btn-delete-msc"><i class="bi bi-trash"></i></button>
                                                </td>
                                            </tr>`);
                        $("#tblDataMSC").append(trHTML);
                    }
                    endload();
                }
                else {
                    endload();
                    Swal.fire("No data", "No data", "warning");
                }

            },
            error: function (res) {
                endload();
                Swal.fire("Error", "Do not get input data", "warning");
            }
        });
    }
    catch (e) {
        endload();
        Swal.fire("Server Error!", "Please, Contact CPD-TE_Auto to support! (Phone: 31746)", "error");
    }
}

function btnDetailMSCOnClick() {
    $(document).on('click', '.btn-detail-msc', function () {
        try {
            onload();
            var mscID = $(this).data('mscid');
            $.ajax({
                type: "GET",
                url: "/MSC/GetById",
                data: {
                    pcnID: mscID
                },
                dataType: "text",//Kieu du lieu tra ve
                contentType: "application/json",
                success: function (response) {
                    var jsonResult = JSON.parse(response);
                    // binding data lên modal
                    $('.recommendedByName').empty(); $('.recommendedByName').append(`${jsonResult.RecommendedByName}`)
                    $('.mscCodeDetail').empty(); $('.mscCodeDetail').append(`${jsonResult.PCNCode}`)
                    $('.recommendedDate').empty(); $('.recommendedDate').append(`${jsonResult.DatetimeYYYYMMDD}`)
                    $('.userDepartment').empty(); $('.userDepartment').text(jsonResult.DeptNameCreated);
                    $('.statusMSC').empty();
                    (jsonResult.Status == -1) ? ($('.statusMSC').append(`<span class="badge bg-danger"><i class="ri-close-circle-line"></i> Rejected</span>`)) : ((jsonResult.Status == 2) ? $('.statusMSC').append(`<span class="badge bg-success"><i class="bi bi-check-circle me-1"></i> Approved</span>`) : $('.statusMSC').append(`<span class="badge bg-warning"><i class="ri-error-warning-line"></i> Pending</span>`))
                    $('.subjectDetail').empty(); $('.subjectDetail').append(`${jsonResult.Subject}`)
                    $('.mscCodeDetail').empty(); $('.mscCodeDetail').append(`${jsonResult.PCNCode}`)
                    $('.processDetail').empty(); $('.processDetail').append(`${jsonResult.ProcessTitle}`)
                    $('.modelDetail').empty(); $('.modelDetail').append(`${jsonResult.ModelTitle}`)
                    $('.htmlDecodeBeforeChange').empty(); (jsonResult.BeforeChangeDescription) ? $('.htmlDecodeBeforeChange').append(`${jsonResult.BeforeChangeDescription}`) : $('.htmlDecodeBeforeChange').append(``);
                    $('.htmlDecodeAfterChange').empty(); (jsonResult.AfterChangeDescription) ? $('.htmlDecodeAfterChange').append(`${jsonResult.AfterChangeDescription}`) : $('.htmlDecodeAfterChange').append(``);
                    $('.htmlDecodeReason').empty(); (jsonResult.Reason) ? $('.htmlDecodeReason').append(`${jsonResult.Reason}`) : $('.htmlDecodeReason').append(``);
                    $('.htmlDecodeCalculateCost').empty(); (jsonResult.CalculateCost) ? $('.htmlDecodeCalculateCost').append(`${jsonResult.CalculateCost}`) : $('.htmlDecodeCalculateCost').append(``);
                    $('.okStatusMSC').empty(); (jsonResult.Status == 2) ? $('.okStatusMSC').append(`Approved`) : ``;
                    $('.okEffectiveDate').empty(); (jsonResult.EffectiveDate != null) ? ($('.okEffectiveDate').append(formartDateSQLToyyyyMMdd(jsonResult.EffectiveDate))) : ($('.okEffectiveDate').append(``));
                    $('.loadFileBefore').empty(); (jsonResult.BeforeChangeFile) ? $('.loadFileBefore').append(`<a target="_blank" href="/Assets/Media/FileMSC/${jsonResult.BeforeChangeFile}">${jsonResult.BeforeChangeFile}</a>`) : $('.loadFileBefore').append('No file!');
                    $('.loadFileAfter').empty(); (jsonResult.AfterChangeFile) ? $('.loadFileAfter').append(`<a target="_blank" href="/Assets/Media/FileMSC/${jsonResult.AfterChangeFile}">${jsonResult.AfterChangeFile}</a>`) : $('.loadFileAfter').append('No file!');
                    $('.reasonReject').empty(); (jsonResult.RejectReason) ? $('.reasonReject').append(`<span>${jsonResult.RejectReason}</span>`) : $('.reasonReject').append("");
                    //binding phòng ban
                    $('.allDepartmentDetail').empty();
                    if (jsonResult.Status == -1 && (jsonResult.BossRejectBy != null)) {
                        for (var ownerStatus of jsonResult.LstOwnerStatus.sort(x => x.Status)) {
                            if (ownerStatus.Status == -1) {//rejected
                                var divKy = $(`<div class="col-12 mt-2 row align-items-center">
                                                    <span class="col-10"><span class="text-danger">Rejected by ${ownerStatus.EmployeeCNName}-${ownerStatus.EmployeeVNName}</span></span>
                                                </div>`);
                                $('.allDepartmentDetail').append(divKy);
                                break;
                            }
                            else {
                                if (ownerStatus.Status == 1) {//chờ ký
                                    var divKy = $(`<div class="col-12 mt-2 row align-items-center">
                                            <span class="col-2">${ownerStatus.EmployeeCNName}-${ownerStatus.EmployeeVNName}</span>
                                            <span class="col-10">
                                                <button data-employeeid="${ownerStatus.EmployeeID}" data-mscid="${mscID}" type="button" class="btn btn-primary btnSign"><i class="bi bi-pencil-square"></i> Signed</button>
                                                <button data-employeeid="${ownerStatus.EmployeeID}" data-mscid="${mscID}" type="button" class="btn btn-danger btnRejectMSC"><i class="ri-close-fill"></i> Rejected</button>
                                            </span>
                                        </div>`)
                                }
                                if (ownerStatus.Status == 2) {//đã ký=>Show tên người ký
                                    var divKy = $(`<div class="col-12 mt-2 row align-items-center">
                                            <span class="col-2"></span>
                                            <span class="col-10"><span class="text-success">${ownerStatus.EmployeeCNName}-${ownerStatus.EmployeeVNName}</span></span>
                                        </div>`)
                                }
                                $('.allDepartmentDetail').append(divKy);
                            }
                        }
                    }
                    else {
                        for (var ownerStatus of jsonResult.LstOwnerStatus.sort(x => x.Status)) {
                            if (ownerStatus.Status == -1) {//rejected
                                var divKy = $(`<div class="col-12 mt-2 row align-items-center">
                                            <span class="col-2">${ownerStatus.EmployeeCNName}-${ownerStatus.EmployeeVNName}</span>
                                            <span class="col-10"><span class="text-danger">Rejected by ${ownerStatus.EmployeeCNName}-${ownerStatus.EmployeeVNName}</span></span>
                                        </div>`);
                                $('.allDepartmentDetail').append(divKy);
                                $('.reasonReject').empty();
                                $('.reasonReject').append(`<span>${jsonResult.RejectReason}</span></br>`);
                                break;
                            }
                            else {
                                if (ownerStatus.Status == 1) {//chờ ký
                                    var divKy = $(`<div class="col-12 mt-2 row align-items-center">
                                            <span class="col-2">${ownerStatus.EmployeeCNName}-${ownerStatus.EmployeeVNName}</span>
                                            <span class="col-10">
                                                <button data-employeeid="${ownerStatus.EmployeeID}" data-mscid="${mscID}" type="button" class="btn btn-primary btnSign"><i class="bi bi-pencil-square"></i> Signed</button>
                                                <button data-employeeid="${ownerStatus.EmployeeID}" data-mscid="${mscID}" type="button" class="btn btn-danger btnRejectMSC"><i class="ri-close-fill"></i> Rejected</button>
                                            </span>
                                        </div>`)
                                }
                                if (ownerStatus.Status == 2) {//đã ký=>Show tên người ký
                                    var divKy = $(`<div class="col-12 mt-2 row align-items-center">
                                            <span class="col-2">${ownerStatus.EmployeeCNName}-${ownerStatus.EmployeeVNName}</span>
                                            <span class="col-10"><span class="text-success">${ownerStatus.EmployeeCNName}-${ownerStatus.EmployeeVNName}</span></span>
                                        </div>`)
                                }
                                $('.reasonReject').empty(); $('.reasonReject').append(`N/A`);
                                $('.allDepartmentDetail').append(divKy);

                            }
                        }
                    }

                    // show modal details

                    $('#detail-msc-modal').modal('show');

                },
                error: function (res) {
                    Swal.fire("Data input Error!", "Please, Contact CPD-TE_Auto to support! (Phone: 31746)", "error");
                }
            });
            endload();
        } catch (e) {
            endload();
        }


    })
}

function btnDeleteMSCOnClick() {
    $(document).on('click', '.btn-delete-msc', function () {
        var mscID = $(this).data('mscid');
        Swal.fire({
            title: "Warning",
            text: `Are you sure ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then(function (result) {
            if (result.value) {
                //Xác nhận xóa:
                onload();
                var model = {};

                model.pcnId = mscID;
                $.ajax({
                    type: "POST",
                    url: "/Admin/PCN/Delete",
                    data: JSON.stringify(model),
                    dataType: "json",//Kieu du lieu tra ve
                    contentType: "application/json",
                    success: function (response) {
                        endload();
                        if (response == 1) {
                            Swal.fire("Success!", `Delete Success`, "success");
                            //gán lại data default
                            loadDataTableMSC();
                        }
                        else {
                            Swal.fire("Server Error!", "You can press 'Ctrl + F5' to refresh this page! or Contact CPD_AIOT to support!", "error");
                        }
                    },
                    error: function (res) {
                        endload();
                        Swal.fire("Server Error!", "You can press 'Ctrl + F5' to refresh this page! or Contact CPD_AIOT to support!", "error");
                    }
                });
            } else if (result.dismiss === "cancel") {
                //ko làm gì
            }
        });
    })
}

function searchPCN() {
    $("#searchPCN").focus();
    $("#searchPCN").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblDataMSC tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
}