// ************************************
// *     EJERCICIO 1                   *
// ************************************


// ============== Point =======================

function Point (x, y) {
	this.x = x;
	this.y = y;    
}

// ============== Rectangle ====================
function Rectangle() {}

Rectangle.prototype.init = function(p1,p2) {
	this.px = p1.x;
	this.py = p1.y;
	this.width = p2.x - p1.x;
	this.height = p2.y - p1.y;
	this.lineWidth= 1;
	this.color = 'black';
}

Rectangle.prototype.draw = function(pCtx) {

	// TU CÓDIGO AQUÍ:
	// pinta un rectángulo del color actual en pantalla en la posición px,py, con
	// la anchura y altura actual y una línea de anchura=lineWidth. Ten en cuenta que 
	// en este ejemplo la variable ctx es global y que guarda el contexto (context) 
	// para pintar en el canvas.
	pCtx.beginPath();
	pCtx.rect(this.px*Block.BLOCK_SIZE,this.py*Block.BLOCK_SIZE,this.width,this.height)
	pCtx.fillStyle = this.color
	pCtx.fill();
	pCtx.lineWidth = this.lineWidth
	pCtx.strokeStyle = "Black"
	pCtx.stroke()	
}


/** Método introducido en el EJERCICIO 4 */
/*
Rectangle.prototype.erase = function(){
	ctx.beginPath();
	ctx.rect(this.px*Block.BLOCK_SIZE,this.py*Block.BLOCK_SIZE,this.width,this.height)
	ctx.fillStyle = Tetris.BOARD_COLOR
	ctx.fill();
	ctx.lineWidth = this.lineWidth
	ctx.strokeStyle = Tetris.BOARD_COLOR
	ctx.stroke()

}
*/
Rectangle.prototype.setLineWidth = function(width) { this.lineWidth=width}
Rectangle.prototype.setFill = function(color) { this.color = color}

/** Método introducido en el EJERCICIO 4 */

Rectangle.prototype.move = function(x,y){
	this.px += x;
	this.py += y;
	this.draw(ctx);
}



// ============== Block ===============================

function Block (pos, color) {

	// TU CÓDIGO AQUÍ: este es el constructor de la clase Block. Recibe dos parámetros, pos y color. Pos = posición de la casilla, por ejemplo, (9,19).
	// color = color que hay que emplear para pintar el bloque.
	// Internamente este método crea dos puntos (empleando las coordenadas del pixel)
	// y llama al método init de la clase Rectangle, pasándole como parámetro,
	// estos dos puntos.
	// Sería interesante que emplearas las constantes Block.BLOCK_SIZE y Block.OUTLINE_WIDTH,
	// para establecer la anchura del bloque y la anchura de la línea, respectivamente.
	this.init(pos,new Point(Block.BLOCK_SIZE+pos.x,Block.BLOCK_SIZE+pos.y))
	this.color = color
	this.width = Block.BLOCK_SIZE
	this.height = Block.BLOCK_SIZE
	this.lineWidth = Block.OUTLINE_WIDTH
}

Block.BLOCK_SIZE = 30;
Block.OUTLINE_WIDTH = 2;

// TU CÓDIGO AQUÍ: emplea el patrón de herencia (Block es un Rectangle)

Block.prototype = new Rectangle();
Block.prototype.constructor = Block

/** Método introducido en el EJERCICIO 4 */

 /**************************************************
 *	 Código que se da dado para el EJERCICIO 5 *
 ***************************************************/

 Rectangle.prototype.can_move = function(board,x,y){
	var ret = true
	if (this.px+x < 0 || this.px + x > Tetris.BOARD_WIDTH-1 || this.py + y > Tetris.BOARD_HEIGHT-1){
			ret = false
		}
	else if (board.placedPieces[this.py+y]) {
		board.placedPieces[this.py+y].forEach(block => {
			if (block.column == this.px+x){ret = false}
		});
	}
	return ret
};

// ************************************
// *      EJERCICIO 2                  *
// ************************************

function Shape() {}


