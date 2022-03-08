let canvas = document.getElementById("game")
let context = canvas.getContext("2d")



//global const
const cnvh = 600
const cnvw = 1200
const Cgroundh = 10
const Cug = 0.4
const Cdg = 0.4
const Cda = 14
const Cax = 1
const Ckickdx = 20
const fonangelrange = 5
const kolfon2kadr = 4
const kolneednimbs = 3
const kolpikekadr = 3
const normalenemies = 3
const kolwallkadr = 4
const jerkdelay = 50

let Cpldx = 5
let Cfondx = 4

//images
let menuimg = new Image()
menuimg.src = "mat/menu.png"

let startimg = new Image()
startimg.src = "mat/startmessage.png"

let replayimg = new Image()
replayimg.src = "mat/losemessage.png"

let herostage = "run"
let herokadr = 0
const kolkadr = 10

let herorunimg = new Image()
herorunimg.src = "mat/herorun.png"
let herorunkadr = 0
const kolrunkadr = 6

let herojumpimg = new Image()
herojumpimg.src = "mat/herojump.png"
let herojumpkadr = 0
const koljumpkadr = 4

let herofallimg = new Image()
herofallimg.src = "mat/herofall.png"
let herofallkadr = 0
const kolfallkadr = 6

let herojerkimg = new Image()
herojerkimg.src = "mat/herojerk.png"
let herojerkkadr = 0
const koljerkkadr = 1

let wallimg = new Image()
wallimg.src = "mat/wall.png"
let wall1img = new Image()
wall1img.src = "mat/wall1.png"
let wall2img = new Image()
wall2img.src = "mat/wall2.png"
let wall3img = new Image()
wall3img.src = "mat/wall3.png"
let wall4img = new Image()
wall4img.src = "mat/wall4.png"
let wall5img = new Image()
wall5img.src = "mat/wall5.png"
let wall6img = new Image()
wall6img.src = "mat/wall6.png"
let enemies = []
enemies.push({img: wallimg, scalek: 1})
enemies.push({img: wall5img, scalek: 2})
enemies.push({img: wall6img, scalek: 1.5})
enemies.push({img: wall1img, scalek: 2})
enemies.push({img: wall2img, scalek: 2})
enemies.push({img: wall3img, scalek: 1.5})
enemies.push({img: wall4img, scalek: 1.8})

let plpartimg= new Image()
plpartimg.src = "mat/plpart.png"

let plendimg= new Image()
plendimg.src = "mat/plendpart.png"

let pikesimg= new Image()
pikesimg.src = "mat/pikes.png"
let pobject = {
    w: 0,
    h: 0
}

let flpartimg= new Image()
flpartimg.src = "mat/flpart.png"
let kolfloorkadr = 8
let floors = []
let fobject = {
    w: 0,
    h: 0
}

let fonimg = new Image()
fonimg.src = "mat/fon1.png"
let fon31img = new Image()
fon31img.src = "mat/fon31.png"
let fon32img = new Image()
fon32img.src = "mat/fon32.png"
let angelimg = new Image()
angelimg.src = "mat/angel.png"
//let swordimg = new Image()
//swordimg.src = "mat/hero.png"


let fons = []
let sword = {
    kx: 0.613,
    ky: 0.263,
    kw: 0.048,
    kh: 0.191
}
let angel = {
    kx: 0.500,
    ky: 0.03,
    kw: 0.280,
    kh: 0.444
}

let nimbimg = new Image()
nimbimg.src = "mat/nimb.png"
let nimb = {
    curkadr: 0,
    kolkadr: 8,
    kw: 0.5,
    kh: 0.5
}
let nimb1img = new Image()
nimb1img.src = "mat/nimb1.png"
let nimb2img = new Image()
nimb2img.src = "mat/nimb2.png"
let nimb3img = new Image()
nimb3img.src = "mat/nimb3.png"
let nimbicon = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    dy: 0
}


let fondx
let fonw, fonh
let fonchange = 0
let angelchangetimer = 0
let kolnimbs = 0

//scaling per
let predk = 1

let groundh
let firstherox
let ug
let dg 
let da
let pldx
let jumph
let jerkl
let kickdx

//global per
//time
let timer = 0
let herotimer = 0
let lavatimer = 0
let lavarange = 0

