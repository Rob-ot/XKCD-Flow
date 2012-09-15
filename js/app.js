var app = angular.module('app', ['ngResource'], function($routeProvider) {

  $routeProvider.when('/comic/:comicId', {
    templateUrl : 'partials/comic.html',
    controller : ComicController
  })

  $routeProvider.otherwise({
    redirectTo : '/comic/1'
  })
})


function ComicController ($scope, $routeParams, Comics) {
  var comicId = parseInt($routeParams.comicId, 10)
  $scope.comicId = comicId
  $scope.previousId = Math.max(comicId - 1, 0)
  $scope.nextId = comicId + 1

  Comics.query(function () {

  })
}


app.factory("Comics", function ($http, $resource) {
  var Comics = $resource("http://dynamic.xkcd.com/api-0/jsonp/comic/1",
    {callback:'JSON_CALLBACK'},
    {query:{method:'JSONP'}})

  return Comics
})
