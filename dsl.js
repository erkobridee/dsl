(function(global, oDOC) {

  if(typeof global.$DSL === 'undefined') {
    
    // dynamic script loader    
    global.$DSL = (function() {

      var STRING_CONST = 'string',
          SCRIPT_CONST = 'script',
          SCRIPT_JS_TYPE = 'text/javascript';

      function DSL() {}

      DSL.isIe = !!global.ActiveXObject;

      DSL.DEBUG = false;
      DSL.JS_CHECK = true; // JS already loaded?

      // static

      DSL.load = function(scriptSrc, onSuccess, onError) {
        var typeofScript = typeof scriptSrc;

        if(typeofScript === STRING_CONST) {
          
          process([scriptSrc], onSuccess, onError);
        
        } else if((typeofScript === 'object') && (scriptSrc instanceof Array)) {
          
          process(scriptSrc, onSuccess, onError);
        
        } else { displayMsg(scriptSrc + ' : unknown'); }

      };

      // private 
      
      function displayMsg(msg) {
        if(DSL.DEBUG && (typeof msg === STRING_CONST)) { console.log(msg); }        
      }

      function executeCallback(callback) {
        if(typeof callback === 'function') { callback(); }
      }

      function getTagByName(tagName) {
        return oDOC.getElementsByTagName(tagName);
      }

      function getScriptName(scriptSrc) {
        return scriptSrc.replace( /.+\/|\.min\.js|\.js|\?.+|\W/gi , '');
      }

      function resetScriptHandlers(scriptElem) {
        scriptElem.onreadystatechange = scriptElem.onload = scriptElem.onerror = null;
      }

      function checkNotAvailableScript(scriptScr) {

        var localScript,
            localScriptName,
            localScriptSrc,
            scriptName = getScriptName(scriptScr),
            scripts = getTagByName(SCRIPT_CONST),
            i = (scripts.length - 1),
            notAvailableFlag = true;

        displayMsg("search: " + scriptName + " >> " + scriptScr);

        while(i-- > 0) {
          localScript = scripts[i];
          localScriptSrc = localScript.src;

          if((localScript.type !== SCRIPT_JS_TYPE) || (localScriptSrc.length === 0)) continue;

          localScriptName = getScriptName(localScriptSrc);

          displayMsg(localScriptName + " >> " + localScriptSrc);

          if(scriptName == localScriptName) { 
            notAvailableFlag = false;
            displayMsg('script already loaded: ' + scriptName);
            break; 
          }
        }

        return notAvailableFlag;
      }

      function process(scriptArr, onSuccess, onError) {
        
        var i = 0,
            length = scriptArr.length,
            scriptSrc = '',
            notAvailableFlag = true;

        function loadScript() {
          scriptSrc = scriptArr[i];

          if(!DSL.isIe && DSL.JS_CHECK) notAvailableFlag = checkNotAvailableScript(scriptSrc);

          if(notAvailableFlag) {
            injectScript(scriptSrc, localSuccess, localError);
          } else {
            localSuccess();            
          }
        }

        function localSuccess() {
          if(notAvailableFlag) displayMsg(scriptSrc + ' : success');
          executeCallback(onSuccess);
        }

        function localError() {
          displayMsg(scriptSrc + ' : fail');

          if(i < length) {
            i++;
            loadScript();
          } else {
            executeCallback(onError);
          }
        }

        loadScript();       

      }

      // based on: https://gist.github.com/getify/603980
      function injectScript(scriptSrc, onSuccess, onError) {

        var handler,
            head = oDOC.head || getTagByName('head');
 
        setTimeout(function () { // inject script process

          if ("item" in head) { // check if ref is still a live node list
            
            if (!head[0]) { // append_to node not yet ready
              setTimeout(arguments.callee, 25);
              return;
            }

            head = head[0]; // reassign from live node list ref to pure node ref - avoids nasty IE bug where changes to DOM invalidate live node lists
          }

          var scriptElem = oDOC.createElement(SCRIPT_CONST);

          scriptElem.type = SCRIPT_JS_TYPE;

          // based on: http://www.nczonline.net/blog/2009/07/28/the-best-way-to-load-external-javascript/
          if (scriptElem.readyState) { //IE
            scriptElem.onreadystatechange = function() {
              //if (scriptElem.readyState == "loaded" || scriptElem.readyState == "complete") {
              if ( /de|te/.test( scriptElem.readyState ) ) {
                resetScriptHandlers(scriptElem);
                onSuccess();
              } else {
                resetScriptHandlers(scriptElem);
                onError();
              }
            };
          } else {  //Others            
            scriptElem.onload = function() {
              resetScriptHandlers(scriptElem);
              onSuccess();
            };
            scriptElem.onerror = function() {
              resetScriptHandlers(scriptElem);
              onError();
            };
          }

          scriptElem.src = scriptSrc;
          head.insertBefore(scriptElem, head.firstChild);

        }, 0);
         
        // required: shim for FF <= 3.5 not having document.readyState
        if (oDOC.readyState === null && oDOC.addEventListener) {
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