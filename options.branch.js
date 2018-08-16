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
var fields = ["subject", "teacher", "room"]
for(period in periods){
  for(field of fields){
    periods[period][field] = ""
  }
}

function get(){
  for(period in periods){
    var DOMNodes = $("."+period)
    for(field in periods[period]){
      periods[period][field] = DOMNodes.filter("."+field).val()
    }
  }
}

function set(periodsToSet){
  for(period in periodsToSet){
    var DOMNodes = $("."+period)
    for(field in periodsToSet[period]){
        DOMNodes.filter("."+field).val(periodsToSet[period][field])
    }
  }
}

function save(){
  get()
  if(chrome.storage){
    chrome.storage.sync.set(periods, function() {
      var status = $('#status');
      status.text('Options saved.');
      setTimeout(function() {
        status.text('');
      }, 750);
    });
  }
  if(store){
    store.set("periodInfo", periods)
  }
}

function restore(){
  if(chrome.storage){
    chrome.storage.sync.get(periods, function(items) {
      periods = items
    });
  }
  if(store){
    let tempPeriods = store.get("periodInfo")
    if(tempPeriods) periods = tempPeriods
  }
  set()
}

$(document).ready(restore);
$('#submit').click(save);
