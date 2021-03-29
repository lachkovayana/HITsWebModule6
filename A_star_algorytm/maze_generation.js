"use strict"
//тестовая карта 9 на 9
var n = 200;
//Тут работа с созданием html объектов и их настройка в зависимости от карты
//работаем с переменными CSS
var root = document.querySelector(':root');
root.style.setProperty("--sizeOfCell",700/n +"px");
root.style.setProperty("--borderSize",700/n +"px");
//работаем с section в body
var mainObject = document.getElementById("mainField");
mainObject.classList.add("lineSpace");
var objectsArray = new Array(n);
let nodeForMazeCreation;
for (let i = 0; i < n; ++i) {
    objectsArray[i] = document.createElement("div");
    mainObject.appendChild(objectsArray[i]);
    objectsArray[i].classList.add("string");
    if (i == 0) {
        nodeForMazeCreation = mainObject.getElementsByTagName("div")[0];
    }
    else {
        nodeForMazeCreation = nodeForMazeCreation.nextSibling;
    }
    let arrayForNodes = new Array(n);
    for (let j = 0; j < n; ++j) {
        arrayForNodes[j] = document.createElement("p");
        nodeForMazeCreation.appendChild(arrayForNodes[j]);
    }
}
var cells = mainObject.getElementsByTagName("p");
for (let i = 0; i < cells.length; ++i) {
    cells[i].classList.add("cell1");
    cells[i].classList.add("wall");
    cells[i].classList.add("string");
    cells[i].classList.add("onHover");
}
cells[n-1].classList.remove("wall");
cells[n-1].classList.add("end");
cells[n*(n-1)].classList.remove("wall");
cells[n*(n-1)].classList.add("begin");
//
//
//
//Генератор случайных чисел от min ДО(не ПО) max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
//структура точки
function point(x, y, isWall) {
    this.x = x;
    this.y = y;
    if (isWall !== undefined) {
        this.isWall = isWall;
    }
    else {
        this.isWall = true;
    }
    this.isVisited = false;
    this.h;//эвр. расстояние до конца 
    this.g = Infinity;//расстояние от начальной вершины до этой 
    this.f;//h+g
    this.parent;//из какой точки попали в эту
    this.isInOpenList = false;//проверка на наличие этой точки в открытом списке
    this.isConcidered = false;//проверка на наличие этой точки в списке рассматриваемых вершин
}

//creating map
let map = new Array(n);
for (let i = 0; i < n; ++i) {
    map[i] = new Array(n);
    for (let j = 0; j < n; ++j) {
        map[i][j] = new point(i, j, true);
    }
}
//список, в котором будут лежать рассматриваемые точки
var consideredCells = buckets.LinkedList();

//create beginning and end
var beginPoint = map[0][0];
beginPoint.isConcidered = true;
var endPoint = map[n - 1][n - 1];

beginPoint.isWall = false;
var currentCell = beginPoint;
consideredCells.add(map[currentCell.x + 2][currentCell.y]);
map[currentCell.x + 2][currentCell.y].isConcidered = true;
consideredCells.add(map[currentCell.x][currentCell.y + 2], getRandomInt(0, 2));
map[currentCell.x][currentCell.y + 2].isConcidered = true;
//неьлоьшой список для рассмотрения ближайших клеток без стен
let nearestCells = buckets.LinkedList();
let randomCell;
//собственно сам генератор
while (consideredCells.isEmpty() != true) {
    randomCell = getRandomInt(0, consideredCells.size());
    currentCell = consideredCells.elementAtIndex(randomCell);
    consideredCells.removeElementAtIndex(randomCell);
    //добавляем вершины в список рассматриваемых, или в список тех, к кому можно провести стену
    if (currentCell.x - 2 >= 0) {
        if (map[currentCell.x - 2][currentCell.y].isConcidered == false) {
            consideredCells.add(map[currentCell.x - 2][currentCell.y]);
            map[currentCell.x - 2][currentCell.y].isConcidered = true;
        }
        else {
            if (map[currentCell.x - 2][currentCell.y].isWall == false)
                nearestCells.add(map[currentCell.x - 1][currentCell.y]);

        }
    }

    if (currentCell.x + 2 < n) {
        if (map[currentCell.x + 2][currentCell.y].isConcidered == false) {
            consideredCells.add(map[currentCell.x + 2][currentCell.y]);
            map[currentCell.x + 2][currentCell.y].isConcidered = true;
        }
        else {
            if (map[currentCell.x + 2][currentCell.y].isWall == false)
                nearestCells.add(map[currentCell.x + 1][currentCell.y]);

        }
    }

    if (currentCell.y - 2 >= 0) {
        if (map[currentCell.x][currentCell.y - 2].isConcidered == false) {
            consideredCells.add(map[currentCell.x][currentCell.y - 2]);
            map[currentCell.x][currentCell.y - 2].isConcidered = true;
        }
        else {
            if (map[currentCell.x][currentCell.y - 2].isWall == false)
                nearestCells.add(map[currentCell.x][currentCell.y - 1]);

        }
    }

    if (currentCell.y + 2 < n) {
        if (map[currentCell.x][currentCell.y + 2].isConcidered == false) {
            consideredCells.add(map[currentCell.x][currentCell.y + 2]);
            map[currentCell.x][currentCell.y + 2].isConcidered = true;
        }
        else {
            if (map[currentCell.x][currentCell.y + 2].isWall == false)
                nearestCells.add(map[currentCell.x][currentCell.y + 1]);

        }
    }
    //делаем текущую клетку свободной и слчайную из тех, кто рядом со свободной стеной
    currentCell.isWall = false;
    nearestCells.elementAtIndex(getRandomInt(0, nearestCells.size())).isWall = false;
    nearestCells.clear();
}
//Так как алгоритм Прима создает горизонтальную и вертикальную сплошную стену при n четном, усовершенствуем его немного
if (n % 2 == 0) {
    endPoint.isWall = false;
    let randomVar = getRandomInt(0, 2);
    if (randomVar == 1)
        map[n - 2][n - 1].isWall = false;
    else
        map[n - 1][n - 2].isWall = false;
    for(let i =0;i<n-2;i+=2)
    {
        randomVar = getRandomInt(0, 5);
        if(randomVar%2==1)
        map[i][n-1].isWall = false;
    }
    for(let i =0;i<n-2;i+=2)
    {
        randomVar = getRandomInt(0, 5);
        if(randomVar%2==1)
        map[n-1][i].isWall = false;
    }
}
//тут должен быть вывод
// function printMaze(){
//     for(let i = 0;i<n;++i)
//     {
//     }
// }

