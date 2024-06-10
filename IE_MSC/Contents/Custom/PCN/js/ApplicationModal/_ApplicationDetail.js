async function ApplicationDetail(IdApplication) {
    try {
        await Detail_GetApplication(IdApplication);

        Detail_CreateApplicationModal(_datas.Application);

    } catch (e) {
        Swal.fire('error', `${GetAjaxErrorMessage(e)}`, 'error');
        console.error(e);
    }
}

function Detail_CreateApplicationModal(application) {
    Detail_SetInformation(application);
    Detail_SetDetails(application);
    Detail_SetSigns(application);

    $('#ApplicationDetailModal').modal('show');
}

// Infor
function Detail_SetInformation(application) {
    $('#ApplicationDetailModal-UserCreated').val(GetUserName(application.UserCreated));
    $('#ApplicationDetailModal-Department').val(Detail_GetDepartment(application));
    $('#ApplicationDetailModal-DateCreated').val(moment(application.DateCreated).format("YYYY-MM-DD HH:mm:ss"));
    $('#ApplicationDetailModal-ApplicationStatus').val(GetApplicationStatus(application));

    $('#ApplicationDetailModal-CodePCN').val(application.Code);
    $('#ApplicationDetailModal-Subject').val(application.Subject);
    $('#ApplicationDetailModal-Process').val(application.Process);
    $('#ApplicationDetailModal-Model').val(application.Model);

    Detail_SetStatusClass(application.Status);
    $('#ApplicationDetailModal-DateActived').val(application.Status === 2 ? GetApplicationActiveDate(application) : '');
}
function Detail_GetDepartment(application) {
    if (application.Customer && application.Department) {
        return `[ ${application.Customer.CustomerName} - ${application.Department.DepartmentName} ]`;
    }
    return GetUserDept(application.UserCreated);
}
function Detail_SetStatusClass(status) {
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
function Detail_SetDetails(application) {
    $('#ApplicationDetailModal-BeforeChange').html(Detail_DecodeContent(application.BeforeChange));
    $('#ApplicationDetailModal-AfterChange').html(Detail_DecodeContent(application.AfterChange));
    $('#ApplicationDetailModal-Reason').html(Detail_DecodeContent(application.Reason));
    $('#ApplicationDetailModal-Cost').html(Detail_DecodeContent(application.CalcCost));

    Detail_SetFileLink('#ApplicationDetailModal-BeforeChangeFile', application.BeforeChangeFile);
    Detail_SetFileLink('#ApplicationDetailModal-AfterChangeFile', application.AfterChangeFile);
}
function Detail_DecodeContent(content) {
    try {
        if (content) return decodeURIComponent(content);
        else return '';
    } catch (e) {
        if (content) return content;
        else return ''
    }
}
function Detail_SetFileLink(elementId, fileName) {
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
function Detail_SetSigns(application) {
    const signContainer = $('#ApplicationDetailModal-Sign');
    signContainer.empty();

    let isReject = application.Signs.some((sign) => { return sign.Status === -1 });
    application.Signs.forEach((sign) => {
        const signItem = Detail_CreateSignItem(sign, isReject);
        signContainer.append(signItem);
    });
}
function Detail_CreateSignItem(sign, isReject) {
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

/* Other */
async function Detail_GetApplication(IdApplication) {
    if (!_datas.Application || _datas.Application.Id.toUpperCase() !== IdApplication.toUpperCase()) {
        _datas.Application = await GetApplication(IdApplication);
    }
}