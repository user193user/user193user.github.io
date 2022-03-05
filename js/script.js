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
const cnvh = 600
const cnvw = 1200
const Cgroundh = 10
const Cfirstherox = 10
const Cug = 0.4
const Cdg = 0.4
const Cda = 14
const Cpldx = 5

let predk = 1

let groundh
let firstherox
let ug
let dg 
let da
let pldx
let jumph
let jerkl


//global per
let timer = 0
let hero = {
    hcol: {
        x: firstherox, 
        y: 0,
        w: 0, 
        h: 0 
    },
    himg: {
        x: firstherox, 
        y: 0,
        w: 0,
        h: 0
    }
}
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
let wobject = {
    wcol: {
        w: 0,
        h: 0
    }
}


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
    console.log(jumpscnt)
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
        fally = hero.hcol.y + hero.hcol.h + 1
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
    resizeCanvas()
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
        walls[j].x -= pldx
        j++
    }
}

function spawn()
{
    if(timer % 75 == 0)
    {
        let availablespawny = []
        let spawnstep = Math.round(canvas.height / 60.0)              ///!!!
        if(spawnstep == 0)                                            ///!!!
            spawnstep = 1                                             ///!!!
        let tempy = maxspawny
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
                    x: canvas.width + Math.random() * (spawnw - 2*wobject.wcol.w) + wobject.wcol.w, 
                    y: spawny - wobject.wcol.h, 
                    w: wobject.wcol.w, 
                    h: wobject.wcol.h, 
                    dx: pldx})
            }            
        }
    }
    if(timer % 200 == 0)
    {
        walls.push({
            x: canvas.width, 
            y: canvas.height - groundh - 1, 
            w: wobject.wcol.w*4, 
            h: wobject.wcol.h/2, 
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
            hero.hcol.y -= hero.dy
            hero.hcol.y = Math.max(0, hero.hcol.y)
            hero.dy -= ug
        }
        else
        {
            let flag = true
            for(let i in platforms)
                if(isstandon(platforms[i]) && platforms[i].y > fally)
                {
                    hero.hcol.y = platforms[i].y - hero.hcol.h
                    hero.dy = 0
                    jumpscnt = 0
                    console.log("standon")
                    isjumping = false
                    isfallingjerk = false
                    flag = false
                    break
                }
            if(hero.hcol.y - hero.dy < canvas.clientHeight - hero.hcol.h - groundh && flag)
            {
                hero.hcol.y -= hero.dy
                hero.dy -= dg
            }
            else if(flag)
            {
                hero.hcol.y = canvas.clientHeight - hero.hcol.h - groundh
                hero.dy = 0
                jumpscnt = 0
                console.log("flag")
                isjumping = false
                isfallingjerk = false
            }
        }
    }
    if(isrightjerk)
    {
        console.log("jerk")
        hero.hcol.x += hero.dx
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
        hero.hcol.x += hero.dx
        if(hero.hcol.x <= firstherox)
        {
            hero.hcol.x = firstherox
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
        platforms[i].x -= pldx
        if(isstandon(platforms[i]))
        {
            interf = true
            console.log(platforms[i])
        }
    }
    //падение с платформы
    if(!interf && hero.hcol.y < canvas.height - hero.h - groundh && !isjumping)
    {
        console.log("interfere")
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
    return (hero.hcol.y + hero.hcol.h <= platform.y && hero.hcol.y + hero.hcol.h - hero.dy >= platform.y) && 
    hero.hcol.x + hero.hcol.w > platform.x && hero.hcol.x < platform.x + platform.w
}

function iscollision(object)
{
    let points = [{x: hero.hcol.x, y: hero.hcol.y}, {x: hero.hcol.x + hero.hcol.w, y: hero.hcol.y}, {x: hero.hcol.x + hero.hcol.w, y: hero.hcol.y + hero.hcol.h}, {x: hero.hcol.x, y: hero.hcol.y + hero.hcol.h}]
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
    context.drawImage(heroimg, hero.hcol.x, hero.hcol.y, hero.himg.w, hero.hcol.h)
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

window.onresize = function() 
{
    resizeCanvas()
}

function resizeCanvas()
{
    canvas.width = window.innerWidth*0.6
    canvas.height = canvas.width*cnvh/cnvw
    let k = 1.0*canvas.height / cnvh

    groundh = Math.round(k * cnvh / 100)
    firstherox = Math.round(canvas.height / 60)

    hero.hcol.h = Math.round(k * cnvh / 8)
    hero.hcol.w = Math.round(heroimg.width * hero.hcol.h / heroimg.height)
    hero.hcol.y = canvas.height - hero.hcol.h - groundh
    hero.hcol.x = firstherox
    hero.himg.w = hero.hcol.w / 0.5

    plobject.plcol.w = Math.round(k*platformimg.width*2)
    plobject.plcol.h = Math.round(platformimg.height*0.8*k)
    plobject.plmargin.top = canvas.height / 8
    plobject.plmargin.bottom = canvas.height / 8
    minspawny = hero.hcol.h + Math.round(canvas.height / 60.0)
    maxspawny = canvas.height - hero.hcol.h - groundh - Math.round(canvas.height / 60.0)

    wobject.wcol.w = Math.round(k*25)
    wobject.wcol.h = Math.round(50*k)

    for(i in platforms)
    {
        platforms[i].w = platforms[i].w / predk * k
        platforms[i].h = platforms[i].h / predk * k
        platforms[i].x = platforms[i].x / predk * k
        platforms[i].y = platforms[i].y / predk * k
    }

    for(i in walls)
    {
        walls[i].w = walls[i].w / predk * k
        walls[i].h = walls[i].h / predk * k
        walls[i].x = walls[i].x / predk * k
        walls[i].y = walls[i].y / predk * k
    }

    firstherox = Math.round(canvas.height / 60.0)
    ug = Cug * k
    dg = Cdg * k
    da = Cda * k
    pldx = Cpldx * k 
    jumph = canvas.height / 3 
    jerkl = canvas.width / 5

    predk = k
    console.log(ug + " " + dg + " " + da + " " + pldx)
}