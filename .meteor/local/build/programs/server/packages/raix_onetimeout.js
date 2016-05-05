(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

/* Package-scope variables */
var OneTimeout;

(function(){

////////////////////////////////////////////////////////////////////////
//                                                                    //
// packages/raix_onetimeout/onetimeout.js                             //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                                                                      //
OneTimeout = function(delay) {
  if (typeof delay === 'undefined') {
    throw new Error('New api');
  }
  // Pointer to Meteor.setTimeout
  var id = null;
  // Save the methods into the localstorage
  return function oneTimeout(f) {
    // If a timeout is in progress
    if (id !== null) {
      // then stop the current timeout - we have updates
      Meteor.clearTimeout(id);
    }
    // Spawn new timeout
    id = Meteor.setTimeout(function runOneTimeout() {
      // Ok, we reset reference so we dont get cleared and go to work
      id = null;
      // Run function
      f();
      // Delay execution a bit
    }, delay);
  };
};

////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['raix:onetimeout'] = {}, {
  OneTimeout: OneTimeout
});

})();

//# sourceMappingURL=raix_onetimeout.js.map
