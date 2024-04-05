
// Bindings utilities

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function WrapperObject() {
}
WrapperObject.prototype = Object.create(WrapperObject.prototype);
WrapperObject.prototype.constructor = WrapperObject;
WrapperObject.prototype.__class__ = WrapperObject;
WrapperObject.__cache__ = {};
Module['WrapperObject'] = WrapperObject;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant)
    @param {*=} __class__ */
function getCache(__class__) {
  return (__class__ || WrapperObject).__cache__;
}
Module['getCache'] = getCache;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant)
    @param {*=} __class__ */
function wrapPointer(ptr, __class__) {
  var cache = getCache(__class__);
  var ret = cache[ptr];
  if (ret) return ret;
  ret = Object.create((__class__ || WrapperObject).prototype);
  ret.ptr = ptr;
  return cache[ptr] = ret;
}
Module['wrapPointer'] = wrapPointer;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function castObject(obj, __class__) {
  return wrapPointer(obj.ptr, __class__);
}
Module['castObject'] = castObject;

Module['NULL'] = wrapPointer(0);

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function destroy(obj) {
  if (!obj['__destroy__']) throw 'Error: Cannot destroy object. (Did you create it yourself?)';
  obj['__destroy__']();
  // Remove from cache, so the object can be GC'd and refs added onto it released
  delete getCache(obj.__class__)[obj.ptr];
}
Module['destroy'] = destroy;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function compare(obj1, obj2) {
  return obj1.ptr === obj2.ptr;
}
Module['compare'] = compare;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function getPointer(obj) {
  return obj.ptr;
}
Module['getPointer'] = getPointer;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function getClass(obj) {
  return obj.__class__;
}
Module['getClass'] = getClass;

// Converts big (string or array) values into a C-style storage, in temporary space

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
var ensureCache = {
  buffer: 0,  // the main buffer of temporary storage
  size: 0,   // the size of buffer
  pos: 0,    // the next free offset in buffer
  temps: [], // extra allocations
  needed: 0, // the total size we need next time

  prepare() {
    if (ensureCache.needed) {
      // clear the temps
      for (var i = 0; i < ensureCache.temps.length; i++) {
        Module['_webidl_free'](ensureCache.temps[i]);
      }
      ensureCache.temps.length = 0;
      // prepare to allocate a bigger buffer
      Module['_webidl_free'](ensureCache.buffer);
      ensureCache.buffer = 0;
      ensureCache.size += ensureCache.needed;
      // clean up
      ensureCache.needed = 0;
    }
    if (!ensureCache.buffer) { // happens first time, or when we need to grow
      ensureCache.size += 128; // heuristic, avoid many small grow events
      ensureCache.buffer = Module['_webidl_malloc'](ensureCache.size);
      assert(ensureCache.buffer);
    }
    ensureCache.pos = 0;
  },
  alloc(array, view) {
    assert(ensureCache.buffer);
    var bytes = view.BYTES_PER_ELEMENT;
    var len = array.length * bytes;
    len = alignMemory(len, 8); // keep things aligned to 8 byte boundaries
    var ret;
    if (ensureCache.pos + len >= ensureCache.size) {
      // we failed to allocate in the buffer, ensureCache time around :(
      assert(len > 0); // null terminator, at least
      ensureCache.needed += len;
      ret = Module['_webidl_malloc'](len);
      ensureCache.temps.push(ret);
    } else {
      // we can allocate in the buffer
      ret = ensureCache.buffer + ensureCache.pos;
      ensureCache.pos += len;
    }
    return ret;
  },
  copy(array, view, offset) {
    offset /= view.BYTES_PER_ELEMENT;
    for (var i = 0; i < array.length; i++) {
      view[offset + i] = array[i];
    }
  },
};

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureString(value) {
  if (typeof value === 'string') {
    var intArray = intArrayFromString(value);
    var offset = ensureCache.alloc(intArray, HEAP8);
    ensureCache.copy(intArray, HEAP8, offset);
    return offset;
  }
  return value;
}

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt8(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP8);
    ensureCache.copy(value, HEAP8, offset);
    return offset;
  }
  return value;
}

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt16(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP16);
    ensureCache.copy(value, HEAP16, offset);
    return offset;
  }
  return value;
}

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP32);
    ensureCache.copy(value, HEAP32, offset);
    return offset;
  }
  return value;
}

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureFloat32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF32);
    ensureCache.copy(value, HEAPF32, offset);
    return offset;
  }
  return value;
}

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureFloat64(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF64);
    ensureCache.copy(value, HEAPF64, offset);
    return offset;
  }
  return value;
}

