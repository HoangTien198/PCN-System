var InitApplicationApproveFormCount = 0;

async function ApplicationApprove(IdApplication) {
    try {
        await GetApproveApplication(IdApplication);

        CreateApplicationApproveModal(_datas.Application);
        InitApproveSumernote();

    } catch (e) {
        Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
        console.error(e);
    }
}


/* Create Approve Modal */
function CreateApplicationApproveModal(application) {
    console.log(application);

    SetApplicationApproveInformation(application);
    SetApplicationApproveDetails(application);
    SetApplicationApproveSigns(application);

    $('#ApplicationApproveModal').modal('show');
}

// Infor
function SetApplicationApproveInformation(application) {
    $('#ApplicationApproveModal-UserCreated').val(GetUserName(application.UserCreated));
    $('#ApplicationApproveModal-Department').val(GetApproveDepartment(application));
    $('#ApplicationApproveModal-DateCreated').val(moment(application.DateCreated).format("YYYY-MM-DD HH:mm:ss"));
    $('#ApplicationApproveModal-ApplicationStatus').val(GetApplicationStatus(application));

    SetApplicationApproveStatusClass(application.Status);
    $('#ApplicationApproveModal-DateActived').val(application.Status === 2 ? GetApplicationActiveDate(application) : '');

    $('#ApplicationApproveModal-CodePCN').val(application.Code);
    $('#ApplicationApproveModal-Subject').val(application.Subject);
    $('#ApplicationApproveModal-Process').val(application.Process);
    $('#ApplicationApproveModal-Model').val(application.Model);
}
function GetApproveDepartment(application) {
    if (application.Customer && application.Department) {
        return `[ ${application.Customer.CustomerName} - ${application.Department.DepartmentName} ]`;
    }
    return GetUserDept(application.UserCreated);
}
function SetApplicationApproveStatusClass(status) {
    const statusElement = $('#ApplicationApproveModal-ApplicationStatus');
    statusElement.removeClass();

    switch (status) {
        case -1:
            statusElement.addClass('form-control text-truncate bg-opacity-10 text-danger bg-danger');
            break;
        case 1:
            statusElement.addClass('form-control text-truncate bg-opacity-10 text-warning bg-warning');
            break;
        case 2:
            statusElement.addClass('form-control text-truncate bg-opacity-10 text-success bg-success');
            break;
    }
}

// Detail
function SetApplicationApproveDetails(application) {
    try { $('#ApplicationApproveModal-BeforeChange').html(decodeURIComponent(_datas.Application.BeforeChange)) }
    catch { $('#ApplicationApproveModal-BeforeChange').html(_datas.Application.BeforeChange) }

    try { $('#ApplicationApproveModal-AfterChange').html(decodeURIComponent(_datas.Application.AfterChange)) }
    catch { $('#ApplicationApproveModal-AfterChange').html(_datas.Application.AfterChange) }

    try { $('#ApplicationApproveModal-Reason').html(decodeURIComponent(_datas.Application.Reason)) }
    catch { $('#ApplicationApproveModal-Reason').html(_datas.Application.Reason) }

    SetApproveFileLink('#ApplicationApproveModal-BeforeChangeFile', application.BeforeChangeFile);
    SetApproveFileLink('#ApplicationApproveModal-AfterChangeFile', application.AfterChangeFile);
}
function SetApproveFileLink(elementId, fileName) {
    const element = $(elementId);
    if (fileName) {
        element.text(fileName);
        element.attr('href', `/Data/Files/${fileName}`);
    } else {
        element.attr('href', 'javascript:;');
        element.text('No file');
    }
}
function InitApproveSumernote() {
    if (IsUserHasDepartment('IE')) {
        $('#ApplicationApproveModal-CalcCost').summernote({
            height: 200,
            foreColor: 'White',
            fontName: 'Arial',
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['fontsize', ['fontname', 'fontsize']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['color', ['color']],
                ['table', ['table']],
            ],
        });

        $('#ApplicationApproveModal-Reason').css('height', 'calc(100% - 2.8rem)')
    }
}

