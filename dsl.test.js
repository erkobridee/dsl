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
        var scriptUrl = 'http://code.angularjs.org/unknow/angular.js';

        actions.load(
          'http://code.angularjs.org/unknow/angular.js',
          actions.finish,
          actions.load(
            'http://code.angularjs.org/1.1.4/angular.js',
            actions.finish,
            function() {
              alert('PANIC!');
            }
          )
        );

      }
    };
    
    actions.init();

  }

})();