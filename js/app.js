document.addEventListener("DOMContentLoaded", function(){

   var board = document.querySelector('#board');

   function GameOfLife(boardWidth, boardHeight){
      this.width = boardWidth;
      this.height = boardHeight;
      this.board = board;
      this.cells = [];
   }

   GameOfLife.prototype.createBoard = function(){
      this.board.style.width = this.width * 15 + 'px';
      this.board.style.height = this.height * 15 + 'px';
      var numOfFields = this.width * this.height;

      for (var i = 0; i < numOfFields; i++){
         var div = document.createElement('div');
         div.setAttribute('id', i)
         this.board.appendChild(div);
         this.cells.push(div);
      };

      var boostEvent = document.querySelector('#boostEvent').value;

      for (var i = 0; i < this.cells.length; i++){
         this.cells[i].addEventListener(boostEvent, function(){
            this.classList.toggle('live');
         });
      };
   };

   GameOfLife.prototype.position = function(x, y){
      var index = x + y * this.width;
      return this.cells[index];
   };

   GameOfLife.prototype.setCellState = function(x, y, state){
      var whichCell = this.position(x, y);
      if (state === 'live'){
         whichCell.classList.add('live');
      } else{
         whichCell.classList.remove('live');
      };
   };

   GameOfLife.prototype.firstGlider = function(){
      this.setCellState(5, 2, 'live');
   	this.setCellState(5, 3, 'live');
   	this.setCellState(5, 4, 'live');
   	this.setCellState(5, 5, 'live');
      this.setCellState(6, 5, 'live');
   };

   GameOfLife.prototype.computeCellNextState = function(x, y){
      var liveDivs = 0;

      if ((x - 1) >= 0 && (y - 1) >= 0 && this.position(x - 1, y - 1).classList == 'live'){
         liveDivs++;
      };

      if ((y - 1) >= 0 && this.position(x, y - 1).classList == 'live'){
         liveDivs++;
      };

      if ((x + 1) < this.width && (y - 1) >= 0 && this.position(x + 1, y - 1).classList == 'live'){
         liveDivs++;
      };

      if ((x - 1) >= 0 && this.position(x - 1, y).classList == 'live'){
         liveDivs++;
      };


      if ((x + 1) < this.width && this.position(x + 1, y).classList == 'live'){
         liveDivs++;
      };

      if ((x - 1) >= 0 && (y + 1) < this.height && this.position(x - 1, y + 1).classList == 'live'){
         liveDivs++;
      };

      if ((y + 1) < this.height && this.position(x, y + 1).classList == 'live'){
         liveDivs++;
      };

      if ((x + 1) < this.width && (y + 1) < this.height && this.position(x + 1, y + 1).classList == 'live'){
         liveDivs++;
      };

      if(this.position(x, y).classList == 'live'){
   		if(liveDivs === 2 || liveDivs === 3){
   			return 1;
   		} else{
            return 0;
         };
      } else{
         if (liveDivs === 3){
            return 1;
         } else {
            return 0;
         };
      };
   };

   GameOfLife.prototype.computeNextGeneration = function(){
      var nextGen = [];
      for (var y = 0; y < this.height; y++){
         for (var x = 0; x < this.width; x++){
            nextGen.push(this.computeCellNextState(x, y));
         };
      };
      return nextGen;
   };

   GameOfLife.prototype.printNextGeneration = function(){
      var nextGen2 = this.computeNextGeneration();
      for (var i = 0; i < nextGen2.length; i++){
         if (nextGen2[i] === 1){
            this.cells[i].classList.add('live');
         } else{
            this.cells[i].classList.remove('live');
         };
      };
   };


   var startBtn = document.querySelector('#startBtn');
   startBtn.addEventListener('click', startGame);

   function startGame(e){

      while(board.firstChild){
         board.removeChild(board.firstChild);
      };

      var width = document.querySelector('#widthInput').value;
      var height = document.querySelector('#heightInput').value;
      var playBtn = document.querySelector('#play');
      var pauseBtn = document.querySelector('#pause');

      if (width < 10 || height < 10){
         alert('Wysokość i szerokość muszą mieć co najmniej 10 jednostek!')
      } else{
         var newGame = new GameOfLife(width, height);
         newGame.createBoard();
         newGame.firstGlider();
         playBtn.addEventListener('click', run);

         function run(e){
            var interval = setInterval(function(){
               newGame.printNextGeneration();
            }, 200);

            pauseBtn.addEventListener('click', stopGame);

            function stopGame(e){
               clearInterval(interval);
            }
         }
      };
   }
});
