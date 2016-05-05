(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var MongoID = Package['mongo-id'].MongoID;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var Random = Package.random.Random;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var EJSON = Package.ejson.EJSON;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var MiniMax = Package['ground:minimax'].MiniMax;

/* Package-scope variables */
var _groundUtil, Ground;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/ground_util/util.common.js                               //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
/* global _groundUtil:true */
/* global Ground:true */
// Define the utillity scope
_groundUtil = {};

// New ground scope
Ground = {};

// Meteor.Collection or Mongo.Collection
_groundUtil.Collection = (typeof Mongo !== 'undefined')?
        Mongo.Collection: Meteor.Collection;


///////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/ground_util/util.server.js                               //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
// Define server specifics

///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['ground:util'] = {}, {
  _groundUtil: _groundUtil,
  Ground: Ground
});

})();

//# sourceMappingURL=ground_util.js.map
