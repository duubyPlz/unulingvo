(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

/* Package-scope variables */
var Dictionary;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/ground_dictionary/packages/ground_dictionary.js                                              //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/ground:dictionary/dictionary.js                                                       //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
var _splice = function(array, begin) {                                                            // 1
  var result = [];                                                                                // 2
                                                                                                  // 3
  begin = begin || 0;                                                                             // 4
                                                                                                  // 5
  // Add the ones we need                                                                         // 6
  for (var i = begin; i < array.length; i++)                                                      // 7
    result.push(array[i]);                                                                        // 8
                                                                                                  // 9
  return result;                                                                                  // 10
};                                                                                                // 11
                                                                                                  // 12
Dictionary = function(list) {                                                                     // 13
  var self = this;                                                                                // 14
  // Dictionary                                                                                   // 15
  self.lookupString = {};                                                                         // 16
  self.lookupNumber = {};                                                                         // 17
  self.lookupDate = {}; // Special lookup making sure date lookups are acurate                    // 18
  self.lookupBoolean = {};                                                                        // 19
                                                                                                  // 20
  self.list = [];                                                                                 // 21
                                                                                                  // 22
  self.initial = [];                                                                              // 23
                                                                                                  // 24
  // If user sets a list                                                                          // 25
  if (list instanceof Dictionary) {                                                               // 26
    // Clone the initial list                                                                     // 27
    self.initial = list.clone();                                                                  // 28
    // We set the clone                                                                           // 29
    self.set(list.clone());                                                                       // 30
  } else if (list) {                                                                              // 31
    // Clone the array                                                                            // 32
    self.initial = _splice(list);                                                                 // 33
    // Just set the list                                                                          // 34
    self.set(list);                                                                               // 35
  }                                                                                               // 36
                                                                                                  // 37
};                                                                                                // 38
                                                                                                  // 39
Dictionary.prototype.lookup = function(key) {                                                     // 40
  var self = this;                                                                                // 41
                                                                                                  // 42
  var lookup = self.lookupString;                                                                 // 43
                                                                                                  // 44
  if (key instanceof Date) {                                                                      // 45
    lookup = self.lookupDate;                                                                     // 46
    key = +key;                                                                                   // 47
  } else if (key === +key) {                                                                      // 48
    lookup = self.lookupNumber;                                                                   // 49
  } else if (key === !!key) {                                                                     // 50
    lookup = self.lookupBoolean;                                                                  // 51
  }                                                                                               // 52
                                                                                                  // 53
  if (arguments.length === 2) {                                                                   // 54
    // Setter                                                                                     // 55
    lookup[key] = arguments[1];                                                                   // 56
  }                                                                                               // 57
                                                                                                  // 58
  return lookup[key];                                                                             // 59
};                                                                                                // 60
                                                                                                  // 61
Dictionary.prototype.add = function(value) {                                                      // 62
  var self = this;                                                                                // 63
  // Make sure not to add existing values / words                                                 // 64
  if (!self.exists(value)) {                                                                      // 65
    // Add value to keyword list                                                                  // 66
    // We return the index - note this can be 0 :)                                                // 67
    var index = this.list.push(value) - 1;                                                        // 68
    // Set the normal lookup                                                                      // 69
    this.lookup(value, index);                                                                    // 70
  }                                                                                               // 71
                                                                                                  // 72
  return this.index(value);                                                                       // 73
};                                                                                                // 74
                                                                                                  // 75
Dictionary.prototype.addList = function(list) {                                                   // 76
  // Iterate over the list of values                                                              // 77
  if (list)                                                                                       // 78
    for (var i = 0; i < list.length; i++)                                                         // 79
      this.add(list[i]);                                                                          // 80
};                                                                                                // 81
                                                                                                  // 82
Dictionary.prototype.set = function(list) {                                                       // 83
  // Reset the this.lookup                                                                        // 84
  this.lookupString = {};                                                                         // 85
  this.lookupNumber = {};                                                                         // 86
  this.lookupBoolean = {};                                                                        // 87
  this.lookupDate = {};                                                                           // 88
  this.list = [];                                                                                 // 89
  // Add the list                                                                                 // 90
  this.addList(list);                                                                             // 91
};                                                                                                // 92
                                                                                                  // 93
Dictionary.prototype.remove = function(value) {                                                   // 94
  var self = this;                                                                                // 95
  // Make sure theres something to remove                                                         // 96
  if (self.exists(value)) {                                                                       // 97
    var result = [];                                                                              // 98
    // copy the this.lookup                                                                       // 99
    for (var i = 0; i < this.list.length; i++)                                                    // 100
      if (i !== self.index(value)) result.push(this.list[i]);                                     // 101
    // Set the new list of this.lookup                                                            // 102
    this.set(result);                                                                             // 103
  }                                                                                               // 104
};                                                                                                // 105
                                                                                                  // 106
Dictionary.prototype.withoutInitial = function() {                                                // 107
  return _splice(this.list, this.initial.length);                                                 // 108
};                                                                                                // 109
                                                                                                  // 110
Dictionary.prototype.value = function(index) {                                                    // 111
  return this.list[index];                                                                        // 112
};                                                                                                // 113
                                                                                                  // 114
Dictionary.prototype.index = function(value) {                                                    // 115
  // We have to use the Date lookup in order to get the correct lookup value                      // 116
  // otherwise there are some slight diviation in the result - We want this                       // 117
  // 100% accurate                                                                                // 118
  return this.lookup(value);                                                                      // 119
};                                                                                                // 120
                                                                                                  // 121
Dictionary.prototype.exists = function(value) {                                                   // 122
  return (typeof this.index(value) !== 'undefined');                                              // 123
};                                                                                                // 124
                                                                                                  // 125
Dictionary.prototype.clone = function() {                                                         // 126
  return _splice(this.list);                                                                      // 127
};                                                                                                // 128
                                                                                                  // 129
Dictionary.prototype.toArray = function() {                                                       // 130
  return this.list;                                                                               // 131
};                                                                                                // 132
                                                                                                  // 133
Dictionary.prototype.toObject = function() {                                                      // 134
  return _.extend({}, this.lookupString, this.lookupNumber, this.lookupDate, this.lookupBoolean); // 135
};                                                                                                // 136
                                                                                                  // 137
////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

///////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['ground:dictionary'] = {}, {
  Dictionary: Dictionary
});

})();

//# sourceMappingURL=ground_dictionary.js.map