Shape.prototype.init = function(coords, color) {

	// TU CÓDIGO AQUÍ: método de inicialización de una Pieza del tablero
	// Toma como parámetros: coords, un array de posiciones de los bloques
	// que forman la Pieza y color, un string que indica el color de los bloques
	// Post-condición: para cada coordenada, crea un bloque de ese color y lo guarda en un bloque-array

	/*8 Atributo introducido en el EJERCICIO 8*/
	var bloques = []
	for (let i = 0; i < coords.length; i++) {
		bloques[i] = new Block(coords[i],color)
	}
	this.bloqueArray = bloques
	this.rotation_dir = 1;

};

Shape.prototype.draw = function(pCtx) {

	// TU CÓDIGO AQUÍ: método que debe pintar en pantalla todos los bloques
	// que forman la Pieza
	this.bloqueArray.forEach(bloque => {
		bloque.draw(pCtx)
	});
};

 /**************************************************
 *	 Código que se da dado para el EJERCICIO 5 *
 ***************************************************/

 Shape.prototype.can_move = function(board, dx, dy) {
	for (let index = 0; index < this.bloqueArray.length; index++) {
		const element = this.bloqueArray[index];
		if (!element.can_move(board,dx,dy))	
		{
			return false
		}
	}
	return true
};

/* Método introducido en el EJERCICIO 8 */

Shape.prototype.can_rotate = function(board) {

//  TU CÓDIGO AQUÍ: calcula la fórmula de rotación para cada uno de los bloques de
// la pieza. Si alguno de los bloques no se pudiera mover a la nueva posición,
// devolver false. En caso contrario, true.
var salida = true
	var center =this.center_block;
	var dir = this.rotation_dir;
	this.bloqueArray.forEach(block => {
		x = center.px - dir*center.py + dir*block.py
		y = center.py + dir*center.px - dir*block.px
		let aux = new Block(new Point(x,y),"green")
		if(!aux.can_move(board,0,0)){
			salida = false
			return			
		}
	});
	return salida
};

/* Método introducido en el EJERCICIO 8 */

Shape.prototype.rotate = function() {

// TU CÓDIGO AQUÍ: básicamente tienes que aplicar la fórmula de rotación
// (que se muestra en el enunciado de la práctica) a todos los bloques de la pieza
	var center =this.center_block;
	var dir = this.rotation_dir;
	this.bloqueArray.forEach(block => {
		x = center.px - dir*center.py + dir*block.py
		y = center.py + dir*center.px - dir*block.px
		block.px = x;
		block.py = y;
	});


  /* Deja este código al final. Por defecto las piezas deben oscilar en su
     movimiento, aunque no siempre es así (de ahí que haya que comprobarlo) */
    if (this.shift_rotation_dir)
            this.rotation_dir *= -1
};

/* Método introducido en el EJERCICIO 4 */

Shape.prototype.move = function(dx, dy) {
    /*for (block of this.bloqueArray) {
        block.erase();
    }*/

    for (block of this.bloqueArray) {
        block.move(dx,dy);
    }
}


// ============= I_Shape ================================
function I_Shape(center) {
	this.tipoPieza = "I_Shape"
     var coords = [new Point(center.x - 2, center.y),
               new Point(center.x - 1, center.y),
               new Point(center.x , center.y),
               new Point(center.x + 1, center.y)];
    
     Shape.prototype.init.call(this, coords, "blue");  

	/* Atributo introducido en el ejercicio 8*/

	this.shift_rotation_dir = true;
	this.center_block = this.bloqueArray[1];

}

// TU CÓDIGO AQUÍ: La clase I_Shape hereda de la clase Shape
I_Shape.prototype = new Shape();
I_Shape.prototype.constructor = Shape

// =============== J_Shape =============================
function J_Shape(center) {
	this.tipoPieza = "J_Shape"
	var coords = [new Point(center.x - 1, center.y),
		new Point(center.x , center.y),
		new Point(center.x + 1, center.y),
		new Point(center.x + 1, center.y + 1)];

Shape.prototype.init.call(this, coords, "orange"); 
	/* atributo introducido en el EJERCICIO 8 */
	this.shift_rotation_dir = false;
	this.center_block = this.bloqueArray[1];
	
}

// TU CÓDIGO AQUÍ: La clase J_Shape hereda de la clase Shape

// ============ L Shape ===========================
J_Shape.prototype = new Shape();
J_Shape.prototype.constructor = Shape

