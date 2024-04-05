#ifndef _POINT_H
#define _POINT_H

class Point {
public:
	double X;
	double Y;
	Point(double _x, double _y) :X(_x), Y(_y) {};
	~Point() {};
};

#endif //_POINT_H