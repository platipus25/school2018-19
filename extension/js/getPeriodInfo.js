periods = {
  1:{},
  2:{},
  3:{},
  4:{},
  5:{},
  6:{},
  7:{},
  8:{},
}
if(store) var tempPeriods = store.get("periodInfo")
if(tempPeriods){
  periods = tempPeriods
}
if(chrome.storage){
  chrome.storage.sync.get(periods, function(items){
    periods = items
  });
}



function getPeriodInfo(period){
  //if(period == "Break" || period == "Lunch") return {period:period}
  //console.log(periodInfoAll[period])
  var thisPeriodInfo = periods[period]
  if(!thisPeriodInfo) thisPeriodInfo = {}
  thisPeriodInfo.period = period
  console.log(period, thisPeriodInfo)
  return thisPeriodInfo
}
