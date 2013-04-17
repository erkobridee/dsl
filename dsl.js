// based on: https://gist.github.com/getify/603980
(function(global, oDOC) {

  if(typeof global.$DSL === 'undefined') {
    // dynamic script loader
    var dsl = {

      boot: function(scriptSrc, onSuccess, onError) {

        var handler
          , head = oDOC.head || oDOC.getElementsByTagName('head');
 
        setTimeout(function () {

          if ("item" in head) { // check if ref is still a live node list
            
            if (!head[0]) { // append_to node not yet ready
              setTimeout(arguments.callee, 25);
              return;
            }

            head = head[0]; // reassign from live node list ref to pure node ref - avoids nasty IE bug where changes to DOM invalidate live node lists
          }

          var scriptElem = oDOC.createElement('script');
          scriptElem.type = 'text/javascript';

          // based on: http://www.nczonline.net/blog/2009/07/28/the-best-way-to-load-external-javascript/
          if (scriptElem.readyState) { //IE
            scriptElem.onreadystatechange = function() {
              if (scriptElem.readyState == "loaded" || scriptElem.readyState == "complete") {
                scriptElem.onreadystatechange = null;
                onSuccess();
              } else {
                onError();
              }
            };
          } else {  //Others            
            scriptElem.onload = function() {
              scriptElem.onload = scriptElem.onerror = null;
              onSuccess();
            };
            scriptElem.onerror = function() {
              scriptElem.onload = scriptElem.onerror = null;
              onError();
            }
          }

          scriptElem.src = scriptSrc;
          head.insertBefore(scriptElem, head.firstChild);

        }, 0);
         
        // required: shim for FF <= 3.5 not having document.readyState
        if (oDOC.readyState == null && oDOC.addEventListener) {
          oDOC.readyState = "loading";
          oDOC.addEventListener("DOMContentLoaded", handler = function () {
            oDOC.removeEventListener("DOMContentLoaded", handler, false);
            oDOC.readyState = "complete";
          }, false);
        }   

      },

      load: function(scriptSrc, completeHandler, failHandler) {

        function onSuccessHandler() {
          completeHandler();
        }

        function onErrorHandler() {
          failHandler();
        }

        dsl.boot(scriptSrc, onSuccessHandler, onErrorHandler);

      }

    };

    global.$DSL = dsl;
  }

})(window, document);