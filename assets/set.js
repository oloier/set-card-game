var playermax = 10; // maximum player count
var cardspeed = 0; //

var nextcard=0;
var cards=new Array();
var colors=new Array('r','g','p');
var shades=new Array('s','l','o');
var shapes=new Array('o','d','s');
var cardqueue=new Array();
var placedcards=new Array();
placedcards["r4c1"]="";
placedcards["r4c2"]="";
placedcards["r4c3"]="";
var allcards=new Array();
for (i=0; i<3; i++) {
	for (j=0; j<3; j++) {
		for (k=0; k<3; k++) {
			for (ii=0; ii<3; ii++) {
				pos=Number(i*27)+Number(j*9)+Number(k*3)+ii;
				allcards[pos]=ii+colors[i]+shades[j]+shapes[k];
			}
		}
	}	
}

function shuffle() {
	var cardindex=allcards;
	var randnum=0;
	var top=0;
	for (i=0; i<81; i++) {
		randnum=Math.floor(Math.random()*cardindex.length);
		cards[i]=cardindex[randnum];
		top=cardindex.length-1;
		for (j=randnum; j<top; j++) cardindex[j]=cardindex[j+1];
		cardindex.pop();
	}
}

function startgame(timer) {
	document.getElementById('averagetime').innerText=" ";
	document.getElementById('fasttime').innerText=" ";
	document.getElementById('slowtime').innerText=" ";
	shuffle();
	for (i=1; i<4; i++) {
	for (j=1; j<5; j++) {
		pos=(i-1)*4 + (j-1);
		cardqueue[pos]=new Array();
		cardqueue[pos]['card']=cards[pos];
		var cell='r'+i+'c'+j;
		cardqueue[pos]['cell']=cell;
		}
	}
 //for (i=0; i<81; i++) document.write('card '+i+': '+cards[i]+'<br>'); force_nomatch(12);
 //force 4th row
	placecards(cardspeed);
	if (timer = '1') {
		setTimeout('starttimer()', cardspeed);
	}
	nextcard=12;
}

var endtime=0;
var totaltime=0;
var averagetime=0;
var fasttime=0;
var slowtime=0;
var timer_on=0;
var passed=0;
var times=new Array();

function starttimer() {
	timer_on=1;
	setTimeout('timer()', 1000);
}

function stoptimer() {
	timer_on=0;
	endtime=new Date();
	document.getElementById('totaltime').innerText=Math.round(totaltime/100)/10;
	var cardsleft=0;
	for (i=0; i<15; i++) {
	cell='r'+Number(Math.floor(i/4)+1)+'c'+Number((i%4)+1);
	if (placedcards[cell]!="")
		cardsleft++;
	}
	var sets=27-(cardsleft/3);
	averagetime=totaltime/sets;
	document.getElementById('averagetime').innerText=Math.round(averagetime/100)/10;
	var data='';
	for (i=0; i<(times.length-1); i++)
	data+=(Math.round(times[i]/100)/10)+':';
	data+=Math.round(times[i]/100)/10;
}

function toggletimer() {
	if (timer_on) {
		timer_on=0;
		document.getElementById('pause').innerText='Resume';
		document.getElementsByTagName('body')[0].className = 'pause';
	}
	else {
		timer_on=1;
		setTimeout('timer()', 100);
		document.getElementById('pause').innerText='Pause';
		document.getElementsByTagName('body')[0].className = '';
	}
}

function timer() {
	if (!timer_on) return;
	var now=new Date();
	passed+=100;
	totaltime+=100;
	document.getElementById('totaltime').innerText=totaltime/1000;
	if (passed>slowtime) document.getElementById('slowtime').innerText=passed/1000;
	setTimeout('timer()', 100);
}

function time_event() {
	var now=new Date();
	if (passed>slowtime) {
		slowtime=passed;
		document.getElementById('slowtime').innerText=Math.round(passed/100)/10;
	}
	if (passed<fasttime || fasttime==0) {
		fasttime=passed;
		document.getElementById('fasttime').innerText=Math.round(passed/100)/10;
	}
	times[times.length]=passed;
	passed=0;
}

var selectpos=0;
var selectarr=new Array();
function toggleselect(divname) {
	dobj=document.getElementById(divname);
	if (selectarr[0]==divname || selectarr[1]==divname || selectarr[2]==divname) {
		var top=selectarr.length;
		for (i=0; i<top; i++) {
			if (selectarr[i+1]==divname) continue;
			selectarr[i]=selectarr[i+1];
		}
		selectarr.pop();
		selectpos--;
		dobj.className="inactive";
	}
	else {
		dobj.className="active";
		selectarr[selectpos]=divname;
		selectpos++;
		if (selectpos==3)	checkmatch();
	}
}

