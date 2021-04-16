#ifndef Neuro_H
#define Neuro_H
#include <math.h>
#include <vector>
using namespace std;

#define learnRate 0.25
#define randWeight (( ((float)rand() / (float)RAND_MAX) - 0.5)* pow(out,-0.5))
class Neuro
{
public:
	Neuro();
    

    struct Layers{

            // информация об входящей/выходящей ширине слоя
           int in;
           int out;
           // матрица весов
           float** massiv;
           //--- текущий массив скрытых значений
           float* hidden;
           //--- текущие ошибки для обратного распространения
           float* errors;
           int getCountOfIn(){return in;}
           int getCountOfOut(){return out;}
           float **getmassiv(){return massiv;}
           void updatemassiv(float *enteredVal)
           {
               //--- upd вес с учетом ошибок
               for(int ou = 0; ou < out; ou++)
               {

                   for(int hid = 0; hid < in; hid++)
                   {
                       massiv[hid][ou] += (learnRate * errors[ou] * enteredVal[hid]);
                   }
                   massiv[in][ou] += (learnRate * errors[ou]);
               }
           };
           void Init(int inputs, int outputs)
           {
               //--- значения инициализации и выделение памяти
               in=inputs;
               out=outputs;
               errors = (float*) malloc((out)*sizeof(float));
               hidden = (float*) malloc((out)*sizeof(float));

               massiv = (float**) malloc((in+1)*sizeof(float*));
               for(int inp = 0; inp < in+1; inp++)
               {
                   massiv[inp] = (float*) malloc(out*sizeof(float));
               }
               for(int inp = 0; inp < in+1; inp++)
               {
                   for(int outp = 0; outp < out; outp++)
                   {
                       massiv[inp][outp] =  randWeight;
                   }
               }
           }
           void makeHidden(float *inputs)
           {
               //--- установить  значение после прохождения сигнала текущим слоем
               for(int hid = 0; hid < out; hid++)
               {
                   float tmpS = 0.0;
                   for(int inp = 0; inp < in; inp++)
                   {
                       tmpS += inputs[inp] * massiv[inp][hid];
                   }
                   tmpS += massiv[in][hid];
                   hidden[hid] = sigmoida(tmpS);
               }
           };
           float* getHidden()
           {
               return hidden;
           };
           void calcOutError(float *targets)
           {
               //--- вычисление ошибки, если слой является последним
               for(int ou = 0; ou < out; ou++)
               {
                   errors[ou] = (targets[ou] - hidden[ou]) * sigmoidasDerivate(hidden[ou]);
               }
           };
           void calcHidError(float *targets,float **outWeights,int inS, int outS)
           {
               //--- ошибка вычисления, если слой скрытый
               for(int hid = 0; hid < inS; hid++)
               {
                   errors[hid] = 0.0;
                   for(int ou = 0; ou < outS; ou++)
                   {
                       errors[hid] += targets[ou] * outWeights[hid][ou];
                   }
                   errors[hid] *= sigmoidasDerivate(hidden[hid]);
               }
           };
           float* getErrors()
           {
               return errors;
           };
           float sigmoida(float val)
           {
               //--- функция активации
              return (1.0 / (1.0 + exp(-val)));
           }
           float sigmoidasDerivate(float val)
           {
               //--- производная функции активации
                return (val * (1.0 - val));
           };
    };

    void Redirection(bool ok);
    void backPropagate();
    void train(float *in, float *targ);
    void query(float *in);
    void gget();

private:
    std::vector<Layers> *listOfLayers = nullptr;
    int _inputNeurons;
    int _outputNeurons;
    int CountOfLayers;

    float *_inputs = nullptr;
    float *_targets = nullptr;
};
#endif 
