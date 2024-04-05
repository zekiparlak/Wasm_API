#ifndef _iCALLBACK_H
#define _iCALLBACK_H

#include "pch.h"
#include "Point.h"

class iCallback {
public:
	virtual void DoCallback(Point* minP, Point* maxP) = 0;
	virtual ~iCallback() {};
};

#endif //_iCALLBACK_H