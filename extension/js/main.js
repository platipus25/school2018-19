
function init(nowIn){
  console.group()
  console.time("init")
  var lib = window.whatsnextInstance
  lib.periodInfo = {
    "3":{
      subject:"Science",
      teacher:"Mr. Newman"
    }
  }
  var state = lib.getState()

  // check if isSchool
  var schoolInSession = state.nextDayOff;
  if(schoolInSession && schoolInSession.rel == "next"){
    $("#noschool").show()
    $("#noschool").text(schoolInSession.name)
  }else{
    $("#noschool").hide()
  }


  // get Period
  thisPeriod = state.thisPeriod
  nextPeriod = state.nextPeriod
  console.log(state)
  if(thisPeriod){
    var ts = countdown(lib.now(), thisPeriod.end, countdown.HOURS| countdown.MINUTES)
    console.log("periodCountdown", ts)
    $('#thisPeriodCountdown').html(ts.toHTML());

    var periodName = thisPeriod.info.period
    if(thisPeriod.info.subject) periodName = thisPeriod.period.subject.toLowerCase()
    if(!isNaN(parseInt(periodName))) periodName = "period "+periodName
    console.log("This period is:", periodName)
    $("#thisPeriodSubject").text(periodName)
  }else{
    $("#thisPeriodSubject").text("School")
    $('#thisPeriodCountdown').html("0 minutes");
  }

  if(!nextPeriod){
    $(".nextPeriod").text("__")
  }else{
    $(".nextPeriod").text("__")
    var periodName = nextPeriod.info.period
    if(nextPeriod.info.subject) periodName = nextPeriod.period.subject.toLowerCase()
    if(!isNaN(parseInt(periodName))) periodName = "period "+periodName
    console.log("Next period is:"+periodName)
    $("#nextPeriodSubject").text(periodName)

    $("#nextPeriodTeacher").text(nextPeriod.info.teacher)

    for(field in nextPeriod.info){
      $("#"+field).text(nextPeriod.info[field])
    }
    $("#time").text(nextPeriod.start.toLocaleTimeString())
  }


  /*nextDayOff = getNextDayOff(now)

  var ts = countdown(now.toJSDate(), nextDayOff[0].dates[0].toJSDate(), countdown.MONTHS|countdown.DAYS|countdown.HOURS)
  console.log("dayOffCountdown", ts)
  if(ts.value) $('#dayOffCountdown').html(ts.toHTML());
  $("#nameOfBreak").text(nextDayOff[0].name)*/


  console.timeEnd("init")
  console.groupEnd()
}



$(document).ready(function(){
  window.whatsnextInstance = new whatsnext(new Date(2018, 11, 12, 8))
  console.log(window.whatsnextInstance)
  init()
  $("#optionsLink").click(function(){chrome.runtime.openOptionsPage()})
  console.log("init interval:",setInterval(function(){init()}, 1*60*1000))
});
$(window).focus(function(){
  init()
})
