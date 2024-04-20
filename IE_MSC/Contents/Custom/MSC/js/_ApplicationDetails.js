$(document).ready(function () {

});
async function ApplicationDetails(IdApplication) {
    try {
        var application = await GetApplication(IdApplication);

        CreateApplicationDetailsModal(application);

    } catch (e) {
        console.error(e);
    }
}
function CreateApplicationDetailsModal(application) {

    /* Information */
    $('#ApplicationDetailsModal-UserCreated').val(`${application.UserCreated.EmployeeCode}${application.UserCreated.EmployeeVNName ? ' - ' + application.UserCreated.EmployeeVNName : ' - ' + application.UserCreated.EmployeeCNName}`);
    $('#ApplicationDetailsModal-Department').val(application.Departments.length > 0 ? [...new Set(application.Departments.map(department => department.DepartmentName))].join(", ") : '');
    $('#ApplicationDetailsModal-DateCreated').val(moment(application.DateCreated).format("YYYY-MM-DD HH:mm"));
    $('#ApplicationDetailsModal-ApplicationStatus').val(application.ApplicationStatus);
    $('#ApplicationDetailsModal-StatusMSC').val(application.ApplicationStatus);

    $('#ApplicationDetailsModal-ApplicationStatus').removeClass();    
    $('#ApplicationDetailsModal-StatusMSC').removeClass();
    $('#ApplicationDetailsModal-DateActived').val('');

    switch (application.ApplicationStatus) {
        case "Pending":
            $('#ApplicationDetailsModal-ApplicationStatus').addClass('form-control text-truncate bg-opacity-10 text-warning bg-warning');
            $('#ApplicationDetailsModal-StatusMSC').addClass('form-control text-truncate bg-opacity-10 text-warning bg-warning');
            break;
        case "Approved":
            $('#ApplicationDetailsModal-ApplicationStatus').addClass('form-control text-truncate bg-opacity-10 text-success bg-success');
            $('#ApplicationDetailsModal-StatusMSC').addClass('form-control text-truncate bg-opacity-10 text-success bg-success');
            $('#ApplicationDetailsModal-DateActived').val(moment(application.DateActived).format("YYYY-MM-DD HH:mm"))
            break;
        case "Rejected":
            $('#ApplicationDetailsModal-ApplicationStatus').addClass('form-control text-truncate bg-opacity-10 text-danger bg-danger');
            $('#ApplicationDetailsModal-StatusMSC').addClass('form-control text-truncate bg-opacity-10 text-danger bg-danger');
            break;
    }

    $('#ApplicationDetailsModal-CodeMSC').val(application.CodeMSC);
    $('#ApplicationDetailsModal-Title').val(application.Title);
    $('#ApplicationDetailsModal-Process').val(application.Process);
    $('#ApplicationDetailsModal-Model').val(application.Model);

    /* Details */
    $('#ApplicationDetailsModal-BeforeChange').html(application.BeforeChange);
    $('#ApplicationDetailsModal-AfterChange').html(application.AfterChange);

    $('#ApplicationDetailsModal-BeforeChangeFile').attr('href', application.BeforeChangeFile ? `/Assets/Media/FileMSC/${application.BeforeChangeFile}` : 'javascript:;');
    $('#ApplicationDetailsModal-AfterChangeFile').attr('href', application.AfterChangeFile ? `/Assets/Media/FileMSC/${application.AfterChangeFile}` : 'javascript:;');
    $('#ApplicationDetailsModal-BeforeChangeFile').text(application.BeforeChangeFile ? application.BeforeChangeFile : 'No file');
    $('#ApplicationDetailsModal-AfterChangeFile').text(application.AfterChangeFile ? application.AfterChangeFile : 'No file');

    /* Reason */
    $('#ApplicationDetailsModal-Reason').html(application.Reason);
    $('#ApplicationDetailsModal-Cost').html(application.Cost);

    /* Sign */
    let SignContainer = $('#ApplicationDetailsModal-sign');
    let IsReject = false;
    SignContainer.empty();
    application.Signs.forEach(function (sign) {
        let color = (sign.Status == "Pending") ? "warning" : (sign.Status == "Approved") ? "success" : "danger";
        let dept = sign.Departments.length > 0 ? [...new Set(sign.Departments.map(department => department.DepartmentName))].join(", ") : '';
        let user = `${sign.User.EmployeeCode }${ sign.User.EmployeeVNName ?' - ' + sign.User.EmployeeVNName : ' - ' + sign.User.EmployeeCNName}`;

        if (sign.Status == "Rejected") {
            IsReject = true;

            let item = `<div class="widget-reminder-item">
                       <div class="widget-reminder-time">${sign.DateSigned ? moment(sign.DateSigned).format("YYYY-MM-DD HH:mm") : 'Pending'}</div>
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
                       <div class="widget-reminder-time">Closed</div>
                       <div class="widget-reminder-divider bg-secondary"></div>
                       <div class="widget-reminder-content">
                           <div class="fw-bold text-secondary">${user}</div>
                           <div class="fs-10px">${dept}</div>
                       </div>
                   </div>`;
                SignContainer.append(item);
            }
            else {
                let item = `<div class="widget-reminder-item">
                       <div class="widget-reminder-time">${sign.DateSigned ? moment(sign.DateSigned).format("YYYY-MM-DD HH:mm") : 'Pending'}</div>
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


    $('#ApplicationDetailsModal').modal('show');
}