(function() {
var app = angular.module('signally', []);

app.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});

app.controller('AppController', function() {
    this.signals = signals;
});

app.controller('SignalController', function() {
    this.signal = {};
    this.addSignal = function(signal) {
        var phrase = this.signal.phrase;
        //TODO: This secure?
        console.log(phrase);
        phrase = phrase.replace(/<(?:.|\n)*?>/gm, '');
        this.signal.phrase = phrase;
        var signal = {
            person: this.signal.person,
            topic: this.signal.topic,
            phrase: phrase
        }
        console.log(signal);
        signals.push(signal);
        this.signal.phrase = "";
    };
});

var signals = [{
    phrase: 'stuff'
    }, {
    phrase: 'more stuff'
    }
];

app.directive('contenteditable', ['$sce', function($sce) {
    return {
      restrict: 'A', // only activate on element attribute
      require: '?ngModel', // get a hold of NgModelController
      link: function(scope, element, attrs, ngModel) {
        if (!ngModel) return; // do nothing if no ng-model

        // Specify how UI should be updated
        ngModel.$render = function() {
          element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
        };

        // Listen for change events to enable binding
        element.on('blur keyup change', function() {
          scope.$evalAsync(read);
        });
        element.on('keydown',function (event) {
            if (event.which == 13) {
                $("#phraseform").find('[type=submit]').trigger('click');
            }
        });

        read(); // initialize

        // Write data to the model
        function read() {
          var html = element.html();
          // When we clear the content editable the browser leaves a <br> behind
          // If strip-br attribute is provided then we strip this out
          if ( attrs.stripBr && html == '<br>' ) {
            html = '';
          }
          ngModel.$setViewValue(html);
        }
      }
    };
  }]);
})();
