function generateWinningNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

function shuffle(arr) {
    var m = arr.length, i;
    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
    this.swatchColor = "";
    this.numberColor = "";
    this.subtitleColor = "";
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(num) {
    console.log(num);
    if (typeof num !== 'number' || (1 > num) || (num > 100)) {
        throw "That is an invalid guess."
    }
    this.playersGuess = num;
    return this.checkGuess();
}

Game.prototype.checkGuess = function() {
    if (this.playersGuess === this.winningNumber) {
        $("#title").text("You Win!").css({ "color": "#FF6C03", "font-size": "7em"}).fadeIn();
        $("#subtitle").text("click reset to play again.");
        $('#hint, #submit, #player-input').prop("disabled", true);
        this.swatchColor = "FF8928";
        this.numberColor = "#7F3601";
    } else if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
        return "You have already guessed that number."
    } else if (this.pastGuesses.length > 4) {
        $("#title").text("You Lose!");
        $("#subtitle").text("click reset to play again.");
        $('#hint, #submit, #player-input').prop("disabled", true);
        // return "You Lose."
    } else {
        this.pastGuesses.push(this.playersGuess);
        $('#guesses ul li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
        var diffThisTurn = this.difference();
        if (diffThisTurn <= 10) {
            this.swatchColor = "#E8CA68";
            this.numberColor = "#664F05";
            this.subtitleColor = "#E5B10B";
            return "You\'re burning up!";
        } else if (diffThisTurn < 25) {
            this.swatchColor = "#E5FF64";
            this.numberColor = "#6A7F00";
            this.subtitleColor = "#D5FF00";
            return "You\'re lukewarm";
        } else if (diffThisTurn < 50) {
            this.swatchColor = "#6EE87B";
            this.numberColor = "#027512";
            this.subtitleColor = "#05F526";
            return "You\'re a bit chilly."
        } else {
            this.swatchColor = "#29FFE7";
            this.numberColor = "#037F79";
            this.subtitleColor = "#05FFF3";
            return "You\'re ice cold!";
        }
    }
}

Game.prototype.provideHint = function() {
    var hintArr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    // return shuffle(hintArr);
    return shuffle(hintArr);
}

function newGame() {
    return new Game();
}


$(document).ready(function() {
    var game = newGame();
    $('#submit').on('click', function() {
        var submission = +$('#player-input').val();
        $('#player-input').val('');
        var output = game.playersGuessSubmission(submission);
        $('#guesses ul li:nth-child(' + game.pastGuesses.length + ')').css({ "background-color": game.swatchColor, "color": game.numberColor });
        $("#subtitle").css({ "color": game.subtitleColor });
        $("#subtitle").text(output);
        console.log(output);

    })
    $("#hint").on('click', function() {
        var hintText = game.provideHint();
        $("#title").text('The winning number is either '+hintText[0]+", "+hintText[1]+", or "+hintText[2]).css({"font-size": "3em"});
        console.log(hintText);
        
    })
    $('#reset').on('click', function() {
        game = newGame();
        $("#guesses li").text("-").css({"color": "#554","background": "#dfc"});
        $("#title"). text("Guessing Game").css({"font-size": "7em","color": "#dfc"});
        $("#subtitle").text("Guess a number between one and a hundred").css({"color": "#fff", "font-size": "3em"});
        $('#hint, #submit, #player-input').prop("disabled",false);
        console.log('new game...');
    })
})
