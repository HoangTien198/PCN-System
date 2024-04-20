function SubmitForm(type) {
    var form = document.getElementById('loginForm');
    if (type === 'normal') {
        form.action = '@Url.Action("LoginNormal", "Authentication")';
    } else if (type === 'smartoffice') {
        form.action = '@Url.Action("LoginSmartOffice", "Authentication")';
    }
    form.submit();
}

function GetAjaxErrorMessage(error) {
    var regex = new RegExp(`<title>(.*?)<\/title>`);
    var match = regex.exec(error.responseText);

    if (match && match.length >= 2) {
        var extractedContent = match[1];
        return extractedContent;
    } else {
        return "Lỗi không xác định.";
    }
}