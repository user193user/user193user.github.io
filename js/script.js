let canvas = document.getElementById("game")
let context = canvas.getContext("2d")

let canupdate = false
//images
let heroimg = new Image()
heroimg.src = "mat/hero1.png"
let herokadr = 0
let kolkadr = 10

let wallimg = new Image()
wallimg.src = "mat/wall.png"

let platformimg = new Image()
platformimg.src = "mat/platform.png"

let plpartimg= new Image()
plpartimg.src = "mat/plpart.png"

let lavacntpartimg= new Image()
lavacntpartimg.src = "mat/lavacentralpart.png"

let lavaendpartimg= new Image()
lavaendpartimg.src = "mat/lavaendpart.png"

let fonimg = new Image()
fonimg.src = "mat/fon1.png"
let fons = []
let kscale = 1
const Cfondx = 4
let fondx

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
    },
    dy: 0,
    dx: 0
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
    },
    wimg: {
        w: 0,
        h: 0,
        dx: 0,
        dy: 0
    }
}

let lavas = []
let lobject = {
    limg: {
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
    //console.log(jumpscnt)
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

heroimg.onload = function () 
{
    kscale = cnvh / fonimg.height
    let pokrx = 0
    while(pokrx < canvas.width)
    {
        fons.push({x: pokrx, y: 0})
        pokrx += fonimg.width * kscale
    }
    resizeCanvas()
    game()
}

function game()
{
    if(timer % 10 == 0)
        herokadr++
    herokadr %= kolkadr
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

    updatefon()
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
            let spawnw = Math.round((Math.random() + 1)*plobject.plcol.w / plobject.plcol.h) //kolpart
            platforms.push({
                x: canvas.width, 
                y: spawny, 
                w: spawnw*plobject.plcol.h, 
                h: plobject.plcol.h, 
                dx: pldx,
                kolplpart: spawnw
            })
            if(Math.random() < 0.5)
            {
                walls.push({
                    x: canvas.width + Math.random() * (spawnw - 2*wobject.wcol.w) + wobject.wcol.w, 
                    y: spawny - wobject.wcol.h - wobject.wimg.dy, 
                    w: wobject.wcol.w, 
                    h: wobject.wcol.h, 
                    dx: pldx,
                    type: "wall"
                })
            }            
        }
    }
    if(timer % 200 == 0)
    {
        walls.push({
            x: canvas.width, 
            y: canvas.height - groundh - 1, 
            w: wobject.wcol.w, 
            h: wobject.wcol.h, 
            dx: pldx,
            type: "lava"
        })
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
                    //console.log("standon")
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
                //console.log("flag")
                isjumping = false
                isfallingjerk = false
            }
        }
    }
    if(isrightjerk)
    {
        //console.log("jerk")
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
        //console.log("return")
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
            //console.log(platforms[i])
        }
    }
    //падение с платформы
    if(!interf && hero.hcol.y < canvas.height - hero.hcol.h - groundh && !isjumping)
    {
        //console.log("interfere")
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

function updatefon()
{
    let ind = 0
    while(ind < fons.length)
    {
        fons[ind].x -= fondx
        if(fons[ind].x + fonimg.width * kscale < 0)
            fons.splice(ind, 1)
        else
            ind++
    }
    if(fons.length == 0)
        fons.push({x: 0, y: 0})
    else if(fons[fons.length - 1].x + fonimg.width * kscale < canvas.width)
        fons.push({x: fons[fons.length - 1].x + fonimg.width * kscale, y: 0})
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
    let hotrx = {
        x1: hero.hcol.x,
        x2: hero.hcol.x + hero.hcol.w
    }
    let hotry = {
        y1: hero.hcol.y,
        y2: hero.hcol.y + hero.hcol.h
    }
    let ootrx = {
        x1: object.x,
        x2: object.x + object.w
    }
    let ootry = {
        y1: object.y,
        y2: object.y + object.h
    }
    let f1 = false, f2 = false
    if(hotrx.x1 < ootrx.x1)
    {
        if(hotrx.x2 >= ootrx.x1)
            f1 = true
    }
    else
    {
        if(ootrx.x2 >= hotrx.x1)
            f1 = true
    }
    if(hotry.y1 < ootry.y1)
    {
        if(hotry.y2 >= ootry.y1)
            f2 = true
    }
    else
    {
        if(ootry.y2 >= hotry.y1)
            f2 = true
    }
    if(f1 && f2)
        return true
    else
        return false
}

function render()
{
    context.clearRect(0, 0, canvas.width, canvas.height)

    for(i in fons)
        context.drawImage(fonimg, fons[i].x, 0, fonimg.width * kscale, fonimg.height * kscale)
    for(i in platforms)
        drawplatform(platforms[i])
    for(i in walls)
        context.drawImage(wallimg, 
            walls[i].x - wobject.wimg.dx, 
            walls[i].y - wobject.wimg.dy, 
            wobject.wimg.w, 
            wobject.wimg.h)
    context.drawImage(heroimg, herokadr * heroimg.width / kolkadr, 0, heroimg.width / kolkadr, heroimg.height, 
        hero.hcol.x - (hero.himg.w - hero.hcol.w) / 2, 
        hero.hcol.y - (hero.himg.h - hero.hcol.h), 
        hero.himg.w, 
        hero.himg.h)
}

function drawplatform(platform)
{
    let lx = platform.x
    let kol = 0
    while(kol < platform.kolplpart)
    {
        context.drawImage(plpartimg, lx, platform.y, platform.h, platform.h)
        lx += platform.h
        kol++
    }
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
    let k = canvas.height / cnvh

    groundh = Math.round(k * cnvh / 100)
    firstherox = Math.round(canvas.height / 60)

    hero.hcol.h = Math.round(k * cnvh / 8)
    hero.hcol.w = Math.round(heroimg.width / kolkadr * hero.hcol.h / heroimg.height)
    hero.hcol.y = canvas.height - hero.hcol.h - groundh
    hero.hcol.x = firstherox
    hero.himg.w = Math.round(hero.hcol.w / 0.8)
    hero.himg.h = Math.round(hero.hcol.h / 0.8)

    plobject.plcol.w = Math.round(k*platformimg.width*2)
    plobject.plcol.h = Math.round(platformimg.height*0.8*k)
    plobject.plmargin.top = canvas.height / 8
    plobject.plmargin.bottom = canvas.height / 8
    minspawny = hero.hcol.h + Math.round(canvas.height / 60.0)
    maxspawny = canvas.height - hero.hcol.h - groundh - Math.round(canvas.height / 60.0)

    wobject.wcol.h = Math.round(k*0.05*cnvh)
    wobject.wcol.w = Math.round(wallimg.width*wobject.wcol.h/wallimg.height)
    console.log(wobject.wcol.h + " " + wobject.wcol.w)
    wobject.wimg.w = Math.round(wobject.wcol.w / 0.5)
    wobject.wimg.h = Math.round(wobject.wcol.h / 0.5)
    wobject.wimg.dx = (wobject.wimg.w - wobject.wcol.w) / 2
    wobject.wimg.dy = (wobject.wimg.h - wobject.wcol.h) / 2

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

    fondx = k * Cfondx
    kscale = canvas.height / fonimg.height
    for(i in fons)
        fons[i].x = fons[i].x / predk * k

    predk = k
    console.log(ug + " " + dg + " " + da + " " + pldx)
}