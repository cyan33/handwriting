var canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d');

var canvasWidth = Math.min(800, $(window).width() - 20);
var canvasHeight = canvasWidth;

canvas.width = canvasWidth;
canvas.height = canvasHeight;


$('#controller').css('width', canvasWidth + 'px');

//status variables
//to calculate the intermediate parameters
var isMouseDown = false;
var strokeColor = 'black';
var lastLoc = null;
var lastTimeStamp,
	curTimeStamp;

var lastLineWidth = -1;


canvasInit();


function canvasInit () {
	//size

	//draw the red square
	context.save();

	context.strokeStyle = 'rgb(230, 11, 9)';	//red

	context.beginPath();
	context.moveTo(3, 3);
	context.lineTo(canvasWidth - 3, 3);
	context.lineTo(canvasWidth - 3, canvasHeight - 3);
	context.lineTo(3, canvasWidth - 3);
	context.closePath();

	context.lineWidth = 6;
	context.stroke();

	//draw the intersections
	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(canvasWidth, canvasHeight);

	context.moveTo(canvasWidth / 2, 0);
	context.lineTo(canvasWidth / 2, canvasHeight);

	context.moveTo(canvasWidth, 0);
	context.lineTo(0, canvasHeight);

	context.moveTo(0, canvasHeight / 2);
	context.lineTo(canvasWidth, canvasHeight / 2);

	context.lineWidth = 1;
	context.stroke();

	context.restore();
};


function coordinateConversion (x, y) {
	//convert the coordinates of mouse in window to those in canvas.
	var box = canvas.getBoundingClientRect();
	return {
		x: Math.round(x - box.left),
		y: Math.round(y - box.top)
	};
}

//listen to the status of the mouse
document.onmousedown = function (e) {
	lastLoc = coordinateConversion(e.clientX, e.clientY);
	lastTimeStamp = new Date().getTime();
};

canvas.onmousedown = function (e) {
	e.preventDefault();
	isMouseDown = true;
};
canvas.onmouseup = function (e) {
	e.preventDefault();
	isMouseDown = false;
	
};
canvas.onmouseout = function (e) {
	e.preventDefault();
	isMouseDown = false;
	
};
canvas.onmousemove = function (e) {
	e.preventDefault();

	if (isMouseDown) {
		//draw(the core part of this app)
		var curLoc = coordinateConversion(e.clientX, e.clientY);
		curTimeStamp = new Date().getTime();
		var distance = calcDistance(curLoc, lastLoc);
		
		var time = curTimeStamp - lastTimeStamp;

		// console.log(distance / time);
		//Dont forget 'beginPath()', or it'll change the color!!
		context.beginPath();
		context.moveTo(lastLoc.x, lastLoc.y);
		context.lineTo(curLoc.x, curLoc.y);

		context.strokeStyle = strokeColor;
		context.lineWidth = calcLineWidth(distance, time);
		context.lineCap = 'round';
		context.lineJoin = 'round';
		context.stroke();

		lastLoc = curLoc;
		lastTimeStamp = curTimeStamp;
		lastLineWidth = calcLineWidth(distance, time);
	}
};

function calcDistance (loc1, loc2) {
	//this is used to calculate the distance between lastLoc and curLoc
	return Math.sqrt((loc1.x - loc2.x)*(loc1.x - loc2.x) + (loc1.y - loc2.y)*(loc1.y - loc2.y));
}

function calcLineWidth (s, t) {
	var maxLineWidth = 30;
	var minLineWidth = 8;
	var maxSpeed = 8;
	var minSpeed = 0.1;
	//calculate the supposed line width, which is in revesed relationship between speed and linewidth
	var v = s / t;
	var resultLineWidth;

	if (v < minSpeed)	resultLineWidth = maxLineWidth;
	else if (v > maxSpeed)	resultLineWidth = minLineWidth;
	else {
		resultLineWidth = maxLineWidth - (v - minSpeed) / (maxSpeed - minSpeed) * (maxLineWidth - minLineWidth);
	} 
	
	//output the result
	if (lastLineWidth === -1) {
		return Math.round(resultLineWidth);
	}

	return Math.round(lastLineWidth * 1/2 + resultLineWidth * 1/2);
}


$('.clear')[0].onclick = function () {
	//clear the canvas and redraw it 
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	canvasInit();
};

for(var i = 0, len = $('.color-btn').length; i < len; i++){
	$('.color-btn')[i].onclick = function () {
		$('.color-btn').removeClass('color-btn-selected');
		$(this).addClass('color-btn-selected');
		strokeColor = $(this).css('background-color');

		console.log($(this).css('background-color'));
	};
}
