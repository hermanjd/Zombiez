//----------------------------------
//▀▀█ █▀▀█ █▀▄▀█ █▀▀▄ ░▀░ █▀▀ █▀▀ |
//▄▀░ █░░█ █░▀░█ █▀▀▄ ▀█▀ █▀▀ ▀▀█ |
//▀▀▀ ▀▀▀▀ ▀░░░▀ ▀▀▀░ ▀▀▀ ▀▀▀ ▀▀▀ |
//----------------------------------
//
//For å gjøre koden enklere å lese så vil jeg påpeke at måten spillet er designet på er at alle elementer på skjermen blir
//flyttet relativt til spilleren. Det betyr at spilleren aldri flytter seg fra midten av skjermen, men heller at alle andre
//elementer flytter på seg.
//
//Jeg annbefaler å spille dette spillet med en mus og ikke en touchpad.
//
//Nå, hvordan koden er bygd opp:


//koden starter med å kjøre funksjonen mainmenu
window.onload = mainmenu;

//Deretter blir alle globale variabler nødvendig for at koden skal fungere deklarert
var bredde = 2000; //Spillerens x verdi
var hoyde = 2000; //Spillerens y verdi
var mouse = {x:0, y:0}; //Hvor musen befinner seg på skjermen
var enemies = []; //Array som innerholder informasjon om fiendene
var bullets = []; //Array som innerholder informasjon om kulene
var score = 0; //Variabel som teller antal poeng spilleren har fått
var frames = 0; //Variabel som teller hvor mange ganger skjermen har oppdatert seg
var keys = []; //Array for tastaturknapper
var updateInterval; //Variabel for intervallen av skjermoppdatering
var enemiesInterval; //Variabel for intervallen av når å lage nye fiender
var ctx = document.getElementById("gameWindow").getContext("2d"); //variabelen for selve spillevinduet

//Funksjonen som gjør at startknappen kjører spillet
function mainmenu(){
	document.getElementById("gamestarter").onclick  = gameStart;
}

//Denne funksjonen setter i gang spillet og fjærner menyen
function gameStart(){
	document.getElementById("mainMenu").style.display = "none"; //Fjerner meny elementet
	document.getElementById("startMenu").style.display = "none"; //Fjerner meny elementet
	
	document.getElementById("gameWindow").onmousemove  = getMouseCords; //Oppdaterer museposisjonen når musen beveger seg
	document.getElementById("gameWindow").onclick  = addBullet; //Legger til en kule ved museklikk
	document.body.onkeydown = function(e){keys[e.keyCode] = true;}; //Setter statusen til tastetrykket til true
	document.body.onkeyup = function(e){keys[e.keyCode] = false;}; //Setter det tilbake til false etter knappen er sluppet
	
	updateInterval = setInterval(update, 17); //Setter et intervall på hvor ofte spillet skal oppdatere seg (60 fps)
	enemiesInterval = setInterval(addEnemies, 2000); //Setter et intervall på hvor ofte nye fiender skal komme
}

//Dette er kjernen som kjører alle funksjonene i spillet og det er denne funksjonen som oppdaterer seg 60 ganger i sekundet
function update(){
	windowResize();
	canvasClear();
	drawLevel();
	playerMove();
	drawBullets();
	playerDraw(mouse.x,mouse.y);
	drawEnemies();
	drawStatistics();
}

//Denne funksjonen vil tilpasse spillevinduet skulle størelsen på vinduet endre seg
function windowResize() {
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
}

//Denne funksjonen tegner en stor firkant i størelse av spillevinduet for å slette gammel grafikk som er på skjermen
function canvasClear(){
	ctx.beginPath();
	ctx.fillStyle = "#ecf0f1";
	ctx.rect(0,0,ctx.canvas.width,ctx.canvas.height);
	ctx.fill();
}