//hero
let hero = {
    hcol: {
        x: 0, 
        y: 0,
        w: 0, 
        h: 0
    },
    himg: {
        w: 0,
        h: 0
    },
    dy: 0,
    dx: 0,
    blessed: false,
    blessedtimer: 0,
    blessedplank: 2000
}
//platforms
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
//lets
let walls = []
let wobject = {
    wcol: {
        w: 0,
        h: 0
    }
}

let lavas = []
let lavawidth

let fally = 0
let isjumping = false
let isfallingjerk = false
let jumpscnt = 0

let isrightjerk = false
let ax

let gameover = false
let pause = true
let start = false
let score = 0
let scoretimer = 0
let kolspeedup = 0
//func


///////////////////////////////////////////swipe detectors
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

canvas.addEventListener('mousedown', function(event) 
{
    touchstartX = event.offsetX
    touchstartY = event.offsetY
}, false);

canvas.addEventListener('mouseup', function(event) 
{
    if(!start)
    {
        start = true
        game()
    }
    else if(gameover)
    {
        gameover = false
        pregame()
        game()
    }
    else
    {
        touchendX = event.offsetX
        touchendY = event.offsetY
        handleGesture()
    }
}, false); 

function handleGesture() 
{
    if(Math.abs(touchendY - touchstartY) <= 10 && Math.abs(touchendX - touchstartX) <= 10)
        swipeUp()
    else if (Math.abs(touchendX - touchstartX) > Math.abs(touchendY - touchstartY))
    {
        if(touchendX > touchstartX)
            swipeRight()
    }
    else
    {
        if(touchendY < touchstartY)
            swipeUp()
        else
            swipeDown()
    }
}

function swipeUp()
{
    herostage = "jump"
    herojumpkadr = 0
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
    herostage = "fall"
    herofallkadr = 0
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
        herostage = "jerk"
        herojerkkadr = 0
        isrightjerk = true
        hero.dx = Math.round(Math.sqrt(2*ax*jerkl))
    }
}
////////////////////////////////////////////

angelimg.onload = function () 
{
    pregame()
    render()
    context.drawImage(menuimg, 0, 0, canvas.width, canvas.height)
    context.drawImage(startimg, 
        canvas.width*0.4, 
        0 + (canvas.height - startimg.height*canvas.width*0.2/startimg.width)/2, 
        canvas.width*0.2, 
        startimg.height*canvas.width*0.2/startimg.width)
}

function pregame()
{
    score = 0
    scoretimer = 0
    Cpldx = 5
    Cfondx = 4

    isjumping = false
    isfallingjerk = false
    isrightjerk = false

    fonchange = 0 //текущий номер фона между ангелами
    hero.dy = 0
    hero.dx = 0
    kolnimbs = 0
    hero.blessed = false
    timer = 0
    lavatimer = 0
    herotimer = 0
    angelchangetimer = 0
    jumpscnt = 0

    herostage = "run"
    floors.splice(0,floors.length)
    fons.splice(0,fons.length)
    platforms.splice(0,platforms.length)
    walls.splice(0,walls.length)
    lavas.splice(0,lavas.length)
    resizeCanvas(true)
    let pokrx = 0
    let kolfon = 0
    while(pokrx < canvas.width)
    {
        if(kolfon == 1)
            fons.push({img: 1, x: pokrx, isactivated: false, curkadr: 0})
        else
            fons.push({img: 0, x: pokrx, isactivated: false, curkadr: 0})
        pokrx += fonw
        kolfon++
    }
    pokrx = 0
    while(pokrx < canvas.width)
    {
        floors.push({x: pokrx, kadr: randomInteger(0, kolfloorkadr - 1)})
        pokrx += groundh
    }
    herostage = "run"
    herorunkadr = 0
}

function game()
{
    if(!gameover)
        update()
    if(!gameover)
        render()
    if(!gameover)
        requestAnimFrame(game)
}

