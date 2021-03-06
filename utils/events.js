

var getDateTime = function getDateTime() {

    var date = new Date();
    console.log(date);
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day;

};


var compareDate = function compareDate() {
    var date = new Date() ;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate() + 7;
    day = (day < 10 ? "0" : "") + day;

    return year + '-' + month + '-' + day;

};

exports.compareDate = compareDate;
exports.getDateTime = getDateTime;
