let canvas = document.getElementById("game")
let context = canvas.getContext("2d")

let canupdate = false
//images
let heroimg = new Image()
heroimg.src = "mat/hero.png"

let wallimg = new Image()
wallimg.src = "mat/wall.png"

let platformimg = new Image()
platformimg.src = "mat/platform.png"

//global const
const groundh = 10
const firstherox = 10
const ug = 0.5
const dg = 0.5
const da = 10
const pldx = 5 
const jumph = canvas.clientHeight / 3 
const jerkl = canvas.clientWidth / 5


//global per
let timer = 1
let hero = {x: firstherox, y: 0, w: 0, h: 0, dx: 0, dy: 0}
let platforms = []
let maxspawny
let minspawny
let plobject = {
    plmargin: {
        right: 50,
        left: 50,
        top: 0,
        bottom: 0
    },
    plcol: {
        w: 0,
        h: 0
    }
}

let walls = []
/*let wobject = {
    ocol: {
        w: 0,
        h: 0
    }
}*/


let fally = 0
let isjumping = false
let isfallingjerk = false
let jumpscnt = 0

let isrightjerk = false
let ax = 1 
let jerkdelay = 50

let gameover = false
//func


///////////////////////////////////////////swipe detectors
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

canvas.addEventListener('mousedown', function(event) 
{
    touchstartX = event.offsetX;
    touchstartY = event.offsetY;
}, false);

canvas.addEventListener('mouseup', function(event) 
{
    touchendX = event.offsetX;
    touchendY = event.offsetY;
    handleGesture();
}, false); 

function handleGesture() 
{
    if(Math.abs(touchendY - touchstartY) <= 10 && Math.abs(touchendX - touchstartX) <= 10)
        swipeUp()
    else if (Math.abs(touchendX - touchstartX) > Math.abs(touchendY - touchstartY)) 
        if(touchendX > touchstartX)
            swipeRight()
        else
            console.log('Swiped left')
    else
        if(touchendY < touchstartY)
            swipeUp()
        else
            swipeDown()
}

function swipeUp()
{
    if(jumpscnt <= 1)
    {
        jumpscnt++
        hero.dy = Math.round(Math.sqrt(2*ug*jumph))
        fally = 0
        isjumping = true
    }
}

function swipeDown()
{
    if(!isfallingjerk)
    {
        isfallingjerk = true
        hero.dy = -da
        isjumping = true
        isfallingjerk = true
        fally = hero.y + hero.h + 1
    }
}

function swipeRight()
{
    if(!isrightjerk && hero.dx == 0)
    {
        isrightjerk = true
        hero.dx = Math.round(Math.sqrt(2*ax*jerkl))
    }
}
////////////////////////////////////////////

platformimg.onload = function () 
{
    //resizeCanvas()
    hero.y = canvas.height - heroimg.height - groundh
    hero.w = heroimg.width
    hero.h = heroimg.height

    plobject.plcol.w = platformimg.width*2
    plobject.plcol.h = platformimg.height
    plobject.plmargin.top = canvas.clientHeight / 8
    plobject.plmargin.bottom = canvas.clientHeight / 8
    minspawny = hero.h + 10
    maxspawny = canvas.clientHeight - hero.h - groundh - 10
    game()
}

function game()
{
    timer++
    if(!gameover)
        update()
    if(!gameover)
        render()
    if(!gameover)
        requestAnimFrame(game)
}

function update()
{
    updatelets()
    spawn()
    move()
    updateplatforms()
    destroyer()
}

function updatelets()
{
    let j = 0
    while(j < walls.length)
    {
        if(iscollision(walls[j]))
        {
            console.log(walls[j])
            if(isrightjerk)
            {
                walls.splice(j, 1)
                hero.dx = 0
                continue
            }
            else
            {
                gameover = true
                alert("Game over!")
                return
            }
        }
        walls[j].x -= walls[j].dx
        j++
    }
}

function spawn()
{
    if(timer % 75 == 0)
    {
        let availablespawny = []
        let spawnstep = 10
        let tempy = maxspawny
        console.log()
        while(tempy >= minspawny)
        {
            let flag = true
            for(let i in platforms)
                if(platforms[i].x + platforms[i].w + plobject.plmargin.right > canvas.clientWidth)
                    if(tempy >= platforms[i].y - plobject.plmargin.top && 
                        tempy <= platforms[i].y + plobject.plmargin.bottom + platforms[i].h)
                    {
                        tempy -= spawnstep
                        flag = false
                        break
                    }
            if(flag)
                availablespawny.push(tempy)
            tempy -= spawnstep
        }
        if(availablespawny.length)
        {
            let spawny = availablespawny[randomInteger(0, availablespawny.length - 1)]
            let spawnw = (Math.random() + 1)*plobject.plcol.w
            platforms.push({
                x: canvas.clientWidth, 
                y: spawny, 
                w: spawnw, 
                h: plobject.plcol.h, 
                dx: pldx})
            if(Math.random() < 0.5)
            {
                walls.push({
                    x: canvas.clientWidth + Math.random() * (spawnw - 50) + 25, 
                    y: spawny - 50, 
                    w: 25, 
                    h: 50, 
                    dx: pldx})
            }            
        }
    }
    if(timer % 200 == 0)
    {
        walls.push({
            x: canvas.clientWidth, 
            y: canvas.clientHeight - 25, 
            w: 100, 
            h: 25, 
            dx: pldx})
    }
    if(timer == 200 * 75)
        timer = 0
}

