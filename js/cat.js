let pretimer = Date.now()
let timer

function changepos(flag)
{
    document.getElementById("main").style.position="relative";
    document.getElementById("smth").style.position="relative";
    let cat = document.getElementById("main")
    let smth = document.getElementById("smth")
    smth.style.opacity = 0
    let smthl = Math.round(Math.random()*(window.innerWidth  - 200)) + 50
    let smthr = Math.round(Math.random()*(window.innerHeight  - 400)) + 50
    let catl = Math.round(Math.random()*(window.innerWidth  - 200)) + 50
    let catr = Math.round(Math.random()*(window.innerHeight  - 200)) + 50
    smth.style.left = String(smthl) + 'px'
    smth.style.top = String(smthr) + 'px'
    while(Math.abs(catr - smthr) < 100 || Math.abs(catl - smthl) < 200)
    {
        catl = Math.round(Math.random()*(window.innerWidth  - 200)) + 50
        catr = Math.round(Math.random()*(window.innerHeight  - 200)) + 50
    }
    cat.style.left = String(catl) + 'px'
    cat.style.top = String(catr) + 'px'
    timer = Date.now()
    if(flag)
        alert((timer - pretimer) / 1000 + " секунд")
    pretimer = timer
    //cat.style.left = '500px'
    //cat.style.top = '500px'
}

function fail()
{
    
}

document.onmousemove = function(event) {
    let posX = event.pageX
    let posY = event.pageY
	let smth = document.getElementById("smth").getBoundingClientRect();
    let smthX = smth.left + smth.width / 2
    let smthY = smth.top + smth.height / 2
    if(Math.abs(posX - smthX) < smth.width*0.8 && Math.abs(posY - smthY) < smth.height*0.7)
        document.getElementById("smth").style.opacity = 1
    else
        document.getElementById("smth").style.opacity = 0
    if(Math.abs(posX - smthX) < smth.width / 2 && Math.abs(posY - smthY) < smth.height / 2)
    {
        alert("cat is dead")
        changepos(false)
    }
}

function foo()
{
    document.getElementById("smth").style.opacity = 0
}