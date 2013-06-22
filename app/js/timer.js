angular.module('timer', [])
  .directive('timer', function ($rootScope, $timeout, $compile) {
    return  {
      restrict: 'E',
      replace: false,
      scope: {
          interval: '=interval',
          countdownattr: '=countdown',
          intervalevent: '=intervalevent'
      },
      controller: function ($rootScope, $scope, $element) {
        if ($element.html().trim().length === 0) {
          $element.append($compile('<span>{{millis}}</span>')($scope));
        }

        $scope.startTime = null;
        $scope.timeoutId = null; 
        $scope.countdown = $scope.countdownattr && parseInt($scope.countdownattr, 10) > 0 ? parseInt($scope.countdownattr, 10) : undefined;
        $scope.isRunning = false;
        $scope.intervalEvents = 0;      

        $scope.$on('timer-start', function (){
          $scope.start();
        });

        $scope.$on('timer-resume', function (){
          $scope.resume();
        });

        $scope.$on('timer-stop', function (){
          $scope.stop();
        });
        
        //example only: should consume this event in your controller
        $scope.$on('event:timer-interval', function () {
        		$scope.intervalEvents++        		
        });
        
        function resetTimeout() {
          if ($scope.timeoutId) {
            $timeout.cancel($scope.timeoutId);
          }  
        }

        $scope.start = $element[0].start = function () {
          $scope.startTime = new Date();
          resetTimeout();
          tick();
        };

        $scope.resume = $element[0].resume = function () {
          resetTimeout();
          $scope.startTime = new Date() - ($scope.stoppedTime - $scope.startTime);
          tick();
        };

        $scope.stop = $element[0].stop = function () {
          $scope.stoppedTime = new Date();
          $timeout.cancel($scope.timeoutId);
          $scope.timeoutId = null;
        };

        $element.bind('$destroy', function () {
          $timeout.cancel($scope.timeoutId);
        });

        var tick = function (){
            if ($scope.countdown > 0) {
                $scope.countdown--;
            }
            else if ($scope.countdown <= 0) {
                $scope.stop();
            }
            $scope.millis = new Date() - $scope.startTime;
            $scope.seconds = Math.floor(($scope.millis / 1000) % 60) ;
            $scope.minutes = Math.floor((($scope.millis / (1000*60)) % 60));
            $scope.hours = Math.floor((($scope.millis / (1000*60*60)) % 24));
            
            if($scope.intervalevent != undefined && $scope.intervalevent) {
            	$rootScope.$broadcast('event:timer-interval');            	
          	}
            
            $scope.timeoutId = $timeout(function () {
              tick();
            }, $scope.interval);
        };

        $scope.start();
      }
    };
  });