function move()
{
    if(isjumping)
    {
        if(hero.dy > 0)
        {
            hero.y -= hero.dy
            hero.y = Math.max(0, hero.y)
            hero.dy -= ug
        }
        else
        {
            let flag = true
            for(let i in platforms)
                if(isstandon(platforms[i]) && platforms[i].y > fally)
                {
                    hero.y = platforms[i].y - hero.h
                    hero.dy = 0
                    jumpscnt = 0
                    isjumping = false
                    isfallingjerk = false
                    flag = false
                    break
                }
            if(hero.y - hero.dy < canvas.clientHeight - heroimg.height - groundh && flag)
            {
                hero.y -= hero.dy
                hero.dy -= dg
            }
            else if(flag)
            {
                hero.y = canvas.clientHeight - heroimg.height - groundh
                hero.dy = 0
                jumpscnt = 0
                isjumping = false
                isfallingjerk = false
            }
        }
    }
    if(isrightjerk)
    {
        console.log("jerk")
        hero.x += hero.dx
        hero.dx -= ax
        if(hero.dx <= 0)
        {
            hero.dx = -2*ax
            isrightjerk = false
        }
    }
    else if(hero.dx < 0)
    {
        console.log("return")
        hero.x += hero.dx
        if(hero.x <= firstherox)
        {
            hero.x = firstherox
            hero.dx = 0
        }
    }
}

function updateplatforms()
{
    //проверка на падение с платформы
    let interf = false
    for(let i in platforms)
    {
        platforms[i].x -= platforms[i].dx
        if(isstandon(platforms[i]))
            interf = true
    }
    //падение с платформы
    if(!interf && hero.y < canvas.clientHeight - heroimg.height - groundh && !isjumping)
    {
        isjumping = true
        jumpscnt = 1
        hero.dy = 0
    }
}

function destroyer()
{
    //удаление
    let ind = 0
    while(ind < platforms.length)
    {
        if(platforms[ind].x + platforms[ind].w < 0)
            platforms.splice(ind, 1)
        else
            ind++
    }
    ind = 0
    while(ind < walls.length)
    {
        if(walls[ind].x + walls[ind].w < 0)
            walls.splice(ind, 1)
        else
            ind++
    }
}

function randomInteger(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isstandon(platform)
{
    return (hero.y + hero.h <= platform.y && hero.y + hero.h - hero.dy >= platform.y) && 
    hero.x + hero.w > platform.x && hero.x < platform.x + platform.w
}

function iscollision(object)
{
    let points = [{x: hero.x, y: hero.y}, {x: hero.x + hero.w, y: hero.y}, {x: hero.x + hero.w, y: hero.y + hero.h}, {x: hero.x, y: hero.y + hero.h}]
    for(let i in points)
        if(points[i].x >= object.x && points[i].x <= object.x + object.w &&
            points[i].y >= object.y && points[i].y <= object.y + object.h)
            return true
    return false
}

function render()
{
    context.clearRect(0, 0, canvas.width, canvas.height)
    for(i in platforms)
        context.drawImage(platformimg, platforms[i].x, platforms[i].y, platforms[i].w, platforms[i].h)
    for(i in walls)
        context.drawImage(wallimg, walls[i].x, walls[i].y, walls[i].w, walls[i].h)
    context.drawImage(heroimg, hero.x, hero.y, hero.w, hero.h)
}

let requestAnimFrame = 
(
    function () 
    {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback)
            {
                window.setTimeout(callback, 1000/100)
            }
    }
)()

////not game's part
/*
window.onresize = function() 
{
    resizeCanvas()
}

function resizeCanvas()
{
    canvas.width = window.innerWidth*0.6
    canvas.height = canvas.width*9/16
    plobject.plcol.h = canvas.height / 25
    plobject.plcol.w = canvas.width / 4
    let khero = canvas.height / 15 * 4 / heroimg.height
    hero.h = heroimg.height * khero
    hero.w = heroimg.width * khero
}*/