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

  Comics.query(comicId, function (comic) {
    $scope.comic = comic

  })
}


var jsonp = (function () {
  var next = 0
  return {
    getHandler: function (cb) {
      var id = "jsonpHandlers" + next
      window[id] = function () {
        cb.apply(null, arguments)
        delete window[id]
      }
      next++
      return id
    }
  }
}())


app.factory("Comics", function ($http, $resource) {
  return {
    query: function (comicId, cb) {
      $http.jsonp("http://dynamic.xkcd.com/api-0/jsonp/comic/" + comicId + "?callback=" + jsonp.getHandler(cb))
    }
  }
})
