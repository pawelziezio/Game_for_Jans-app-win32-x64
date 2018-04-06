const memoryGame = {
  	choiceItem: "",//wybrany katalog z *.png
 	cardCount: 20, //liczba kart w grze
  	divBoard: null, //div z planszą gry
  	divScore: null, //div z wynikiem gry
  	cards: [], //tutaj trafi wymieszana tablica klocków
  	cardsChecked: [], //zaznaczone klocki
  	moveCount: 0, //liczba ruchów
  	imageNames: [
    	//png dla kart
    	"d1.png",
    	"d2.png",
		"d3.png",
		"d4.png",
		"d5.png",
		"d6.png",
		"d7.png",
		"d8.png",
		"d9.png",
		"d10.png"
	],
  	canGet: true, //czy można klikać na karty
  	cardPairs: 0, //liczba dopasowanych kart

 	cardClick: function(e) {
    	//jeżeli jeszcze nie pobraliśmy 1 elementu
    	//lub jeżeli index tego elementu nie istnieje w pobranych...
    	if (this.canGet && e.target.dataset.index) {
      		if (
        		!this.cardsChecked[0] ||
        		this.cardsChecked[0].dataset.index !== e.target.dataset.index
      		) {
        		this.cardsChecked.push(e.target);

        		//nadajemy background tyle karty
				e.target.nextElementSibling.style.backgroundImage ="url(./photos/" + this.choiceItem + "/" + this.imageNames[e.target.dataset.cardtype] +")";

        		//obracamy kartę
        		e.target.style.transform = "rotateY(180deg)";
        		e.target.nextElementSibling.style.transform = "rotateY(360deg)";
      		}

      		if (this.cardsChecked.length === 2) {
        		this.canGet = false;
        		if (this.cardsChecked[0].dataset.cardtype === this.cardsChecked[1].dataset.cardtype) {
          			setTimeout(this.deleteCards.bind(this), 300);
        		} else {
          			setTimeout(this.resetCards.bind(this), 800);
        		}

        		this.moveCount++;
        		this.divScore.innerHTML = this.moveCount;
      		}
    	}
  	},

  	deleteCards: function() {
		const sound = new Audio("./mp3/10375.mp3");
		sound.play();

    	this.cardsChecked[0].parentElement.style.transform = "scale(0,0)";
    	this.cardsChecked[1].parentElement.style.transform = "scale(0,0)";

    	setTimeout(function() {
        	this.cardsChecked[0].parentElement.remove();
        	this.cardsChecked[1].parentElement.remove();
        	this.cardsChecked = [];
        	this.canGet = true;
      		}.bind(this),300
    	);
		
		this.cardPairs++;

		// sprawdzamy czy koniec
    	if (this.cardPairs >= this.cardCount / 2) {
	  		this.finishGame();
		}
	},

  	resetCards: function() {
    	//obracamy karty ponownie
    	this.cardsChecked[0].style.transform = "rotateY(0deg)";
    	this.cardsChecked[0].nextElementSibling.style.transform = "rotateY(180deg)";

    	this.cardsChecked[1].style.transform = "rotateY(0deg)";
    	this.cardsChecked[1].nextElementSibling.style.transform = "rotateY(180deg)";

    	// zabieramy tło ... chyba tylko dla treningu
    	setTimeout(
      		function() {
        	this.cardsChecked[0].nextElementSibling.style.backgroundImage = "none";
        	this.cardsChecked[1].nextElementSibling.style.backgroundImage = "none";
        	this.cardsChecked = [];
        	this.canGet = true;
      	}.bind(this),300);
	},

	startGame: function() {
    	//czyścimy
    	this.divBoard = document.querySelector(".game-board");
    	this.divBoard.innerHTML = "";

    	//czyścimy ruchy
    	this.divScore = document.querySelector(".game-score");
    	this.divScore.innerHTML = "0";

    	//czyścimy zmienne (gra może się zacząć ponownie)
    	this.cards = [];
    	this.cardsChecked = [];
    	this.moveCount = 0;
		this.canGet = true;
		this.cardPairs = 0;

    	//generujemy tablicę numerów kocków (parami)
    	for (let i = 0; i < this.cardCount; i++) {
      		this.cards.push(Math.floor(i / 2));
    	}

    	// funkcja mieszająca tablicę
    	const mixArray = function(array) {
      		const result = [];
      		const tempArray = [...array];
      		let randomIndex = 0;
      		let item = 0;

      		for (let i = 0; i < array.length; i++) {
        		randomIndex = Math.floor(Math.random() * tempArray.length);
        		item = tempArray.splice(randomIndex, 1);
        		result.push(...item);
      		}

			  return result;
    	};

    	// mieszmy wartości w tablicy - funkcja powayżej
    	this.cards = mixArray(this.cards);

    	// budujemy divy z kartami + dataset
    	let divsBox = ``;
    	for (let i = 0; i < this.cardCount; i++) {
      		divsBox += `
				<div class="card-box">
					<div class="card-content" data-cardtype=${this.cards[i]} data-index=${i}>
						<div class="card-front" data-cardtype=${this.cards[i]} data-index=${i}></div>
						<div class="card-back"></div>
					</div>
				</div>`;
    	}

    	// wstawiamy divy z kartami
    	this.divBoard.innerHTML = divsBox;

    	const gameBoard = document.querySelector(".game-board");
    	gameBoard.addEventListener("click", this.cardClick.bind(this));
  	},

	//wybieramy jakimi kartami chcemy grać
 	choice: function() {
    	const gameChoice = document.querySelector(".game-choice");
    	gameChoice.addEventListener("click",function(e) {
        	e.preventDefault();
        	this.choiceItem = e.target.dataset.photos;

			if (this.choiceItem) {
        		gameChoice.classList.add("displayNone");
          		this.startGame();
       		}
      	}.bind(this));
  	},

	//start od początku na kliknięcie w ikonę - prawy górmny róg
  	restartGame: function() {
    	const gameChoice = document.querySelector(".game-choice");
    	const gameBoard = document.querySelector(".game-board");
    	gameChoice.classList.remove("displayNone");

    	while (gameBoard.firstChild) {
      		gameBoard.removeChild(gameBoard.firstChild);
    	}

    	this.moveCount = 0;
    	this.divScore = document.querySelector(".game-score");
    	this.divScore.innerHTML = this.moveCount;
  	},

	//koniec gry - wyskakuje modal
	finishGame: function(){
		// modal on finish
		const modal = document.getElementById("myModal");
		const btn = document.getElementById("myBtn");
		const span = document.getElementsByClassName("close")[0];
		const divScoreModal = document.querySelector('.game-score-modal');

		//barwa na koniec
		const sound = new Audio("./mp3/applause.mp3");
		sound.play();

		modal.style.display = "block";
		divScoreModal.innerHTML = this.moveCount;

		//chowamy modal
		span.addEventListener("click", function() {
	  		modal.style.display = "none";
		});

		window.addEventListener("click", function(event) {
	  		if (event.target == modal) {
				modal.style.display = "none";
	  		}
		})
 	}
}

document.addEventListener("DOMContentLoaded", function() {
  	memoryGame.choice();

	//po click na iconę prayw górny róg - gra od początku
  	const restartGame = document.querySelector(".restart");
  	restartGame.addEventListener("click", function(e) {
    	e.preventDefault();
    	memoryGame.restartGame();
  	})
})