// Interface: iVirApi

/** @suppress {undefinedVars, duplicate} @this{Object} */
function iVirApi() { throw "cannot construct a iVirApi, no constructor in IDL" }
iVirApi.prototype = Object.create(WrapperObject.prototype);
iVirApi.prototype.constructor = iVirApi;
iVirApi.prototype.__class__ = iVirApi;
iVirApi.__cache__ = {};
Module['iVirApi'] = iVirApi;

// Interface: iCallback

/** @suppress {undefinedVars, duplicate} @this{Object} */
function iCallback() { throw "cannot construct a iCallback, no constructor in IDL" }
iCallback.prototype = Object.create(WrapperObject.prototype);
iCallback.prototype.constructor = iCallback;
iCallback.prototype.__class__ = iCallback;
iCallback.__cache__ = {};
Module['iCallback'] = iCallback;

// Interface: VoidPtr

/** @suppress {undefinedVars, duplicate} @this{Object} */
function VoidPtr() { throw "cannot construct a VoidPtr, no constructor in IDL" }
VoidPtr.prototype = Object.create(WrapperObject.prototype);
VoidPtr.prototype.constructor = VoidPtr;
VoidPtr.prototype.__class__ = VoidPtr;
VoidPtr.__cache__ = {};
Module['VoidPtr'] = VoidPtr;

/** @suppress {undefinedVars, duplicate} @this{Object} */
VoidPtr.prototype['__destroy__'] = VoidPtr.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_VoidPtr___destroy___0(self);
};

// Interface: Api

/** @suppress {undefinedVars, duplicate} @this{Object} */
function Api(virApi) {
  if (virApi && typeof virApi === 'object') virApi = virApi.ptr;
  this.ptr = _emscripten_bind_Api_Api_1(virApi);
  getCache(Api)[this.ptr] = this;
};

