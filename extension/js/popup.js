function init(nowIn){
  if(nowIn && !nowIn.isValid) return "invalid DateTime"
  console.group()
  console.time("init")
  if(nowIn){
    now = nowIn
  }else{
    now = DateTime.local()
  }
  window.now = now;
  try{
    if(todaysSchedule){
      if(todaysSchedule.Break.start.toISODate() != now.toISODate()){
        console.log(todaysSchedule.Break.start.toISODate())
        todaysSchedule = null
      }else{
        console.log("still today")
      }
    }
  }catch(exception){
    console.log("todaysSchedule doesn't exist", exception)
  }

  $("#nowDate").text(now.weekdayShort+" "+now.toLocaleString(DateTime.DATE_SMALL))
  $("#nowTime").text(now.toLocaleString(DateTime.TIME_SIMPLE))

  // check if isSchool
  var schoolInSession = isSchool(now);
  if(schoolInSession[0] == false){
    $("#noschool").show()
    $("#noschool").text(schoolInSession[1])
  }else{
    $("#noschool").hide()
  }


  // get Period
  thisPeriod = getPeriod(now)
  nextPeriod = getNextPeriod(now)
  if(thisPeriod){
    var ts = countdown(now.toJSDate(), thisPeriod.end.toJSDate(), countdown.HOURS| countdown.MINUTES)
    console.log("periodCountdown", ts)
    $('#endOfPeriodCountdown').html(ts.toHTML());

    var periodName = thisPeriod.period.period
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


  nextDayOff = getNextDayOff(now)

  var ts = countdown(now.toJSDate(), nextDayOff[0].dates[0].toJSDate(), countdown.MONTHS|countdown.DAYS|countdown.HOURS)
  console.log("dayOffCountdown", ts)
  if(ts.value) $('#dayOffCountdown').html(ts.toHTML());
  $("#nameOfBreak").text(nextDayOff[0].name)


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

  now = DateTime.local()//randomDate()
  console.log(now.toISO())
  init(now)

  $("#optionsLink").click(function(){chrome.runtime.openOptionsPage()})
  console.log("init interval:",setInterval(function(){init()}, 1*60*1000))
});
$(window).focus(function(){
  init()
})
