//$(window).on("load", function () {
//    // Single date picker
//    $('input[name="singledatetimes-first"]').daterangepicker({
//        singleDatePicker: true,
//        locale: {
//            format: 'YYYY/MM/DD'
//        }
//    });
//    $('input[name="singledatetimes-second"]').daterangepicker({
//        singleDatePicker: true,
//        locale: {
//            format: 'YYYY/MM/DD'
//        }
//    });
//    // Range date time 24H 
//    $('input[name="rangedatetimes-first"]').daterangepicker({
//        //maxSpan: {
//        //    days: 30
//        //},
//        timePicker: true,
//        timePicker24Hour: true,
//        timePickerIncrement: 30,
//        locale: {
//            format: 'YYYY/MM/DD HH:mm'
//        }
//    });
//    $('input[name="rangedatetimes-second"]').daterangepicker({
//        //maxSpan: {
//        //    days: 30
//        //},
//        timePicker: true,
//        timePicker24Hour: true,
//        timePickerIncrement: 30,
//        locale: {
//            format: 'YYYY/MM/DD HH:mm'
//        }
//    });

//});
//$(function () {

//    //// Single date picker
//    //$('input[name="singledatetimes-first"]').daterangepicker({
//    //    singleDatePicker: true,
//    //    locale: {
//    //        format: 'YYYY/MM/DD'
//    //    }
//    //});
//    //$('input[name="singledatetimes-second"]').daterangepicker({
//    //    singleDatePicker: true,
//    //    locale: {
//    //        format: 'YYYY/MM/DD'
//    //    }
//    //});
//    //// Range date time 24H 
//    //$('input[name="rangedatetimes-first"]').daterangepicker({
//    //    //maxSpan: {
//    //    //    days: 30
//    //    //},
//    //    timePicker: true,
//    //    timePicker24Hour: true,
//    //    timePickerIncrement: 30,
//    //    locale: {
//    //        format: 'YYYY/MM/DD HH:mm'
//    //    }
//    //});
//    //$('input[name="rangedatetimes-second"]').daterangepicker({
//    //    //maxSpan: {
//    //    //    days: 30
//    //    //},
//    //    timePicker: true,
//    //    timePicker24Hour: true,
//    //    timePickerIncrement: 30,
//    //    locale: {
//    //        format: 'YYYY/MM/DD HH:mm'
//    //    }
//    //});
//});
function Getrangedate(rangedate) {
    var d = new Date();
    d.setDate(d.getDate() + rangedate);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    return d.getFullYear() + '/' + (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;
}