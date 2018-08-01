var periodInfoAll = {
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
    periodInfoAll = items
  });
}

function getPeriodInfo(period){
  if(period == "Break" || period == "Lunch") return {period:period}
  //console.log(periodInfoAll[period])
  var thisPeriodInfo = periodInfoAll[period]
  if(!thisPeriodInfo) thisPeriodInfo = {}
  thisPeriodInfo.period = period
  return thisPeriodInfo
}