function checkmatch() {
	for (i=0; i<4; i++) {
		if (oddmanout(placedcards[selectarr[0]].charAt(i), placedcards[selectarr[1]].charAt(i), placedcards[selectarr[2]].charAt(i))) {
			//alert('Not a match: '+placedcards[selectarr[0]].charAt(i)+', '+placedcards[selectarr[1]].charAt(i)+', '+placedcards[selectarr[2]].charAt(i)+'\r\n'+
			//placedcards[selectarr[0]]+'\r\n'+placedcards[selectarr[1]]+'\r\n'+placedcards[selectarr[2]]);
			cleanup();
			return;
		}
	}
	time_event(); 	// match found correctly, remove cards and add new ones
	document.getElementById('find').innerHTML="Calculating";
	for (i=0; i<3; i++) {
		placedcards[selectarr[i]]="";
		dobj=document.getElementById(selectarr[i]);
		dobj.className="inactive";
		dobj.innerHTML='';
	}
	if (placedcards['r4c1']!="" || placedcards['r4c2']!="" || placedcards['r4c3']!="") { // had 15 cards, only rearrange
		for (i=1; i<4; i++) {
			cname='r4c'+i;
			if (placedcards[cname]!="") {
				for (ii=0; ii<3; ii++) {
					if (selectarr[ii].charAt(1)!="4" && placedcards[selectarr[ii]]=="") {
						placedcards[selectarr[ii]]=placedcards[cname];
						placedcards[cname]="";
						document.getElementById(cname).innerHTML="";
						var thiscard=placedcards[selectarr[ii]];
						var num=thiscard.charAt(0);
						var cardurl=thiscard.substring(1);
						var injstr='';
						while (num>=0) {
							injstr+='<img src="assets/img/'+cardurl+'.svg" alt="" />';
							num--;
						}
						document.getElementById(selectarr[ii]).innerHTML=injstr;
						break;
					}
				}
			}
		}
		selectarr.pop();
		selectarr.pop();
		selectarr.pop();
		selectpos=0;
		findmatch(2);
		return;
	}
	if (nextcard==81) {
		selectarr.pop();
		selectarr.pop();
		selectarr.pop();
		selectpos=0;
		findmatch(2);
		return;
	}
	// add cards to queue
	var pos=cardqueue.length;
	var j=0;
	for (i=pos; i<pos+3; i++) {
		cardqueue[i]=new Array();
		cardqueue[i]['card']=cards[nextcard];
		cardqueue[i]['cell']=selectarr[j];
		j++;
		nextcard++;
	}
	var remain=81-nextcard;
	document.getElementById('count').innerText=remain;
	selectarr.pop();
	selectarr.pop();
	selectarr.pop();
	selectpos=0;
	placecards(cardspeed);
}

function oddmanout(v1, v2, v3) {
	if (v1==v2 && v1==v3 && v2==v3) return 0;
	if (v1!=v2 && v1!=v3 && v2!=v3) return 0;
	return 1;
}

function cleanup() {
	for (i=0; i<3; i++) {
		dobj=document.getElementById(selectarr[i]);
		dobj.className="inactive";
	}
	selectarr.pop();
	selectarr.pop();
	selectarr.pop();
	selectpos=0;
}

function placecards(delay) {
	var thiscard=cardqueue[0]['card'];
	placedcards[cardqueue[0]['cell']]=cardqueue[0]['card'];
	var num=thiscard.charAt(0);
	var cardurl=thiscard.substring(1);
	var cell=cardqueue[0]['cell'];
	var injstr='';
	while (num>=0) {
		injstr+='<img src="assets/img/'+cardurl+'.svg" alt="" />';
		num--;
	}
	document.getElementById(cell).innerHTML=injstr;
	var top=cardqueue.length;
	for (i=0; i<top-1; i++) cardqueue[i]=cardqueue[i+1];
	cardqueue.pop();
	if (cardqueue.length>0) setTimeout('placecards('+delay+')', delay);
	else findmatch(2);
	
	toggleCount();
}

function addExtraRow(display) {
	document.getElementById('r4c1').style.display = display;
	document.getElementById('r4c2').style.display = display;
	document.getElementById('r4c3').style.display = display;
}

