var _datas = {};

$(document).ready(async function () {
    const IdApplication = $('#IdApplication').val();

    _datas.Application = await GetApplication(IdApplication);
    _datas.SessionUser = await GetSessionUser();

    $('button.menu-toggler').click();

    CreateDirectSignForm();
  
    
})

function CreateDirectSignForm() {
    _datas.SessionUser.Status = _datas.Application.Signs.find(s => s.IdUser === _datas.SessionUser.Id)?.Status;

    Sign_InitSumernote();
    Sign_SetApplicationInformation(_datas.Application);
    Sign_SetApplicationDetails(_datas.Application);
    Sign_SetApplicationSigns(_datas.Application);   

    if (_datas.SessionUser.Status === 1 && _datas.Application.Status === 1) {
        $('#button-container').show();
    }
    else {
        $('#button-container').hide();
    }

    HideLoad();
}

// Init
function Sign_InitSumernote() {

    if (IsUserHasDepartment('IE') && _datas.SessionUser.Status === 1 && _datas.Application.Status === 1) {
        $('#Sign-CalcCost').summernote({
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

        $('#Sign-Reason').css('height', 'calc(100% - 2.8rem)')
    }
}

// Infor
function Sign_SetApplicationInformation(application) {
    $('#Sign-UserCreated').val(GetUserName(application.UserCreated));
    $('#Sign-Department').val(Sign_GetDepartment(application));
    $('#Sign-DateCreated').val(moment(application.DateCreated).format("YYYY-MM-DD HH:mm:ss"));
    $('#Sign-ApplicationStatus').val(GetApplicationStatus(application));

    $('#Sign-CodePCN').val(application.Code);
    $('#Sign-Subject').val(application.Subject);
    $('#Sign-Process').val(application.Process);
    $('#Sign-Model').val(application.Model);

    Sign_SetApplicationStatusClass(application.Status);
    $('#Sign-DateActived').val(application.Status === 2 ? GetApplicationActiveDate(application) : '');
}
function Sign_GetDepartment(application) {
    if (application.Customer && application.Department) {
        return `[ ${application.Customer.CustomerName} - ${application.Department.DepartmentName} ]`;
    }
    return GetUserDept(application.UserCreated);
}
function Sign_SetApplicationStatusClass(status) {
    const statusElement = $('#Sign-ApplicationStatus');
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
function Sign_SetApplicationDetails(application) {
    $('#Sign-BeforeChange').html(Sign_DecodeContent(application.BeforeChange))
    $('#Sign-AfterChange').html(Sign_DecodeContent(application.AfterChange))
    $('#Sign-Reason').html(Sign_DecodeContent(application.Reason))
    $('#Sign-CalcCost').html(Sign_DecodeContent(application.CalcCost))

    Sign_SetFileLink('#Sign-BeforeChangeFile', application.BeforeChangeFile);
    Sign_SetFileLink('#Sign-AfterChangeFile', application.AfterChangeFile);
}
function Sign_DecodeContent(content) {
    try {
        if (content) return decodeURIComponent(content);
        else return '';
    } catch (e) {
        if (content) return content;
        else return ''
    }
}
function Sign_SetFileLink(elementId, fileName) {
    const element = $(elementId);
    if (fileName) {
        element.text(fileName);
        element.attr('href', `/Data/Files/${fileName}`);
    } else {
        element.attr('href', 'javascript:;');
        element.text('No file');
    }
}

// Sign
function Sign_SetApplicationSigns(application) {
    const signContainer = $('#Sign-Sign');
    signContainer.empty();

    let isReject = application.Signs.some((sign) => { return sign.Status === -1 });
    application.Signs.forEach((sign) => {
        const signItem = Sign_CreateSignItem(sign, isReject);
        signContainer.append(signItem);
    });
}
function Sign_CreateSignItem(sign, isReject) {
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


/* Approve Save */
async function Approve_ApplicationSave() {
    try {
        Swal.fire({
            title: "Approve this application?",
            html: Approve_ApplicationInfor(_datas.Application),
            icon: "question",
            showCancelButton: true,
            confirmButtonText: `<i class="fa-duotone fa-check"></i> Approve`,
            cancelButtonText: `Cancel`,
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
                    Detail: $('#Approve-SignDetail').val()
                }

                const calcCost = IsUserHasDepartment('IE') ? $('#Sign-CalcCost').summernote('code') : null;

                let result = await ApproveApplication(sign, calcCost);

                if (result) {
                    _datas.Application = result;
                    toastr['success']('Approve application Success.');
                    CreateDirectSignForm();
                }
            }
        });
    } catch (e) {
        Swal.fire('Error!', `${GetAjaxErrorMessage(e)}`, 'error');
        console.error(e);
    }
}
function Approve_ApplicationInfor(application) {
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
                <textarea class="form-control overflow-auto" rows="5" style="resize: none;" id="Approve-SignDetail"></textarea>
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
                    Detail: $('#Reject-SignDetail').val()
                }

                const calcCost = IsUserHasDepartment('IE') ? $('#Sign-CalcCost').summernote('code') : null;

                let result = await RejectApplication(sign, calcCost);

                if (result) {
                    _datas.Application = result;
                    toastr['success']('Reject application Success.');
                    CreateDirectSignForm();
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
                <textarea class="form-control overflow-auto" rows="5" style="resize: none;" id="Reject-SignDetail"></textarea>
            </div>`;
}