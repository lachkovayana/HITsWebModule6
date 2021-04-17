import random

class Tree:
    def __init__(self, action, left, root, right):
        self.action = action
        self.left = left
        self.root = root
        self.right = right

class Gene:
    operation = ['+', '-', '==', '!=', '>=', '>', '<=', '<']
    construct = ['if', 'elif', 'else', '=', 'for i in range']
    vars = ['x0', 'x1', 'x2', 'n']
    nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    limits = {
        'x0': False,
        'x1': False,
        'x2': False,
        'for i in range': False
    } # ВОЗМОЖНО НЕ ПРИГОДИТСЯ В ИТОГЕ, НО ПУСТЬ БУДЕТ

# функция возвращает число в диапозоне от start до end
def rand(start, end):
    return random.randrange(start, end)

# алгоритм нахождения n-го числа Фибоначи
def fibNum(n):
    f0 = 0
    f1 = 1
    for i in range(n):
        if (n == 1):
            answer = 0
        elif (n == 2):
            answer = 1
        elif (i >= 2):
            f2 = f0 + f1
            f0 = f1
            f1 = f2
            answer = f2
    return answer

# получение глубины дерева
def getDeep(tree):
    tmp = tree
    flag = True
    deep = 0
    while (flag == True):
        try:
            tmp = tmp.right
            deep += 1
        except:
            flag = False
    return deep

# функция для конвертации дерева в строку
def treeIntoString(tree):
    # tmp = tree
    # flag = True
    # deep = 0
    # while (flag == True):
    #     try:
    #         tmp = tmp.right
    #         deep += 1
    #     except:
    #         flag = False
    string = ''
    deep = getDeep(tree)
    tmp = tree
    for i in range(deep):
        if (i == deep - 1):
            string += tmp.left + tmp.root + tmp.right
        else:
            string += tmp.left + tmp.root
        tmp = tmp.right
    return string

# функция для конвертации всего алгоритма в код
def buildCode(individual):
    lenOfInd = len(individual)
    code = ''
    for i in range(lenOfInd):
        if (type(individual[i]) == Tree and individual[i].action == '='):
            code += treeIntoString(individual[i]) + '\n'
        elif (type(individual[i][0]) == Tree and (individual[i][0].action == 'if' or individual[i][0].action == 'elif')):
            for j in range(len(individual[i])):
                if (j==0):
                    action = individual[i][j].action
                    code += action + '(' + treeIntoString(individual[i][j]) + '):\n'
                else:
                    code += '\t' + treeIntoString(individual[i][j]) + '\n'
        elif (type(individual[i][0]) != Tree):
            for j in range(len(individual[i])):
                if (j==0):
                    code += individual[i][j] + ':\n'
                else:
                    code += '\t' + treeIntoString(individual[i][j]) + '\n'
        else:
            for j in range(len(individual[i])):
                if (j==0):
                    action = individual[i][j].action
                    if (individual[i][j].right):
                        code += action + '(' + individual[i][j].left + ',' + individual[i][j].right + '):\n'
                    else:
                        code += action + '(' + individual[i][j].left + '):\n'
                else:
                    if (type(individual[i][j]) == Tree and individual[i][j].action == '='):
                        code += '\t' + treeIntoString(individual[i][j]) + '\n'
                    elif (type(individual[i][j][0]) == Tree and (
                            individual[i][j][0].action == 'if' or individual[i][j][0].action == 'elif')):
                        for k in range(len(individual[i][j])):
                            if (k == 0):
                                action = individual[i][j][k].action
                                code += '\t' + action + '(' + treeIntoString(individual[i][j][k]) + '):\n'
                            else:
                                code += '\t\t' + treeIntoString(individual[i][j][k]) + '\n'
                    elif (type(individual[i][j][0]) != Tree):
                        for k in range(len(individual[i][j])):
                            if (k == 0):
                                code += '\t' + individual[i][j][k] + ':\n'
                            else:
                                code += '\t\t' + treeIntoString(individual[i][j][k]) + '\n'
    return code

# функция возвращает случайную переменную или число (зависит от randNumber)
def generateVarOrNum(gene, randNumber, includeN=True):
    if (randNumber == 0):
        if (includeN==True):
            randIndex = rand(0, len(gene.vars))
        else:
            randIndex = rand(0, len(gene.vars)-1)
        toReturn = gene.vars[randIndex] # генерация переменной
    else:
        randIndex = rand(0, len(gene.nums))
        toReturn = gene.nums[randIndex] # генерация числа
    return toReturn