function findmatch(mode) {
	if (placedcards["r4c1"]=="") {
		itop=10;
		jtop=11;
		ktop=12;
		addExtraRow('none');
	}
	else {
		itop=13;
		jtop=14;
		ktop=15;
		addExtraRow('inline-block');
	}
	var found=0;
	for (i=0; i<itop && found==0; i++) {
		var a=Math.floor(i/4)+1;
		var b=(i%4)+1;
		var c1='r'+a+'c'+b;
		if (placedcards[c1]=="") continue;
		for (j=i+1; j<jtop && found==0; j++) {
			var a=Math.floor(j/4)+1;
			var b=(j%4)+1;
			var c2='r'+a+'c'+b;
			if (placedcards[c2]=="") continue;
			for (k=j+1; k<ktop && found==0; k++) {
				var a=Math.floor(k/4)+1;
				var b=(k%4)+1;
				var c3='r'+a+'c'+b;
				if (placedcards[c3]=="") continue;
				for (ii=0; ii<4 && found==0; ii++) {
					if (oddmanout(placedcards[c1].charAt(ii), placedcards[c2].charAt(ii), placedcards[c3].charAt(ii))) break;
					if (ii==3) found=1;
				}
			}
		}
	}
	if (found==1 && mode==2) {
		document.getElementById('find').innerHTML="Find set";
		return;
	}
	if (found==1) {
		if (mode==1) {
			for (ii=0; ii<3; ii++) {
				if (ii==0) cname=c1; if (ii==1) cname=c2; if (ii==2) cname=c3;
				dobj=document.getElementById(cname);
				dobj.className="find";
			}
		}
	}
	else {
		if (mode==2 && (placedcards["r4c1"]!="" || nextcard>=81)) {
			document.getElementById('find').innerHTML="No sets found";
			endgame();
			return;
		}
		if (placedcards["r4c1"]!="") {
			stoptimer();
			alert('There are no matches. In addition, there isn\'t enough room in the browser for more cards. Game over.');
			return;
		}
		if (nextcard>=81) {
			stoptimer();
			alert('There are no more matches.');
			return;
		}	else {
			var pos=cardqueue.length;
			var j=1;
			for (i=pos; i<pos+3; i++) {
				cname='r4c'+j;
				cardqueue[i]=new Array();
				cardqueue[i]['card']=cards[nextcard];
				cardqueue[i]['cell']=cname;
				addExtraRow('inline-block');
				//alert('adding exta card: cardqueue['+i+'][\'card\']="'+cards[nextcard]+'\r\n cardqueue['+i+'][\'cell\']="'+cname);
				j++;
				nextcard++;
			}
			var remain=81-nextcard;
			document.getElementById('count').innerText=remain;
			selectarr.pop();
			selectarr.pop();
			selectarr.pop();
			selectpos=0;
			placecards(cardspeed);
		}
	}
}

function force_nomatch(mod) {
	if (mod==12) {
		for (i=0; i<12; i++) {
			cell='r'+Number(Math.floor(i/4)+1)+'c'+Number((i%4)+1);
			cardqueue[i]['cell']=cell;
		}
		cardqueue[0]['card']="0rod"; cardqueue[1]['card']="0ros"; cardqueue[2]['card']="0rss"; cardqueue[3]['card']="1rsd"; cardqueue[4]['card']="1rso"; cardqueue[5]['card']="2rss"; cardqueue[6]['card']="2roo"; cardqueue[7]['card']="2ros"; cardqueue[8]['card']="0pod"; cardqueue[9]['card']="0pos"; cardqueue[10]['card']="0pss"; cardqueue[11]['card']="1psd";
	}
	if (mod==15) {
		for (i=0; i<15; i++) {
			cell='r'+Number(Math.floor(i/4)+1)+'c'+Number((i%4)+1);
			cardqueue[i]['cell']=cell;
		}
		cardqueue[0]['card']="0rod"; cardqueue[1]['card']="0ros"; cardqueue[2]['card']="0rss"; cardqueue[3]['card']="1rsd"; cardqueue[4]['card']="1rso"; cardqueue[5]['card']="2rss"; cardqueue[6]['card']="2roo"; cardqueue[7]['card']="2ros"; cardqueue[8]['card']="0pod"; cardqueue[9]['card']="0pos"; cardqueue[10]['card']="0pss"; cardqueue[11]['card']="1psd"; cardqueue[12]['card']="1pso"; cardqueue[13]['card']="2pss"; cardqueue[14]['card']="2poo"; cardqueue[15]['card']="2pos";
	}
}

