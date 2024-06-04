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

    /* Information */
    $('#ApplicationDetailModal-UserCreated').val(GetUserName(application.UserCreated));
    $('#ApplicationDetailModal-Department').val(GetUserDept(application.UserCreated));
    $('#ApplicationDetailModal-DateCreated').val(moment(application.DateCreated).format("YYYY-MM-DD HH:mm:ss"));
    $('#ApplicationDetailModal-ApplicationStatus').val(GetApplicationStatus(application));

    $('#ApplicationDetailModal-ApplicationStatus').removeClass();    
    $('#ApplicationDetailModal-DateActived').val('');

    switch (application.Status) {
        case -1:
            $('#ApplicationDetailModal-ApplicationStatus').addClass('form-control text-truncate bg-opacity-10 text-danger bg-danger');
            break;
        case 1:
            $('#ApplicationDetailModal-ApplicationStatus').addClass('form-control text-truncate bg-opacity-10 text-warning bg-warning');
            break;
        case 2:
            $('#ApplicationDetailModal-ApplicationStatus').addClass('form-control text-truncate bg-opacity-10 text-success bg-success');
            $('#ApplicationDetailModal-DateActived').val(GetApplicationActiveDate(application))
            break;
    }

    $('#ApplicationDetailModal-CodePCN').val(application.Code);
    $('#ApplicationDetailModal-Subject').val(application.Subject);
    $('#ApplicationDetailModal-Process').val(application.Process);
    $('#ApplicationDetailModal-Model').val(application.Model);

    /* Details */
    try {
        $('#ApplicationDetailModal-BeforeChange').html(decodeURIComponent(application.BeforeChange));
    } catch (e) {
        $('#ApplicationDetailModal-BeforeChange').html(application.BeforeChange);
    }
    try {
        $('#ApplicationDetailModal-AfterChange').html(decodeURIComponent(application.AfterChange));
    } catch (e) {
        $('#ApplicationDetailModal-AfterChange').html(application.AfterChange);
    }
   
    

    if (application.BeforeChangeFile) {
        $('#ApplicationDetailModal-BeforeChangeFile').text(application.BeforeChangeFile);
        $('#ApplicationDetailModal-BeforeChangeFile').attr('href', `/Data/Files/${application.BeforeChangeFile}`);
    }
    else {
        $('#ApplicationDetailModal-BeforeChangeFile').attr('href', 'javascript:;');
        $('#ApplicationDetailModal-BeforeChangeFile').text('No file');
    }

    if (application.AfterChangeFile) {
        $('#ApplicationDetailModal-AfterChangeFile').text(application.AfterChangeFile);
        $('#ApplicationDetailModal-AfterChangeFile').attr('href', `/Data/Files/${application.AfterChangeFile}`);
    }
    else {
        $('#ApplicationDetailModal-AfterChangeFile').attr('href', 'javascript:;');
        $('#ApplicationDetailModal-AfterChangeFile').text('No file');
    }

    /* Reason */
    $('#ApplicationDetailModal-Reason').html(decodeURIComponent(application.Reason));
    $('#ApplicationDetailModal-Cost').html(application.CalcCost ? decodeURIComponent(application.CalcCost) : '');

    /* Sign */
    let SignContainer = $('#ApplicationDetailModal-Sign');
    let IsReject = false;
    SignContainer.empty();
    application.Signs.forEach(function (sign) {
        let color = (sign.Status == 1) ? "warning" : (sign.Status == 2) ? "success" : "danger";
        let dept = GetUserDept(sign.User);
        let user = GetUserName(sign.User);

        if (sign.Status == -1) {
            IsReject = true;

            let time = `<span class="text-danger fw-bold">${moment(sign.DateSigned).format("YYYY-MM-DD HH:mm")}</span>`;

            let item = `<div class="widget-reminder-item bg-${color} bg-opacity-10">
                       <div class="widget-reminder-time">${time}</div>
                       <div class="widget-reminder-divider bg-danger"></div>
                       <div class="widget-reminder-content">
                           <div class="fw-bold text-danger">${user}</div>
                           <div class="fs-10px text-danger">${dept}</div>
                           <div class="fs-13px text-danger">${sign.Details}</div>
                       </div>
                   </div>`;
            SignContainer.append(item);
        }
        else {
            if (IsReject) {
                let item = `<div class="widget-reminder-item bg-secondary bg-opacity-10">
                       <div class="widget-reminder-time"><span class="text-secondary fw-bold">Closed</span></div>
                       <div class="widget-reminder-divider bg-secondary"></div>
                       <div class="widget-reminder-content">
                           <div class="fw-bold text-secondary">${user}</div>
                           <div class="fs-10px">${dept}</div>
                       </div>
                   </div>`;
                SignContainer.append(item);
            }
            else {
                let time = (sign.Status == 1) ? '<span class="text-warning fw-bold">Pending</span>' : `<span class="text-success fw-bold">${moment(sign.DateSigned).format("YYYY-MM-DD HH:mm")}</span>`;

                let item = `<div class="widget-reminder-item bg-${color} bg-opacity-10">
                       <div class="widget-reminder-time">${time}</div>
                       <div class="widget-reminder-divider bg-${color}"></div>
                       <div class="widget-reminder-content">
                           <div class="fw-bold text-${color}">${user}</div>
                           <div class="fs-10px text-${color}">${dept}</div>
                       </div>
                   </div>`;
                SignContainer.append(item);
            }
        }
    });


    $('#ApplicationDetailModal').modal('show');
}

/* Other */
async function GetDetailApplication(IdApplication) {
    if (!_datas.Application || _datas.Application.Id.toUpperCase() !== IdApplication.toUpperCase()) {
        _datas.Application = await GetApplication(IdApplication);
    }
}