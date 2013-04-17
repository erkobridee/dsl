(function() {

  if(typeof $DSL !== 'undefined') {
    console.log('$DSL is defined');

    var actions = {
      
      load: function(scriptUrl, onCompleted) {
        $DSL.load(
          scriptUrl,
          onCompleted
        );
      },

      checkUndefined: function(objectName) {
        var flag = false;
        
        if(typeof window[objectName] === 'undefined') {
          flag = true;
        } 

        return flag;
      },

      finish: function() {
        var msg = 'DSL script load finished';
        console.log(msg);
        alert(msg);
      },

      init: function() {
        var scriptUrl = 'http://code.angularjs.org/unknow/angular.js';

        actions.load(
          scriptUrl,
          function() {
            actions.finish();
          }
        );

        if(actions.checkUndefined('angular')) {         
          console.log('call fallback js');

          // fallback
          scriptUrl = 'http://code.angularjs.org/1.1.4/angular.js';
          actions.load(
            scriptUrl, 
            function() {
              actions.finish();
            }
          );
        } else {
          actions.finish();
        }

      }
    };

    actions.init();

  }

})();