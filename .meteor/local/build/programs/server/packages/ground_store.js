(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

/* Package-scope variables */
var Store;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/ground_store/storage.scope.js                            //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
// Define the Storage scope
Store = {};
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['ground:store'] = {}, {
  Store: Store
});

})();

//# sourceMappingURL=ground_store.js.map
