const score = document.querySelector('.score');//Select the class score
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');

startScreen.addEventListener('click', start);//Click to start the game//start function defined later

let player = {speed: 5, score: 0};

//console.log(gameArea);

let keys = {ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false}

document.addEventListener('keydown', keyDown);//When someone presses keydown, keydown function will be called
document.addEventListener('keyup', keyUp);
//document.addEventListener('')

function keyDown(e) {
    e.preventDefault();//It prevents the event to happen
    keys[e.key] = true;//assign true to the key we pressed
    //console.log(e.key);//e.key returns the key that was pressed by the user
    //console.log(keys);
    //keys[e.key] = false;//We can also write it here
}

function keyUp(e) {
    e.preventDefault();
    keys[e.key] = false;//Does that keys false again so that at a time one key is true
    //console.log(e.key)
    
}

function isCollide(a,b) {//a represents position of car and b represent enemy cars
    aRect = a.getBoundingClientRect();//Get details of a
    bRect = b.getBoundingClientRect();//Get details of b

    return !((aRect.top>bRect.bottom) || (aRect.bottom<bRect.top) || (aRect.right<bRect.left) || (aRect.left>bRect.right))//Defines condition that if this happens
}

function moveLines() {
    let lines = document.querySelectorAll('.lines');

    //Regenerating the line again
    lines.forEach(function(item){

        if(item.y >=700){
            item.y -=750;//If height increases above 700px then decrease height by 750px. This will regenerate the lines
        }

        item.y += player.speed;//Assigning spped of lines
        item.style.top = item.y + "px";
        })
}

function endGame() {
    player.start = false;
    startScreen.classList.remove('hide');
    startScreen.innerHTML = "Game Over <br> Your Final Score is " + player.score + "<br> Press here to restart the game"
}

function moveEnemy(car) {
    let enemy = document.querySelectorAll('.enemy');

    //Regenerating the enemy again
    enemy.forEach(function(item){

        if (isCollide(car,item)) {//car parameter is present in parent function i.e., moveEnemy(car) so it can access it and item is also present in the function
            console.log("Boom it");
            endGame();
        }

        if(item.y >=700){
            item.y = -300;//If height increases above 700px then decrease height by 300px. This will regenerate the enemy
            item.style.left = Math.floor(Math.random()*350) + "px";//Generating car in random
        }

        item.y += player.speed;//Assigning spped of enemy
        item.style.top = item.y + "px";
        })
}

function gamePlay() {
    //console.log("Hey! I am clicked.");
    
    let car = document.querySelector('.car');//Class car is selected
    let road = gameArea.getBoundingClientRect();//Get details of road
    //console.log(road);

    if (player.start) {//If player starts

        moveLines();//Runes this function
        moveEnemy(car);

        //Ensuring that the car do not go outside the road
        if (keys.ArrowUp && player.y > (road.top + 70)) {player.y -= player.speed}//Goes up by reducing the value of top//Cant go in top above 70px
        if (keys.ArrowDown && player.y < (road.bottom - 70)) {player.y += player.speed}//Cant go in bottom below 70px
        if (keys.ArrowLeft && player.x > 0) {player.x -= player.speed}//Goes to left by decreasing the value of left//Cant go in left outside road
        if (keys.ArrowRight && player.x < (road.width - 50)) {player.x += player.speed}//Cant go in right outside road

        car.style.top = player.y + "px";
        car.style.left = player.x + "px";//concaninate with pixel

        window.requestAnimationFrame(gamePlay);//Now it will be called again and again
        console.log(player.score++);

        //player.score++;
        let ps = player.score - 1;
        score.innerText = "Score: " + ps;
    }
}

function start() {

    //gameArea.classList.remove('hide');//Removed class hide from gameArea
    startScreen.classList.add('hide')//Added class hide to startScreen
    gameArea.innerHTML = "";

    player.start = true;
    player.score = true;

    window.requestAnimationFrame(gamePlay);//Here we write to this line we have to write it again in the gameplay func to get the animation

    //Road lines creation
    for(x=0; x<5; x++){
        let roadLine = document.createElement('div');
        roadLine.setAttribute('class','lines');//Created class lines
        roadLine.y = (x*150);
        roadLine.style.top = roadLine.y + "px";
        gameArea.appendChild(roadLine);
    }

    //Car creation
    let car = document.createElement('div')//Will create a div
    car.setAttribute('class','car');//Added class car to it
    //car.innerText = "Hey! I am car.";//Write this text to it
    gameArea.appendChild(car);//Will add element car in the gameArea

    player.x = car.offsetLeft;//Sets position of player from left
    player.y = car.offsetTop;//Sets position of player from top

    //console.log("Top Position: " + car.offsetTop);//Shows position from top
    //console.log("Left Position: " + car.offsetLeft);//Shows position from left

    //Car repetation
    for(x=0; x<3; x++){
        let enemyCar = document.createElement('div');
        enemyCar.setAttribute('class','enemy');//Created class enemy
        enemyCar.y = ((x+1)*350)*-1;//Creating distance between cars
        enemyCar.style.top = enemyCar.y + "px";
        enemyCar.style.backgroundColor = randomColor();//Given blue color to enemy car
        enemyCar.style.left = Math.floor(Math.random()*350) + "px";//Generates random number. Multiplied by 350 as it generates numbers in 0.decimal
        gameArea.appendChild(enemyCar);
    }
}

function randomColor() {
    function c() {
        let hex = Math.floor(Math.random()*256).toString(16);
        return ("0" + String(hex)).substr(-2);//Gives last two words
    }
    return "#" + c() + c() + c();
}