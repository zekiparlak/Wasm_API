
#include <emscripten.h>
#include <stdlib.h>

EM_JS_DEPS(webidl_binder, "$intArrayFromString,$UTF8ToString,$alignMemory");

class VirApi : public iVirApi {
public:
  void InitWebGL()  {
    EM_ASM_INT({
      var self = Module['getCache'](Module['VirApi'])[$0];
      if (!self.hasOwnProperty('InitWebGL')) throw 'a JSImplementation must implement all functions, you forgot VirApi::InitWebGL.';
      self['InitWebGL']();
    }, (ptrdiff_t)this);
  }
  void DownloadAndMakeTexture(const char* url)  {
    EM_ASM_INT({
      var self = Module['getCache'](Module['VirApi'])[$0];
      if (!self.hasOwnProperty('DownloadAndMakeTexture')) throw 'a JSImplementation must implement all functions, you forgot VirApi::DownloadAndMakeTexture.';
      self['DownloadAndMakeTexture']($1);
    }, (ptrdiff_t)this, url);
  }
  void __destroy__()  {
    EM_ASM_INT({
      var self = Module['getCache'](Module['VirApi'])[$0];
      if (!self.hasOwnProperty('__destroy__')) throw 'a JSImplementation must implement all functions, you forgot VirApi::__destroy__.';
      self['__destroy__']();
    }, (ptrdiff_t)this);
  }
};

class Callback : public iCallback {
public:
  void DoCallback(Point* minP, Point* maxP)  {
    EM_ASM_INT({
      var self = Module['getCache'](Module['Callback'])[$0];
      if (!self.hasOwnProperty('DoCallback')) throw 'a JSImplementation must implement all functions, you forgot Callback::DoCallback.';
      self['DoCallback']($1,$2);
    }, (ptrdiff_t)this, (ptrdiff_t)minP, (ptrdiff_t)maxP);
  }
  void __destroy__()  {
    EM_ASM_INT({
      var self = Module['getCache'](Module['Callback'])[$0];
      if (!self.hasOwnProperty('__destroy__')) throw 'a JSImplementation must implement all functions, you forgot Callback::__destroy__.';
      self['__destroy__']();
    }, (ptrdiff_t)this);
  }
};

extern "C" {

// Define custom allocator functions that we can force export using
// EMSCRIPTEN_KEEPALIVE.  This avoids all webidl users having to add
// malloc/free to -sEXPORTED_FUNCTIONS.
EMSCRIPTEN_KEEPALIVE void webidl_free(void* p) { free(p); }
EMSCRIPTEN_KEEPALIVE void* webidl_malloc(size_t len) { return malloc(len); }


// Interface: iVirApi


// Interface: iCallback


// Interface: VoidPtr


void EMSCRIPTEN_KEEPALIVE emscripten_bind_VoidPtr___destroy___0(void** self) {
  delete self;
}

// Interface: Api


Api* EMSCRIPTEN_KEEPALIVE emscripten_bind_Api_Api_1(VirApi* virApi) {
  return new Api(virApi);
}

const char* EMSCRIPTEN_KEEPALIVE emscripten_bind_Api_TestMessage_1(Api* self, const char* msg) {
  return self->TestMessage(msg);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Api_TestFloatArray_1(Api* self, int len_arr) {
  return self->TestFloatArray(len_arr);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Api_TestCallback_3(Api* self, Callback* cb, int arraybuffer, int size_arr) {
  self->TestCallback(cb, arraybuffer, size_arr);
}

double EMSCRIPTEN_KEEPALIVE emscripten_bind_Api_Test_WASM_Performance_0(Api* self) {
  return self->Test_WASM_Performance();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Api_TextureRequest_1(Api* self, const char* url) {
  self->TextureRequest(url);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Api_ChangeTexture_OnWheel_5(Api* self, int x, int y, int load, int halfWidth, int halfHeight) {
  self->ChangeTexture_OnWheel(x, y, load, halfWidth, halfHeight);
}

const char* EMSCRIPTEN_KEEPALIVE emscripten_bind_Api_LatLonToTileUrl_3(Api* self, double lat, double lon, int zoom) {
  return self->LatLonToTileUrl(lat, lon, zoom);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Api___destroy___0(Api* self) {
  delete self;
}

// Interface: Point


Point* EMSCRIPTEN_KEEPALIVE emscripten_bind_Point_Point_2(double X, double Y) {
  return new Point(X, Y);
}

double EMSCRIPTEN_KEEPALIVE emscripten_bind_Point_get_X_0(Point* self) {
  return self->X;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Point_set_X_1(Point* self, double arg0) {
  self->X = arg0;
}

double EMSCRIPTEN_KEEPALIVE emscripten_bind_Point_get_Y_0(Point* self) {
  return self->Y;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Point_set_Y_1(Point* self, double arg0) {
  self->Y = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Point___destroy___0(Point* self) {
  delete self;
}

// Interface: VirApi


VirApi* EMSCRIPTEN_KEEPALIVE emscripten_bind_VirApi_VirApi_0() {
  return new VirApi();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_VirApi_InitWebGL_0(VirApi* self) {
  self->InitWebGL();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_VirApi_DownloadAndMakeTexture_1(VirApi* self, const char* url) {
  self->DownloadAndMakeTexture(url);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_VirApi___destroy___0(VirApi* self) {
  delete self;
}

// Interface: Callback


Callback* EMSCRIPTEN_KEEPALIVE emscripten_bind_Callback_Callback_0() {
  return new Callback();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Callback_DoCallback_2(Callback* self, Point* minP, Point* maxP) {
  self->DoCallback(minP, maxP);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Callback___destroy___0(Callback* self) {
  delete self;
}

}