//Denne funksjonen tegner alle linjene som er på banen samt de grå boksene som er slutten av banen.
function drawLevel(){
	ctx.beginPath();
	for(var i = 0; i < 6000; i+=100){
		ctx.moveTo((i - bredde),0);
		ctx.lineTo((i - bredde),5000);
	}
	for(var i = 0; i < 5000; i+=100){
		ctx.moveTo(0, (i - hoyde));
		ctx.lineTo(5000,(i - hoyde));
	}
	ctx.lineWidth=1;
	ctx.strokeStyle="#95a5a6";
	ctx.stroke();
	ctx.fillStyle = "#bdc3c7";
	ctx.rect(0,0,((ctx.canvas.width / 2)-bredde),5000);
	ctx.rect(4000,0,((ctx.canvas.width / 2)-bredde),5000);
	ctx.rect(0,0,4000,((ctx.canvas.height / 2)-hoyde));
	ctx.rect(0,4000,4000,((ctx.canvas.height / 2)-hoyde));
	ctx.fill();
}

//Denne funkjsonen sjekker hilke av WASD som er klikket inn og vil endre spillerens x og y verdi i henhold til knappen som er klikket inn
//Den sjekker også om spilleren prøver å komme seg ut av spillerbanen og vil forhindre det om det skje.
function playerMove(){
	if(keys[68]){
		bredde += 5;
	}
	if(keys[65]){
		bredde -= 5;
	}
	if(keys[83]){
		hoyde += 5;
	}
	if(keys[87]){
		hoyde -= 5;
	}
	
	if(bredde < 0){
		bredde = 0;
	}
	if(bredde > 4000){
		bredde = 4000;
	}
	if(hoyde > 4000){
		hoyde = 4000;
	}
	if(hoyde < 0){
		hoyde = 0;
	}	
}

