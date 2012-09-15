var app = angular.module('app', ['ngResource'], function($routeProvider) {

  $routeProvider.when('/comic/:comicId', {
    templateUrl : 'partials/comics.html'
  })

  $routeProvider.otherwise({
    redirectTo : '/comic/5'
  })
})

function ComicsController ($scope, $routeParams) {
  var comicId = parseInt($routeParams.comicId, 10)
  $scope.previousId = Math.max(comicId - 1, 0)
  $scope.nextId = comicId + 1

  $scope.list = [-2, -1, 0, 1, 2].map(function (adjustment) {
    return comicId + adjustment
  })
}

function ComicController ($scope, $routeParams, Comics) {
  Comics.query($scope.comicId, function (comic) {
    $scope.comic = comic
  })
}


var jsonp = (function () {
  var next = 0
  return function (cb) {
    var id = "jsonpHandlers" + next
    window[id] = function () {
      cb.apply(null, arguments)
      delete window[id]
    }
    next++
    return id
  }
}())


app.factory("Comics", function ($http, $resource) {
  var cache = {}
  return {
    query: function (comicId, cb) {
      if (cache[comicId]) return cb(cache[comicId])
      console.log("fetch", comicId)
      $http.jsonp("http://dynamic.xkcd.com/api-0/jsonp/comic/" + comicId + "?callback=" + jsonp(function (comic) {
        cache[comicId] = comic
        cb(comic)
      }))
    }
  }
})
