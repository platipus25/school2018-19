const whatsnextLib = /*new whatsnext(new Date(2018, 9, 23, 10, 9))*/new whatsnext();
console.log(whatsnextLib)

whatsnextLib.periodInfo = {
  1:{
    subject:"Science",
    teacher:"Mr. Newman",
    room:209
  },
  2:{
    subject:"Orchestra",
    teacher:"Ms. Miyata"
  },
  3:{
    subject:"Tech Aide",
    room:111,
    flyingMonkey:10
  },
  4:{
    teacher:"Mr McNulty",
    subject:"Math"
  },
  5:{

  },
  6:{

  },
  7:{

  },
  8:{

  }
}

var wigets = {
  get now(){return (new Date().toDateString()+" "+new Date().toLocaleTimeString('en-US', {hour:"numeric", minute:"2-digit"}))},
  get period(){
    var periodObj = whatsnextLib.thisPeriod
    var period;
    if(periodObj.info == null){
      period = periodObj.period
    }else if(periodObj.period[0] == "p"){
      period = "Passing Period"
    }else{
      period = "Period "+periodObj.period
    }
    if(period == "none") period = "School"
    return period
  },
  get periodCountdown(){
    if(periodEnd = whatsnextLib.thisPeriod.end == null){
      return "0 minutes"
    }
    return countdown(new Date(), whatsnextLib.thisPeriod.end, countdown.HOURS | countdown.MINUTES).toHTML()
  },
  get nextPeriod(){
    var period = whatsnextLib.nextPeriod.period
    return period
  },
  get nextPeriodInfo(){
    var period = whatsnextLib.nextPeriod
    if(period.info != null){
      return "<br>"+period.info.infoAsHTML()
    }
    return "none"
  },
  get nextPeriodStartTime(){
    return  whatsnextLib.nextPeriod.start.toLocaleTimeString('en-US', {hour:"numeric", minute:"2-digit"})
  },
  get nextBreak(){
    return whatsnextLib.nextDayOff.name
  },
  get nextBreakCountdown(){
    return countdown(new Date(), whatsnextLib.nextDayOff.date, countdown.MONTHS | countdown.DAYS | countdown.HOURS).toHTML()
  }
}
var fieldValuePairs = {
  "Now":"now",
  "period":"periodCountdown",
  "Next Period":"nextPeriod",
  "Details":"nextPeriodInfo",
  "nextBreak":"nextBreakCountdown",
}

for(fieldMarker in fieldValuePairs){
  let valueMarker = fieldValuePairs[fieldMarker]
  var field = fieldMarker
  var value = valueMarker
  if(wigets.hasOwnProperty(fieldMarker)){
    field = wigets[fieldMarker]
  }
  if(wigets.hasOwnProperty(valueMarker)){
    value = wigets[valueMarker]
  }
  //console.log(fieldMarker, valueMarker)
  console.log(field, value)
  let makeDOM = function(field, value, tag, fieldMarker, valueMarker){
    if(!tag) tag = "span"
    var container = $("<div class='fieldContainer'></div>")
    container.append($("<"+tag+" class='field' id='"+fieldMarker+"'>"+field+"</"+tag+">"))
    container.append($("<span class='fieldValueColon'>: <span>"))
    container.append($("<"+tag+" class='value' id='"+valueMarker+"'>"+value+"</"+tag+">"))
    container.append($("<br>"))
    console.log(container)
    return container
  }
  $("#container").append(makeDOM(field, value, "span", fieldMarker, valueMarker))
}

function update(){
  for(fieldMarker in fieldValuePairs){
    let valueMarker = fieldValuePairs[fieldMarker]
    var field = fieldMarker
    var value = valueMarker
    if(wigets.hasOwnProperty(fieldMarker)){
      field = wigets[fieldMarker]
    }
    if(wigets.hasOwnProperty(valueMarker)){
      value = wigets[valueMarker]
    }
    $("#"+fieldMarker).text(field)
    $("#"+valueMarker).html(value)
  }
}

/*
for(field in fieldValuePairs){
  let value = fieldValuePairs[field]
  let fieldValuePair = {}
  let fieldValue = field
  let valuevalue = null
  if(fieldValues.hasOwnProperty(field)){
    fieldValue = fieldValues[field]
    fieldValuePair[fieldValue] = null
  }
  if(fieldValues.hasOwnProperty(value)){
    valuevalue = fieldValues[value]
  }
  fieldValuePair[fieldValue] = valuevalue
  console.log(fieldValuePair)
} */
/*function update(){
  for(fieldMarker in fieldValuePairs){

  }
}

function update(){
  $("#nowDate").text(new Date().toDateString())
  $("#nowTime").text(new Date().toLocaleTimeString('en-US', {hour:"numeric", minute:"2-digit"}))
  var periodObj = whatsnextLib.thisPeriod
  var period;
  if(periodObj.info == null){
    period = periodObj.period
  }else if(periodObj.period[0] == "p"){
    period = "Passing Period"
  }else{
    period = "Period "+periodObj.period
  }
  $("#thisPeriod").text(period)
  $("#endOfPeriodCountdown").text(countdown(new Date(), periodObj.end, countdown.HOURS | countdown.MINUTES))
  var nextPeriod = whatsnextLib.nextPeriod
  $("#period").text(nextPeriod.period)
  $("#teacher").text(nextPeriod.info)
  $("#subject").text(nextPeriod.info)
  $("#room").text(nextPeriod.info)
  $("#time").text(nextPeriod.start.toLocaleTimeString('en-US', {hour:"numeric", minute:"2-digit"}))
  var nextBreak = whatsnextLib.nextDayOff
  $("#nameOfBreak").text(nextBreak.name)
  $("#dayOffCountdown").text(countdown(new Date(), nextBreak.date, countdown.MONTHS | countdown.DAYS | countdown.HOURS))
}*/
update()
setInterval(update, 1000)
