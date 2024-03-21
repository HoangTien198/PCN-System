$('input[name="rangedatetimes-first"]').val(Getrangedate(0) + " 07:30 - " + Getrangedate(0) + " 19:30");
    $('input[name="rangedatetimes-first"]').daterangepicker({
        //maxSpan: {
        //    days: 30
        //},
        timePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 30,
        locale: {
            format: 'YYYY/MM/DD HH:mm'
        }
    });
    $('input[name="rangedatetimes-first"]').on("change", function () {
        
    });
