var RejectInitApplicationFormCount = 0;

async function ApplicationReject(IdApplication) {
    try {
        await Reject_GetApplication(IdApplication);

        Reject_CreateApplicationModal(_datas.Application);
        Reject_InitSumernote();

    } catch (e) {
        Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
        console.error(e);
    }
}


/* Create Reject Modal */
function Reject_CreateApplicationModal(application) {
    Reject_SetApplicationInformation(application);
    Reject_SetApplicationDetails(application);
    Reject_SetApplicationSigns(application);

    $('#ApplicationRejectModal').modal('show');
}

// Infor
function Reject_SetApplicationInformation(application) {
    $('#ApplicationRejectModal-UserCreated').val(GetUserName(application.UserCreated));
    $('#ApplicationRejectModal-Department').val(Reject_GetDepartment(application));
    $('#ApplicationRejectModal-DateCreated').val(moment(application.DateCreated).format("YYYY-MM-DD HH:mm:ss"));
    $('#ApplicationRejectModal-ApplicationStatus').val(GetApplicationStatus(application));

    $('#ApplicationRejectModal-CodePCN').val(application.Code);
    $('#ApplicationRejectModal-Subject').val(application.Subject);
    $('#ApplicationRejectModal-Process').val(application.Process);
    $('#ApplicationRejectModal-Model').val(application.Model);

    Reject_SetApplicationStatusClass(application.Status);
    $('#ApplicationRejectModal-DateActived').val(application.Status === 2 ? GetApplicationActiveDate(application) : '');
}
function Reject_GetDepartment(application) {
    if (application.Customer && application.Department) {
        return `[ ${application.Customer.CustomerName} - ${application.Department.DepartmentName} ]`;
    }
    return GetUserDept(application.UserCreated);
}
function Reject_SetApplicationStatusClass(status) {
    const statusElement = $('#ApplicationRejectModal-ApplicationStatus');
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
function Reject_SetApplicationDetails(application) {
    $('#ApplicationRejectModal-BeforeChange').html(Reject_DecodeContent(_datas.Application.BeforeChange))
    $('#ApplicationRejectModal-AfterChange').html(Reject_DecodeContent(_datas.Application.AfterChange))
    $('#ApplicationRejectModal-Reason').html(Reject_DecodeContent(_datas.Application.Reason))
    $('#ApplicationRejectModal-CalcCost').html(Reject_DecodeContent(_datas.Application.CalcCost))

    Reject_SetFileLink('#ApplicationRejectModal-BeforeChangeFile', application.BeforeChangeFile);
    Reject_SetFileLink('#ApplicationRejectModal-AfterChangeFile', application.AfterChangeFile);
}
function Reject_DecodeContent(content) {
    try {
        if (content) return decodeURIComponent(content);
        else return '';
    } catch (e) {
        if (content) return content;
        else return ''
    }
}
function Reject_SetFileLink(elementId, fileName) {
    const element = $(elementId);
    if (fileName) {
        element.text(fileName);
        element.attr('href', `/Data/Files/${fileName}`);
    } else {
        element.attr('href', 'javascript:;');
        element.text('No file');
    }
}
function Reject_InitSumernote() {
    if (IsUserHasDepartment('IE')) {
        $('#ApplicationRejectModal-CalcCost').summernote({
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

        $('#ApplicationRejectModal-Reason').css('height', 'calc(100% - 2.8rem)')
    }
}

// Sign
function Reject_SetApplicationSigns(application) {
    const signContainer = $('#ApplicationRejectModal-Sign');
    signContainer.empty();

    let isReject = application.Signs.some((sign) => { return sign.Status === -1 });
    application.Signs.forEach((sign) => {
        const signItem = Reject_CreateSignItem(sign, isReject);
        signContainer.append(signItem);
    });
}
function Reject_CreateSignItem(sign, isReject) {
    let setup = {
        color: '',
        time: '',
        user: GetUserName(sign.User),
        dept: GetUserSignDepartment(sign),
        detail: sign.Detail ? sign.Detail : '',
    };

    switch (sign.Status) {
        case 1:
            if (isReject) {
                setup.color = 'secondary';
                setup.time = '<span class="text-secondary fw-bold">Close</span>';
            }
            else {
                setup.color = 'warning';
                setup.time = '<span class="text-warning fw-bold">Pending</span>';
            }
            break;
        case 2:
            setup.color = 'success';
            setup.time = `<span class="text-success fw-bold">${moment(sign.DateApproved).format("YYYY-MM-DD HH:mm")}</span>`;
            break;
        case -1:
            setup.color = 'danger';
            setup.time = `<span class="text-danger fw-bold">${moment(sign.DateRejected).format("YYYY-MM-DD HH:mm")}</span>`;
            break;
        default:
    }
    return `
        <div class="widget-reminder-item bg-${setup.color} bg-opacity-10">
            <div class="widget-reminder-time">${setup.time}</div>
            <div class="widget-reminder-divider bg-${setup.color}"></div>
            <div class="widget-reminder-content">
                <div class="fw-bold text-${setup.color}">${setup.user}</div>
                <div class="fs-10px text-${setup.color}">${setup.dept}</div>
                <div class="fs-10px text-${setup.color}">${setup.detail}</div>
            </div>
        </div>`;
}


/* Reject Save */
async function Reject_ApplicationSave() {
    try {
        Swal.fire({
            title: "Reject this application?",
            html: Reject_ApplicationInfor(_datas.Application),
            icon: "question",
            showCancelButton: true,
            confirmButtonText: `<i class="fa-duotone fa-x"></i> Reject`,
            cancelButtonText: `Cancel`,
            buttonsStyling: false,
            reverseButtons: true,
            customClass: {
                cancelButton: 'btn btn-sm btn-outline-secondary me-3',
                confirmButton: 'btn btn-sm btn-danger'
            },
        }).then(async function (confirm) {
            if (confirm.value) {
                const sign = {
                    IdUser: _datas.SessionUser.Id,
                    IdApplication: _datas.Application.Id,
                    Status: -1,
                    Detail: $('#ApplicationRejectModal-SignDetail').val()
                }

                const calcCost = IsUserHasDepartment('IE') ? $('#ApplicationRejectModal-CalcCost').summernote('code') : null;

                let result = await RejectApplication(sign, calcCost);

                if (result) {
                    datatable.draw(false);

                    _datas.Application = result;

                    $('#ApplicationRejectModal').modal('hide');
                    toastr['success']('Reject Application Success.');
                }
            }
        });
    } catch (e) {
        Swal.fire('Error!', `${GetAjaxErrorMessage(e)}`, 'error');
        console.error(e);
    }
}
function Reject_ApplicationInfor(application) {
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
                <textarea class="form-control overflow-auto" rows="5" style="resize: none;" id="ApplicationRejectModal-SignDetail"></textarea>
            </div>`;
}

/* Other */
async function Reject_GetApplication(IdApplication) {
    if (!_datas.Application || _datas.Application.Id.toUpperCase() !== IdApplication.toUpperCase()) {
        _datas.Application = await GetApplication(IdApplication);
    }
}