var periods = {
  1:{},
  2:{},
  3:{},
  4:{},
  5:{},
  6:{},
  7:{},
  8:{},
}
if(chrome){
  chrome.storage.sync.get(["1","2","3","4","5","6","7","8"], function(items){
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
