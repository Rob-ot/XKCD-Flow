var app = angular.module('app', ['ngResource'], function($routeProvider) {

  $routeProvider.when('/comic/:comicId', {
    templateUrl : 'partials/comic.html',
    controller : ComicController
  })

  $routeProvider.otherwise({
    redirectTo : '/comic/1'
  })
})


function ComicController ($scope, $routeParams) {
  $scope.comicId = $routeParams.comicId
  $scope.previousId = $routeParams.comicId - 1
  $scope.nextId = $routeParams.comicId + 1

}


app.factory("Comics"), function ($http, $resource) {
  var Comics = $resource("http://dynamic.xkcd.com/api-0/jsonp/comic/1", {
    get: {method: "JSONP"}
  })

  return Comics
}