// ============ L Shape ===========================
function L_Shape(center) {
	this.tipoPieza = "L_Shape"
	// TU CÓDIGO AQUÍ: Para programar L_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y + 1),
		new Point(center.x - 1, center.y),
		new Point(center.x , center.y),
		new Point(center.x + 1, center.y)];

Shape.prototype.init.call(this, coords, "cyan"); 
	/* atributo introducido en el EJERCICIO 8 */
	this.shift_rotation_dir = false;
       this.center_block = this.bloqueArray[2];
 
}

// TU CÓDIGO AQUÍ: La clase L_Shape hereda de la clase Shape
L_Shape.prototype = new Shape();
L_Shape.prototype.constructor = Shape
// ============ O Shape ===========================
function O_Shape(center) {
	this.tipoPieza = "O_Shape"
	// TU CÓDIGO AQUÍ: Para programar O_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y ),
		new Point(center.x , center.y),
		new Point(center.x , center.y + 1),
		new Point(center.x - 1, center.y + 1)];
	Shape.prototype.init.call(this, coords, "red"); 
	/* atributo introducido en el EJERCICIO 8 */

       this.center_block = this.bloqueArray[0];

}

// TU CÓDIGO AQUÍ: La clase O_Shape hereda de la clase Shape
O_Shape.prototype = new Shape();
O_Shape.prototype.constructor = Shape
/* Código introducido en el EJERCICIO 8*/
// O_Shape la pieza no rota. Sobreescribiremos el método can_rotate que ha heredado de la clase Shape

O_Shape.prototype.can_rotate = function(board){
	return false;
};


// ============ S Shape ===========================
function S_Shape(center) {
	this.tipoPieza = "S_Shape"
	// TU CÓDIGO AQUÍ: Para programar S_Shape toma como ejemplo el código de la clase I_Shape 
	var coords = [new Point(center.x - 1, center.y + 1),
		new Point(center.x , center.y + 1),
		new Point(center.x , center.y),
		new Point(center.x + 1, center.y)];

Shape.prototype.init.call(this, coords, "lime"); 
	/* atributo introducido en el EJERCICIO 8 */


	this.shift_rotation_dir = true;
	this.center_block = this.bloqueArray[2];


}

// TU CÓDIGO AQUÍ: La clase S_Shape hereda de la clase Shape
S_Shape.prototype = new Shape();
S_Shape.prototype.constructor = Shape
// ============ T Shape ===========================
function T_Shape(center) {
	this.tipoPieza = "T_Shape"
	// TU CÓDIGO AQUÍ: : Para programar T_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y ),
		new Point(center.x , center.y),
		new Point(center.x + 1 , center.y),
		new Point(center.x, center.y + 1)];

Shape.prototype.init.call(this, coords, "yellow"); 
	/* atributo introducido en el EJERCICIO 8 */
	this.shift_rotation_dir = false;
       this.center_block = this.bloqueArray[1];


}

// TU CÓDIGO AQUÍ: La clase T_Shape hereda de la clase Shape
T_Shape.prototype = new Shape();
T_Shape.prototype.constructor = Shape

// ============ Z Shape ===========================
function Z_Shape(center) {
	this.tipoPieza = "Z_Shape"
	// TU CÓDIGO AQUÍ: : Para programar Z_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y ),
		new Point(center.x , center.y),
		new Point(center.x , center.y + 1),
		new Point(center.x + 1, center.y + 1)];

Shape.prototype.init.call(this, coords, "magenta"); 
	/* atributo introducido en el EJERCICIO 8 */

       this.shift_rotation_dir = true;
       this.center_block = this.bloqueArray[1];
}

// TU CÓDIGO AQUÍ: La clase Z_Shape hereda de la clase Shape
Z_Shape.prototype = new Shape();
Z_Shape.prototype.constructor = Shape

// ************************************
// *     EJERCICIO 3               *
// ************************************

// ====================== BOARD ================

function Board(width, height) {
	this.width = width;
	this.height = height;
	this.placedPieces = {}; /* 6. Estructura de datos introducida en el EJERCICIO 6 */
	this.score = 0; // Para almacenar la puntuacion
	this.lines = 0; // Para ver cuantas lineas llevas
	this.level = 1;
	this.nextShape;
}


