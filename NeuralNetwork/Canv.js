var canvas;
var context;
let isDrawing = false;
canvas = document.getElementById("drawingCanvas");
context = canvas.getContext("2d");
window.onload = function () {
  // Подключаем требуемые для рисования события
  canvas.onmousedown = startDrawing;
  canvas.onmouseup = stopDrawing;
  canvas.onmouseout = stopDrawing;
  canvas.onmousemove = draw;
};

// Отслеживаем элемент <img> для толщины линии, по которому ранее щелкнули
var previousThicknessElement;

function changeThickness(thickness, imgElement) {
  // Изменяем текущую толщину линии
  context.lineWidth = thickness;

  // Меняем стиль элемента <img>, по которому щелкнули
  imgElement.className = "Selected";

  // Возвращаем ранее выбранный элемент <img> в нормальное состояние
  if (previousThicknessElement != null) previousThicknessElement.className = "";

  previousThicknessElement = imgElement;
}
var thck = document.getElementById("control_panel_thickness");

function startDrawing(e) {
  // Начинаем рисовать
  isDrawing = true;

  // Задаем цвет
  context.strokeStyle = document.querySelector(".color").value;

  // Задаем толщину
  if (thck.value == 1) {
    context.lineWidth = "3";
  }

  if (thck.value == 2) {
    context.lineWidth = "5";
  }

  if (thck.value == 3) {
    context.lineWidth = "1";
  }

  // Создаем новый путь (с текущим цветом и толщиной линии)
  context.beginPath();

  // Нажатием левой кнопки мыши помещаем "кисть" на холст
  context.moveTo(
    (e.pageX - canvas.offsetLeft - 50) / 10,
    (e.pageY - canvas.offsetTop) / 10
  );
}
function draw(e) {
  if (isDrawing == true) {
    // Определяем текущие координаты указателя мыши
    var x = (e.pageX - canvas.offsetLeft - 50) / 10;
    var y = (e.pageY - canvas.offsetTop) / 10;

    // Рисуем линию до новой координаты
    context.lineTo(x, y);
    context.stroke();
  }
}
function stopDrawing() {
  isDrawing = false;
}
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context2.clearRect(0, 0, canvas2.width, canvas2.height);
}
function getImage() {
  let imagedata = changesize().getImageData(0, 0, 28, 28);
  let inputs = [];
  for (let i = 3; i < 28 * 28 * 4; i += 4) {
    if (imagedata.data[i] != 0) {
      inputs.push(1);
    } else {
      inputs.push(0);
    }
  }
  /* console.log(imagedata);
	console.log(inputs); */
  return inputs;
}
let canvas2 = document.getElementById("canvas");
let context2 = canvas2.getContext("2d");
function changesize() {
  let imagedata = context.getImageData(0, 0, 28, 28);

  let img = new Image();
  img.src = canvas.toDataURL();
  var pc = document.getElementById("pic_cntr");
  pc.innerHTML = "<img id=source src=" + img.src + ">";
  var image = document.getElementById("source");
  image.onload = function () {
    context2.drawImage(image, 0, 0, 28, 28);
  };
  return context2;
}
