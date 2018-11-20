
function init(nowIn){
  console.group()
  console.time("init")
  var now = (nowIn || new Date())
  var lib = window.whatsnextInstance
  var state = lib.getState()

  $("#nowDate").text(lib.now())//now.weekdayShort+" "+now.toLocaleString(DateTime.DATE_SMALL))
  $("#nowTime").text()//now.toLocaleString(DateTime.TIME_SIMPLE))

  // check if isSchool
  var schoolInSession = state.nextDayOff;
  if(schoolInSession && schoolInSession.rel == "next"){
    $("#noschool").show()
    $("#noschool").text(schoolInSession.name)
  }else{
    $("#noschool").hide()
  }


  // get Period
  thisPeriod = lib.thisPeriod
  nextPeriod = lib.nextPeriod
  if(thisPeriod){
    var ts = countdown(now.toJSDate(), thisPeriod.end.toJSDate(), countdown.HOURS| countdown.MINUTES)
    console.log("periodCountdown", ts)
    $('#endOfPeriodCountdown').html(ts.toHTML());

    var periodName = thisPeriod.info.period
    if(thisPeriod.period.subject) periodName = thisPeriod.period.subject
    if(!isNaN(parseInt(periodName))) periodName = "Period "+periodName
    console.log("This period is:", periodName)
    $("#thisPeriod").text(periodName)
  }else{
    $("#thisPeriod").text("School")
    $('#endOfPeriodCountdown').html("0 minutes");
  }

  if(!nextPeriod){
    $(".nextPeriod").text("__")
  }else{
    console.log("Next period is:", nextPeriod)
    $(".nextPeriod").text("__")
    for(field in nextPeriod.period){
      $("#"+field).text(nextPeriod.period[field])
    }
    $("#time").text(nextPeriod.start.toLocaleString(DateTime.TIME_SIMPLE))
  }


  /*nextDayOff = getNextDayOff(now)

  var ts = countdown(now.toJSDate(), nextDayOff[0].dates[0].toJSDate(), countdown.MONTHS|countdown.DAYS|countdown.HOURS)
  console.log("dayOffCountdown", ts)
  if(ts.value) $('#dayOffCountdown').html(ts.toHTML());
  $("#nameOfBreak").text(nextDayOff[0].name)*/


  console.timeEnd("init")
  console.groupEnd()
}

function randomDate(now){
  var random = function(min = 0, max = 1){
    return Math.round(Math.random() * (max - min) ) + min;
  }
  var returnDate = DateTime.local(random(0, 1)?2018:2019, random(0, 12), random(0, 31), random(7, 14) /*random(0, 24)*/, random(0, 59))
  if(returnDate.isValid && returnDate > DateTime.local()) return returnDate
  return randomDate()
}

$(document).ready(function(){
  window.whatsnextInstance = new whatsnext()
  //now = DateTime.local()//randomDate()
  //console.log(now.toISO())
  init()
  $("#optionsLink").click(function(){chrome.runtime.openOptionsPage()})
  console.log("init interval:",setInterval(function(){init()}, 1*60*1000))
});
$(window).focus(function(){
  init()
})
