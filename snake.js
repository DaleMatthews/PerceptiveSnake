$(document).ready(function(){
	//Canvas stuff
	var mainCanvas  = document.getElementById('canvas1');
	var width = mainCanvas.width;
	var height = mainCanvas.height;
	
	var offscreenCanvas  = document.createElement('canvas');
	offscreenCanvas.width = width;
	offscreenCanvas.height = height;
	
	var ctx; //back buffer
	
	var cell_size = 25;
	var dir;
	var food;
	var score;
	var gameOn=true;
	
	var food_image;
	
 	var snakeImages = new Array(); 
	
	var burp = new Howl({
	    urls: ['sounds/burp.mp3', 'sounds/burp.ogg']
	});
	var death = new Howl({
	    urls: ['sounds/torture.mp3', 'sounds/torture.ogg']
	});
	var mainSong = new Howl({
	    urls: ['sounds/mainSong.mp3', 'sounds/mainSong.ogg']
	}).play();

	var snake_array; //an array of cells to make up the snake
	
	function init()
	{
		loadImages();
		drawingBuffer = 1;
		dir = "right"; //default direction
		create_snake();
		create_food(); //Now we can see the food particle
		//finally lets display  the score
		score = 0;
	
		//Lets move the snake now using a timer which will trigger the paint function
		//every 60m
		if(typeof game_loop != "undefined") 
			clearInterval(game_loop);
		game_loop = setInterval(paint, 120);
	}

	function loadImages()
	{
		food_image = new Image();
		food_image.src = 'cupcake.jpg';

		snakeImages[0] = new Image();
		snakeImages[0].src = 'image/snake.jpg';

		snakeImages[1] = new Image();
		snakeImages[1].src = 'image/snake2.jpg';

		snakeImages[2] = new Image();
		snakeImages[2].src = 'image/snake3.jpg';

		snakeImages[3] = new Image();
		snakeImages[3].src = 'image/snake4.jpg';

		snakeImages[4] = new Image();
		snakeImages[4].src = 'image/snake5.jpg';

		snakeImages[5] = new Image();
		snakeImages[5].src = 'image/snake6.jpg';
		
		snakeImages[6] = new Image();
		snakeImages[6].src = 'image/snake7.jpg';

		snakeImages[7] = new Image();
		snakeImages[7].src = 'image/snake8.jpg';

		snakeImages[8] = new Image();
		snakeImages[8].src = 'image/snake9.jpg';

		snakeImages[9] = new Image();
		snakeImages[9].src = 'image/snake10.jpg';

		snakeImages[10] = new Image();
		snakeImages[10].src = 'image/snake11.jpg';

		snakeImages[11] = new Image();
		snakeImages[11].src = 'image/snake12.jpg';
	}
	
	function create_snake()
	{
		var length = 5; //Length of the snake
		snake_array = []; //Empty array to start with
		for(var i = length-1; i>=0; i--)
		{
			//This will create a horizontal snake starting from the top left
			snake_array.push({x: i, y:0});
		}
	}
	
	//Lets create the food now
	function create_food()
	{
		//burp.play();
		food = {
			x: Math.round(Math.random()*(width-cell_size)/cell_size), 
			y: Math.round(Math.random()*(height-cell_size)/cell_size), 
		};
		//This will create a cell with x/y between 0-44
		//Because there are 45(450/10) positions across the rows and columns
	}
	
	//Lets paint the snake now
	function paint()
	{
		if(!gameOn)
			return;
		//get the context
		ctx = offscreenCanvas.getContext('2d');
		
		//To avoid the snake trail we need to paint the BG on every frame
		//Lets paint the canvas now
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, width, height);
		ctx.strokeStyle = "white";
		ctx.strokeRect(0, 0, width, height);
		
		//The movement code for the snake to come here.
		//The logic is simple
		//Pop out the tail cell and place it infront of the head cell
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		//These were the position of the head cell.
		//We will increment it to get the new head position
		//Lets add proper direction based movement now
		if(dir == "right") nx++;
		else if(dir == "left") nx--;
		else if(dir == "up") ny--;
		else if(dir == "down") ny++;
		
		//Lets add the game over clauses now
		//This will restart the game if the snake hits the wall
		//Lets add the code for body collision
		//Now if the head of the snake bumps into its body, the game will restart
		if(nx < 0 || nx >= width/cell_size || ny < 0 || ny >= height/cell_size || check_collision(nx, ny, snake_array))
		{
			//ends game
			death.play();
			gameOn=false;
			score=0;
			create_snake();
			return false;
		}
		
		//Lets write the code to make the snake eat the food
		//The logic is simple
		//If the new head position matches with that of the food,
		//Create a new head instead of moving the tail
		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};
			score++;
			//Create new food
			create_food();
		}
		else
		{
			var tail = snake_array.pop(); //pops out the last cell
			tail.x = nx; tail.y = ny;
		}
		//The snake can now eat the food.
		
		snake_array.unshift(tail); //puts back the tail as the first cell
		
		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			//Lets paint 10px wide cells
			paint_snake(c.x, c.y, i);
		}
		
		//Lets paint the food
		paint_food(food.x, food.y);
		//Lets paint the score
		var score_text = "Score: " + score;
		ctx.fillStyle = 'blue';
		ctx.fillText(score_text, 5, height-5);
		
		//now draw it in the front buffer
		ctx = mainCanvas.getContext('2d');
		ctx.drawImage(offscreenCanvas, 0, 0);
	}
	
	//Lets first create a generic function to paint cells
	function paint_snake(x, y, i)
	{
		i=i%snakeImages.length;
		ctx.drawImage(snakeImages[i], x*cell_size, y*cell_size, cell_size, cell_size);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cell_size, y*cell_size, cell_size, cell_size);
	}

	function paint_food(x, y)
	{
		ctx.drawImage(food_image, x*cell_size, y*cell_size, cell_size, cell_size);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cell_size, y*cell_size, cell_size, cell_size);
	}

	function check_collision(x, y, array)
	{
		//This function will check if the provided x/y coordinates exist
		//in an array of cells or not
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
				return true;
		}
		
		return false;

	}
	
	//Lets add the keyboard controls now
	$(document).keydown(function(e){
		var key = e.which;
		//We will add another clause to prevent reverse gear
		if(key == "37" && dir != "right") dir = "left";
		else if(key == "38" && dir != "down") dir = "up";
		else if(key == "39" && dir != "left") dir = "right";
		else if(key == "40" && dir != "up") dir = "down";
		else if (key == '32'){
			 gameOn=true;
			 init();
	    }
		//The snake is now keyboard controllable
	})
	
})