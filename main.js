
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
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.speed = 3;

        board.ball = this;
        this.kind = "circle";
    }
    
    //Prototype de la clase Ball
    self.Ball.prototype = {
        //Metodos de la clase Ball
        move: function(){ //Mueve la pelota
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y * this.direction);
        },
        get width(){
            return this.radius * 2;
        },
        get height(){
            return this.radius * 2;
        },
        collision: function(bar){ //Reacciona al pegar con la barra
            var relative_intersect_y = ( bar.y + (bar.height / 2) ) - this.y;

            var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);

            if(this.x > (this.board.width / 2)) this.direction = -1;
            else this.direction = 1;
        },
        colissionBoard: function(){ //REacciona al pegar con los bordes del board
            var relative_intersect_y = ( this.y + (this.height / 2) ) - this.y;

            var normalized_intersect_y = relative_intersect_y / (this.height / 2);

            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);
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
        check_collisions: function(){
            for(var i = this.board.bars.length - 1; i>= 0; i--){
                var bar = this.board.bars[i];
                if(hit(bar, this.board.ball)){
                    this.board.ball.collision(bar);
                }
            }
        },
        check_collisions_board: function(){
            if(hitBoard(this.board.ball)){
                this.board.ball.colissionBoard();
            }
        },
        play: function(){ //Metodo para controlar el dibujado (draw) y la limpieza de los objetos (clean)
            if(this.board.playing){
                this.clean();
                this.draw();
                this.check_collisions();
                this.check_collisions_board();
                this.board.ball.move();
            }
        }
    }

    function hitBoard(b){
        var hit = false;
        
        console.log(puntos2);
        console.log(puntos1);
        //Colisiones bordes del tablero
        if(b.y < 10.0 || b.y > 390.0){
            hit = true;
        }
        if(b.x < -10)
        {
            puntos2 = puntos2 + 1;
            again();
        }
        if(b.x > 810.0){
            puntos1 = puntos1 + 1;
            again();
        }
        function again(){
            b.x = 350;
            b.y = 100;
            board_view.draw();
            board.playing = !board.playing;
        }
        return hit;
    }

    function hit(a, b){
        //Revisa si hay una colisión de a con b
        var hit = false;

        //Colisiones horizontales
        if(b.x + b.width >= a.x && b.x < a.x + a.width){
            //Colisiones verticales
            if(b.y + b.height >= a.y && b.y < a.y + a.height){
                hit = true;
            }
        }
        
        //Colisión de a con b
        if(b.x <= a.x && b.x + b.width >= a.x + a.width){
            if(b.y <= a.y && b.y + b.height >= a.y + a.height){
                hit = true;
            }
        }
        //Colisión de b con a
        if(a.x <= b.x && a.x + a.width >= b.x + b.width){
            if(a.y <= b.y && a.y + a.height >= b.y + b.height){
                hit = true;
            }
        }
        return hit;
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
var puntos1 = 0;
var puntos2 = 0;
var player1 = document.getElementById('player1');
var player2 = document.getElementById('player2');

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
    player1.innerHTML = "Jugador 1: "+puntos1
    player2.innerHTML = "Jugador 2: "+puntos2
}