Api.prototype = Object.create(WrapperObject.prototype);
Api.prototype.constructor = Api;
Api.prototype.__class__ = Api;
Api.__cache__ = {};
Module['Api'] = Api;
/** @suppress {undefinedVars, duplicate} @this{Object} */
Api.prototype['TestMessage'] = Api.prototype.TestMessage = function(msg) {
  var self = this.ptr;
  ensureCache.prepare();
  if (msg && typeof msg === 'object') msg = msg.ptr;
  else msg = ensureString(msg);
  return UTF8ToString(_emscripten_bind_Api_TestMessage_1(self, msg));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Api.prototype['TestFloatArray'] = Api.prototype.TestFloatArray = function(len_arr) {
  var self = this.ptr;
  if (len_arr && typeof len_arr === 'object') len_arr = len_arr.ptr;
  return _emscripten_bind_Api_TestFloatArray_1(self, len_arr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Api.prototype['TestCallback'] = Api.prototype.TestCallback = function(cb, arraybuffer, size_arr) {
  var self = this.ptr;
  if (cb && typeof cb === 'object') cb = cb.ptr;
  if (arraybuffer && typeof arraybuffer === 'object') arraybuffer = arraybuffer.ptr;
  if (size_arr && typeof size_arr === 'object') size_arr = size_arr.ptr;
  _emscripten_bind_Api_TestCallback_3(self, cb, arraybuffer, size_arr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Api.prototype['Test_WASM_Performance'] = Api.prototype.Test_WASM_Performance = function() {
  var self = this.ptr;
  return _emscripten_bind_Api_Test_WASM_Performance_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Api.prototype['TextureRequest'] = Api.prototype.TextureRequest = function(url) {
  var self = this.ptr;
  ensureCache.prepare();
  if (url && typeof url === 'object') url = url.ptr;
  else url = ensureString(url);
  _emscripten_bind_Api_TextureRequest_1(self, url);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Api.prototype['ChangeTexture_OnWheel'] = Api.prototype.ChangeTexture_OnWheel = function(x, y, load, halfWidth, halfHeight) {
  var self = this.ptr;
  if (x && typeof x === 'object') x = x.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  if (load && typeof load === 'object') load = load.ptr;
  if (halfWidth && typeof halfWidth === 'object') halfWidth = halfWidth.ptr;
  if (halfHeight && typeof halfHeight === 'object') halfHeight = halfHeight.ptr;
  _emscripten_bind_Api_ChangeTexture_OnWheel_5(self, x, y, load, halfWidth, halfHeight);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Api.prototype['LatLonToTileUrl'] = Api.prototype.LatLonToTileUrl = function(lat, lon, zoom) {
  var self = this.ptr;
  if (lat && typeof lat === 'object') lat = lat.ptr;
  if (lon && typeof lon === 'object') lon = lon.ptr;
  if (zoom && typeof zoom === 'object') zoom = zoom.ptr;
  return UTF8ToString(_emscripten_bind_Api_LatLonToTileUrl_3(self, lat, lon, zoom));
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
Api.prototype['__destroy__'] = Api.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_Api___destroy___0(self);
};

// Interface: Point

/** @suppress {undefinedVars, duplicate} @this{Object} */
function Point(X, Y) {
  if (X && typeof X === 'object') X = X.ptr;
  if (Y && typeof Y === 'object') Y = Y.ptr;
  this.ptr = _emscripten_bind_Point_Point_2(X, Y);
  getCache(Point)[this.ptr] = this;
};

Point.prototype = Object.create(WrapperObject.prototype);
Point.prototype.constructor = Point;
Point.prototype.__class__ = Point;
Point.__cache__ = {};
Module['Point'] = Point;
/** @suppress {undefinedVars, duplicate} @this{Object} */
Point.prototype['get_X'] = Point.prototype.get_X = function() {
  var self = this.ptr;
  return _emscripten_bind_Point_get_X_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Point.prototype['set_X'] = Point.prototype.set_X = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Point_set_X_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Point.prototype, 'X', { get: Point.prototype.get_X, set: Point.prototype.set_X });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Point.prototype['get_Y'] = Point.prototype.get_Y = function() {
  var self = this.ptr;
  return _emscripten_bind_Point_get_Y_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Point.prototype['set_Y'] = Point.prototype.set_Y = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Point_set_Y_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Point.prototype, 'Y', { get: Point.prototype.get_Y, set: Point.prototype.set_Y });

/** @suppress {undefinedVars, duplicate} @this{Object} */
Point.prototype['__destroy__'] = Point.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_Point___destroy___0(self);
};

// Interface: VirApi

/** @suppress {undefinedVars, duplicate} @this{Object} */
function VirApi() {
  this.ptr = _emscripten_bind_VirApi_VirApi_0();
  getCache(VirApi)[this.ptr] = this;
};

VirApi.prototype = Object.create(iVirApi.prototype);
VirApi.prototype.constructor = VirApi;
VirApi.prototype.__class__ = VirApi;
VirApi.__cache__ = {};
Module['VirApi'] = VirApi;
/** @suppress {undefinedVars, duplicate} @this{Object} */
VirApi.prototype['InitWebGL'] = VirApi.prototype.InitWebGL = function() {
  var self = this.ptr;
  _emscripten_bind_VirApi_InitWebGL_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
VirApi.prototype['DownloadAndMakeTexture'] = VirApi.prototype.DownloadAndMakeTexture = function(url) {
  var self = this.ptr;
  ensureCache.prepare();
  if (url && typeof url === 'object') url = url.ptr;
  else url = ensureString(url);
  _emscripten_bind_VirApi_DownloadAndMakeTexture_1(self, url);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
VirApi.prototype['__destroy__'] = VirApi.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_VirApi___destroy___0(self);
};

// Interface: Callback

/** @suppress {undefinedVars, duplicate} @this{Object} */
function Callback() {
  this.ptr = _emscripten_bind_Callback_Callback_0();
  getCache(Callback)[this.ptr] = this;
};

Callback.prototype = Object.create(iCallback.prototype);
Callback.prototype.constructor = Callback;
Callback.prototype.__class__ = Callback;
Callback.__cache__ = {};
Module['Callback'] = Callback;
/** @suppress {undefinedVars, duplicate} @this{Object} */
Callback.prototype['DoCallback'] = Callback.prototype.DoCallback = function(minP, maxP) {
  var self = this.ptr;
  if (minP && typeof minP === 'object') minP = minP.ptr;
  if (maxP && typeof maxP === 'object') maxP = maxP.ptr;
  _emscripten_bind_Callback_DoCallback_2(self, minP, maxP);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
Callback.prototype['__destroy__'] = Callback.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_Callback___destroy___0(self);
};