function update()
{
    if(score == 400 && kolspeedup == 0)
    {
        Cpldx *= 1.1
        Cfondx *= 1.1
        pldx = canvas.height / cnvh * Cpldx
        fondx = canvas.height / cnvh * Cfondx
        kolspeedup++
    }
    if(score == 800 && kolspeedup == 1)
    {
        Cpldx *= 1.1
        Cfondx *= 1.1
        pldx = canvas.height / cnvh * Cpldx
        fondx = canvas.height / cnvh * Cfondx
        kolspeedup++
    }
    scoretimer++
    if(scoretimer % 20 == 0)
        score++
    scoretimer %= 20
    timer++
    lavatimer++
    herotimer++
    angelchangetimer++
    if(hero.blessed && hero.blessedtimer == hero.blessedplank)
        hero.blessed = false
    else
        hero.blessedtimer++
    if(herotimer % 10 == 0)
    {
        herotimer = 0
        if(hero.blessed)
        {
            nimb.curkadr++
            if(hero.blessedplank - hero.blessedtimer < 300)
                nimb.curkadr %= nimb.kolkadr
            else
                nimb.curkadr %= nimb.kolkadr - 2
        }
        switch(herostage)
        {
            case "run":
                herorunkadr++
                herorunkadr %= kolrunkadr
                break
            case "jump":
                herojumpkadr++
                herojumpkadr %= koljumpkadr
                break
            case "fall":
                herofallkadr++
                herofallkadr %= kolfallkadr
                break
            case "jerk":
                herojerkkadr++
                herojerkkadr %= koljerkkadr
                break
        }
    }
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
        walls[j].dstrtimer++
        if(walls[j].dstrtimer % 40 == 0)
            walls[j].curkadr++
        walls[j].curkadr %= kolwallkadr

        if(walls[j].isdead)
        {
            if(walls[j].x > canvas.width)
            {
                walls.splice(j, 1)
                continue
            }
            walls[j].x += kickdx
        }
        else 
        {
            if(iscollision(walls[j]) && !hero.blessed)
            {
                if(isrightjerk && walls[j].enemynum < normalenemies)
                {
                    walls[j].isdead = true
                    hero.dx = 0
                }
                else
                {
                    gameover = true
                    gameOver()
                    return
                }
            }
            walls[j].x -= pldx
        }
        j++
    }
    j = 0
    while(j < lavas.length)
    {
        if(iscollision(lavas[j]) && !hero.blessed)
        {
            gameover = true
            gameOver()
            return
        }
        lavas[j].x -= pldx
        j++
    }
}

