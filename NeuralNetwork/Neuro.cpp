#include "neuro.h"
#include <stdlib.h>
#include <iostream>
#include <algorithm> 
#include<fstream>

Neuro::Neuro() // конфигурация для MNIST
{
    
    _inputNeurons = 784;
    
    _outputNeurons =10;
   //---установить количество слоев для NN,
    //---где входные нейроны для первого слоя равны входу NN
    //--- и выходные нейроны для последнего слоя равны выходу NN
    CountOfLayers = 4;
    listOfLayers = new vector<Layers>(CountOfLayers);
    //--- установите размер входного и выходного массива для каждого слоя
    //--- где первый слой имеет размер входного сигнала "NN input"
    //--- и последний слой имеет выходной размер "NN output"
    listOfLayers -> at(0).Init(_inputNeurons, 200);
    listOfLayers -> at(1).Init(200, 60);
    listOfLayers -> at(2).Init(60, 40);
    listOfLayers -> at(3).Init(40, _outputNeurons);

}


void Neuro::Redirection(bool ok)
{
    
    //--- сигнал через NN в прямом направлении

    //--- для первого уровня аргументом является _inputs
    listOfLayers->at(0).makeHidden(_inputs);
   //--- для другого слоя аргументом является "скрытый" массив предыдущего слоя
    for (int i = 1; i<CountOfLayers; i++)
        listOfLayers->at(i).makeHidden(listOfLayers->at(i-1).getHidden());


    //--- условие bool для запроса NN или train NN
    if (!ok)
    {
        
        vector<float> feed;
        int index = 0;
        float value = -10;
        for(int out = 0; out < _outputNeurons; out++)
        {
            if((listOfLayers->at(CountOfLayers-1).hidden[out]) > value) {
                value = (listOfLayers->at(CountOfLayers-1).hidden[out]);
                index = out;
            }
            
        }
        
        cout << "Это однозначно :" << index << "\n";
        return;
    }
    else
    {
        backPropagate();
    }
}

void Neuro::backPropagate()
{   
    //--- вычислить ошибки для последнего слоя
    listOfLayers->at(CountOfLayers-1).calcOutError(_targets);
    //--- для других слоев для вычисления ошибок нам нужна информация о "следующем слое"
    //--- //например для вычисления ошибок 4-го слоя нам нужны ошибки 5-го слоя
    for (int i = CountOfLayers-2; i>= 0; i--)
        listOfLayers->at(i).calcHidError(
        listOfLayers->at(i+1).getErrors(),
        listOfLayers->at(i+1).getmassiv(),
        listOfLayers->at(i+1).getCountOfIn(),
        listOfLayers->at(i+1).getCountOfOut()
        );

    //--- обновление весов
    //--- для UPD веса текущего слоя мы должны получить "скрытый" массив значений предыдущего слоя
    for (int i = CountOfLayers-1; i>0; i--)
        listOfLayers->at(i).updatemassiv(listOfLayers->at(i-1).getHidden());
    //--- первый слой не имеет предыдущего слоя.
    //---  для него "скрытый" массив значений предыдущего слоя будет NN входом
    listOfLayers->at(0).updatemassiv(_inputs);
}

void Neuro::train(float *in, float *targ) 
{
    if(in)
    _inputs = in;
    if(targ)
    _targets = targ;

    Redirection(true);
}

void Neuro::query(float *in)
{
    _inputs = in;
    Redirection(false);
}
void Neuro::gget()
{
    ofstream fout;
    fout.open("matrix_first.txt");
    float **matrix = listOfLayers->at(0).getmassiv();
    fout << "[";
    for(int i = 0; i < 785; ++i){
        fout << "[";
        for(int k = 0; k < 201; ++k){
            if (k!= 200){
                fout << matrix[i][k] << ",";
            }
            else{
                fout << matrix[i][k];
            }
        }
        if (i!= 784){
            fout << "]," << "\n";           
        }
        else{
            fout << "]";
        }
    
    }
    fout << "]";
    fout.close();
    fout.open("matrix_second.txt");
    matrix = listOfLayers->at(1).getmassiv();
    fout << "[";
    for(int i = 0; i < 201; ++i){
        fout << "[";
        for(int k = 0; k < 61; ++k){
            if (k!= 60){
                fout << matrix[i][k] << ",";
            }
            else{
                fout << matrix[i][k];
            }
        }
        if (i!= 200){
            fout << "]," << "\n";           
        }
        else{
            fout << "]";
        }
    
    }
    fout << "]";
    fout.close();
    fout.open("matrix_third.txt");
    matrix = listOfLayers->at(2).getmassiv();
    fout << "[";
    for(int i = 0; i < 61; ++i){
        fout << "[";
        for(int k = 0; k < 41; ++k){
            if (k!= 40){
                fout << matrix[i][k] << ",";
            }
            else{
                fout << matrix[i][k];
            }
        }
        if (i!= 60){
            fout << "]," << "\n";           
        }
        else{
            fout << "]";
        }
    
    }
    fout << "]";
    fout.close();
    fout.open("matrix_fourth.txt");
    matrix = listOfLayers->at(3).getmassiv();
    fout << "[";
    for(int i = 0; i < 41; ++i){
        fout << "[";
        for(int k = 0; k < 11; ++k){
            if (k!= 10){
                fout << matrix[i][k] << ",";
            }
            else{
                fout << matrix[i][k];
            }
        }
        if (i!= 40){
            fout << "]," << "\n";           
        }
        else{
            fout << "]";
        }
    
    }
    fout << "]";
    fout.close();
}


