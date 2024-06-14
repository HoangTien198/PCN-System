function SubmitForm() {
    var form = document.getElementById('loginForm');
    form.action = '@Url.Action("LoginNormal", "Authentication")';
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