function spawn()
{
    if(lavarange == 0)
        lavarange = randomInteger(200, 500)
    lavatimer %= lavarange
    timer %= 70
    if(timer == 0)
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
                kolplpart: spawnw,
            })
            if(Math.random() < 0.4)
            {
                let en
                if(Math.random() < 0.9)
                    en = randomInteger(0, normalenemies - 1)
                else
                    en = randomInteger(normalenemies, enemies.length - 1)
                walls.push({
                    x: canvas.width + Math.random() * 
                    (spawnw*plobject.plcol.h - 2*wobject.wcol.w*enemies[en].scalek) + wobject.wcol.w*enemies[en].scalek, 
                    y: spawny - wobject.wcol.h*enemies[en].scalek - wobject.wcol.h*enemies[en].scalek / 2, 
                    w: wobject.wcol.w*enemies[en].scalek, 
                    h: wobject.wcol.h*enemies[en].scalek, 
                    dx: pldx,
                    enemynum: en,
                    curkadr: 0,
                    dstrtimer: 0,
                    isdead: false
                })
            }            
        }
    }
    if(lavatimer == 0)
    {
        let spawnw = Math.round((Math.random() + 1)*lavawidth / groundh) //kolpart
        lavas.push({
            x: canvas.width, 
            y: canvas.height - groundh, 
            w: spawnw*groundh, 
            h: groundh, 
            dx: pldx,
            kolplpart: spawnw
        })
        lavarange = 0
    }
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
            if(hero.dy <= 0)
            {
                herostage = "fall"
                herofallkadr = 0
            }
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
                    isjumping = false
                    isfallingjerk = false
                    flag = false
                    herostage = "run"
                    herorunkadr = 0
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
                isjumping = false
                isfallingjerk = false
                herostage = "run"
                herorunkadr = 0
            }
        }
    }
    if(isrightjerk)
    {
        hero.hcol.x += hero.dx
        hero.dx -= ax
        if(hero.dx <= 0)
        {
            hero.dx = -2*ax
            isrightjerk = false
            if(isjumping)
            {
                if(hero.dy > 0)
                {
                    herostage = "jump"
                    herojumpkadr = 0
                }
                else
                {
                    herostage = "fall"
                    herofallkadr = 0
                }
            }
            else
            {
                herostage = "run"
                herorunkadr = 0
            }
        }
    }
    else if(hero.dx < 0)
    {
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
            interf = true
    }
    //падение с платформы
    if(!interf && hero.hcol.y < canvas.height - hero.hcol.h - groundh && !isjumping)
    {
        isjumping = true
        jumpscnt = 1
        hero.dy = 0
        herostage = "fall"
        herofallkadr = 0
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
    ind = 0
    while(ind < lavas.length)
    {
        if(lavas[ind].x + lavas[ind].w < 0)
            lavas.splice(ind, 1)
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
        if(fons[ind].img && !fons[ind].isactivated &&
            iscollision({
                x: fons[ind].x + sword.kx*fonw, 
                y: sword.ky*fonh, 
                w: fonw*sword.kw, 
                h: fonh*sword.kh}))
        {
            fons[ind].isactivated = true
            kolnimbs++
            if(kolnimbs == kolneednimbs)
            {
                kolnimbs = 0
                hero.blessed = true
                hero.blessedtimer = 0
            }
        }
        if(fons[ind].x + fonw < 0)
            fons.splice(ind, 1)
        else
            ind++
    }
    while(fons[fons.length - 1].x + fonw <= canvas.width)
    {
        if(fonchange >= fonangelrange && Math.random())
        {
            if(Math.random() < 0.3)
            {
                fons.push({img: 1, x: fons[fons.length - 1].x + fonw, isactivated: false, curkadr: 0})
                fonchange = 0
            }
        }
        else
        {
            fons.push({img: 0, x: fons[fons.length - 1].x + fonw, isactivated: false, curkadr: 0})
            fonchange++
        }
    }
    if(angelchangetimer % 40 == 0)
    {
        angelchangetimer = 0
        for(i in fons)
            if(fons[i].img)
                fons[i].curkadr = (fons[i].curkadr + 1) % kolfon2kadr
    }
    ind = 0
    while(ind < floors.length)
    {
        floors[ind].x -= pldx
        if(floors[ind].x + groundh < 0)
            floors.splice(ind, 1)
        else
            ind++
    }
    while(floors[floors.length - 1].x + groundh <= canvas.width)
        floors.push({x: floors[floors.length - 1].x + groundh, kadr: randomInteger(0, kolfloorkadr - 1)})
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
    {
        if(fons[i].img)
        {
            context.drawImage(fon31img, fons[i].x, 0, fonw, fonh)
            context.drawImage(angelimg,
                angelimg.width / kolfon2kadr * fons[i].curkadr, 
                0,
                angelimg.width / kolfon2kadr,
                angelimg.height,
                fons[i].x + fonw*angel.kx,
                fonh*angel.ky,
                fonw*angel.kw, 
                fonh*angel.kh)
            context.drawImage(fon32img, fons[i].x, 0, fonw, fonh)
        }
        else
            context.drawImage(fonimg, fons[i].x, 0, fonw, fonh)
    }
    for(i in floors)
        context.drawImage(flpartimg, floors[i].x, canvas.height - fobject.h, fobject.w, fobject.h)
    for(i in platforms)
        drawplatform(platforms[i], plpartimg, plendimg)
    for(i in walls)
        drawwall(walls[i])
    switch(herostage)
    {
        case "run":
            drawhero(herorunimg, herorunkadr, kolrunkadr)
            break
        case "jump":
            drawhero(herojumpimg, herojumpkadr, koljumpkadr)
            break
        case "fall":
            drawhero(herofallimg, herofallkadr, kolfallkadr)
            break
        case "jerk":
            drawhero(herojerkimg, herojerkkadr, koljerkkadr)
            break
    }
    if(hero.blessed)
    {
        let dx
        if(herostage == "jump" || herostage == "fall")
            dx = hero.hcol.w / 5
        else
            dx = hero.hcol.w / 3
        let dy
        if(herostage == "jump" || herostage == "fall")
            dy = (hero.himg.h - hero.hcol.h) * 3
        else
            dy = (hero.himg.h - hero.hcol.h) * 2.5
        context.drawImage(nimbimg, 
            nimb.curkadr * nimbimg.width / nimb.kolkadr, 
            0, 
            nimbimg.width / nimb.kolkadr, 
            nimbimg.height, 
            hero.hcol.x + dx, 
            hero.hcol.y - dy,
            hero.himg.w * nimb.kw,
            hero.himg.h * nimb.kh)
    }
    for(i in lavas)
        drawpikes(lavas[i])
    for(i in floors)
        context.drawImage(flpartimg, 
            floors[i].kadr * flpartimg.width / kolfloorkadr,
            0,
            flpartimg.width / kolfloorkadr,
            flpartimg.height,
            floors[i].x, 
            canvas.height - fobject.h, 
            fobject.w, 
            fobject.h)
    let nimby = nimbicon.y
    for(let i = 0; i < kolneednimbs; i++)
    {
        let img
        if(hero.blessed)
            img = nimb3img
        else if(i < kolnimbs)
            img = nimb1img
        else
            img = nimb2img
        context.drawImage(img, 
            nimbicon.x, 
            nimby, 
            nimbicon.w, 
            nimbicon.h)
        nimby += nimbicon.dy
    }

    drawscore()
}

