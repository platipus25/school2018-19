function init(now){
  todaysSchedule = null
  var periodCountdownId = store.get("periodCountdownId")
  var dayOffCountdownId = store.get("dayOffCountdownId")
  var timeOfDayId = window.timeOfDayId

  if(!now) now = DateTime.local()
  window.now = now;
  $("#nowDate").text(now.weekdayShort+" "+now.toLocaleString(DateTime.DATE_SMALL))
  $("#nowTime").text(now.toLocaleString(DateTime.TIME_SIMPLE))
  if(timeOfDayId) clearInterval(timeOfDayId)
  window.timeOfDayId = setInterval(function(){
    $("#nowTime").text(now.toLocaleString(DateTime.TIME_SIMPLE))
  }, 1000)

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
    function periodCountdown(end){
      var now = window.now
      var ts = countdown(now.toJSDate(), end.toJSDate(), countdown.HOURS| countdown.MINUTES)
      if(ts.value > 1) $('#endOfPeriodCountdown').html(ts.toHTML());
    }

    if(periodCountdownId) clearInterval(periodCountdownId)
    periodCountdown(thisPeriod.end)
    periodCountdownId = setInterval(periodCountdown, 0.5*(60)*(1000), thisPeriod.end)
    store.set("periodCountdownId", periodCountdownId)

    var periodName = thisPeriod.period.period
    if(thisPeriod.period.subject) periodName = thisPeriod.period.subject
    if(!isNaN(parseInt(periodName))) periodName = "Period "+periodName
    console.log(periodName)
    $("#thisPeriod").text(periodName)
  }

  if(!nextPeriod){
    $(".nextPeriod").text("__")
  }else{
    console.log(nextPeriod)
    for(field in nextPeriod.period){
      $("#"+field).text(nextPeriod.period[field])
    }
    $("#time").text(nextPeriod.start.toLocaleString(DateTime.TIME_SIMPLE))
  }


  nextDayOff = getNextDayOff(now)

  function dayOffCountdown(end){
    var now = window.now
    var ts = countdown(now.toJSDate(), end.toJSDate(), countdown.MONTHS|countdown.DAYS|countdown.HOURS)
    console.log("dayOffCountdown", ts)
    if(ts.value) $('#dayOffCountdown').html(ts.toHTML());
  }

  if(dayOffCountdownId) clearInterval(dayOffCountdownId)
  dayOffCountdown(nextDayOff[0].dates[0])
  dayOffCountdownId = setInterval(dayOffCountdown, 2*(60*1000)/*2 minutes */, nextDayOff[0].dates[0])
  store.set("dayOffCountdownId", dayOffCountdownId)
  $("#nameOfBreak").text(nextDayOff[0].name)

  $("#optionsLink").click(function(){chrome.runtime.openOptionsPage()})
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
  console.group()
  console.time("init")
  now = DateTime.local()//randomDate()
  console.log(now.toISO())
  init(now)
  console.timeEnd("init")
  console.groupEnd()

  var initId = setInterval(function(){init()}, 60000)
  clearInterval(store.get("initId"))
  store.set("initId", initId)
});

//setTimeout(60000, function(){window.close()});
