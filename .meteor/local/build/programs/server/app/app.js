var require = meteorInstall({"populate_db.js":function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// populate_db.js                                                    //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
// db.products.insert(                                               //
//    [                                                              //
//      { _id: 11, item: "pencil", qty: 50, type: "no.2" },          //
//      { item: "pen", qty: 20 },                                    //
//      { item: "eraser", qty: 25 }                                  //
//    ]                                                              //
// )                                                                 //
///////////////////////////////////////////////////////////////////////

},"server":{"main.js":["meteor/meteor",function(require){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// server/main.js                                                    //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
var _meteor = require('meteor/meteor');                              // 1
                                                                     //
_meteor.Meteor.startup(function () {                                 // 3
  // code to run on server at startup                                //
});                                                                  //
///////////////////////////////////////////////////////////////////////

}]}},{"extensions":[".js",".json"]});
require("./populate_db.js");
require("./server/main.js");
//# sourceMappingURL=app.js.map
