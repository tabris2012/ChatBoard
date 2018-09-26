function sendText(input_name, display_id, color) {
  const obj_text = document.getElementsByName(input_name)[0];
  const target = document.getElementById(display_id);

  var new_span = document.createElement('span');
  new_span.innerHTML = obj_text.value;
  new_span.style.color = color;

  target.appendChild(new_span);
  target.appendChild(document.createElement('br'));

  obj_text.value = ""; //テキストボックスクリア

  //target.value += text+"\n"; //innerTextには追記できない
}


function saveHistory(display_id) {
  const display = document.getElementById(display_id);
  const text = display.innerText;
  
  $.ajax({
    async: true,
    type: "POST",
    url: "./api/history",
    data: {
      data: text,
    },
    dataType: "text"
  })
  .done(data => {

  })
}

function clearDiv(div_id) {
  const from = document.getElementById(div_id);

  //display内を削除
  var clone = from.cloneNode(false);
  from.parentNode.replaceChild(clone, from);
}