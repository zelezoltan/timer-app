function $(selector){
    return document.querySelector(selector);
}

// Model

let time = false;
let timer = undefined;
let paused = false;
const timerStarted = new Event('timerStarted');
const timerStopped = new Event('timerStopped');
const timerPaused = new Event('timerPaused');

function setTime(){
   const h = parseInt($('#hours').value);
   const m = parseInt($('#minutes').value);
   const s = parseInt($('#seconds').value);
   //console.log(h,m,s);
   if( h || h===0 ) setHours(h);
   if( m || m===0 ) setMinutes(m);
   if( s || s===0 ) setSeconds(s);
}

function setHours(h){
    time -= parseInt(time/(60*60))*60*60 ;
    time += h*60*60;
}

function setMinutes(m){
    time -= (parseInt(time/60) % 60)*60;
    time += m*60;
}

function setSeconds(s){
    time -= (time % 60);
    time += s;
}

function elapseTime(){
    if(time > 0){
        time -= 1;
        return time;
    } else {
        return false;
    }   
}

function startTimer(){
    timer = setInterval(timerTick, 1000);
    paused = false;
    window.dispatchEvent(timerStarted);
}

function stopTimer(){
    clearInterval(timer);
    timer = undefined;
    paused = false;
    window.dispatchEvent(timerStopped);
}

function pauseTimer(){
    if(paused && !timer){
        timer = setInterval(timerTick, 1000);
        paused = false;
    } 
    else if(!paused && timer){
        clearInterval(timer);
        timer = undefined;
        paused = true;
    } else {
        return;
    }
    window.dispatchEvent(timerPaused);
}

function updateTime(){
    const h = parseInt(time/(60*60));
    const m = parseInt(time/60) % 60;
    const s = parseInt(time % 60);
    /*$('.display').innerHTML = (h < 10 ? 0 + h.toString() : h.toString()) + ":" +
                                 (m < 10 ? 0 + m.toString() : m.toString()) + ":" + 
                                 (s < 10 ? 0 + s.toString() : s.toString());
    */
    $('#h').innerHTML = ((h < 10 ? 0 + h.toString() : h.toString()));
    $('#m').innerHTML = ((m < 10 ? 0 + m.toString() : m.toString()));
    $('#s').innerHTML = ((s < 10 ? 0 + s.toString() : s.toString()));
}

function buttonClick(){
    if(!timer && !paused){
        setTime();
        startTimer();
        updateTime();
    } else if(timer || paused){
        stopTimer();
        setTime();
        updateTime();
    }
}

function timerTick(){
    if(!elapseTime()){
        stopTimer();
    }
    updateTime();
}

$('#start').addEventListener('click', buttonClick);

window.addEventListener('timerStarted', function(){
    $('#start').classList = 'stop';
    $('#start').innerHTML = 'STOP';
    $('audio').pause();
});

window.addEventListener('timerStopped', function(){
    $('button').classList = '';
    $('button').innerHTML = 'START';
    if(time <= 0){
    	$('audio').volume = 0.2;
     	$('audio').play();
    }
    $('#pause').innerHTML = 'PAUSE';
});

$('#pause').addEventListener('click', function(){
    pauseTimer();
    if(paused) $('#pause').innerHTML = 'CONTINUE';
    else $('#pause').innerHTML = 'PAUSE';
});

$('#hours').addEventListener('input',function(){
    if(this.value && !timer){
        setHours(parseInt(this.value));
        updateTime();
    } 
});

$('#minutes').addEventListener('input',function(){
    if(this.value && !timer) {
        setMinutes(parseInt(this.value));
        updateTime();
    } 
});

$('#seconds').addEventListener('input',function(){
    if(this.value && !timer){
        setSeconds(parseInt(this.value));
        updateTime();
    }
});

function init(){
    updateTime();
};

init();
