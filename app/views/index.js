function sendText(input_name, display_id) {
  const obj_text = document.getElementsByName(input_name)[0];
  const target = document.getElementById(display_id);

  var new_span = document.createElement('span');
  new_span.className = input_name;
  new_span.innerHTML = obj_text.value;

  target.appendChild(new_span);
  target.appendChild(document.createElement('br'));

  obj_text.value = ""; //テキストボックスクリア

  //target.value += text+"\n"; //innerTextには追記できない
}

function loadHistory(div_id) {
  const target = document.getElementById(div_id);
  
  $.ajax({
    async: true,
    type: "POST",
    url: "./api/history/load",
    dataType: "text"
  })
  .done(data => {
    target.innerHTML = data;
  })
}

function saveHistory(div_id, to_div_id) {
  const display = document.getElementById(div_id);
  const text = display.innerHTML;
  
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
    const to_div = document.getElementById(to_div_id);

    for (var child of display.children) { //inはインデックス、ofは要素
      to_div.appendChild(child); //子要素を移動
      to_div.appendChild(document.createElement('br'));
    }

    clearDiv(div_id);
  })
}

function clearDiv(div_id) {
  const from = document.getElementById(div_id);

  //display内を削除
  var clone = from.cloneNode(false);
  from.parentNode.replaceChild(clone, from);
}