// Si la pieza nueva puede entrar en el tablero, pintarla y devolver true.
// Si no, devoler false

Board.prototype.draw_shape = function(shape,pCtx){
	if (shape.can_move(this,0,0)){
		shape.draw(pCtx);
		return true;
	}
	return false;
}

 /*****************************
 *	 EJERCICIO 6          *
 *****************************/

 Board.prototype.add_shape = function(shape){

	// TU CÓDIGO AQUÍ: meter todos los bloques de la pieza que hemos recibido por parámetro en la estructura de datos grid
	shape.bloqueArray.forEach(block => {
		if (!this.placedPieces[block.py]){
			this.placedPieces[block.py] = [{"column": block.px, "color":block.color}]
		}else{
			this.placedPieces[block.py].push({"column": block.px, "color":block.color})
		}		
	});
	
}


// ****************************
// *     EJERCICIO 5          *
// ****************************

Board.prototype.can_move = function(x,y){

	// TU CÓDIGO AQUÍ: 
	// hasta ahora, este método siempre devolvía el valor true. Ahora,
	// comprueba si la posición que se le pasa como párametro está dentro de los  
   // límites del tablero y en función de ello, devuelve true o false.
   return game.current_shape.can_move(this,x,y)
};

Board.prototype.is_row_complete = function(y){
// TU CÓDIGO AQUÍ: comprueba si la línea que se le pasa como parámetro
// es completa o no (se busca en el grid).
	return (this.placedPieces[y].length == 10)
};

Board.prototype.delete_row = function(y){
// TU CÓDIGO AQUÍ: Borra del grid y de pantalla todos los bloques de la fila y
	//Este codigo es para rehacer algunos bordes que se borran por la implementacion de mover el block
	this.placedPieces[y].forEach(block => {
		var aux = new Block(new Point(block.column,y),block.color)
		//aux.erase();
	});
	delete this.placedPieces[y]
	
};

Board.prototype.move_down_rows = function(y_start){
/// TU CÓDIGO AQUÍ: 
//  empezando en la fila y_start y hasta la fila 0
//    para todas las casillas de esa fila
//       si la casilla está en el grid  (hay bloque en esa casilla)
//          borrar el bloque del grid
//          
//          mientras se pueda mover el bloque hacia abajo
//              mover el bloque hacia abajo
//          
//          meter el bloque en la nueva posición del grid
	for (let index = y_start; index >= 0; index--) {
		if (!this.placedPieces[index-1]){
			delete this.placedPieces[index]
			break//Paramos el bucle si esa fila esta vacia
		}
		this.placedPieces[index] = this.placedPieces[index-1]
	}

};

Board.prototype.remove_complete_rows = function(){
// TU CÓDIGO AQUÍ:
// Para toda fila y del tablero
//   si la fila y está completa
//      borrar fila y
//      mover hacia abajo las filas superiores (es decir, move_down_rows(y-1) )
	var cont = 0;
	for (key in this.placedPieces){
		if (this.is_row_complete(key)){
			this.delete_row(key)
			cont++;
			this.move_down_rows(key)
		}
	}	
	if (cont > 0) {
		this.setNewScore(cont)
	}
};

Board.prototype.setNewScore = function(lines) {
	var linevalue = 100; //valor de una linea
	var lineModifier = 1 + (lines-1) ;//La funcion que quieras para el modificador por lineas
	var speedModifier = this.level
	this.score = this.score + linevalue * lines * lineModifier * speedModifier;
	this.lines = this.lines + lines;

	if (this.lines > this.level*10){//cada 10 lineas se suve un nivel
		this.level = this.level+1;
		clearInterval(game.loop);
		game.loop = setInterval(function(){ game.do_move("Down") }, 1000 - 40 * (this.level-1));//el nivel incremta cuan rapido caen las piezas
	}
	if (lines == 4){
		playSound(document.getElementById("clear"));
	}else{
		playSound(document.getElementById("line"));
	}
	document.getElementById("score").innerHTML = this.score
	document.getElementById("lines").innerHTML = this.lines
	document.getElementById("level").innerHTML = this.level
}

// ==================== Tetris ==========================

