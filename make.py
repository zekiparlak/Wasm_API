import os

EMPP = "em++"
WEBIDL = "webidl_binder"

# Source files
API_SRC = ".\\Native"
SRC_FILE = API_SRC + "\\main.cpp"
BINDER_PATH = ".\\WasmBinder"
GLUJS_PATH = BINDER_PATH + "\\ApiGlue.js"
LIBFUNCS_PATH = BINDER_PATH + "\\LibFuncs.js"

OUTDIR = ".\\WasmTestApp\\src\\WasmAPI"
OUTPUT_FN = "ApiWasm_Test"
OUTPUT = OUTDIR + "\\" + OUTPUT_FN

EMPP_OPTS = [" -std=c++17 ",
             " -Os ",
             " -s EXPORT_NAME=ApiWasm_TestModule ",
             " -s MODULARIZE=1 ",
             " -s ENVIRONMENT=web,node ",
             " -s USE_ES6_IMPORT_META=1 ",
             """ -s EXPORTED_FUNCTIONS="['_malloc','_free','getValue','setValue','UTF8ToString']" """,
             """ -s EXPORTED_RUNTIME_METHODS="['string2c_str']" """,
             " -s INITIAL_MEMORY=200MB ",
             " --post-js " + GLUJS_PATH + " ",
             " --js-library " + LIBFUNCS_PATH + " "]

opts = "".join(EMPP_OPTS)

genereateGlue = WEBIDL + " " + BINDER_PATH + "\\main.idl" + " "  + BINDER_PATH + "\\ApiGlue"
buildAll = EMPP + " " + SRC_FILE + " -o " + OUTPUT + " " + opts

if(os.system(genereateGlue) == 0):
    if(os.system(buildAll) == 0):
        print("Success")