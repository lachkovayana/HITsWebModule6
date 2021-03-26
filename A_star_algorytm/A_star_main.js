"use strict"

//const buckets = require("./buckets");

//Нахождение эвристического пути
function distance(somePoint) {
    let distance = Math.abs(endPoint.x - somePoint.x) + Math.abs(endPoint.y - somePoint.y);
    return distance;
}
//Забиваем значение эвр.пути длч каждой вершины
for (let i = 0; i < n; ++i) {
    for (let j = 0; j < n; ++j) {
        map[i][j].h = distance(map[i][j]);
    }
}
//Переменная, показывающая существование пути, длина диагонального и ортогонального перехода
var pathIsExist;
var ortLength = 10;
var diagLength = 14;
//собственно сам алгоритм
function a_star() {
    //настраиваем функцию сравнения в открытой куче
    var openList = buckets.Heap(function (a, b) {
        if (a.h + a.g < b.g + b.h) {
            return -1;
        }
        if (a.h + a.g > b.g + b.h) {
            return 1;
        }
        return 0;
    });
    beginPoint.g = 0;
    openList.add(beginPoint);
    let cx;
    let cy;
    let tentativeScore;
    let currentPoint;
    while (openList.isEmpty() != true) {
        currentPoint = openList.removeRoot();
        if (currentPoint == endPoint) {
            return true;
        }
        currentPoint.isVisited = true;
        currentPoint.isInOpenList = false;
        cx = currentPoint.x;
        cy = currentPoint.y;
        //Здесь перебор соседниx вершин
        for (let i = -1; i < 2; ++i) {
            for (let j = -1; j < 2; ++j) {
                //проверка на границы, а также являются ли координаты равными current
                if (cx + i == n || cx + i == -1 || cy + j == n || cy + j == -1 || (i == 0 && j == 0)) {
                    continue;
                }
                //проверка на стены рядом с текущей клеткой
                if ((i + j) % 2 == 0) {
                    if (map[cx][cy + j].isWall === true || map[cx + i][cy].isWall === true)
                        continue;
                }
                if (map[cx + i][cy + j].isWall === true)
                    continue;
                //новый кратчайший путь до этой точки через current 
                if ((i + j) % 2 == 1) {
                    tentativeScore = currentPoint.g + ortLength;
                }
                else {
                    tentativeScore = currentPoint.g + diagLength;
                }
                if (map[cx + i][cy + j].isVisited == true && tentativeScore >= map[cx + i][cy + j].g) {
                    continue;
                }
                //Если у точки появился путь покороче
                if (map[cx + i][cy + j].isVisited == false && tentativeScore < map[cx + i][cy + j].g) {
                    map[cx + i][cy + j].parent = currentPoint;
                    map[cx + i][cy + j].g = tentativeScore;
                    map[cx + i][cy + j].f = map[cx + i][cy + j].g + map[cx + i][cy + j].h;
                    //проверка на наличие в открытом списке
                    if (map[cx + i][cy + j].isInOpenList == false) {
                        map[cx + i][cy + j].isInOpenList = true;
                        openList.add(map[cx + i][cy + j]);
                    }
                }

            }
        }
    }
    return false;
}

pathIsExist = a_star();
function getPath() {
    if (pathIsExist == false) {
        console.log("Пути не существует");
        return;
    }
    let currentPoint = endPoint;
    let fullPath = buckets.Stack();

    while (currentPoint !== beginPoint) {
        fullPath.push(currentPoint);
        currentPoint = currentPoint.parent;
    }
    let sizeOfStack =fullPath.size();
    for(let i = 0;i<sizeOfStack;++i){
        console.log(fullPath.peek().x, fullPath.pop().y);
    }
}
getPath();