function Tetris() {
	this.board = new Board(Tetris.BOARD_WIDTH, Tetris.BOARD_HEIGHT);
}

Tetris.SHAPES = [I_Shape, J_Shape, L_Shape, O_Shape, S_Shape, T_Shape, Z_Shape];
Tetris.DIRECTION = {'Left':[-1, 0], 'Right':[1, 0], 'Down':[0, 1]};
Tetris.BOARD_WIDTH = 10;
Tetris.BOARD_HEIGHT = 20;
Tetris.BOARD_COLOR='white';
Tetris.NEXT_BOARD_WIDTH = 4;
Tetris.NEXT_BOARD_HEIGHT = 2;

Tetris.prototype.create_new_shape = function(){

	// TU CÓDIGO AQUÍ: 
	// Elegir un nombre de pieza al azar del array Tetris.SHAPES
	// Crear una instancia de ese tipo de pieza (x = centro del tablero, y = 0)
	// Devolver la referencia de esa pieza nueva
	ctxNext.fillStyle = '#bbb';
	ctxNext.fillRect(0,0,canvas.width,canvas.height);

	if (!this.board.nextShape){
		this.board.nextShape = Tetris.SHAPES[Math.floor(Math.random() * Tetris.SHAPES.length)]
	}
	var pieza = new this.board.nextShape(new Point(Tetris.BOARD_WIDTH/2,0));
	this.board.nextShape = Tetris.SHAPES[Math.floor(Math.random() * Tetris.SHAPES.length)] 
	if (!pieza.can_move(this.board,0,0)){
		this.endgame();
	}
	
	this.board.draw_shape(new this.board.nextShape(new Point(Tetris.NEXT_BOARD_WIDTH/2,0)),ctxNext)
	return pieza
}

Tetris.prototype.endgame = function() {
	
	clearInterval(game.loop);
	alert("Fin de la partida")//alertamos a jugador del final de la partida
	this.manageScore(this.board.score);
	this.board.placedPieces = {} //Borramos las piezas colocadas
	this.update_Frame() //acutualizamos la pantalla
	this.loop = setInterval(function(){ game.do_move("Down") }, 1000);
	this.board.score = 0;
	this.board.level = 1;
	this.board.lines = 0;
	this.board.setNewScore(0);
		
}

Tetris.prototype.manageScore = function(score) {
	var pos = 11;
	var name = null;
	for (let index = 1; index <= localStorage.length; index++) {
		if (score>=JSON.parse(localStorage.getItem(index)).score){
			pos = index
			name = prompt("Estas entre los 10 primeros, introduce tu nombre para guardar el record", "Anonimo");
			break;
		}
	}
	console.log(pos)
	if (name){
		for (let index = localStorage.length; index > pos; index--) {
		localStorage.setItem(index,localStorage.getItem(index-1));
	}
	localStorage.setItem(pos,JSON.stringify({"name":name,"score": score}));
	}
	if (localStorage.length == 0) {
		name = prompt("Estas entre los 10 primeros, introduce tu nombre para guardar el record", "Anonimo");
		localStorage.setItem(1,JSON.stringify({"name":name,"score": score}));
	}
	this.updateRecords();
}

Tetris.prototype.updateRecords = function() {
	document.getElementById("scores").innerHTML = "<tr><th>Player</th><th>Score</th></tr>";
	for (let index = 1; index <= localStorage.length; index++) {
		const score = JSON.parse(localStorage.getItem(index)).score;
		const name = JSON.parse(localStorage.getItem(index)).name;
		document.getElementById("scores").innerHTML = document.getElementById("scores").innerHTML + "<tr> <td>" +name+"</td> <td>"+score+"</td> </tr>"
	}
	
}

Tetris.prototype.init = function(){

	/**************
	  EJERCICIO 4
	***************/

	// gestor de teclado

	document.addEventListener('keydown', this.key_pressed.bind(this), false);

	// Obtener una nueva pieza al azar y asignarla como pieza actual

	this.current_shape = this.create_new_shape()

	// TU CÓDIGO AQUÍ: 
	// Pintar la pieza actual en el tablero
	// Aclaración: (Board tiene un método para pintar)
	this.board.draw_shape(this.current_shape,ctx)
	this.loop = setInterval(function(){ game.do_move("Down") }, 1000);

}

