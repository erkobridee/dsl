(function(global, oDOC) {

  if(typeof global.$DSL === 'undefined') {
    
    // dynamic script loader    
    global.$DSL = (function() {

      function DSL() {};

      DSL.DEBUG = false;

      // static
      DSL.load = function(scriptSrc, onSuccess, onError) {

        if(typeof scriptSrc === 'string') {
          
          scriptSrcString(scriptSrc, onSuccess, onError);
        
        } else if((typeof scriptSrc === 'object') && (scriptSrc instanceof Array)) {
          
          scriptSrcArray(scriptSrc, onSuccess, onError);
        
        } else { console.log(scriptSrc + ' : unknown'); }

      }

      // private 

      function scriptSrcString(scriptSrc, onSuccess, onError) {

        function localSuccess(msg) {
          displayMsg(msg);
          executeCallback(onSuccess);
        }

        function localError(msg) {
          displayMsg(msg);
          executeCallback(onError);
        }

        boot(scriptSrc, localSuccess, localError);

      }

      function scriptSrcArray(scriptArr, onSuccess, onError) {
        var i = 0
          , length = scriptArr.length
          ;

        function loadScript() {
          boot(scriptArr[i], localSuccess, localError);
        }

        function localSuccess(msg) {
          displayMsg(msg);
          executeCallback(onSuccess);
        }

        function localError(msg) {
          displayMsg(msg);

          if(i < length) {
            i++;
            loadScript();
          } else {
            executeCallback(onError);
          }
        }

        loadScript();       

      }

      function displayMsg(msg) {
        if(DSL.DEBUG && (typeof msg === 'string')) { console.log(msg); }        
      }

      function executeCallback(callback) {
        if(typeof callback === 'function') { callback(); }
      }

      // based on: https://gist.github.com/getify/603980
      function boot(scriptSrc, onSuccess, onError) {

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
                onSuccess( scriptElem.src + ' : success' );
              } else {
                scriptElem.onreadystatechange = null;
                onError( scriptElem.src + ' : fail' );
              }
            };
          } else {  //Others            
            scriptElem.onload = function() {
              scriptElem.onload = scriptElem.onerror = null;
              onSuccess( scriptElem.src + ' : success' );
            };
            scriptElem.onerror = function() {
              scriptElem.onload = scriptElem.onerror = null;
              onError( scriptElem.src + ' : fail' );
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

      }

      return DSL;

    })();

  }

})(window, document);