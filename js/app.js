var app = angular.module('app', ['ngResource'], function($routeProvider) {

  $routeProvider.when('/comic/:comicId', {
    templateUrl : 'partials/comics.html'
  })

  $routeProvider.otherwise({
    redirectTo : '/comic/5'
  })
})


var masterComics = []


function ComicsController ($scope, $routeParams, Comics) {
  var adjustment = 2

  var comicId = parseInt($routeParams.comicId, 10)

  $scope.previousId = Math.max(comicId - 1, 0)
  $scope.nextId = comicId + 1

  $scope.comics = masterComics

  var comics = Comics.getRange(comicId - adjustment, comicId + adjustment)
  var comicsLength = comics.length

  // replace the contents of masterComics with the contents of comics
  while (masterComics.pop()) {}
  while (masterComics.push(comics.pop()) < comicsLength) {}

  console.log($scope.comics)
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
    // will return (empty if needed) objects now, and update them by ref later
    getRange: function (low, high) {
      var results = []
      for (var i = low; i <= high; i++) {
        if (!cache[i]) {
          cache[i] = {}
          this.query(i, (function (cachedComicObject) {
            return function (comic) {
              // update existing object, dont make a new one it needs to be by ref
              _.extend(cachedComicObject, comic)
            }
          }(cache[i])))
        }
        results.push(cache[i])
      }
      return results
    },

    query: function (comicId, cb) {
      // xkcds api doesn't like fancy characters which the regular jsonp uses, so use this
      $http.jsonp("http://dynamic.xkcd.com/api-0/jsonp/comic/" + comicId + "?callback=" + jsonp(function (comic) {
        cb(comic)
      }))
    }
  }
})
