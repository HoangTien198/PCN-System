async function ApplicationDetail(IdApplication) {
    try {
        var application = await GetApplication(IdApplication);

        CreateApplicationDetailModal(application);

    } catch (e) {
        Swal.fire('error', `${e}`, 'error');
        console.error(e);
    }
}
function CreateApplicationDetailModal(application) {

    /* Information */
    $('#ApplicationDetailModal-UserCreated').val(GetUserName(application.UserCreated));
    $('#ApplicationDetailModal-Department').val(application.Departments.length > 0 ? [...new Set(application.Departments.map(department => department.DepartmentName))].join(", ") : '');
    $('#ApplicationDetailModal-DateCreated').val(moment(application.DateCreated).format("YYYY-MM-DD HH:mm"));
    $('#ApplicationDetailModal-ApplicationStatus').val(application.ApplicationStatus);
    $('#ApplicationDetailModal-StatusMSC').val(application.ApplicationStatus);

    $('#ApplicationDetailModal-ApplicationStatus').removeClass();    
    $('#ApplicationDetailModal-StatusMSC').removeClass();
    $('#ApplicationDetailModal-DateActived').val('');

    switch (application.ApplicationStatus) {
        case "Pending":
            $('#ApplicationDetailModal-ApplicationStatus').addClass('form-control text-truncate bg-opacity-10 text-warning bg-warning');
            break;
        case "Approved":
            $('#ApplicationDetailModal-ApplicationStatus').addClass('form-control text-truncate bg-opacity-10 text-success bg-success');
            $('#ApplicationDetailModal-DateActived').val(moment(application.DateActived).format("YYYY-MM-DD HH:mm"))
            break;
        case "Rejected":
            $('#ApplicationDetailModal-ApplicationStatus').addClass('form-control text-truncate bg-opacity-10 text-danger bg-danger');
            break;
    }

    $('#ApplicationDetailModal-CodeMSC').val(application.CodeMSC);
    $('#ApplicationDetailModal-Title').val(application.Title);
    $('#ApplicationDetailModal-Process').val(application.Process);
    $('#ApplicationDetailModal-Model').val(application.Model);

    /* Details */
    $('#ApplicationDetailModal-BeforeChange').html(application.BeforeChange);
    $('#ApplicationDetailModal-AfterChange').html(application.AfterChange);

    $('#ApplicationDetailModal-BeforeChangeFile').attr('href', application.BeforeChangeFile ? `/Assets/Media/FileMSC/${application.BeforeChangeFile}` : 'javascript:;');
    $('#ApplicationDetailModal-AfterChangeFile').attr('href', application.AfterChangeFile ? `/Assets/Media/FileMSC/${application.AfterChangeFile}` : 'javascript:;');
    $('#ApplicationDetailModal-BeforeChangeFile').text(application.BeforeChangeFile ? application.BeforeChangeFile : 'No file');
    $('#ApplicationDetailModal-AfterChangeFile').text(application.AfterChangeFile ? application.AfterChangeFile : 'No file');

    /* Reason */
    $('#ApplicationDetailModal-Reason').html(application.Reason);
    $('#ApplicationDetailModal-Cost').html(application.Cost);

    /* Sign */
    let SignContainer = $('#ApplicationDetailModal-sign');
    let IsReject = false;
    SignContainer.empty();
    application.Signs.forEach(function (sign) {
        let color = (sign.Status == "Pending") ? "warning" : (sign.Status == "Approved") ? "success" : "danger";
        let dept = sign.Departments.length > 0 ? [...new Set(sign.Departments.map(department => department.DepartmentName))].join(", ") : '';
        let user = GetUserName(sign.User);

        if (sign.Status == "Rejected") {
            IsReject = true;

            let time = `<span class="text-danger fw-bold">${moment(sign.DateSigned).format("YYYY-MM-DD HH:mm")}</span>`;

            let item = `<div class="widget-reminder-item">
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
                let item = `<div class="widget-reminder-item">
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
                let time = (sign.Status == 'Pending') ? '<span class="text-warning fw-bold">Pending</span>' : `<span class="text-success fw-bold">${moment(sign.DateSigned).format("YYYY-MM-DD HH:mm")}</span>`;

                let item = `<div class="widget-reminder-item">
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