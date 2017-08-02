(function($) {
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  function launchIntoFullscreen(element) {
    if(element.requestFullscreen) {
      element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  function exitFullscreen() {
    if(document.exitFullscreen) {
      document.exitFullscreen();
    } else if(document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if(document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  var GAME = {
    'STARTED': 1,
    'DONE':    2
  };

  var MESSAGE = {
    'CLEAR': '',
    'START': 'Type the word you see on the screen',
    'ENTER': 'Press Enter to continue'
  };

  function Game(wordList) {
    this.wordList = wordList;
  }

  Game.prototype.postMessage = function (message) {
    $('.message').text(message)
  };

  $('#start').on('click', function(e) {
    var game = new Game();

    launchIntoFullscreen(document.documentElement);

    if ($('.overlay').requestFullscreen) {
      $('.overlay').requestFullscreen();
    }

    $('.prompt').text('');
    var wordList = $('#words').val();
    var words = wordList.split('\n');
    var selectedWord = words[getRandomInt(0, words.length)].toUpperCase();
    var input = [];

    var gameState = GAME.STARTED;

    function init() {
      $('.emoji').text('');
      selectedWord = words[getRandomInt(0, words.length)].toUpperCase();
      $(".selected-word").text(selectedWord);
      game.postMessage(MESSAGE.START);
      input = [];
      renderPrompt();
      gameState = GAME.STARTED;
    }

    function renderPrompt() {
      var prompt = input.join('') || '';
      $(".prompt").text(prompt);
    }

    function isValidChar(c) {
      if (c > 64 && c < 91) {
        return true;
      }
      else if (c > 96 && c < 123) {
        return true;
      }
      else if (c > 47 && c < 58) {
        return true;
      }
      else {
        return false;
      }
    }

    $("#overlay").show();
    $(".selected-word").text(selectedWord);

    $(window).keydown(function(e) {
      if (e.which === 8 && gameState === GAME.STARTED) {
        input.pop();
        renderPrompt();
      }
      else if (e.which === 13 && gameState === GAME.DONE) {
        init();
      }
      else if (isValidChar(e.which) && gameState === GAME.STARTED) {
        var char = String.fromCharCode(e.which);
        input.push(char);
        renderPrompt();

        if (input.length) {
          game.postMessage(MESSAGE.CLEAR);
        }
        else {
          game.postMessage(MESSAGE.START);
        }

        var inputWord = input.join('');
        if (inputWord === selectedWord) {
          gameState = GAME.DONE;
          $('.emoji').text('😀');
          game.postMessage(MESSAGE.ENTER);
        }

      }
    });

    console.log(words);
  });

  $('#close').on('click', function(e) {
    exitFullscreen();
    $('.overlay').hide();
  });
})($);