//Denne funksjonen tegner spilleren i midten av skjermen og vil rotere spilleren i henhold til hvor musen befinner seg så skjermen
function playerDraw(x,y){
	ctx.setTransform(1, 0, 0, 1, (ctx.canvas.width / 2), (ctx.canvas.height / 2));
	ctx.rotate((Math.atan2(y - (ctx.canvas.height / 2), x - (ctx.canvas.width / 2)) - Math.PI / 2) + 1.57); //Av en eller annen grunn måtte jeg kalibrere rotasjonen ved å plusse på 1.57, rart
	ctx.beginPath();
	ctx.fillStyle = "#3498db";
	ctx.lineWidth=5;
	ctx.strokeStyle="#2f83b2";
	ctx.rect(40,-15,30,30);
	ctx.arc(0,0,40,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
}

//Oppdaterer den gobale musposisjon variabelen når brukeren beveger musen
function getMouseCords(evt){
    mouse.x = evt.clientX;
    mouse.y = evt.clientY;
}

//Denne funksjonen legger til en kule når venstreklikk blir klikket. Kulen tar vare på vinkelen den er skutt
function addBullet(){
	var b = {
		x:(ctx.canvas.width / 2),
		y:(ctx.canvas.height / 2),
		angle:((Math.atan2(mouse.y - (ctx.canvas.height / 2), mouse.x - (ctx.canvas.width / 2)) - Math.PI / 2) + 1.57)
		}
	bullets.push(b);
}

//Denne funksjonen er til for å tegne kulene samt sjekke om kulen koliderer med en fiende
function drawBullets(){
	for(var i = 0; i < bullets.length; i++){
		//Som sagt så beveger alle elementene seg relativt til spilleren så det er nødvendig å plusse/minuse med farten til spilleren
		if(keys[68]){
			bullets[i]["x"] -= 5;
		}
		if(keys[65]){
			bullets[i]["x"] += 5;
		}
		if(keys[83]){
			bullets[i]["y"] -= 5;
		}
		if(keys[87]){
			bullets[i]["y"] += 5;
		}
		
		ctx.beginPath();
		ctx.fillStyle = "#3498db";
		ctx.lineWidth=5;
		ctx.strokeStyle="#2f83b2";
		ctx.arc(bullets[i]["x"],bullets[i]["y"],10,0,Math.PI*2);
		ctx.fill();
		ctx.stroke();
		
		//Denne testen sjekker om kulen er uttenfor banen og vil slette dem
		if(bullets[i]["x"] > 4000 || bullets[i]["x"] < 0 || bullets[i]["y"] > 4000 || bullets[i]["y"] < 0){
			bullets.splice(i, 1);
		}
		
		//Følene linjer tar i bruk vinkelen til kulen og vil øke x og y verdi i henhold for å gi den moment
		bullets[i]["x"] += (Math.cos(bullets[i]["angle"]))*10;
		bullets[i]["y"] += (Math.sin(bullets[i]["angle"]))*10;
		
		//Denne løkken sjekker om kulen treffer noen av fiendene, er det sant vil den fjerne fienden, kulen, og gi spilleren ett poeng
		for(var z = 0; z < enemies.length; z++){
			if(enemies[z]["x"] > (bullets[i]["x"] - 70) && enemies[z]["x"] < (bullets[i]["x"] + 70)){
				if(enemies[z]["y"] > (bullets[i]["y"] - 70) && enemies[z]["y"] < (bullets[i]["y"] + 70)){
					enemies.splice(z, 1);
					bullets.splice(i, 1);
					score++;
				}
			}
		}
	}
}

//Denne funksjonen er til for å tegne fiendene samnt bestemme hvordan fiendene skal oppføre seg.
function drawEnemies(){
	for(var i = 0; i < enemies.length; i++){	
		//disse if setningene bestemmer hvor fienden skal bevege seg, den vil konstant bevege seg mot spilleren i midten av skjermen
		if(enemies[i]["x"] < (ctx.canvas.width / 2)){
			enemies[i]["x"] += 4;
		}else{
			enemies[i]["x"] -= 4;
		}
		if(enemies[i]["y"] < (ctx.canvas.height / 2)){
			enemies[i]["y"] += 4;
		}else{
			enemies[i]["y"] -= 4;
		}
		
		//Igjenn, alt må bevege seg relativt.
		if(keys[68]){
			enemies[i]["x"] -= 5;
		}
		if(keys[65]){
			enemies[i]["x"] += 5;
		}
		if(keys[83]){
			enemies[i]["y"] -= 5;
		}
		if(keys[87]){
			enemies[i]["y"] += 5;
		}
		
		//Denne if setningen ser om fienden koliderer med spilleren og vil stanse spillet skulle dette være sant
		if(enemies[i]["x"] > ((ctx.canvas.width / 2) - 70) && enemies[i]["x"] < ((ctx.canvas.width / 2) + 70)){
			if(enemies[i]["y"] > ((ctx.canvas.height / 2) - 70) && enemies[i]["y"] < ((ctx.canvas.height / 2) + 70)){
				endGame();
			}
		}
		ctx.beginPath();
		ctx.fillStyle = "#e74c3c";
		ctx.lineWidth=5;
		ctx.strokeStyle="#c0392b";
		ctx.arc(enemies[i]["x"],enemies[i]["y"],40,0,Math.PI*2);
		ctx.fill();
		ctx.stroke();
	}
}

//Denne funksjonen la jeg til for å vise litt artig statestikk, håper den hjelper deg skjønne hvordan koden fungerer
function drawStatistics(){
	frames++;
	ctx.fillStyle = "black";
	ctx.font = "20px Arial";
	ctx.fillText("X:" + bredde + " Y:" + hoyde,10,50);
	ctx.fillText("Frames Rendered:" + frames,10,100);
	ctx.fillText(((Math.atan2(mouse.y - (ctx.canvas.height / 2), mouse.x - (ctx.canvas.width / 2)) - Math.PI / 2) + 1.57),10,150);
	ctx.fillText("Canvas width: " + ctx.canvas.width + "px",10,200);
	ctx.fillText("Canvas height: " + ctx.canvas.height + "px",10,250);
	ctx.fillText("Score: " + score,10,300);
}

//Denne funksjonen er den som legger til fiender hvert andre sekund. Fire fiender blir lagt til i hvert sitt hjørne
function addEnemies(){
	var e = {x:(0-bredde),y:(0-hoyde)}
	enemies.push(e);
	e = {x:(4000-bredde),y:(0-hoyde)}
	enemies.push(e);
	e = {x:(0-bredde),y:(4000-hoyde)}
	enemies.push(e);
	e = {x:(4000-bredde),y:(4000-hoyde)}
	enemies.push(e);
}

//Dette er funksjonen som vil avslutte spillet. Den slutter intervallene og vil vise sluttmenyen
function endGame(){
	clearInterval(updateInterval);
	clearInterval(addEnemies);
	document.getElementById("gameWindow").style.display = "none";
	document.getElementById("mainMenu").style.display = "flex";
	document.getElementById("displayScore").innerHTML = "Din poengsum ble: " + score + " poeng";
	document.getElementById("endMenu").style.display = "inline-block";
}
