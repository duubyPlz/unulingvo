//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Reload = Package.reload.Reload;

(function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/appcache/appcache-client.js                                             //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
if (window.applicationCache) {                                                      // 1
                                                                                    // 2
var appCacheStatuses = [                                                            // 3
  'uncached',                                                                       // 4
  'idle',                                                                           // 5
  'checking',                                                                       // 6
  'downloading',                                                                    // 7
  'updateready',                                                                    // 8
  'obsolete'                                                                        // 9
];                                                                                  // 10
                                                                                    // 11
var updatingAppcache = false;                                                       // 12
var reloadRetry = null;                                                             // 13
var appcacheUpdated = false;                                                        // 14
                                                                                    // 15
Reload._onMigrate('appcache', function (retry) {                                    // 16
  if (appcacheUpdated)                                                              // 17
    return [true];                                                                  // 18
                                                                                    // 19
  // An uncached application (one that does not have a manifest) cannot             // 20
  // be updated.                                                                    // 21
  if (window.applicationCache.status === window.applicationCache.UNCACHED)          // 22
    return [true];                                                                  // 23
                                                                                    // 24
  if (!updatingAppcache) {                                                          // 25
    try {                                                                           // 26
      window.applicationCache.update();                                             // 27
    } catch (e) {                                                                   // 28
      Meteor._debug('applicationCache update error', e);                            // 29
      // There's no point in delaying the reload if we can't update the cache.      // 30
      return [true];                                                                // 31
    }                                                                               // 32
    updatingAppcache = true;                                                        // 33
  }                                                                                 // 34
                                                                                    // 35
  // Delay migration until the app cache has been updated.                          // 36
  reloadRetry = retry;                                                              // 37
  return false;                                                                     // 38
});                                                                                 // 39
                                                                                    // 40
// If we're migrating and the app cache is now up to date, signal that              // 41
// we're now ready to migrate.                                                      // 42
var cacheIsNowUpToDate = function () {                                              // 43
  if (!updatingAppcache)                                                            // 44
    return;                                                                         // 45
  appcacheUpdated = true;                                                           // 46
  reloadRetry();                                                                    // 47
};                                                                                  // 48
                                                                                    // 49
window.applicationCache.addEventListener('updateready', cacheIsNowUpToDate, false);
window.applicationCache.addEventListener('noupdate', cacheIsNowUpToDate, false);    // 51
                                                                                    // 52
// We'll get the obsolete event on a 404 fetching the app.manifest:                 // 53
// we had previously been running with an app cache, but the app                    // 54
// cache has now been disabled or the appcache package removed.                     // 55
// Reload to get the new non-cached code.                                           // 56
                                                                                    // 57
window.applicationCache.addEventListener('obsolete', (function () {                 // 58
  if (reloadRetry) {                                                                // 59
    cacheIsNowUpToDate();                                                           // 60
  } else {                                                                          // 61
    appcacheUpdated = true;                                                         // 62
    Reload._reload();                                                               // 63
  }                                                                                 // 64
}), false);                                                                         // 65
                                                                                    // 66
} // if window.applicationCache                                                     // 67
                                                                                    // 68
//////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.appcache = {};

})();