function drawwall(enemy)
{
    context.drawImage(enemies[enemy.enemynum].img,
        enemies[enemy.enemynum].img.width / kolwallkadr * enemy.curkadr,
        0,
        enemies[enemy.enemynum].img.width / kolwallkadr,
        enemies[enemy.enemynum].img.height,
        enemy.x - enemy.w / 2, 
        enemy.y - enemy.h / 2, 
        enemy.w * 2, 
        enemy.h * 2)
}

function drawpikes(object)
{
    let lx = object.x
    let kol = 0
    let kadr
    while(kol < object.kolplpart)
    {
        kadr = 0
        if(kol % 2 == 0)
            kadr = 1
        if(kol % 3 == 0)
            kadr = 2
        context.drawImage(pikesimg,
            pikesimg.width / kolpikekadr * kadr,
            0,
            pikesimg.width / kolpikekadr,
            pikesimg.height,
            lx, 
            canvas.height - pobject.h, 
            pobject.w, 
            pobject.h)
        lx += object.h
        kol++
    }
}

function drawplatform(object, img, imgend)
{
    let lx = object.x
    let kol = 0
    while(kol < object.kolplpart)
    {
        let ang = 0
        if(kol != 0 && kol != object.kolplpart - 1)
        {
            if(kol % 2 == 0)
                ang = 90
            if(kol % 5 == 0)
                ang = 180
            drawRotatedImage(img, lx + object.h / 2, object.y + object.h/2, ang, object.h, object.h)
        }
        else
        {
            if(kol == 0)
                ang = 180
            drawRotatedImage(imgend, lx + object.h / 2, object.y + object.h/2, ang, object.h, object.h)
        }
        lx += object.h
        kol++
    }
}

function drawhero(map, curkadr, kolkadr)
{
    context.drawImage(map, 
    curkadr * map.width / kolkadr, 
    0, 
    map.width / kolkadr, 
    map.height, 
    hero.hcol.x - (hero.himg.w - hero.hcol.w) / 2, 
    hero.hcol.y - (hero.himg.h - hero.hcol.h), 
    hero.himg.w, 
    hero.himg.h)
}

function drawscore()
{
    let text = String(score)
    while(text.length < 4)
        text = "0" + text
    text = "Score: " + text
    let textx = canvas.width - text.length*(canvas.height / cnvh)*16
    let texty = canvas.height / 20
    context.fillText(text, textx, texty);
}

