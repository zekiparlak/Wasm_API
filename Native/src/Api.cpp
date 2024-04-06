#include "../include/Api.h"

Api::Api(iVirApi* virApi) {
    FLoad = 0;
    FTile_Map_url = "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/";

    FVirApi = virApi;
    FVirApi->InitWebGL();
}

Api::~Api() {
    delete FVirApi;
}

const char* Api::TestMessage(const char* msg) {
    std::string message = "Hello From Sample Api, " + std::string(msg);
    return message.c_str();
}

uintptr_t Api::TestFloatArray(uintptr_t len_arr) {
    int* len = reinterpret_cast<int*>(len_arr);
    *len = 5;

    std::array<float, 5> *fArr = new std::array<float, 5>{5.1f, 4.5f, 8.7f, 6.4f, 3.7f};
    return uintptr_t(fArr->data());
}

void Api::TestCallback(iCallback* cb, uintptr_t arraybuffer, int len_arr) {
    auto pArr = reinterpret_cast<Point**>(arraybuffer);
    
    double minX = pArr[0]->X; double minY = pArr[0]->Y;
    double maxX = pArr[0]->X; double maxY = pArr[0]->Y;

    for (int i = 0; i < len_arr; i++) {
        if (pArr[i]->X < minX) minX = pArr[i]->X;
        if (pArr[i]->Y < minY) minY = pArr[i]->Y;

        if (pArr[i]->X > maxX) maxX = pArr[i]->X;
        if (pArr[i]->Y > maxY) maxY = pArr[i]->Y;
    }

    Point* minp = new Point(minX, minY);
    Point* maxp = new Point(maxX, maxY);
    
    cb->DoCallback(minp, maxp);
}

double Api::Test_WASM_Performance() {
    int n = 10000000;
    double coeffs = 0.005;
    double sum = 0;
    for (int i = 0; i < n; i++) {
        Point* p = new Point((i % 100) * 5, (i % 100) * 3);
        sum += (i + coeffs * p->X - i + coeffs * p->Y);
        delete p;
    }
    return sum;
}

void Api::TextureRequest(const char* _url) {
    FVirApi->DownloadAndMakeTexture(_url);
}

void Api::ChangeTexture_OnWheel(int x, int y, int load, int halfWidth, int halfHeight) {
    if (load > FLoad) {
        tileCoorX[load] = 2 * tileCoorX[load - 1] + floor(x / halfWidth);
        tileCoorY[load] = 2 * tileCoorY[load - 1] + floor(y / halfHeight);;
    }

    FLoad = load;
    int X = tileCoorX[FLoad];
    int Y = tileCoorY[FLoad];

    std::string tile_url = FTile_Map_url +
                            std::to_string(FLoad) + "/" +
                            std::to_string(Y) + "/" +
                            std::to_string(X);

    FVirApi->DownloadAndMakeTexture(tile_url.c_str());
}

const char* Api::LatLonToTileUrl(double lat, double lon, int zoom) {
    int x = floor((lon + 180) / 360 * pow(2, zoom));
    int y = floor((1 - log(tan(lat * M_PI / 180) + 1 / cos(lat * M_PI / 180)) / M_PI) / 2 * pow(2, zoom));

    std::string tile_url = FTile_Map_url +
                            std::to_string(zoom) + "/" +
                            std::to_string(y) + "/" +
                            std::to_string(x);

    return tile_url.c_str();
}
