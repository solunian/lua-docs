# standard-libraries

The standard Lua libraries provide useful functions
that are implemented directly through the C API.
Some of these functions provide essential services to the language
(e.g., `type` and `getmetatable`);
others provide access to "outside" services (e.g., I/O);
and others could be implemented in Lua itself,
but are quite useful or have critical performance requirements that
deserve an implementation in C (e.g., `table.sort`).

All libraries are implemented through the official C API
and are provided as separate C modules.
Currently, Lua has the following standard libraries:

- basic library, which includes the coroutine sub-library;
- package library;
- string manipulation;
- table manipulation;
- mathematical functions (sin, log, etc.);
- input and output;
- operating system facilities;
- debug facilities.

Except for the basic and the package libraries, each library provides all its functions as fields of a global table or as methods of its objects.

To have access to these libraries,
the C host program should call the `luaL_openlibs` function,
which opens all standard libraries.
Alternatively,
it can open them individually by calling
`luaopen_base` (for the basic library),
`luaopen_package` (for the package library),
`luaopen_string` (for the string library),
`luaopen_table` (for the table library),
`luaopen_math` (for the mathematical library),
`luaopen_io` (for the I/O library),
`luaopen_os` (for the Operating System library),
and `luaopen_debug` (for the debug library).
These functions are declared in `lualib.h`
and should not be called directly:
you must call them like any other Lua C function,
e.g., by using `lua_call`.