var TO_RADIANS = Math.PI/180; 
function drawRotatedImage(image, x, y, angle, w, h)
{ 
    context.save(); 
    context.translate(x, y);
    context.rotate(angle * TO_RADIANS);
    context.drawImage(image, -(w/2), -(h/2), w, h);
    context.restore(); 
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
    resizeCanvas(false)
    if(!start)
    {
        render()
        context.drawImage(menuimg, 0, 0, canvas.width, canvas.height)
        context.drawImage(startimg, 
            canvas.width*0.4, 
            0 + (canvas.height - startimg.height*canvas.width*0.2/startimg.width)/2, 
            canvas.width*0.2, 
            startimg.height*canvas.width*0.2/startimg.width)
    }
    else if(gameover)
    {
        render()
        context.drawImage(menuimg, 0, 0, canvas.width, canvas.height)
        context.drawImage(replayimg, 
            canvas.width*0.35, 
            0 + (canvas.height - replayimg.height*canvas.width*0.3/replayimg.width)/2, 
            canvas.width*0.3, 
            replayimg.height*canvas.width*0.3/replayimg.width)
    }
}

function resizeCanvas(startrisize)
{
    //console.log(window.devicePixelRatio)
    canvas.width = window.innerWidth*0.6*window.devicePixelRatio
    canvas.height = canvas.width*cnvh/cnvw
    let k = canvas.height / cnvh

    groundh = Math.round(k * cnvh / 30)

    hero.hcol.h = Math.round(k * cnvh / 8)
    hero.hcol.w = Math.round(hero.hcol.h / 2)
    hero.himg.h = Math.round(hero.hcol.h / 0.8)
    hero.himg.w = hero.himg.h
    firstherox = hero.himg.w - hero.hcol.w
    if(startrisize)
    {
        hero.hcol.y = canvas.height - hero.hcol.h - groundh
        hero.hcol.x = firstherox
    }
    else
    {
        hero.hcol.y = hero.hcol.y / predk * k
        hero.hcol.x = hero.hcol.x / predk * k
    }
    wobject.wcol.h = Math.round(k*0.05*cnvh)
    wobject.wcol.w = wobject.wcol.h

    plobject.plcol.w = Math.round(k*cnvw/4)
    plobject.plcol.h = Math.round(k*cnvh/25)
    plobject.plmargin.top = canvas.height / 8
    plobject.plmargin.bottom = canvas.height / 8
    minspawny = wobject.wcol.h*3
    maxspawny = canvas.height - hero.hcol.h - groundh - Math.round(canvas.height / 60.0)

    pobject.w = groundh
    pobject.h = pikesimg.height * pobject.w / (pikesimg.width / kolpikekadr)

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

    lavawidth = canvas.width / 5
    for(i in lavas)
    {
        lavas[i].w = lavas[i].w / predk * k
        lavas[i].h = lavas[i].h / predk * k
        lavas[i].x = lavas[i].x / predk * k
        lavas[i].y = canvas.height - groundh
    }

    ug = Cug * k
    dg = Cdg * k
    da = Cda * k
    ax = Cax * k
    pldx = Cpldx * k 
    kickdx = Ckickdx * k
    jumph = canvas.height / 3 
    jerkl = canvas.width / 5

    fondx = k * Cfondx
    fonh = canvas.height
    fonw = Math.round(fonimg.width * fonh / fonimg.height)
    for(i in fons)
    {
        if(i == 0)
            fons[i].x = fons[i].x / predk * k
        else
            fons[i].x = fons[i-1].x + fonw
    }

    fobject.w = groundh
    fobject.h = flpartimg.height * fobject.w / (flpartimg.width / kolfloorkadr)
    for(i in floors)
    {
        if(i == 0)
            floors[i].x = floors[i].x / predk * k
        else
            floors[i].x = floors[i-1].x + groundh
    }
    nimbicon.w = canvas.width / 5
    nimbicon.h = nimb1img.height * nimbicon.w / nimb1img.width
    nimbicon.x = canvas.width - nimbicon.w / 3 * 2.2 
    nimbicon.y = 0
    nimbicon.dy = nimbicon.h / 4
    predk = k

    context.fillStyle = "#B4B4B4"
    context.font = String(canvas.height / 20) + "px cursive"
}

function gameOver()
{
    context.drawImage(menuimg, 0, 0, canvas.width, canvas.height)
    context.drawImage(replayimg, 
        canvas.width*0.35, 
        0 + (canvas.height - replayimg.height*canvas.width*0.3/replayimg.width)/2, 
        canvas.width*0.3, 
        replayimg.height*canvas.width*0.3/replayimg.width)
}