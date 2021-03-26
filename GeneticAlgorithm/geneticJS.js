var counter = 0;
var listOfNodes = [];

function structOfNodes(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
}


// кнопка добавления вершины в графе
document.getElementById('add').onclick = function() {
    document.getElementById('window').onclick = function(event) {
        let coordinates = {
            x: event.clientX - 9,
            y: event.clientY - 9
        };
    
        let element = document.createElement('div');
        document.getElementById('window').appendChild(element);
        

        element.className = "node";
        element.style.left = `${coordinates.x}px`;
        element.style.top = `${coordinates.y}px`; 

        listOfNodes[counter] = new structOfNodes(counter, coordinates.x, coordinates.y);
        counter++;
    }
}

// кнопка удаления всех вершин в графе
document.getElementById('delAll').onclick = function() {
    document.querySelectorAll('.node').forEach(element=>element.remove());
    counter = 0;
}



var matrix = [];

// вычисление расстояния между двумя точками
function distanceBetweenPoints(point1, point2) {
    let a = Math.abs(parseInt(point1.style.left) - parseInt(point2.style.left));
    let b = Math.abs(parseInt(point1.style.top) - parseInt(point2.style.top));
    let distance = Math.pow(a, 2) + Math.pow(a, 2);
    return Math.pow(distance, 0.5);
}

// построение матрицы смежности
function buildingMatrix(id) {
    for (let i=0; i<counter; i++) {
        matrix[i] = new Array();
        for (let j=0; j<counter; j++) {
            matrix[i][j] = -1;
        }
    }

    for (let i=0; i<counter; i++) {
        for (let j=0; j<counter; j++) {
            if (i == j) {
                matrix[i][j] = 0;
            } else if (matrix[i][j] == -1){
                matrix[i][j] = matrix[j][i] = distanceBetweenPoints();
            }
        }
    }
}

// Нижне реализация самого генетического алгоритма
// на данный момент реализация существует независимо 
// от приложения. Но скоро это будет исправлено )


// ГЕНЕТИЧЕСКИЙ АЛГОРИТМ


// структура для хранения информации о гене
function structOfGen(path, weight) {
    this.path = path; // путь
    this.weight = weight; // вес пути
}

// генератор рандомного пути
function generateRandPath(n) {
    let array = [];

    for (let i=0; i<n; i++) {
        array[i] = i;
    } 

    for (let j=0; j<100; j++) {
        array.sort(() => Math.random()-0.5);
    } 

    array[n] = array[0];

    return array;
}

// вычисление длины пути
function weightOfPathIs(nodes, path) {
    let weight = 0;

    for (let i=0; i<nodes.length; i++) {
        weight += nodes[path[i]][path[i+1]];
    }

    return weight;
}

// проверка на наличие символа в строке до какого-то определённого значения
function include(array, el, j) {
    for (let i=0; i<j; i++) {
        if (array[i] == el) {
            return true;
        }
    } 
    return false;
}

// скрещивание двух генов
function crossover(parent1, parent2) {
    let breakPoint = Math.ceil((parent1.length-1) * 0.4);
    let child = [];

    for (let i=0; i<breakPoint; i++) {
        child.push(parent1[i]);
    }

    for (let i=0; i<parent2.length - 1; i++) {
        if (!include(child, parent2[i], child.length)) {
            child.push(parent2[i]);
        }
    }

    if (child.length != parent1.length-1) {
        for (let i=breakPoint; i<parent1.length-1; i++) {
            if (!include(child, parent1[i], child.length)) {
                child.push(parent1[i]);
            }
        }
    }

    child.push(child[0]);

    return child;
}

// мутация гена
function mutation(gene) {
    let index1 = parseInt(Math.random()*10) % (gene.length-1);

    let index2;
    
    do {
        index2 = parseInt(Math.random()*10) % (gene.length-1);
    } while (index1 == index2);

    let tmp = gene[index1];
    gene[index1] = gene[index2];
    gene[index2] = tmp;

    gene[gene.length-1] = gene[0];

    return gene;
}

//let n = 12; // parseInt(prompt("Введите кол-во вершин"))
/*let nodes = []; // матрица смежности

for (let i = 0; i < n; i++) {
    nodes[i] = new Array();
}
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        nodes[i][j] = parseInt(Math.random() * 100); //parseInt(prompt());
    } 
}*/
let nodes = [[0,1,10,13,19,8],
             [7,0,1,7,21,23],
             [4,13,0,1,5,8],
             [41,17,7,0,4,1],
             [1,19,3,10,0,48],
             [32,5,22,3,1,0]]; // просто матрица для тестов

travellingSalesmanProblem(nodes);

function travellingSalesmanProblem(nodes) {
    let numOfGeneration = 1; // счётчик поколений
    let maxNumOfGenerations = 100; // максимальное количество поколений
    let sizeOfPopulation = nodes.length; // размер популяции
    let population = []; // создание популяции (массив с маршрутами и их весами)

    for (let i=0; i<sizeOfPopulation; i++) {
        let randPath = generateRandPath(nodes.length); // генерация случайного пути
        let weightOfPath = weightOfPathIs(nodes, randPath); // вычисление длины случайного пути
        population[i] = new structOfGen(randPath, weightOfPath); // внесение данных в популяцию
    }

    console.log(population);

    // данный цикл повторяется до тех пор, пока количество поколений не достигнет максимального количества
    while (numOfGeneration <= maxNumOfGenerations) {
        
        let tmpPopulation = population.slice(); // копируем популяцию
        
        for (let i=0; i<sizeOfPopulation-1; i++) {
            for (let j=i+1; j<sizeOfPopulation; j++) {
                let parent1 = population[i].path;
                let parent2 = population[j].path;

                let newGenePath = crossover(parent1, parent2); // скрещивание двух родителей
                newGenePath = mutation(newGenePath); // мутация гена, полученного путём скрещивания
                let newGeneWeight = weightOfPathIs(nodes, newGenePath); // вычисление пути нового гена
                let newGene = new structOfGen(newGenePath, newGeneWeight);

                tmpPopulation.push(newGene); // добавление нового гена в популяцию
            }
        }

        tmpPopulation.sort(function(a,b) {
            if (a.weight > b.weight) {
                return 1;
            } else if (a.weight < b.weight) {
                return -1;
            } return 0;
        }); // сортировка популяции

        population = tmpPopulation.slice();

        while(population.length != nodes.length) {
            population.pop();
        } // убирает лишние гены из популяции

        console.log(population);
    
        numOfGeneration++;
    }
}