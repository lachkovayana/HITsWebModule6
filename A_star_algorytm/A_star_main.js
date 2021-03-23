"use strict"

//const buckets = require("./buckets");

//функция для получения случайного числа(будет нужна для лабиринта)
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
}
//тестовая карта 9 на 9
var n = 9;
//creating map
let map = new Array(n);
for (let i = 0; i < n; ++i) {
    map[i] = new Array(n);
    for (let j = 0; j < n; ++j) {
        map[i][j] = new point(i, j, false);
    }
}
//create wall
for (let i = 0; i < 5; ++i) {
    map[4][i + 2].isWall = true;
}
//create beginning and end
var beginPoint = map[1][4];
var endPoint = map[7][4];
//Нахождение эвристического пути
function distance(somePoint) {
    let distance = Math.max(Math.abs(endPoint.x - somePoint.x) + Math.abs(endPoint.y - somePoint.y)) * 14;
    distance += Math.abs(Math.abs(endPoint.x - somePoint.x) - Math.abs(endPoint.y - somePoint.y)) * 10;
    return distance;
}
//Забиваем значение эвр.пути длч каждой вершины
for (let i = 0; i < n; ++i) {
    for (let j = 0; j < n; ++j) {
        map[i][j].h = distance(map[i][j]);
    }
}
//Инициализируем эти значения для начала и конца
beginPoint.h=distance(beginPoint);
endPoint.h=0;
//Переменная, показывающая существование пути, длина диагонального и ортогонального перехода
var pathIsExist;
var ortLength = 10;
var diagLength = 14;
//собственно сам алгоритм
function a_star() {
    //настраиваем функцию сравнения в открытой куче
    var openList = buckets.Heap(function(a,b){
        if(a.h+a.g<b.g+b.h)
        {
            return -1;
        }
        if(a.h+a.g>b.g+b.h){
            return 1;
        }
        return 0;
    });
    beginPoint.distFromBeg=0;
    openList.add(beginPoint);
    while (openList != 0) {
        currentPoint = openList.removeRoot();
        if (currentPoint.x == endPoint.x && currentPoint.y == endPoint.y) {
            return true;
        }
        closedList.add()
        currentPoint.isVisited=true;
        let cx=currentPoint.x;
        let cy=currentPoint.y;
        let tentativeScore;
        //Здесь нужно перебрать соседние вершины
        for (let i=-1;i<2;++i)
        {
            for (let j = -1;j<2;++j)
            {
                //проверка на границы, а также являются ли координаты равными current
                if (cx+i==n || cx+i ==-1 || cy+j==n ||cy+j==0 ||(i==0 && j == 0)){
                    continue;
                }
                if ((i+j)%2 == 1){
                    tentativeScore = currentPoint.g + ortLength;
                }
                else{
                    tentativeScore= currentPoint.g + diagLength;
                }
                if(map[cx+i][cx+j].isVisited == true && tentativeScore >= map[cx+i][cx+j].g)
                {
                    /////////////////////////////////////////////////////////////////////////////////////////
                }
            }
        }
    }
}
