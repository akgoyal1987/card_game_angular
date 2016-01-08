(function() {
  'use strict';

  angular
    .module('game')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, webDevTec, toastr, $rootScope, $scope) {
    var colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#abeebb', '#966975', '#7a5d5a', '#fddfd3', '#a8c093', '#b08e7b', '#abcdef', '#456789', '#6d7f00', '#b19bd9', '#2e1b48', '#fdb058', '#FF9780', '#008080', '#A52A2A', '#B8860B', '#8A2BE2'];
    var cards = [];
    var stateOpen = 'open';
    var stateClose = 'close';
    var stateMatch = 'match';
    $scope.btnText = "Start";
    $scope.enableStartButton = true;   

    var preparePlayGround = function(){

      $scope.moves = 0;
    $scope.time = 0;
    $scope.finished = false;

      for(var i=0; i<18 ; i++){
        var rand = Math.floor(Math.random() * (colors.length-1)); 
        cards.push({color : colors[rand], id : rand, state : stateClose});
        cards.push({color : colors[rand], id : rand, state : stateClose});
      }
      var i = cards.length, j, temp;
      while ( --i ){
        j = Math.floor( Math.random() * (i - 1) );
        temp = cards[i];
        cards[i] = cards[j];
        cards[j] = temp;
      }
      $scope.cards = angular.copy(cards);     
    }
    preparePlayGround();

    var timeTicker;
    $scope.start = function(){
      $scope.enableStartButton = false;  
      if($scope.btnText == "Restart"){
        preparePlayGround();
      }
      var timeTick = function(){
        timeTicker = $timeout(function() {
          $scope.time++;
          timeTick();
        }, 1000);
      } 
      timeTick();
    }


    var openCards = [];
    $scope.finished = false;
    $scope.cardClick = function(card){
      if($scope.finished || $scope.enableStartButton || card.state === stateMatch || card.state === stateOpen){
        return;
      }
      if(openCards.length === 0){
        card.state = stateOpen;
        openCards.push(card);
      }else if(openCards.length == 1){
        card.state = stateOpen;
        $scope.moves++;

        openCards.push(card);
        if(openCards[0].id === openCards[1].id){
          openCards[0].state = stateMatch;
        openCards[1].state = stateMatch;        
        openCards = [];
        cards.splice(cards.indexOf(openCards[0]), 1);
        cards.splice(cards.indexOf(openCards[1]), 1);
        if(cards.length === 0){
          $scope.finished = true;
          $scope.message = "Congratulations you have won the game !!!";
          $timeout.cancel(timeTicker);
          $scope.btnText = "Restart";
          $scope.enableStartButton = true;
        }
        }else{
          $timeout(function() {
            openCards[0].state = stateClose;
          openCards[1].state = stateClose;
          openCards = [];         
          }, 1000);
        }

      }
    }
  }
})();