Tetris.prototype.key_pressed = function(e) { 

	var key = e.keyCode ? e.keyCode : e.which;
	   // TU CÓDIGO AQUÍ:
   // en la variable key se guardará el código ASCII de la tecla que
   // ha pulsado el usuario. ¿Cuál es el código key que corresponde 
   // a mover la pieza hacia la izquierda, la derecha, abajo o a rotarla?
   if (!this.paused){
	   switch (key) {
		case 37://izquierda
			var moved = this.do_move("Left")
			if (moved){
				playSound(document.getElementById("move"));	
			}
		break;
		case 39://derecha
			var moved =this.do_move("Right")
			if (moved){
				playSound(document.getElementById("move"));	
			}
		break;
		case 40://abajo
			var moved = this.do_move("Down")
			if (moved){
				playSound(document.getElementById("move"));	
			}
			else{
				playSound(document.getElementById("slowDown"));
			}
		break;
		case 32://abajo
			while (this.do_move("Down")){}
			playSound(document.getElementById("hardDown"));		
		break;
		case 38://rotar
			this.do_rotate()			
		break;
		case 80://rotar
			this.startStop()			
		break;	
		default:
			break;
	}
   }else if (this.paused && key == 80) {
	   this.startStop();
   }
}

Tetris.prototype.startStop = function() {
	var text = document.getElementsByClassName("pause")
	playSound(document.getElementById("pauseSound"));
	if (this.paused){
		this.loop = setInterval(function(){ game.do_move("Down") }, 1000 - 40 * (this.board.level-1));
		this.paused = false;
		playSound(document.getElementById("music"));
		Array.from(text).forEach(element => {
			element.hidden = true
		});
	}else{
		clearInterval(game.loop);
		this.paused = true;
		document.getElementById("music").pause();
		Array.from(text).forEach(element => {
			element.hidden = false
		});
	}
}

Tetris.prototype.do_move = function(direction) {

	// TU CÓDIGO AQUÍ: el usuario ha pulsado la tecla Left, Right o Down (izquierda,
	// derecha o abajo). Tenemos que mover la pieza en la dirección correspondiente
	// a esa tecla. Recuerda que el array Tetris.DIRECTION guarda los desplazamientos 
	// en cada dirección, por tanto, si accedes a Tetris.DIRECTION[direction], 
	// obtendrás el desplazamiento (dx, dy). A continuación analiza si la pieza actual 
	// se puede mover con ese desplazamiento. En caso afirmativo, mueve la pieza.
	var moved = false;
	var dir = Tetris.DIRECTION[direction]
	if (this.board.can_move(dir[0],dir[1])){
		this.current_shape.move(dir[0],dir[1])
		moved = true;
	}	
	else if (direction == "Down")
	{
		this.board.add_shape(this.current_shape)
		this.current_shape = this.create_new_shape()
	}
	this.update_Frame();
	return moved
}

/***** EJERCICIO 8 ******/
Tetris.prototype.do_rotate = function(){
	if (this.current_shape.can_rotate(this.board)) {
		this.current_shape.rotate();
		this.update_Frame()
		playSound(document.getElementById("rotate"))
		
	}	
	// TU CÓDIGO AQUÍ: si la pieza actual se puede rotar, rótala. Recueda que Shape.can_rotate y Shape.rotate ya están programadas.
}

//Metodo auxiliar para no tener codigo duplicado
Tetris.prototype.update_Frame = function() {
	//Este metodo limpia el canvas y dibuja nuevamente todas las piezas en su posicion.
	void ctx.clearRect(0, 0, canvas.width, canvas.height);
	this.board.draw_shape(this.current_shape,ctx)
	this.board.remove_complete_rows();
	for (key in this.board.placedPieces){//Este codigo es para rehacer algunos bordes que se borran por la implementacion de mover el block
		this.board.placedPieces[key].forEach(block => {
			var aux = new Block(new Point(block.column,key),block.color)
			aux.draw(ctx);
		});
	}
}

function playSound(sound) {
	if(sound.paused){
		sound.play();
	}else{
		sound.currentTime = 0 
	}
}

