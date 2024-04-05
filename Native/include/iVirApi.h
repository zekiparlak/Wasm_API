#ifndef _iVIRAPI_H
#define _iVIRAPI_H

#include "pch.h"

#include "Api.h"

class Api;

class iVirApi {
public:
	virtual void InitWebGL() = 0;
	virtual void DownloadAndMakeTexture(const char* _url) = 0;
	virtual ~iVirApi() {};
};

#endif //_iVIRAPI_H