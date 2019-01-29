
function init(nowIn){
    var lib = window.whatsnextInstance

    console.log(lib) //
    lib.periodInfo = {
        "3":{
          subject:"Science",
          teacher:"Mr. Newman"
        }
    }
    var state = lib.getState()
    console.log(state)
    
    var _this = state.thisPeriod
    var _next = state.nextPeriod
    var _isSchool = state.day
    
    // isSchool
    if("min,mon,tue,thu,fri".includes(_isSchool.slice(0, 3))){ // is min mon tue thu fri
        if(state.nextDayOff.rel == "now"){
            _isSchool = state.nextDayOff.name
        }else if(typeof _this == "string"){
            _isSchool = _this
        }else{
            _isSchool = true
        }
    }
    
    var computePeriodObject  = function(object){
        if(object && typeof object != "string"){
            object._info = object.info
            var postFixes = ["", "st", "nd", "rd", "th", "th", "th", "th", "th"]
            if(!object.info.hasOwnProperty("subject")){
                let period = object.info.period
                let postFix = (postFixes[parseInt(period)] || "")
                object._info.subject = period+postFix+" period"
            }
        }else{
            object = null
        }
        return object
    }
    _this = computePeriodObject(_this)
    _next = computePeriodObject(_next)
    
    
    
    
    
    
    
    // check if isSchool
    if(_isSchool && _isSchool !== true){
        $("#noschool").show()
        $("#noschool").text(_isSchool)
    }else{
        $("#noschool").hide()
    }


    // get Period
    thisPeriod = _this
    nextPeriod = _next
    
    if(thisPeriod){
        var ts = countdown(lib.now(), thisPeriod.end, countdown.HOURS| countdown.MINUTES)
        console.log("periodCountdown", ts)
        $('#thisPeriodCountdown').html(ts.toHTML());

        var periodName = thisPeriod._info.subject
        $("#thisPeriodSubject").text(periodName)
    }else{
        $("#thisPeriodSubject").text("School")
        $('#thisPeriodCountdown').html("0 minutes");
    }

    if(nextPeriod){
        var periodName = nextPeriod.info.subject
        $("#nextPeriodSubject").text(periodName)

        $("#nextPeriodTeacher").text(nextPeriod.info.teacher) //

        for(field in nextPeriod.info){ //
            $("#"+field).text(nextPeriod.info[field])//
        }//
        $("#time").text(nextPeriod.start.toLocaleTimeString()) //
    }else{
        $(".nextPeriod").text("__")
    }


    nextDayOff = state.nextDayOff

    var ts = countdown(lib.now(), nextDayOff.date, countdown.MONTHS|countdown.DAYS|countdown.HOURS)
    console.log("dayOffCountdown", ts)
    if(ts.value) $('#dayOffCountdown').html(ts.toHTML());
    $("#nameOfBreak").text(nextDayOff.name)

}



$(document).ready(function(){
  window.whatsnextInstance = new whatsnext(new Date(2019, 0, 28, 12))
  init()
  $("#optionsLink").click(function(){chrome.runtime.openOptionsPage()})
  console.log("init interval:",setInterval(function(){init()}, 1*60*1000))
});
$(window).focus(function(){
  init()
})