# функция генерирует действие
def generateLongAction(gene, root):
    max = 10
    arrayTree = [0] * max
    length = 0
    for i in range(max):
        if (root in gene.operation[0:2]):
            left = generateVarOrNum(gene, rand(0, 2)) # генерация левой части
            randNumber = rand(0, 2)
            if (randNumber == 0 or i==max-1):
                right = generateVarOrNum(gene, rand(0, 2)) # генерация значения в правой части
            else:
                right = gene.operation[rand(0, 2)] # генерация операции в правой части
            arrayTree[i] = Tree(root, left, root, right)
            root = arrayTree[i].right
            length += 1
        else:
            break
    t = [0] * length

    if (length>1):
        t[length-1] = arrayTree[length-1]
        for i in range(length-2,-1,-1):
            t[i] = Tree(arrayTree[i].root, arrayTree[i].left, arrayTree[i].root, t[i+1]) # построение дерева
    else:
        t[0] = arrayTree[0]

    return t[0]

# функция генерирует блок алгоритма
def generateBlock(gene, chooseAction=True):
    if (chooseAction==True):
        action = gene.construct[rand(0, len(gene.construct))] # генерация случайного действия
    else:
        action = chooseAction # действие, заданное в вызове функции

    if (action == gene.construct[3]): # '='
        root = action
        left = generateVarOrNum(gene, 0, False) # будет сгенерирована ПЕРЕМЕННАЯ
        randNumber = rand(0, 2)
        # на этом шаге я генерирую переменную со случайным значением 0/1
        # это будет необходимо для того, чтобы определить, что поставить в правую часть:
        # число/переменную, тем самым завершив действие или же какой-либо знак и расширить действие
        if (randNumber == 0):
            right = generateVarOrNum(gene, rand(0, 2)) # генерация числа/переменной в правой части
        else:
            rootRight = gene.operation[rand(0, 2)] # либо +, либо -
            right = generateLongAction(gene, rootRight) # генерация всей правой части
        tree = Tree(action, left, root, right)
        return tree

    elif (action in gene.construct[0:2]): # if или elif
        array = [0] * rand(2, 6)
        # здесь идёт инициализация массива, первый элемент которого - условие,
        # представленное в виде дерева, а остальное - действия с переменными,
        # тоже представленные в виде деревьев
        root = gene.operation[rand(2, len(gene.operation))]
        randNumber = rand(0, 2)
        if (randNumber == 0):
            left = generateVarOrNum(gene, rand(0, 2)) # генерация числа/переменной в левой части
        else:
            rootLeft = gene.operation[rand(0, 2)]
            left = generateLongAction(gene, rootLeft) # генерация всей левой части
            left = treeIntoString(left)
        randNumber = rand(0, 2)
        if (randNumber == 0):
            right = generateVarOrNum(gene, rand(0, 2)) # генерация числа/переменной в правой части
        else:
            rootRight = gene.operation[rand(0, 2)]
            right = generateLongAction(gene, rootRight) # генерация всей правой части части
            right = treeIntoString(right)
        array[0] = Tree(action, left, root, right)
        for i in range(len(array)-1): # генерация действий внутри условия
            j = i+1
            array[j] = generateBlock(gene, '=')
        return array

    elif (action == gene.construct[2]): # else
        array = [0] * rand(2, 6)
        array[0] = 'else'
        for i in range(len(array)-1):
            j = i+1
            array[j] = generateBlock(gene, '=')
        return array

    else: # for i in range
        array = [0] * rand(2, 6)
        randNumber = rand(0, 2)
        if (randNumber==0): # от 0 до n
            end = gene.vars[len(gene.vars)-1] # 'n'
            array[0] = Tree(action, str(end), None, None)
        else: # от start до n
            start = rand(0, 10)
            end = gene.vars[len(gene.vars) - 1]  # 'n'
            array[0] = Tree(action, str(start), None, str(end))
        # цикл сгенерирован
        for i in range(len(array)-1):
            j = i+1
            randNumber = rand(0, 2)  # будет определять добавление условия
            if (randNumber==0): # условие не требуется
                array[j] = generateBlock(gene, '=')
            else: # условие
                array[j] = generateBlock(gene, gene.construct[rand(0,3)])
        return array

