mergeInto(LibraryManager.library, {
    $string2c_str: function (str) {
        ensureCache.prepare();
        return ensureString(str);
    },
});