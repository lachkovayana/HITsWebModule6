"use strict"
//const buckets = require("./buckets");

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
for (let i = 0; i < 8; ++i) {
    map[2][i + 1].isWall = true;
}
for (let i = 0; i < 7; ++i) {
    map[6][i].isWall = true;
}
map[5][6].isWall = true;


