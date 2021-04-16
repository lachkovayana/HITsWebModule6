
let timeout;
let hiddenFourth;
let hiddenFirst;
let hiddenSecond;
let hiddenThird;
canvas.addEventListener('mousedown', function() {
    main();
});

function main(){
    document.getElementById("output").innerHTML = "";
    
    
    timeout =  setInterval(function(){
        hiddenFirst = makeHidden(getImage(),first,200,784);
        hiddenSecond = makeHidden(hiddenFirst,second, 60, 200);
        hiddenThird = makeHidden(hiddenSecond,third, 40, 60);
        hiddenFourth = makeHidden(hiddenThird,fourth,10,40);
        console.log(hiddenFourth);
        
    }, 50);
    

}
canvas.addEventListener('mouseup', function(){
    clearInterval(timeout);
    let  val = -10;
    let index = 0;
    /* for(let i  = 0; i < 10; ++i){
        console.log(hiddenFourth[i]);
    }
    console.log("----------"); */
    for(let i = 0; i < 10; ++i){
        if (hiddenFourth[i] > val){
            index = i;
            val = hiddenFourth[i];
        }
        
    }
    /* console.log(index); */

    document.getElementById("output").innerText = "Вы ввели : " + index;
});




function makeHidden(_inputs,massiv, out, input )
{
    let hidden = new Array(out);
    for(let hid = 0; hid < out; hid++)
            {
                var tmpS = 0.0;
                for(let inp = 0; inp < input; inp++)
                {
                    tmpS += _inputs[inp] * massiv[inp][hid];
                }
                tmpS += massiv[input][hid];
                hidden[hid] = sigmoida(tmpS);
            }
    return hidden;
}
function sigmoida(val)
{
    //--- функция активации
    return (1.0 / (1.0 + Math.exp(-val)));
}

/* main(); */