# функция определения приспособленности
def findFitness(algorithms, arrayToCheck, n):
    fitness = [0] * len(algorithms)
    for j in range(len(algorithms)):
        fitness[j] = [0] * n
        for i in range(n):
            try:
                x2 = ''
                toCheck = 'n = i+1\n' + algorithms[j] #+ 'print(x2)'
                exec(toCheck)
                if (x2 == arrayToCheck[i]):
                    fitness[j][i] = 2
                elif (x2 != ''):
                    fitness[j][i] = 1
                print(algorithms[j])
            except:
                continue

    return fitness

# функция скрещивания двух генов
def crossover(parentFirst, parentSecond):
    lenFirst = len(parentFirst)
    lenSecond = len(parentSecond)

    indexStart = rand(0, lenFirst)
    indexEnd = rand(indexStart, lenFirst)
    fromFirst = parentFirst[indexStart:indexEnd]
    # копируем какую-то случайную часть от первого родителя

    indexStart = rand(0, lenSecond)
    indexEnd = rand(indexStart, lenSecond)
    fromSecond = parentSecond[indexStart:indexEnd]
    # копируем какую-то случайную часть от второго родителя

    child = fromFirst
    child += fromSecond

    return child

# функция операции с блоком
def operationWithBlock(child):
    randNum = rand(0, 10)
    if (randNum == 0 and len(child) > 2): # удаление
        randIndex = rand(0, len(child))
        if (type(child[randIndex]) == Tree and child[randIndex].action == '='):
            counter = 0
            for i in range(len(child)):
                if (type(child[i]) == Tree):
                    counter += 1
            if (counter > 1):
                del child[randIndex]
        elif (type(child[randIndex][0]) == Tree and child[randIndex][0].action == 'for i in range'):
            isGlobal = rand(0, 2)
            counter = 0

            for i in range(len(child)):
                if (type(child[i]) != Tree and type(child[i][0]) == Tree and child[i][0].action == 'for i in range'):
                    counter += 1

            if (counter <= 1 and len(child[randIndex]) <= 2):
                return child
            elif (isGlobal==0 and len(child[randIndex])>2): # удаление чего-то внутри блока с for
                newRandIndex = rand(1, len(child[randIndex]))
                if (type(child[randIndex][newRandIndex]) == Tree and child[randIndex][newRandIndex].action == '='): # удаление блока с '='
                    del child[randIndex][newRandIndex]
                else:
                    isNewGlobal = rand(0, 2)
                    if (isNewGlobal==0 and len(child[randIndex][newRandIndex])>2): # удаление чего-то внутри условия
                        newNewRandIndex = rand(1, len(child[randIndex]))
                        del child[randIndex][newRandIndex][newNewRandIndex]
                    else: # удаление условия
                        del child[randIndex][newRandIndex]
            else: # удаление всего блока с for
                del child[randIndex]
        else:
            counter = 0
            for i in range(len(child)):
                if (type(child[i]) != Tree and ((type(child[i][0]) == Tree and child[i][0].action != 'for i in range') or type(child[i][0]) != Tree)):
                    counter += 1

            isGlobal = rand(0, 2)
            if (isGlobal == 1 and counter <= 2):
                return child
            if (isGlobal==0 and len(child[randIndex])>2):
                newRandIndex = rand(1, len(child[randIndex]))
                del child[randIndex][newRandIndex] # удаление чего-то внутри условия
            else:
                del child[randIndex] # удаление блока с условием

    if (randNum in range(1,6)): # перемешивание содержимого блока
        randIndex = rand(0, len(child))
        if (not (type(child[randIndex]) == Tree)):
            numOfShuffle = rand(1, len(child[randIndex]))
            tmp = child[randIndex].copy()
            del tmp[0]
            for i in range(numOfShuffle):
                random.shuffle(tmp)
            child[randIndex][1:len(child[randIndex])] = tmp

    #else: # замена частей блока
    #...

    return child

# функция мутации
def mutation(child):
    mutationRate = rand(1, len(child))
    for i in range(mutationRate):
        randNumGlobal = rand(0, 2)
        if (randNumGlobal == 0): # действие с содержимым блоков
            child = operationWithBlock(child)
        else: # меняем блоки местами
            random.shuffle(child)
    return child

