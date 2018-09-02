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
  //var periodCountdownId = store.get("periodCountdownId")
  //var dayOffCountdownId = store.get("dayOffCountdownId")
  //var timeOfDayId = window.timeOfDayId

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
    /*function periodCountdown(end){
      var now = window.now
      var ts = countdown(now.toJSDate(), end.toJSDate(), countdown.HOURS| countdown.MINUTES)
      console.log("periodCountdown", ts)
      if(ts.value > 1) $('#endOfPeriodCountdown').html(ts.toHTML());
    }*/

    /*if(periodCountdownId) clearInterval(periodCountdownId)
    periodCountdown(thisPeriod.end)
    periodCountdownId = setInterval(periodCountdown, 0.5*(60)*(1000), thisPeriod.end)
    store.set("periodCountdownId", periodCountdownId)*/

    var periodName = thisPeriod.period.period
    if(thisPeriod.period.subject) periodName = thisPeriod.period.subject
    if(!isNaN(parseInt(periodName))) periodName = "Period "+periodName
    console.log("This period is:", periodName)
    $("#thisPeriod").text(periodName)
  }

  if(!nextPeriod){
    $(".nextPeriod").text("__")
  }else{
    console.log("Next period is:", nextPeriod)
    for(field in nextPeriod.period){
      $("#"+field).text(nextPeriod.period[field])
    }
    $("#time").text(nextPeriod.start.toLocaleString(DateTime.TIME_SIMPLE))
  }


  nextDayOff = getNextDayOff(now)

  /*function dayOffCountdown(end){
    var now = window.now
    var ts = countdown(now.toJSDate(), end.toJSDate(), countdown.MONTHS|countdown.DAYS|countdown.HOURS)
    console.log("dayOffCountdown", ts)
    if(ts.value) $('#dayOffCountdown').html(ts.toHTML());
  }*/

  /*if(dayOffCountdownId) clearInterval(dayOffCountdownId)
  dayOffCountdown(nextDayOff[0].dates[0])
  dayOffCountdownId = setInterval(dayOffCountdown, 2*(60*1000), nextDayOff[0].dates[0])
  store.set("dayOffCountdownId", dayOffCountdownId)*/

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
  setInterval(function(){init()}, 1*60*1000)
});
