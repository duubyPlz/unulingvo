(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var Dictionary = Package['ground:dictionary'].Dictionary;

/* Package-scope variables */
var MiniMax;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/ground_minimax/packages/ground_minimax.js                                                            //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/ground:minimax/ejson.minimax.js                                                               //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
/*                                                                                                        // 1
                                                                                                          // 2
                                                                                                          // 3
                    __  ____       _ __  ___                                                              // 4
                   /  |/  (_)___  (_)  |/  /___ __  __                                                    // 5
                  / /|_/ / / __ \/ / /|_/ / __ `/ |/_/                                                    // 6
                 / /  / / / / / / / /  / / /_/ />  <                                                      // 7
                /_/  /_/_/_/ /_/_/_/  /_/\__,_/_/|_|                                                      // 8
                                                                                                          // 9
  Minify and Maxify by RaiX aka Morten N.O. Nørgaard Henriksen (mh@gi-software.com)                       // 10
                                                                                                          // 11
  MiniMax.minify( Object )                                                                                // 12
                                                                                                          // 13
  MiniMax.maxify( array )                                                                                 // 14
                                                                                                          // 15
  MiniMax.stringify( object )                                                                             // 16
                                                                                                          // 17
  MiniMax.parse( string )                                                                                 // 18
                                                                                                          // 19
  // For faster lookup                                                                                    // 20
  var keywords = {                                                                                        // 21
    '_id': 0,                                                                                             // 22
    'test': 1,                                                                                            // 23
    'comment': 2,                                                                                         // 24
    'list': 3,                                                                                            // 25
    'note': 4                                                                                             // 26
  };                                                                                                      // 27
                                                                                                          // 28
  var keywordsList = [ '_id', 'test', 'comment', 'list', 'note' ];                                        // 29
                                                                                                          // 30
  var headers = [0, [0, 1, 2], [0, 3, -5] ];                                                              // 31
                                                                                                          // 32
  var data = []; */                                                                                       // 33
                                                                                                          // 34
  // if(!Array.isArray) {                                                                                 // 35
  //   Array.isArray = function (vArg) {                                                                  // 36
  //     return Object.prototype.toString.call(vArg) === '[object Array]';                                // 37
  //   };                                                                                                 // 38
  // }                                                                                                    // 39
                                                                                                          // 40
  // Create the export scope                                                                              // 41
  MiniMax = function(options) {                                                                           // 42
    var self = this;                                                                                      // 43
                                                                                                          // 44
    // Make sure we are on an instance                                                                    // 45
    if (!(self instanceof MiniMax))                                                                       // 46
      return new MiniMax(options);                                                                        // 47
                                                                                                          // 48
    // Make sure options is set                                                                           // 49
    options = options || {};                                                                              // 50
                                                                                                          // 51
    // Setting this true will add all values and dates to the dictionary                                  // 52
    // This can in some cases save                                                                        // 53
    self.progressive = (options.progressive === false)? false : true;                                     // 54
                                                                                                          // 55
    // Set the default Dictionary                                                                         // 56
    // If the user added initial dictionary then add those                                                // 57
    self.dictionary = new Dictionary(_.union([false, true, null, undefined], options.dictionary || [] )); // 58
  };                                                                                                      // 59
                                                                                                          // 60
  MiniMax.prototype.minify = function(maxObj, skipFunctions) {                                            // 61
    var self = this;                                                                                      // 62
    var headers = [0];                                                                                    // 63
                                                                                                          // 64
    // Start dictionary                                                                                   // 65
    var dict = new Dictionary(self.dictionary);                                                           // 66
                                                                                                          // 67
    var getHeader = function(newHeader) {                                                                 // 68
      var headerId = null;                                                                                // 69
      for (var i = 1; i < headers.length; i++) {                                                          // 70
        var orgHeader = headers[i];                                                                       // 71
        // We only need to iterate over the intersection to get a match                                   // 72
        var minLength = Math.min(orgHeader.length, newHeader.length);                                     // 73
        var isMatch = true;                                                                               // 74
        for (var a = 0; a < minLength; a++) {                                                             // 75
          // We break if not a match                                                                      // 76
          if (orgHeader[a] !== newHeader[a]) {                                                            // 77
            isMatch = false;                                                                              // 78
            break;                                                                                        // 79
          }                                                                                               // 80
        }                                                                                                 // 81
        if (isMatch) {                                                                                    // 82
          // We check to see if                                                                           // 83
          // We are equal or in another header                                                            // 84
          // eg. headers = [1, 2, 3] newHeader=[1, 2, 3] return id                                        // 85
          // eg. headers = [1, 2, 3, 4] newHeader=[1, 2, 3] return id                                     // 86
          headerId = i;                                                                                   // 87
          // We could maybe contain another header - so we extend the org. and use                        // 88
          // that eg. headers = [1, 2, 3] newHeader=[1, 2, 3, 4] then                                     // 89
          // set headers=newHeader and return id                                                          // 90
          if (newHeader.length > minLength) {                                                             // 91
            headers[i] = newHeader;                                                                       // 92
          }                                                                                               // 93
        }                                                                                                 // 94
        // Stop when we found a match                                                                     // 95
        if (headerId !== null) {                                                                          // 96
          break;                                                                                          // 97
        }                                                                                                 // 98
      }                                                                                                   // 99
      // Or none of the above we add a new header                                                         // 100
      if (headerId === null) {                                                                            // 101
        headerId = headers.push(newHeader) - 1;                                                           // 102
      }                                                                                                   // 103
      return headerId;                                                                                    // 104
    };                                                                                                    // 105
                                                                                                          // 106
    var minifyHelper = function(maxObj) {                                                                 // 107
      var inArray = !_.isArray(maxObj);                                                                   // 108
      var target = [];                                                                                    // 109
      var header = [];                                                                                    // 110
                                                                                                          // 111
      _.each(maxObj, function(value, key) {                                                               // 112
                                                                                                          // 113
        if (skipFunctions && typeof value === 'function')                                                 // 114
          return;                                                                                         // 115
                                                                                                          // 116
        var minKey = (inArray) ? dict.add(key) : 0;                                                       // 117
                                                                                                          // 118
        if (value !== null && typeof value === 'object' &&                                                // 119
                  !(value instanceof Date)) {                                                             // 120
          // Array or Object                                                                              // 121
          if (inArray) {                                                                                  // 122
            header.push(minKey);                                                                          // 123
          }                                                                                               // 124
                                                                                                          // 125
          // Handle the object                                                                            // 126
          target.push(minifyHelper(value));                                                               // 127
                                                                                                          // 128
        } else {                                                                                          // 129
          // Depending on the progressive settings this will                                              // 130
          // Check if value is found in keywords                                                          // 131
          // Always set the value in keywords dictionary                                                  // 132
          var valueId = (self.progressive) ? dict.add(value) : dict.index(value);                         // 133
                                                                                                          // 134
          if (typeof valueId == 'undefined') {                                                            // 135
            // Not found, we add normal values                                                            // 136
            header.push(minKey);                                                                          // 137
            target.push(value);                                                                           // 138
          } else {                                                                                        // 139
                                                                                                          // 140
            header.push(-minKey);                                                                         // 141
            if (!inArray) {                                                                               // 142
              target.push(value);                                                                         // 143
            } else {                                                                                      // 144
              // Found, make minKey negative and set value to valueId                                     // 145
              target.push(valueId);                                                                       // 146
            }                                                                                             // 147
          }                                                                                               // 148
        }                                                                                                 // 149
      });                                                                                                 // 150
                                                                                                          // 151
      if (inArray) {                                                                                      // 152
        var headerId = getHeader(header);                                                                 // 153
        target.unshift(headerId);                                                                         // 154
      } else {                                                                                            // 155
        target.unshift(0); // 0 marks an array with no headers                                            // 156
      }                                                                                                   // 157
                                                                                                          // 158
                                                                                                          // 159
      return target;                                                                                      // 160
    };                                                                                                    // 161
                                                                                                          // 162
    // If not an object then not much to work on                                                          // 163
    if (typeof maxObj !== 'object') {                                                                     // 164
      return maxObj;                                                                                      // 165
    }                                                                                                     // 166
                                                                                                          // 167
    var data = minifyHelper(maxObj);                                                                      // 168
                                                                                                          // 169
    return [ dict.withoutInitial(), headers, data ];                                                      // 170
  };                                                                                                      // 171
                                                                                                          // 172
                                                                                                          // 173
  // Takes an minify object and maxify to object                                                          // 174
  MiniMax.prototype.maxify = function(minObj) {                                                           // 175
    var self = this;                                                                                      // 176
                                                                                                          // 177
    // We expect an array of 3                                                                            // 178
    if (minObj === null || minObj.length !== 3) {                                                         // 179
      // Return object                                                                                    // 180
      return minObj;                                                                                      // 181
    }                                                                                                     // 182
                                                                                                          // 183
    // Init globals                                                                                       // 184
    var dict = new Dictionary(self.dictionary);                                                           // 185
    dict.addList(minObj[0]);                                                                              // 186
                                                                                                          // 187
    var headers = minObj[1];                                                                              // 188
    var data = minObj[2];                                                                                 // 189
                                                                                                          // 190
    var maxifyHelper = function(minObj) {                                                                 // 191
      // read header reference and fetch the header                                                       // 192
      var headerId = minObj.shift();                                                                      // 193
      var header = (headerId) ? headers[headerId] : null;                                                 // 194
                                                                                                          // 195
      // If header === 0 then we are creating an array otherwise an object                                // 196
      var result = (header === null) ? [] : {};                                                           // 197
      // We launch interation over the minObj                                                             // 198
      if (header === null) {                                                                              // 199
        // Create an array                                                                                // 200
        for (var i = 0; i < minObj.length; i++) {                                                         // 201
          if (_.isArray(minObj[i])) {                                                                     // 202
            result.push(maxifyHelper(minObj[i]));                                                         // 203
          } else {                                                                                        // 204
            result.push(minObj[i]);                                                                       // 205
          }                                                                                               // 206
        }                                                                                                 // 207
      } else {                                                                                            // 208
        // Create object                                                                                  // 209
        for (var i = 0; i < minObj.length; i++) {                                                         // 210
          // Lookup keyword id can be negative for value lookup                                           // 211
          var keyId = header[i];                                                                          // 212
          // Lookup keyword                                                                               // 213
          var key = dict.value(Math.abs(keyId));                                                          // 214
          // Is value an array then dig deeper                                                            // 215
          if (_.isArray(minObj[i])) {                                                                     // 216
            result[key] = maxifyHelper(minObj[i]);                                                        // 217
          } else {                                                                                        // 218
            var value = minObj[i]; // Value or valueId                                                    // 219
            // if keyId is negative then lookup the value in keywords                                     // 220
            if (keyId < 0) {                                                                              // 221
              value = dict.value(value);                                                                  // 222
            }                                                                                             // 223
            result[key] = value;                                                                          // 224
          }                                                                                               // 225
        }                                                                                                 // 226
      }                                                                                                   // 227
      return result;                                                                                      // 228
    };                                                                                                    // 229
                                                                                                          // 230
    return maxifyHelper(data);                                                                            // 231
  };                                                                                                      // 232
                                                                                                          // 233
  MiniMax.prototype.stringify = function(plainObject) {                                                   // 234
    // Compress the object                                                                                // 235
    var minifiedObject = this.minify(plainObject, true);                                                  // 236
    // Convert it into string                                                                             // 237
    return EJSON.stringify(minifiedObject);                                                               // 238
  };                                                                                                      // 239
                                                                                                          // 240
  MiniMax.prototype.parse = function(ejsonString) {                                                       // 241
    // Convert the string into minified object                                                            // 242
    var minifiedObject = EJSON.parse(ejsonString);                                                        // 243
    // Maxify the object                                                                                  // 244
    return this.maxify(minifiedObject);                                                                   // 245
  };                                                                                                      // 246
                                                                                                          // 247
////////////////////////////////////////////////////////////////////////////////                          // 248
//  DEFAULT BEHAVIOUR                                                                                     // 249
////////////////////////////////////////////////////////////////////////////////                          // 250
                                                                                                          // 251
var defaultMiniMax = new MiniMax();                                                                       // 252
                                                                                                          // 253
MiniMax.minify = function(maxObj, skipFunctions) {                                                        // 254
  return defaultMiniMax.minify(maxObj, skipFunctions);                                                    // 255
};                                                                                                        // 256
                                                                                                          // 257
MiniMax.maxify = function(minObj) {                                                                       // 258
  return defaultMiniMax.maxify(minObj);                                                                   // 259
};                                                                                                        // 260
                                                                                                          // 261
MiniMax.stringify = function(obj) {                                                                       // 262
  return defaultMiniMax.stringify(obj);                                                                   // 263
};                                                                                                        // 264
                                                                                                          // 265
MiniMax.parse = function(str) {                                                                           // 266
  return defaultMiniMax.parse(str);                                                                       // 267
};                                                                                                        // 268
                                                                                                          // 269
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['ground:minimax'] = {}, {
  MiniMax: MiniMax
});

})();

//# sourceMappingURL=ground_minimax.js.map