# функция с итерацией
def iteration(population, arrayToCheck, sizeOfPopulation, numOfPopulation, maxNumOfPopulation, bestGene, forBestGene, n):
    tmpPopulation = []
    algorithms = []

    for i in range(len(population)-1):
        for j in range(i+1, len(population)):
            firstParent = population[i]
            secondParent = population[j]
            child = crossover(firstParent, secondParent)
            #child = mutation(child)
            if (len(child) > 0):
                tmpPopulation.append(child)
                algorithms.append(buildCode(child))

    fitness = findFitness(algorithms, arrayToCheck, n)
    tmp = 0
    for i in range(len(fitness)):
        for j in range(len(fitness[i])):
            tmp += fitness[i][j]
        if (tmp > forBestGene):
            bestGene = population[i]
            forBestGene = tmp

    if (tmp != 0):
        for i in range(len(fitness)-1):
            for j in range(len(fitness)-i-1):
                if (fitness[j] > fitness[j+1]):
                    fitness[j], fitness[j+1] = fitness[j+1], fitness[j]
                    tmpPopulation[j], tmpPopulation[j+1] = tmpPopulation[j+1], tmpPopulation[j]
        population = tmpPopulation[0:sizeOfPopulation]
    else:
        for i in range(sizeOfPopulation):
            random.shuffle(tmpPopulation)
        population = tmpPopulation[0:sizeOfPopulation]

    if (forBestGene > 0):

        print(buildCode(bestGene))

    if (numOfPopulation <= maxNumOfPopulation):
        iteration(population, arrayToCheck, sizeOfPopulation, numOfPopulation+1, maxNumOfPopulation, bestGene, forBestGene, n)
    else:
        return

    # print("IS FIRST")
    # print(buildCode(population[0]))
    # print("IS SECOND")
    # print(buildCode(population[1]))
    #
    # child = crossover(population[0], population[1])
    #
    # print("IS CHILD")
    # print(buildCode(child))
    #
    # if (len(child) > 1):
    #     child = mutation(child)
    #
    # print("IS MUTATED")
    # print(buildCode(child))


def geneticAlgorithm():
    numOfPopulation = 1 # счётчик текущей популяции
    maxNumOfPopulation = 1000 # максимальное количество популяций
    sizeOfPopulation = 10 # размер каждой популяции
    bestGene = ''
    forBestGene = -100
    n = 30 # количество чисел для проверки

    arrayToCheck = [0] * n
    for i in range(n):
        arrayToCheck[i] = fibNum(i+1)

    population = [''] * sizeOfPopulation
    algorithms = [''] * sizeOfPopulation
    for i in range(sizeOfPopulation):
        sizeOfIndividual = rand(6, 20)
        individual = []
        for j in range(sizeOfIndividual):
            individual.append(generateBlock(Gene))
        population[i] = individual
        algorithms[i] = buildCode(population[i])

    # for i in range(len(algorithms)):
    #     print(algorithms[i])

    fitness = findFitness(algorithms, arrayToCheck, n)
    for i in range(len(fitness)):
        tmp = 0
        for j in range(len(fitness[i])):
            tmp += fitness[i][j]
        if (tmp > forBestGene):
            bestGene = population[i]
            forBestGene = tmp

    while (numOfPopulation < maxNumOfPopulation):
        tmpPopulation = []
        algorithms = []

        for i in range(len(population) - 1):
            for j in range(i + 1, len(population)):
                firstParent = population[i]
                secondParent = population[j]
                child = crossover(firstParent, secondParent)
                # child = mutation(child)
                if (len(child) > 0):
                    tmpPopulation.append(child)
                    algorithms.append(buildCode(child))

        fitness = findFitness(algorithms, arrayToCheck, n)
        tmp = 0
        for i in range(len(fitness)):
            for j in range(len(fitness[i])):
                tmp += fitness[i][j]
            if (tmp > forBestGene):
                bestGene = population[i]
                forBestGene = tmp

        if (tmp != 0):
            for i in range(len(fitness) - 1):
                for j in range(len(fitness) - i - 1):
                    if (fitness[j] > fitness[j + 1]):
                        fitness[j], fitness[j + 1] = fitness[j + 1], fitness[j]
                        tmpPopulation[j], tmpPopulation[j + 1] = tmpPopulation[j + 1], tmpPopulation[j]
            population = tmpPopulation[0:sizeOfPopulation]
        else:
            for i in range(sizeOfPopulation):
                random.shuffle(tmpPopulation)
            population = tmpPopulation[0:sizeOfPopulation]

        del algorithms
        del tmpPopulation
        numOfPopulation += 1

geneticAlgorithm()