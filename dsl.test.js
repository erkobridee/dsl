(function() {

  if(typeof $DSL !== 'undefined') {
    console.log('$DSL is defined');

    var actions = {
      
      load: function(scriptUrl, onCompleted, onFailed) {
        $DSL.load(
          scriptUrl,
          onCompleted,
          onFailed
        );
      },

      finish: function() {
        var msg = 'DSL script load finished';
        console.log(msg);
        alert(msg);
      },

      init: function() {

        // load angular.js from list (fallback)
        actions.load(
          [
            'http://code.angularjs.org/unknow/angular.js', 
            'http://code.angularjs.org/1.1.4/angular.js',
            '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.1.3/angular.js'
          ],
          actions.finish
        );

      }
    };
    
    $DSL.DEBUG = true;
    actions.init();

  }

})();