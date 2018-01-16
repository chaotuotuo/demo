/**
 * [indexedDB description]
 * @param  {[Object]} opts [description]
 * @param  {[string]} opts.dbName [database name]
 * @param  {[string]} opts.version [database version]
 * @param  {[string]} opts.objectStore [database objectStore]
 * @param  {[Object]} opts.keyPath [database keyPath]
 * @param  {[Object]} opts.dbIndex [database index]
 * @return {[type]}        [description]
 */
function IndexedDB(opts){
 	var openResult = window.indexedDB.open(opts.dbNameame,opts.version),
		_that = this;

	openResult.onsuccess = function(event){
		console.log("open success");
		_that.db = event.target.result;
	};

	openResult.onerror = function(event){
		console.log("open error");
	}

	openResult.onupgradeneeded = function(event){
		console.log("upgradeneeded");
		//createObjectStore
		var objectStore = event.target.result.createObjectStore(opts.objectStore,opts.keyPath);
		//createIndex
		for(var key in opts.dbIndex){
			objectStore.createIndex(key,opts.dbIndex[key]);
		}
	}
}

IndexedDB.prototype = {
	constructor:IndexedDB,
	/**
	 * [createTransaction description]
	 * @param  {[type]} objectStore [indexedDB objectStore]
	 * @param  {[type]} type        [indexedDB type]
	 * @return {[type]}             [description]
	 */
	createTransaction:function(objectStore,type){
		//创建事务并返回
		return this.db.transaction(objectStore,type).objectStore(objectStore);
	},
	/**
	 * [addItem description]
	 * @param {[Object]} opts [description]
	 * @param {[string]} opts.objectStore [database objectStore]
	 * @param {[string]} opts.type [database type]
	 * @param {[Object]} opts.item [database item]
	 * @param {[Function]} opts.callBack [database add success callBack]
	 */
	addItem:function(opts){
		this.createTransaction(opts.objectStore,opts.type).add(opts.item).onsuccess = function(event){
			console.log("add success");

			opts.callBack&&opts.callBack(event.target.result);
		}
	},
	/**
	 * [getItem description]
	 * @param  {[type]} opts [description]
	 * @param {[string]} opts.objectStore [database objectStore]
	 * @param {[string]} opts.type [database type]
	 * @param {[Object]} opts.key [database key]
	 * @param {[Function]} opts.callBack [database getItem success callBack]
	 * @return {[type]}      [description]
	 */
	getItem:function(opts){
		this.createTransaction(opts.objectStore,opts.type).get(opts.key).onsuccess = function(event){
			console.log(event.target.result);

			opts.callBack&&opts.callBack(event.target.result);
		}
	},
	/**
	 * [getItemForIndex description]
	 * @param  {[Object]} opt [description]
	 * @param  {[Object]} opt.objectStore [description]
	 * @param {[string]} opts.type [database type]
	 * @param  {[Object]} opt.index [opt.index]
	 * @param  {[Object]} opt.indexTarget [opt.indexTarget]
	 * @param  {[Object]} opt.callBack [opt.callBack]
	 * @return {[type]}     [description]
	 */
	getItemFromIndex:function(opts){
		this.createTransaction(opts.objectStore,opts.type).index(opts.index).get(opts.indexTarget).onsuccess = function(event){
			opts.callBack&&opts.callBack(event.target.result);
		};
	},
	/**
	 * [getItems description]
	 * @param  {[Object]} opts [description]
	 * @param {[string]} opts.objectStore [database objectStore]
	 * @param {[string]} opts.type [database type]
	 * @param {[Function]} opts.callBackData [database getItems data callBack]
	 * @param {[Function]} opts.callBackEnd [database getItems data callBack]
	 * @return {[type]}      [description]
	 */
	getItems:function(opts){
		//openCursor
		var keyRange = IDBKeyRange.upperBound(3);
		console.log(keyRange.includes);
		this.createTransaction(opts.objectStore,opts.type).openCursor(keyRange,"prev").onsuccess = function(event){
			var cursor = event.target.result;

			if(cursor){
				console.log(cursor);
				console.log(cursor.key);
				console.log(cursor.primaryKey);
				opts.callBackData&&opts.callBackData(cursor.value);
				// cursor.continue();
				// cursor.advance(2);
				// cursor.delete();
				cursor.continue();
			}else{
				console.log("end");

				opts.callBackEnd&&opts.callBackEnd();
			}
		}
	},
	/**
	 * [deleItem description]
	 * @param  {[type]} opts [description]
	 * @param  {[type]} opts.objectStore [database objectStore]
	 * @param  {[type]} opts.type [database type]
	 * @param  {[type]} opts.item [database item]
	 * @return {[type]}      [description]
	 */
	deleItem:function(opts){
		this.createTransaction(opts.objectStore,opts.type).delete(opts.item).onsuccess = function(event){
			console.log("delete success");
		}
	}
}

//chaotuotuo --2017-12-28