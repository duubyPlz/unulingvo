(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var EJSON = Package.ejson.EJSON;
var _groundUtil = Package['ground:util']._groundUtil;
var Ground = Package['ground:util'].Ground;
var ServerTime = Package['ground:servertime'].ServerTime;
var EventEmitter = Package['raix:eventemitter'].EventEmitter;
var OneTimeout = Package['raix:onetimeout'].OneTimeout;
var MiniMax = Package['ground:minimax'].MiniMax;
var Store = Package['ground:store'].Store;

/* Package-scope variables */
var _groundDbConstructor, GroundDB;

(function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/ground_db/groundDB.server.js                                            //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
/* global _groundDbConstructor:true */
/*


TODO:
  `Meteor.default_server` - `Meteor.server`

*/
///////////////////////////////// TEST SCOPE ///////////////////////////////////

Meteor.server = Meteor.server || Meteor.default_server; // jshint ignore:line

//////////////////////////////// GROUND DATABASE ///////////////////////////////

_groundDbConstructor = function(collection, options) { // jshint ignore:line
  var self;
  // XXX: Write the grounddb constructor


  // // This is the basic interface allowing users easily access for handling
  // // method calls, this.super() is the super and this.collection is self
  // // TODO: Remove this section to the README
  // self.conflictHandlers = (options && options.conflictHandlers)?
  //       options.conflictHandlers: {
  //   'insert': function(doc) {
  //     //console.log('insert');
  //     //console.log(doc);
  //     this.super(doc);
  //   },
  //   'update': function(id, modifier) {
  //     //console.log('update');
  //     //console.log(id);
  //     //console.log(modifier);
  //     this.super(id, modifier);
  //   },
  //   'remove': function(id) {
  //     //console.log('remove');
  //     //console.log(id);
  //     this.super(id);
  //   }
  // };

  // // Create overwrite interface
  // _.each(['insert', 'update', 'remove'], function(name) {
  //   // TODO: init default conflict handlers
  //   //self.conflictHandlers[name] = function() {
  //   //  this.super.apply(this, arguments);
  //   //};

  //   // Save super
  //   var _super = Meteor.default_server.method_handlers['/'+self.name+'/'+name];
  //   // Overwrite
  //   Meteor.default_server.method_handlers['/'+self.name+'/'+name] = function() {
  //     var _this = this;
  //     _this.collection = self;
  //     _this.super = _super;
  //     // Call the conflicthandlers
  //     self.conflictHandlers[name].apply(_this, arguments);
  //   };
  // });

  return self;
};


// Global helper for applying grounddb on a collection
Ground.Collection = function(name, options) {
  var self;
  // Inheritance Meteor Collection can be set by options.collection
  // Accepts smart collections by Arunoda Susiripala
  // Check if user used the "new" keyword


  // Make sure we got some options
  options = options || {};

  // Either name is a Meteor collection or we create a new Meteor collection
  if (name instanceof _groundUtil.Collection) {
    self = name;
  } else {
    self = new _groundUtil.Collection(name, options);
  }

  // Throw an error if something went wrong
  if (!(self instanceof _groundUtil.Collection)) {
    throw new Error('Ground.Collection expected a Mongo.Collection');
  }

  // Add grounddb to the collection, circular reference since self is
  // grounddb.collection
  self.grounddb = new _groundDbConstructor(self, options);

  // Return grounded collection - We dont return this eg if it was an instance
  // of Ground.Collection
  return self;
};

////////////////////////// TIMESTAMP CONFLICTHANDLER ///////////////////////////

// TODO:
// When clients make changes the server should track the documents from the
// clients to see if the changes are new or old changes.
// This could be done in several ways.
// Either by versions or server timestamps - both could work.
//
// Conflicting overview:
// We could cut it down to comparing two documents and keep / broadcast the
// winning document.
//
// conflictHandler = function(clientDoc, serverDoc) { return serverDoc; }
//
//
// There should be found a way of registrating deleted documents - eg. by having
// a flag set 'active' all nonactive documents should then be removed from
// published documents.
//
// This could be a standalone package since it would introduce conflict
// handling in generel
//
// Regz. RaiX

//////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['ground:db'] = {}, {
  Ground: Ground,
  GroundDB: GroundDB
});

})();

//# sourceMappingURL=ground_db.js.map
