
//Función que se ejecuta automaticamente y dentro contiene la clase Board (tablero).
(function(){
    //Creamos la clase
    self.Board = function(width, height){
        //asignamos los datos a los atributos de la clase
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
        this.playing = false;
    }
    
    //Prototype de la clase
    self.Board.prototype = {
        //Metodos de la clase
        get elements(){
            var elements = this.bars.map(function(bar){return bar;});
            elements.push(this.ball);
            return elements;
        }
    }
})();

//Función automatica
(function(){
    //Clase Ball (pelota)
    self.Ball = function(x, y, radius, board){
        //Asignamos los datos a los atributos de la clase
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;
        this.direction = 1;

        board.ball = this;
        this.kind = "circle";
    }
    
    //Prototype de la clase Ball
    self.Ball.prototype = {
        //Metodos de la clase Ball
        move: function(){ //Mueve la pelota
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);
            
        }
    }
})();

//Función automatica
(function(){
    //Clase Bar (Barra)
    self.Bar = function(x, y, width, height, board){
        //Asignar datos a los atributos de la clase
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 10;
    }

    //Protytpe de Bar
    self.Bar.prototype = {
        //Metodos de Bar
        down: function(){ //Mueve la barra hacia abajo
            this.y += this.speed;
        },
        up: function(){ //Mueve la barra hacia arriba
            this.y -= this.speed;
        },
        /*toString: function(){ //La utlizamos para testear y ver si funcionaba
            return "x: "+ this.x + " y: "+ this.y; 
        }*/
    }

}
)();

//Función automatica
(function(){
    //Clase BoardView (Ver Tablero)
    self.BoardView = function(canvas, board){
        //Se asigna los datos a los atributos de la clase
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

    //Prototype de BoardView
    self.BoardView.prototype = {
        //Metodos de la clase
        clean: function(){ //Limpia cada objeto dentro del Board para dibujarlo de nuevo a donde se quiere mover
            this.ctx.clearRect(0,0,this.board.width, this.board.height);
        },
        draw: function(){ //Dibuja todo 1 vez
            for(var i = this.board.elements.length - 1; i>=0; i--){
                var el = this.board.elements[i];

                draw(this.ctx, el);
            }
        },
        play: function(){ //Metodo para controlar el dibujado (draw) y la limpieza de los objetos (clean)
            if(this.board.playing){
                this.clean();
                this.draw();
                this.board.ball.move();
            }
        }
    }

    //Función para saber que dibujar (rectangulo, circulo, etc);
    function draw(ctx, element){
        switch(element.kind){
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius, 0, 7);
                ctx.fill();
                ctx.closePath();
                break;
        }   
    }
})();

//Objetos de las clases utilizadas, con sus datos de entrada
var board = new Board(800,400);
var bar = new Bar(20,100,40,100, board);
var bar2 = new Bar(735, 100, 40, 100, board);
var canvas = document.getElementById('canvas');
var board_view = new BoardView(canvas, board);
var ball = new Ball(350, 100, 10, board);

//Recibimos por el document las teclas presionadas y con estás efectuamos las acciones en la pantalla (dibujamos).
document.addEventListener("keydown", function(ev){
    if(ev.keyCode == 87){ //Tecla W
        ev.preventDefault();
        bar.up();
    }else if(ev.keyCode == 83){ //Tecla S
        ev.preventDefault();
        bar.down();
    }else if(ev.keyCode == 38){ //Tecla Flecha arriba
        ev.preventDefault();
        bar2.up();
    }else if(ev.keyCode == 40){ //Tecla flecha abajo
        ev.preventDefault();
        bar2.down();
    }else if(ev.keyCode == 32){ //Tecla espacio
        ev.preventDefault();
        board.playing = !board.playing; //Parar o continuar el juego (dibujo).
    }
});

//Dibujamos una vez al iniciar para ver algo y no necesariamente presionar espacio para comenzar.
board_view.draw();
//Controlar el dibujado de la pantalla por la función controller
window.requestAnimationFrame(controller);
/*setTimeout(function(){ //Es para testear el movimiento de la Ball (pelota).
    ball.direction = -1;
}, 4000)*/
function controller(){
    board_view.play();
    window.requestAnimationFrame(controller);
}