#include <iostream>
#include <stdlib.h>
#include <iomanip>
#include "neuro.h"
#include "Neuro.cpp"
#include<vector>
#include<string>
#include<cmath>
#include<fstream>

using namespace std;

int reverseInt(int i)
{
    unsigned char c1, c2, c3, c4;

    c1 = i & 255;
    c2 = (i >> 8) & 255;
    c3 = (i >> 16) & 255;
    c4 = (i >> 24) & 255;

    return ((int)c1 << 24) + ((int)c2 << 16) + ((int)c3 << 8) + c4;
}

vector<int> numbers()
{
    string fileSource = "/home/timofei/Документы/Module6/Neural Network/";
    ifstream file(fileSource + "train-labels-idx1-ubyte", ios::binary);

    int num, numOfImages;

    file.read((char*)&num, sizeof(num));
    num = reverseInt(num);

    file.read((char*)&numOfImages, sizeof(numOfImages));
    numOfImages = reverseInt(numOfImages);

    char numFromThePicture;
    vector<int> arrayOfNumbers;

    for (int i = 0; i < numOfImages; i++) {
        file.read((char*)&numFromThePicture, sizeof(numFromThePicture));
        arrayOfNumbers.push_back((int)numFromThePicture);
    }

    return arrayOfNumbers;
}




vector<int> inputDataFunction(ifstream& file, int n, int m)
{
    vector
    <int> picture;

    for (int i = 0; i < n * m; i++)
    {
        char tmp;
        file.read((char*)&tmp, sizeof(tmp));

        double pixel = (double)tmp;
        if (pixel < 0)
        {
            pixel = 1;
        }
        else{
            pixel = 0;
        }
        picture.push_back(pixel);
    }

    return picture;
}



float* input_list(vector<int> listFromSerg) {
    float* inputs = (float*)malloc((784) * sizeof(float));
    for (int i = 0; i < 784; ++i) {
        inputs[i] = listFromSerg[i];
    }
    return inputs;
}

float* target_list(int answer) {
    float* targets = (float*)malloc((10) * sizeof(float));
    for (int i = 0; i < 10; ++i) {
        if (i == answer) {
            targets[i] = 0.99;
        }
        else {
            targets[i] = 0.01;
        }
    }
    return targets;
}

int main()
{
    string fileSource = "/home/timofei/Документы/Module6/Neural Network/";
    ifstream file(fileSource +  "train-images-idx3-ubyte", ios::binary);

    int num, numOfImages, pxHeight, pxWidth;

    file.read((char*)&num, sizeof(num));
    num = reverseInt(num);

    file.read((char*)&numOfImages, sizeof(numOfImages));
    numOfImages = reverseInt(numOfImages);

    file.read((char*)&pxHeight, sizeof(pxHeight));
    pxHeight = reverseInt(pxHeight);

    file.read((char*)&pxWidth, sizeof(pxWidth));
    pxWidth = reverseInt(pxWidth);

    Neuro *nW = new Neuro();

    vector<int> answers = numbers();
   
    for (int i = 0; i < 60000; ++i){
        float* current_target_list = target_list(answers[i]);
        float* current_input_list = input_list(inputDataFunction(file, pxHeight, pxWidth));
        /* int k = 0;
        for (int i = 0; i < 28; i++)
        {
            for (int j = 0; j < 28; j++)
            {
                cout << current_input_list[k++] << " ";
            }
            cout << endl;
        }
        cout << endl;
        for (int i = 0; i < 10; ++i){
            cout << current_target_list[i] << " ";
        }
        cout << endl; */

        
        for(int j = 0; j < 3; ++j){
        nW -> train(current_input_list, current_target_list);
        }
        
        
        delete current_input_list;
        delete current_target_list;
        
    }
    for (int i = 0; i < 3; ++i){
        float* current_input_list = input_list(inputDataFunction(file, pxHeight, pxWidth));
        int k = 0;
        for (int i = 0; i < 28; i++)
        {
            for (int j = 0; j < 28; j++)
            {
                cout << current_input_list[k++] << " ";
            }
            cout << endl;
        }

        nW ->query(current_input_list);
        delete current_input_list;
        current_input_list = nullptr;

    }
    nW -> gget();
    
   delete nW;


}