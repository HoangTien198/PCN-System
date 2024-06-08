async function ApplicationDetail(IdApplication) {
    try {
        await GetDetailApplication(IdApplication);

        CreateApplicationDetailModal(_datas.Application);

    } catch (e) {
        Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
        console.error(e);
    }
}


function CreateApplicationDetailModal(application) {
    console.log(application);

    SetApplicationInformation(application);
    SetApplicationDetails(application);
    SetApplicationSigns(application);

    $('#ApplicationDetailModal').modal('show');
}

// Infor
function SetApplicationInformation(application) {
    $('#ApplicationDetailModal-UserCreated').val(GetUserName(application.UserCreated));
    $('#ApplicationDetailModal-Department').val(GetDepartment(application));
    $('#ApplicationDetailModal-DateCreated').val(moment(application.DateCreated).format("YYYY-MM-DD HH:mm:ss"));
    $('#ApplicationDetailModal-ApplicationStatus').val(GetApplicationStatus(application));

    SetApplicationStatusClass(application.Status);
    $('#ApplicationDetailModal-DateActived').val(application.Status === 2 ? GetApplicationActiveDate(application) : '');

    $('#ApplicationDetailModal-CodePCN').val(application.Code);
    $('#ApplicationDetailModal-Subject').val(application.Subject);
    $('#ApplicationDetailModal-Process').val(application.Process);
    $('#ApplicationDetailModal-Model').val(application.Model);
}
function GetDepartment(application) {
    if (application.Customer && application.Department) {
        return `[ ${application.Customer.CustomerName} - ${application.Department.DepartmentName} ]`;
    }
    return GetUserDept(application.UserCreated);
}
function SetApplicationStatusClass(status) {
    const statusElement = $('#ApplicationDetailModal-ApplicationStatus');
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
function SetApplicationDetails(application) {
    $('#ApplicationDetailModal-BeforeChange').html(DecodeContent(application.BeforeChange));
    $('#ApplicationDetailModal-AfterChange').html(DecodeContent(application.AfterChange));
    $('#ApplicationDetailModal-Reason').html(decodeURIComponent(application.Reason));
    $('#ApplicationDetailModal-Cost').html(application.CalcCost ? decodeURIComponent(application.CalcCost) : '');

    SetFileLink('#ApplicationDetailModal-BeforeChangeFile', application.BeforeChangeFile);
    SetFileLink('#ApplicationDetailModal-AfterChangeFile', application.AfterChangeFile);
}
function DecodeContent(content) {
    try {
        return decodeURIComponent(content);
    } catch (e) {
        return content;
    }
}
function SetFileLink(elementId, fileName) {
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
function SetApplicationSigns(application) {
    const signContainer = $('#ApplicationDetailModal-Sign');
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



/* Other */
async function GetDetailApplication(IdApplication) {
    if (!_datas.Application || _datas.Application.Id.toUpperCase() !== IdApplication.toUpperCase()) {
        _datas.Application = await GetApplication(IdApplication);
    }
}