function init(now){
  var nowText = now;
  if(!now){
    now = DateTime.local()
    var nowText = now
    setInterval(60000, function(){
      $("#nowTime").text(nowText.toLocaleString(DateTime.TIME_SIMPLE))
    })
  }
  $("#nowDate").text(nowText.weekdayShort+" "+nowText.toLocaleString(DateTime.DATE_SMALL))
  $("#nowTime").text(nowText.toLocaleString(DateTime.TIME_SIMPLE))
  $("#noschoolOverlay").hide()

  // check if isSchool
  var schoolInSession = isSchool(now);
  if(schoolInSession[0] == false){
    $("#noschoolOverlay").show()
    $("#reason").text(schoolInSession[1])
  }


  // get Period
  var thisPeriod = getPeriod(now)
  var nextPeriod = getNextPeriod(now)
  if(thisPeriod){
    var periodCountdown = countdown(function(ts){
      $('#endOfPeriodCountdown').html(ts.toHTML());
    }, thisPeriod.end.toJSDate(), countdown.HOURS| countdown.MINUTES)
    console.log(thisPeriod)
    var periodName = thisPeriod.period.period
    console.log(periodName)
    $("#periodInfo").text(periodName != "Break" && periodName != "Lunch" && periodName != "Passing Period"?"period "+periodName:periodName)
  }
  setNextPeriod(nextPeriod)


  nextDayOff = getNextDayOff(now)
  var dayOffCountdown = countdown(function(ts){
    $('#dayOffCountdown').html(ts.toHTML());
  }, nextDayOff[1].dates[0]/*.toJSDate()*/, countdown.MONTHS|countdown.DAYS|countdown.HOURS)
  $("#nameOfBreak").text(recessToText(nextDayOff[1]))

  function setNextPeriod(period){
    if(!period) return null
    console.log(period)
    $("#period").text(period.period.period)
    $("#teacher").text(period.period.teacher)
    $("#subject").text(period.period.subject)
    $("#room").text(period.period.room)
    $("#time").text(period.start.toLocaleString(DateTime.TIME_SIMPLE))
  }
  function periodToText(periodObject, amount){
    var object = periodObject.period
    if(object.period == "Break" || object.period == "Lunch") return object.period
    if(amount == "less") return "period "+object.period+" ";
    for(i in object){
      if(object[i] == false) object[i] = "____"
    }
    var text = " period "+object.period+" with "+object.teacher+" teaching "+object.subject+" in room "+object.room+" at "+periodObject.start.toLocaleString(DateTime.TIME_SIMPLE)
    return text
  }
  function recessToText(object){
    var text = object.name/*+": "+object.dates[0].toLocaleString(DateTime.DATE_HUGE)*/
    return text
  }

  $("#optionsLink").click(function(){chrome.runtime.openOptionsPage()})
}

function randomDate(now){
  var random = function(min = 0, max = 1){
    return Math.round(Math.random() * (max - min) ) + min;
  }
  var returnDate = DateTime.local(random(0, 1)?2018:2019, random(0, 12), random(0, 31), random(0, 24), random(0, 59))
  if(returnDate.isValid && returnDate > DateTime.local()) return returnDate
  return randomDate()
}

$(document).ready(function(){
  now = DateTime.local()//randomDate()
  console.log(now.toISO())
  init(now)
  setInterval(240000, function(){init()})
});

//setTimeout(60000, function(){window.close()});
