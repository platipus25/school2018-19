// Saves options to chrome.storage.sync

function get(period){
  var DOMNodes = $("."+period)
  return {
    subject:inputs.filter(".subject").val(),
    teacher:inputs.filter(".teacher").val(),
    room:inputs.filter(".room").val()
  }
}

function set(period, periodObj){
  var DOMNodes = $("."+period)
  inputs.filter(".subject").val(periodObj.subject)
  inputs.filter(".teacher").val(periodObj.teacher)
  inputs.filter(".room").val(periodObj.room)
}

function getPeriodOptions(period){
  var inputs = $("."+numbers[period])
  var outobj = {
    subject:inputs.filter(".subject").val(),
    teacher:inputs.filter(".teacher").val(),
    room:inputs.filter(".room").val()
  }
  return outobj
}
function setPeriodOptions(periodObj, index){
  var inputs = $("."+numbers[index])
  inputs.filter(".subject").val(periodObj.subject)
  inputs.filter(".teacher").val(periodObj.teacher)
  inputs.filter(".room").val(periodObj.room)
}

function save_options() {
  var object = {}
  for(let period = 1; period<=8; period++){
    period = parseInt(period)
    object[period] = get(period)
  }
  console.log(object)
  chrome.storage.sync.set(object, function() {
    // Update status to let user know options were saved.
    var status = $('#status');
    status.text('Options saved.');
    setTimeout(function() {
      status.text('');
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  var object = {}
  for(let period = 1; period<=8; period++){
    period = parseInt(period)
    object[period] = get(period)
  }

  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get(object, function(items) {
    for(i in items){
      setPeriodOptions(items[i], i)
    }
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('submit').addEventListener('click', save_options);