// Sign
function SetApplicationApproveSigns(application) {
    const signContainer = $('#ApplicationApproveModal-Sign');
    signContainer.empty();

    let isReject = false;
    application.Signs.forEach((sign) => {
        if (sign.Status === -1) {
            isReject = true;
            const signItem = CreateRejectedSignItem(sign);

            signContainer.append(signItem);
        } else {
            const signItem = CreateSignItem(sign, isReject);

            signContainer.append(signItem);
        }
    });
}
function CreateRejectedSignItem(sign) {
    const time = `<span class="text-danger fw-bold">${moment(sign.DateRejected).format("YYYY-MM-DD HH:mm")}</span>`;
    return `
        <div class="widget-reminder-item bg-danger bg-opacity-10">
            <div class="widget-reminder-time">${time}</div>
            <div class="widget-reminder-divider bg-danger"></div>
            <div class="widget-reminder-content">
                <div class="fw-bold text-danger">${GetUserName(sign.User)}</div>
                <div class="fs-10px text-danger">${GetUserDept(sign.User)}</div>
                <div class="fs-13px text-danger">${sign.Detail}</div>
            </div>
        </div>`;
}
function CreateSignItem(sign, isReject) {
    const color = sign.Status === 1 ? "warning" : "success";
    const time = sign.Status === 1 ? '<span class="text-warning fw-bold">Pending</span>' : `<span class="text-success fw-bold">${moment(sign.DateApproved).format("YYYY-MM-DD HH:mm")}</span>`;

    if (isReject) {
        return `
            <div class="widget-reminder-item bg-secondary bg-opacity-10">
                <div class="widget-reminder-time"><span class="text-secondary fw-bold">Closed</span></div>
                <div class="widget-reminder-divider bg-secondary"></div>
                <div class="widget-reminder-content">
                    <div class="fw-bold text-secondary">${GetUserName(sign.User)}</div>
                    <div class="fs-10px">${GetUserDept(sign.User)}</div>
                </div>
            </div>`;
    }

    return `
        <div class="widget-reminder-item bg-${color} bg-opacity-10">
            <div class="widget-reminder-time">${time}</div>
            <div class="widget-reminder-divider bg-${color}"></div>
            <div class="widget-reminder-content">
                <div class="fw-bold text-${color}">${GetUserName(sign.User)}</div>
                <div class="fs-10px text-${color}">${GetUserDept(sign.User)}</div>
            </div>
        </div>`;
}

/* Approve Save */
async function ApplicationApproveSave() {
    try {
        Swal.fire({
            title: "Approve this application?",
            html: ApplicationApproveInfor(_datas.Application),
            icon: "question",
            showCancelButton: true,
            confirmButtonText: `<i class="fa-duotone fa-check"></i> Approve`,
            cancelButtonText: `<i class="fa-duotone fa-x"></i> Cancel`,
            buttonsStyling: false,
            reverseButtons: true,
            customClass: {
                cancelButton: 'btn btn-sm btn-outline-secondary me-3',
                confirmButton: 'btn btn-sm btn-success'
            },
        }).then(async function (confirm) {
            if (confirm.value) {
                const sign = {
                    IdUser: _datas.SessionUser.Id,
                    IdApplication: _datas.Application.Id,
                    Status: 2,
                    Detail: $('#ApplicationApproveModal-SignDetail').val()
                }

                const calcCost = IsUserHasDepartment('IE') ? $('#ApplicationApproveModal-CalcCost').summernote('code') : null;

                let result = await ApproveApplication(sign, calcCost);

                if (result) {
                    datatable.draw(false);
                    toastr['success']('Approve Application Success.');
                }
            }
        });
    } catch (e) {
        Swal.fire('Error!', `${GetAjaxErrorMessage(e)}`, 'error');
        console.error(e);
    }
}
function ApplicationApproveInfor(application) {
    return `<table class="table table-striped table-bordered align-middle fs-6">
                <tbody>
                    <tr>
                        <th class="text-theme text-nowrap">PCN單號<br />Mã số</th>
                        <td class="text-start">${application.Code}</td>
                    </tr>
                    <tr>
                        <th class="text-theme text-nowrap">日期<br />Ngày</th>
                        <td class="text-start">${moment(application.DateCreated).format("YYYY-MM-DD HH:mm")}</td>
                    </tr>
                    <tr>
                        <th class="text-theme text-nowrap">制作人<br />Người đề nghị</th>
                        <td class="text-start">${GetUserName(application.UserCreated)}</td>
                    </tr>
                    <tr>
                        <th class="text-theme text-nowrap">主題<br />Chủ đề</th>
                        <td class="text-start">${application.Subject}</td>
                    </tr>
                </tbody>
            </table>
            <div class="form-group mb-3 text-start">
                <label class="form-label">理由（如果有) / Lý do (nếu có)</label>
                <textarea class="form-control overflow-auto" rows="5" style="resize: none;" id="ApplicationApproveModal-SignDetail"></textarea>
            </div>`;
}

/* Other */
async function GetApproveApplication(IdApplication) {
    if (!_datas.Application || _datas.Application.Id.toUpperCase() !== IdApplication.toUpperCase()) {
        _datas.Application = await GetApplication(IdApplication);
    }
}
function IsUserHasDepartment(departmentName) {
    if (_datas.SessionUser.UserDepartments.some(dept => { return dept.Department.DepartmentName.toUpperCase().includes(departmentName) })) {
        return true;
    }
    else {
        return false;
    }
}