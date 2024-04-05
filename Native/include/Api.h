#ifndef _API_H
#define _API_H

#include "pch.h"

#include "iVirApi.h"
#include "iCallback.h"
#include "Point.h"

class iVirApi;

class Api {
private:
	iVirApi* FVirApi;
	std::string message;
	std::string FTile_Map_url;

	int tileCoorX[20];
	int tileCoorY[20];
	int FLoad;
public:
	Api(iVirApi* virApi);
	~Api();

	const char* TestMessage(const char* msg);
	uintptr_t TestFloatArray(uintptr_t len_arr);
	void TestCallback(iCallback* cb, uintptr_t arraybuffer, int size_arr);
	double Test_WASM_Performance();
	void TextureRequest(const char* _url);
	void ChangeTexture_OnWheel(int x, int y, int load, int halfWidth, int halfHeight);
	const char* LatLonToTileUrl(double lat, double lon, int zoom);
};

#endif	//_API_H