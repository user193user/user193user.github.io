let canvas = document.getElementById("game")
let context = canvas.getContext("2d")
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
const ug = 0.4
const dg = 0.1
const pldx = -4 
const jumph = canvas.clientHeight / 3

//global per
let timer = 1
let hero = {x: firstherox, y: 0, w: 0, h: 0, dx: 0, dy: 0}
let platforms = []
let walls = []

let jumpy = 0
let isjumping = false
let jumpscnt = 0

let gameover = false
//func
canvas.addEventListener("mousedown", function(event) {
    if(hero.dy == 0 || jumpscnt == 1)
    {
        jumpscnt++
        /*if(2*event.offsetY > 2*hero.y + hero.h && event.offsetY < hero.y + hero.h)
        {
            jumph = 0
            jumpy = 0
            isjumping = false
        }
        else
        {
            jumph = hero.y + hero.h - event.offsetY
            if(jumph > 0)
                jumph += 50
            //if(hero.y - jumph < 0)
            //    jumph = hero.y - 10
            jumpy = event.offsetY
            isjumping = true
        }
        if(jumph < 0)
            hero.dy = 0
        else
            hero.dy = Math.round(Math.sqrt(2*ug*jumph))*/
        hero.dy = Math.round(Math.sqrt(2*ug*jumph))
        isjumping = true
    }

})

platformimg.onload = function () 
{
    hero.y = canvas.clientHeight - heroimg.height - groundh
    hero.w = heroimg.width
    hero.h = heroimg.height
    game()
}

function game()
{
    timer++
    if(!gameover)
        update()
    if(!gameover)
        render()
    requestAnimFrame(game)
}

function update()
{
    for(let i in walls)
    {
        if(iscollision(walls[i]))
        {
            gameover = true
            alert("Game over!")
            return
        }
        walls[i].x += walls[i].dx
    }
    if(timer % 200 == 0)
    {
        platforms.push({x: canvas.clientWidth, y: Math.floor(Math.random()*(canvas.height - 2*hero.h) + hero.h + 30), w: platformimg.width*2, h: platformimg.height, dx: pldx})
        timer = 0
    }
    if(timer % 150 == 0)
    {
        walls.push({x: canvas.clientWidth, y: Math.floor(Math.random()*(canvas.height - 2*hero.h) + hero.h + 30), w: 25, h: 100, dx: pldx})
    }
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
            //platforms[0].y > jumpy && -hero.y - hero.h > -platforms[0].y && hero.y + hero.h - hero.dy > platforms[0].dy
            for(i in platforms)
                if(isstandon(platforms[i]) && (jumph >= 0 || platforms[i].y >= jumpy))
                {
                    hero.dy = 0
                    hero.y = platforms[i].y - hero.h
                    isjumping = false
                    jumpscnt = 0
                    return
                }
            if(hero.y - hero.dy < canvas.clientHeight - heroimg.height - groundh)
            {
                hero.y -= hero.dy
                hero.dy -= dg
            }
            else
            {
                hero.y = canvas.clientHeight - heroimg.height - groundh
                hero.dy = 0
                jumpscnt = 0
                isjumping = false
            }
        }
    }
    let interf = false
    for(let i in platforms)
    {
        platforms[i].x += platforms[i].dx
        if(isstandon(platforms[i]))
            interf = true
    }
    let ind = 0
    while(ind < platforms.length)
    {
        if(platforms[ind].x + platforms[ind].w < 0)
            platforms.splice(ind, 1)
        else
            ind++
    }
    if(!interf && hero.y < canvas.clientHeight - heroimg.height - groundh && !isjumping)
    {
        isjumping = true
        hero.dy = 0
    }
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
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    for(i in platforms)
        context.drawImage(platformimg, platforms[i].x, platforms[i].y, platforms[i].w, platforms[i].h)
    for(i in walls)
        context.drawImage(wallimg, walls[i].x, walls[i].y, walls[i].w, walls[i].h)
    context.drawImage(heroimg, hero.x, hero.y)
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
                window.setTimeout(callback, 1000/20)
            }
    }
)()