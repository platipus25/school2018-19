
function init(nowIn){
    console.log("\n")
    var lib = window.whatsnextInstance

    //console.log(lib) //
    lib.periodInfo = {
        "1":{
          subject:"Science",
          teacher:"Mr. Newman",
          room:209
        },
        "7":{
          subject:"English",
          teacher:"Sumi"
        }
    }
    var state = lib.getState()
    //console.log(JSON.stringify(state))
    
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
            let period = object.info.period
            let postFix = (postFixes[parseInt(period)] || "")
            if(period[0] == "p"){ // Passing Period
                period = "Passing Period"
            }else{
                postFix += " period"
            }
            if(!object.info.hasOwnProperty("name")){
                object._info.name = period+postFix
            }
            
            if(object.info.hasOwnProperty("subject")){
                object._info.name = object._info.subject
            }
            
        }else{
            object = null
        }
        return object
    }
    _this = computePeriodObject(_this)
    _next = computePeriodObject(_next)
    
    
    console.log(JSON.stringify(_this._info.name))
    console.log(JSON.stringify(_next._info.name))
    
    
    
    
    
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
        //console.log("periodCountdown", ts)
        $('#thisPeriodCountdown').html(ts.toHTML());

        var periodName = thisPeriod._info.name
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
    //console.log("dayOffCountdown", ts)
    if(ts.value) $('#dayOffCountdown').html(ts.toHTML());
    $("#nameOfBreak").text(nextDayOff.name)

}



$(document).ready(function(){
  window.whatsnextInstance = new whatsnext(new Date(2019, 0, 30, 7, 55))
  init()
                  i = 0.5
                  setInterval(function(){
                              window.whatsnextInstance.time = new Date(window.whatsnextInstance.time.valueOf()+(i*1000*60))
                              init()
                              }, i*1000*0.5)
  $("#optionsLink").click(function(){chrome.runtime.openOptionsPage()})
  console.log("init interval:",setInterval(function(){init()}, 1*60*1000))
});
$(window).focus(function(){
  init()
})