function redeal() {
	var imgs = document.getElementsByTagName('img');
	for (i=0; i<imgs.length; i++) imgs[i].setAttribute("src", "assets/img/blank.svg");
	document.getElementById('count').innerText = '69';
	nextcard=0;
	cards=new Array();
	colors=new Array('r','g','p');
	shades=new Array('s','l','o');
	shapes=new Array('o','d','s');
	cardqueue=new Array();
	placedcards=new Array();
	placedcards["r4c1"]="";
	placedcards["r4c2"]="";
	placedcards["r4c3"]="";
	allcards=new Array();
	for (i=0; i<3; i++) {
		for (j=0; j<3; j++) {
			for (k=0; k<3; k++) {
				for (ii=0; ii<3; ii++) {
					pos=Number(i*27)+Number(j*9)+Number(k*3)+ii;
					allcards[pos]=ii+colors[i]+shades[j]+shapes[k];
				}
			}
		}	
	}
	endtime=0;
	totaltime=0;
	averagetime=0;
	fasttime=0;
	slowtime=0;
	timer_on=0;
	passed=0;
	times=new Array();
	toggletimer();
	startgame(0);
}


function randomcolor() {
	var randcolor = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
	return randcolor;
}

function addplayers() {
	var playercount = prompt('How many players?');
	if (playercount > playermax) players = playermax;
	for (i=1; i<=playercount; i++) {
		var color = randomcolor();
		document.getElementById('players').innerHTML += '<a class="button" id="score'+ i +'" style="background-color:'+ color +'" onclick="addscore('+ i +')"><b>Player '+ i +'</b><s>0</s></a>';
	}
	document.getElementById('add').style.display = 'none';
}

function addscore(id) {
	var playerid = document.getElementById('score' + id);
	var s = playerid.lastChild;
	var score = parseInt(s.innerHTML) + 1;
	s.innerText = score;
}

function endgame() {
	stoptimer();
	document.getElementById('end').style.display = 'block';
	document.getElementById('pause').style.display = 'none';
	document.getElementById('find').style.display = 'none';
	document.getElementsByTagName('body')[0].className = 'end';

	var players = document.getElementById('players');
	var winner = document.getElementById('winner');
	
	// check if we're doing multiplayer
	if (players.innerHTML != '') {
		var scores = new Array();
		var pscore = document.getElementsByTagName('s');
		
		// load scores into an array
		for (i=0; i<pscore.length; i++) {
			var score = parseInt(pscore[i].innerHTML);
			scores.push(score);
		}

		// get highest score
    var hiscore = Math.max.apply(Math, scores);

    // fetch array key for player number based on hi-score
    var playernum = '';
    for (i=0; i<scores.length; i++) {
    	if (scores[i] == hiscore) {
    		playernum = i + 1;
    	}
    }
    var scorecolor = document.getElementById('score' + playernum).style.backgroundColor;
    winner.innerHTML = 'Player '+ playernum +' wins!';
    winner.style.color = scorecolor;
	} else {
		winner.innerHTML = 'Game Over!';
	}
}

function replay() {
	document.getElementById('end').style.display = 'none';
	document.getElementById('add').style.display = 'inline-block';
	document.getElementById('pause').style.display = 'inline-block';
	document.getElementById('find').style.display = 'inline-block';
	document.getElementsByTagName('body')[0].className = '';
	document.getElementById('players').innerHTML = '';
	redeal();
}

function cardlayout() {
	var wwidth  = window.innerWidth;
	var wheight = window.innerHeight;
	var game = document.getElementById('game');
	if (wwidth > wheight) {
		game.className = 'wide';
	} else if (wheight > wwidth) {
		game.className = 'tall';
	}
}

function getmatch() {
	findmatch(1);
	var cards = document.getElementById('game').getElementsByTagName('a');
	for (i=0; i<cards.length; i++) {
		if (cards[i].className == 'find') {
			var cardID = cards[i].getAttribute('id');	
			toggleselect(cardID);
		}
	}
}

function fadecount() {
	var count = document.getElementById('count');
	if (count.className == '') {
		count.className = 'active';
	} else {
		count.className = '';
	}
} function toggleCount() {
	fadecount(); setTimeout(fadecount, 3000);
}


window.onresize = cardlayout;
cardlayout();
startgame(1);


/*
var image=new Array();
for (i=0; i<3; i++) {
	for (j=0; j<3; j++) {
		for (k=0; k<3; k++) {
			var n=((i+1)*9)+((j+1)*3)+(k+1);
			image[n] = new Image();
			var imgname='assets/img/'+colors[i]+shades[j]+shapes[k]+'.svg';
			image[n].src = imgname;
		}
	}
}
*/
