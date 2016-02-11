﻿function IStorage(){}function JSONStorage(e){EventTarget.call(this),this._storageEngine=e}function getPublicApi(){return utils.createApiWrapper(module.exports.storage,IStorage.prototype)}var utils=require("kango/utils"),array=utils.array,object=utils.object,EventTarget=utils.EventTarget,NotImplementedException=utils.NotImplementedException;IStorage.prototype={setItem:function(e,t){throw new NotImplementedException},getItem:function(e){throw new NotImplementedException},removeItem:function(e){throw new NotImplementedException},getKeys:function(){throw new NotImplementedException},clear:function(){throw new NotImplementedException}},JSONStorage.prototype=object.extend(EventTarget,{_storageEngine:null,getItem:function(e){var t=this._storageEngine.getItem(e);return"undefined"!=typeof t&&null!=t?JSON.parse(t):null},setItem:function(e,t){if("undefined"==typeof t)return this.removeItem(e);var n=JSON.stringify(t);return"undefined"!=typeof n&&(this._storageEngine.setItem(e,n),this.fireEvent("setItem",{data:{name:e,value:t}})),!1},removeItem:function(e){this._storageEngine.removeItem(e),this.fireEvent("removeItem",{data:{name:e}})},getKeys:function(){return this._storageEngine.getKeys()},getItems:function(){var e={};return array.forEach(this.getKeys(),function(t){e[t]=this.getItem(t)},this),e},clear:function(){this._storageEngine.clear(),this.fireEvent("clear")},dispose:function(){this.removeAllEventListeners(),"undefined"!=typeof this._storageEngine.dispose&&this._storageEngine.dispose(),this._storageEngine=null}});







function SQLiteStorageAsync(e){this._tableName=e+"_storage",this._connect=this._openDatabase(),this._createDatabase()}function SQLiteStorageAsyncCache(){this._data={}}function SQLiteStorage(e){var t=this;core.addAsyncModule(t),this._storage=e;var n=this._cache=new SQLiteStorageAsyncCache;e.getItems(function(e){n.setItems(e),core.fireEvent("moduleinitialized",{data:t})})}var core=require("kango/core"),extensionInfo=require("kango/extension_info"),utils=require("kango/utils"),object=utils.object;SQLiteStorageAsync.prototype={_getDatabaseFile:function(){var e=extensionInfo.package_id+".sqlite";return FileUtils.getFile("ProfD",[e])},_openDatabase:function(){var e=this._getDatabaseFile();return Services.storage.openDatabase(e)},_createDatabase:function(){this._connect.executeSimpleSQL("CREATE TABLE IF NOT EXISTS "+this._tableName+" (key TEXT PRIMARY KEY, value TEXT)")},getItems:function(e){var t=this._connect.createStatement("SELECT key, value FROM "+this._tableName),n={};t.executeAsync({handleResult:function(e){for(var t=e.getNextRow();t;){var a=t.getResultByName("key");n[a]=t.getResultByName("value"),t=e.getNextRow()}},handleError:function(e){},handleCompletion:function(t){e(n)}})},setItem:function(e,t,n){var a=this._connect.createStatement("INSERT OR REPLACE INTO "+this._tableName+" (key, value) VALUES(:key, :value)");a.params.key=e,a.params.value=t.toString(),a.executeAsync({handleResult:function(e){},handleError:function(e){},handleCompletion:function(e){"function"==typeof n&&n(e==Ci.mozIStorageStatementCallback.REASON_FINISHED)}})},removeItem:function(e,t){var n=this._connect.createStatement("DELETE FROM "+this._tableName+" WHERE key=:key");n.params.key=e,n.executeAsync({handleResult:function(e){},handleError:function(e){},handleCompletion:function(e){"function"==typeof t&&t(e==Ci.mozIStorageStatementCallback.REASON_FINISHED)}})},clear:function(e){var t=this._connect.createStatement("DELETE FROM "+this._tableName);t.executeAsync({handleResult:function(e){},handleError:function(e){},handleCompletion:function(t){"function"==typeof e&&e(t==Ci.mozIStorageStatementCallback.REASON_FINISHED)}})},close:function(){null!=this._connect&&(this._connect.asyncClose(),this._connect=null)},dispose:function(){this.close()},removeDatabase:function(){this.close();var e=this._getDatabaseFile();e.remove(!1)}},SQLiteStorageAsyncCache.prototype={setItems:function(e){this._data=e},getItem:function(e){return this._data[e]||null},setItem:function(e,t){this._data[e]=t},removeItem:function(e){return delete this._data[e]},clear:function(){this._data={}},getKeys:function(){return object.getKeys(this._data)}},SQLiteStorage.prototype={getItem:function(e){return this._cache.getItem(e)},setItem:function(e,t){this._cache.setItem(e,t),this._storage.setItem(e,t)},removeItem:function(e){this._cache.removeItem(e),this._storage.removeItem(e)},clear:function(){this._cache.clear(),this._storage.clear()},getKeys:function(){return this._cache.getKeys()},dispose:function(){this._storage.dispose(),this._storage=null,this._cache=null}},core.uninstall?module.exports.uninstall=function(){SQLiteStorageAsync.prototype.removeDatabase()}:(module.exports.storage=new JSONStorage(new SQLiteStorage(new SQLiteStorageAsync("user"))),module.exports.systemStorage=new JSONStorage(new SQLiteStorage(new SQLiteStorageAsync("system"))),module.exports.dispose=function(){exports.storage.dispose(),exports.systemStorage.dispose()},module.exports.getPublicApi=getPublicApi);