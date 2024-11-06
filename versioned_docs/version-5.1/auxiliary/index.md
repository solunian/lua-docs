# auxiliary

The _auxiliary library_ provides several convenient functions
to interface C with Lua.
While the basic API provides the primitive functions for all
interactions between C and Lua,
the auxiliary library provides higher-level functions for some
common tasks.

All functions from the auxiliary library
are defined in header file `lauxlib.h` and
have a prefix `luaL_`.

All functions in the auxiliary library are built on
top of the basic API,
and so they provide nothing that cannot be done with this API.

Several functions in the auxiliary library are used to
check C function arguments.
Their names are always `luaL_check*` or `luaL_opt*`.
All of these functions throw an error if the check is not satisfied.
Because the error message is formatted for arguments
(e.g., "`bad argument #1`"),
you should not use these functions for other stack values.
