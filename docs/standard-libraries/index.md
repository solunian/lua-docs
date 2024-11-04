---
sidebar_position: 1
---

# standard-libraries

The standard Lua libraries provide useful functions that are implemented directly through the C API. Some of these functions provide essential services to the language (e.g., type and getmetatable); others provide access to "outside" services (e.g., I/O); and others could be implemented in Lua itself, but are quite useful or have critical performance requirements that deserve an implementation in C (e.g., table.sort).

All libraries are implemented through the official C API and are provided as separate C modules. Currently, Lua has the following standard libraries:

basic library (§6.1);
coroutine library (§6.2);
package library (§6.3);
string manipulation (§6.4);
table manipulation (§6.5);
mathematical functions (§6.6) (sin, log, etc.);
bitwise operations (§6.7);
input and output (§6.8);
operating system facilities (§6.9);
debug facilities (§6.10).
Except for the basic and the package libraries, each library provides all its functions as fields of a global table or as methods of its objects.

To have access to these libraries, the C host program should call the luaL_openlibs function, which opens all standard libraries. Alternatively, the host program can open them individually by using luaL_requiref to call luaopen_base (for the basic library), luaopen_package (for the package library), luaopen_coroutine (for the coroutine library), luaopen_string (for the string library), luaopen_table (for the table library), luaopen_math (for the mathematical library), luaopen_bit32 (for the bit library), luaopen_io (for the I/O library), luaopen_os (for the Operating System library), and luaopen_debug (for the debug library). These functions are declared in lualib.h.
