$(document).ready(function () {
    setInterval(function () {
        checkSession();
    }, 5000);
    onload();
    loadDataTableMSC();
    searchMSC();
    trMSCOnClick();
    btnDetailMSCOnClick();
    btnSignOnClick();
    btnRejectMSCOnclick();
    navItemOnClick();
})

function loadDataTableMSC() {
    try {
        $.ajax({
            type: "GET",
            url: "/Boss/MSC/GetMSCByAccount",
            success: function (response) {
                var dt = JSON.parse(response);
               
                if (dt) {
                    var lstWaitToSign = dt[0].LstPCN;
                    var lstWaitForApproval = dt[1].LstPCN;
                    var lstApproved = dt[2].LstPCN;
                    var lstRejected = dt[3].LstPCN;

                    (lstWaitToSign) ? $('.waitingToSignQty').text(lstWaitToSign.length) : $('.waitingToSignQty').text(0);
                    (lstApproved) ? $('.approvedQty').text(lstApproved.length) : $('.approvedQty').text(0);
                    (lstRejected) ? $('.rejectedQty').text(lstRejected.length) : $('.rejectedQty').text(0);

                    if (lstWaitToSign) {
                        $("#tblDataMSCWaitToSign").empty();
                        for (var item of lstWaitToSign) {
                            var checkToBindingButton = 1;
                            for (var checkConfirmDept of item.LstOwnerStatus) {
                                if (checkConfirmDept.Status != 1) {
                                    checkToBindingButton = 0;
                                    break;
                                }
                            }
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
                                                ${(checkToBindingButton == 1) ?
                                    `<td>
                                                    <button type="button" data-mscid="${item.PCNID}" title="detail" class="btn btn-primary btn-detail-msc"><i class="bi bi-eye"></i></button>
                                                    <button type="button" data-mscid="${item.PCNID}" title="edit" class="btn btn-warning btn-edit-msc"><i class="bi bi-pencil"></i></button>
                                                </td>`:
                                    `<td>
                                                    <button type="button" data-mscid="${item.PCNID}" title="detail" class="btn btn-primary btn-detail-msc"><i class="bi bi-eye"></i></button>
                                                </td>`}
                                            </tr>`);
                            $("#tblDataMSCWaitToSign").append(trHTML);
                        }
                    }
                    if (lstApproved) {
                        $("#tblDataMSCApproved").empty();
                        for (var item of lstApproved) {
                            var checkToBindingButton = 1;
                            for (var checkConfirmDept of item.LstOwnerStatus) {
                                if (checkConfirmDept.Status != 1) {
                                    checkToBindingButton = 0;
                                    break;
                                }

                            }
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
                                                ${(checkToBindingButton == 1) ?
                                    `<td>
                                                    <button type="button" data-mscid="${item.PCNID}" title="detail" class="btn btn-primary btn-detail-msc"><i class="bi bi-eye"></i></button>
                                                    <button type="button" data-mscid="${item.PCNID}" title="edit" class="btn btn-warning btn-edit-msc"><i class="bi bi-pencil"></i></button>
                                                </td>`:
                                    `<td>
                                                    <button type="button" data-mscid="${item.PCNID}" title="detail" class="btn btn-primary btn-detail-msc"><i class="bi bi-eye"></i></button>
                                                </td>`}
                                            </tr>`);
                            $("#tblDataMSCApproved").append(trHTML);
                        }
                    }
                    if (lstRejected) {
                        $("#tblDataMSCRejected").empty();
                        for (var item of lstRejected) {
                            var checkToBindingButton = 1;
                            for (var checkConfirmDept of item.LstOwnerStatus) {
                                if (checkConfirmDept.Status != 1) {
                                    checkToBindingButton = 0;
                                    break;
                                }

                            }
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
                                                ${(checkToBindingButton == 1) ?
                                    `<td>
                                                    <button type="button" data-mscid="${item.PCNID}" title="detail" class="btn btn-primary btn-detail-msc"><i class="bi bi-eye"></i></button>
                                                    <button type="button" data-mscid="${item.PCNID}" title="edit" class="btn btn-warning btn-edit-msc"><i class="bi bi-pencil"></i></button>
                                                </td>`:
                                    `<td>
                                                    <button type="button" data-mscid="${item.PCNID}" title="detail" class="btn btn-primary btn-detail-msc"><i class="bi bi-eye"></i></button>
                                                </td>`}
                                            </tr>`);
                            $("#tblDataMSCRejected").append(trHTML);
                        }
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
    } catch (e) {
        endload();
        Swal.fire("Server Error!", "Please, Contact CPD-TE_Auto to support! (Phone: 31746)", "error");
    }

}

function SetTrigger(id) {
    $('#' + id).trigger('click')
    $('#' + id).blur();
    $('#searchMSC').val("");
    $('#searchMSC').keyup();
    $('#searchMSC').focus();
}

function navItemOnClick() {
    $(document).on('click', 'button.nav-link', function () {
        $('#searchMSC').val("");
        $('#searchMSC').keyup();
        $('#searchMSC').focus();
    })
}

function trMSCOnClick() {
    $(document).on('click', '.trMSC', function () {
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
                    //$('.userDepartment').empty(); $('.userDepartment').append(jsonResult.RecommendedByDepartment);
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
                    //$('.userDepartment').empty(); $('.userDepartment').append(jsonResult.RecommendedByDepartment);
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

function btnSignOnClick() {
    $(document).on('click', '.btnSign', function () {
        onload();
        // binding data
        var data = {};
        data.MSCID = $(this).data('mscid');
        data.EmployeeID = $(this).data('employeeid');
        // post data
        $.ajax({
            type: "POST",
            url: "/Boss/MSC/ConfirmMSC",
            data: JSON.stringify(data),
            dataType: "text",//Kieu du lieu tra ve
            contentType: "application/json",
            success: function (response) {
                endload();
                if (response == 0) {
                    Swal.fire("Warning!", "You are not authorized to sign", "warning");
                }
                else if (response == 1) {
                    Swal.fire("Success!", "Signed", "success");
                    $('#detail-msc-modal').modal('hide');
                    loadDataTableMSC();
                }
                else if (response == 2) {
                    Swal.fire("Warning!", "Please wait in order of the signing process", "warning");
                }
                else {
                    Swal.fire("Server Error!", "Please, Contact CPD-TE_Auto to support! (Phone: 31746)", "error");
                }
            },
            error: function (res) {
                endload();
                Swal.fire("Data input Error!", "Please, Contact CPD-TE_Auto to support! (Phone: 31746)", "error");
            }
        });
    })
}

//click btnRejectMSC
function btnRejectMSCOnclick() {
    $(document).on('click', '.btnRejectMSC', function () {
        var mscID = $(this).data('mscid');
        var empID = $(this).data('employeeid');

        Swal.fire({
            html: true,
            title: 'Reason ?',
            icon: "warning",
            // html: "<input id='lineLeaderReasonReject' class='swal2-input' required/>",
            html: `<textarea id="deptReasonReject" class='swal2-textarea' required rows="6" cols="30">`,
            confirmButtonText: 'Gửi',
            showCancelButton: true,
            cancelButtonText: "Hủy bỏ!",
            reverseButtons: true,
            preConfirm: () => {
                if (document.getElementById('deptReasonReject').value) {
                    var reasonReject = document.getElementById('deptReasonReject').value;
                    var data = {};
                    data.EmployeeID = empID;
                    data.PCNID = mscID;
                    data.ReasonReject = reasonReject;
                    $.ajax({
                        type: "POST",
                        url: "/Boss/MSC/RejectMSC",
                        data: JSON.stringify(data),
                        dataType: "text",
                        contentType: "application/json",
                        success: function (response) {
                            try {
                                if (response == 1) {
                                    Swal.fire("Success", "Rejected!", "success");
                                    //nếu modal đang mở
                                    $("#detail-msc-modal").modal('hide');//đóng modal
                                    loadDataTableMSC();
                                }
                                else if (response == 0) {
                                    Swal.fire("Warning!", "You are not authorized to reject", "warning");
                                }
                                else if (response == 2) {
                                    Swal.fire("Warning!", "Please Wait for other departments to confirm", "warning");
                                }
                                else {
                                    Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận CPD-AIOT để được trợ giúp. Số máy: 31746", "error");
                                }
                            }
                            catch (ex) {
                                Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận CPD-AIOT để được trợ giúp. Số máy: 31746", "error");
                            }

                        },
                        error: function (err) {
                            Swal.fire("Có lỗi xảy ra", "Liên hệ bộ phận CPD-AIOT để được trợ giúp. Số máy: 31746", "error");
                        }
                    });

                } else {
                    Swal.showValidationMessage('Press your reason!');
                }
            }
        })
    })
}
