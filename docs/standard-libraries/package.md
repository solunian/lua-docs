---
sidebar_position: 3
---

The package library provides basic
facilities for loading modules in Lua.
It exports one function directly in the global environment:
`require`.
Everything else is exported in the table `package`.

## `require (modname)`

Loads the given module.
The function starts by looking into the `package.loaded` table
to determine whether `modname` is already loaded.
If it is, then `require` returns the value stored
at `package.loaded[modname]`.
(The absence of a second result in this case
signals that this call did not have to load the module.)
Otherwise, it tries to find a _loader_ for the module.

To find a loader,
`require` is guided by the table `package.searchers`.
Each item in this table is a search function,
that searches for the module in a particular way.
By changing this table,
we can change how `require` looks for a module.
The following explanation is based on the default configuration
for `package.searchers`.

First `require` queries `package.preload[modname]`.
If it has a value,
this value (which must be a function) is the loader.
Otherwise `require` searches for a Lua loader using the
path stored in `package.path`.
If that also fails, it searches for a C loader using the
path stored in `package.cpath`.
If that also fails,
it tries an _all-in-one_ loader (see `package.searchers`).

Once a loader is found,
`require` calls the loader with two arguments:
`modname` and an extra value,
a _loader data_,
also returned by the searcher.
The loader data can be any value useful to the module;
for the default searchers,
it indicates where the loader was found.
(For instance, if the loader came from a file,
this extra value is the file path.)
If the loader returns any non-nil value,
`require` assigns the returned value to `package.loaded[modname]`.
If the loader does not return a non-nil value and
has not assigned any value to `package.loaded[modname]`,
then `require` assigns **true** to this entry.
In any case, `require` returns the
final value of `package.loaded[modname]`.
Besides that value, `require` also returns as a second result
the loader data returned by the searcher,
which indicates how `require` found the module.

If there is any error loading or running the module,
or if it cannot find any loader for the module,
then `require` raises an error.

## `package.config`

A string describing some compile-time configurations for packages.
This string is a sequence of lines:

- The first line is the directory separator string.
  Default is '`\`' for Windows and '`/`' for all other systems.

- The second line is the character that separates templates in a path.
  Default is '`;`'.

- The third line is the string that marks the
  substitution points in a template.
  Default is '`?`'.

- The fourth line is a string that, in a path in Windows,
  is replaced by the executable's directory.
  Default is '`!`'.

- The fifth line is a mark to ignore all text after it
  when building the `luaopen_` function name.
  Default is '`-`'.

## `package.cpath`

A string with the path used by `require`
to search for a C loader.

Lua initializes the C path `package.cpath` in the same way
it initializes the Lua path `package.path`,
using the environment variable `LUA_CPATH_5_4`,
or the environment variable `LUA_CPATH`,
or a default path defined in `luaconf.h`.

## `package.loaded`

A table used by `require` to control which
modules are already loaded.
When you require a module `modname` and
`package.loaded[modname]` is not false,
`require` simply returns the value stored there.

This variable is only a reference to the real table;
assignments to this variable do not change the
table used by `require`.
The real table is stored in the C registry,
indexed by the key `LUA_LOADED_TABLE`, a string.

## `package.loadlib (libname, funcname)`

Dynamically links the host program with the C library `libname`.

If `funcname` is "`*`",
then it only links with the library,
making the symbols exported by the library
available to other dynamically linked libraries.
Otherwise,
it looks for a function `funcname` inside the library
and returns this function as a C function.
So, `funcname` must follow the `lua_CFunction` prototype
(see `lua_CFunction`).

This is a low-level function.
It completely bypasses the package and module system.
Unlike `require`,
it does not perform any path searching and
does not automatically adds extensions.
`libname` must be the complete file name of the C library,
including if necessary a path and an extension.
`funcname` must be the exact name exported by the C library
(which may depend on the C compiler and linker used).

This functionality is not supported by ISO C.
As such, it is only available on some platforms
(Windows, Linux, Mac OS X, Solaris, BSD,
plus other Unix systems that support the `dlfcn` standard).

This function is inherently insecure,
as it allows Lua to call any function in any readable dynamic
library in the system.
(Lua calls any function assuming the function
has a proper prototype and respects a proper protocol
(see `lua_CFunction`).
Therefore,
calling an arbitrary function in an arbitrary dynamic library
more often than not results in an access violation.)

## `package.path`

A string with the path used by `require`
to search for a Lua loader.

At start-up, Lua initializes this variable with
the value of the environment variable `LUA_PATH_5_4` or
the environment variable `LUA_PATH` or
with a default path defined in `luaconf.h`,
if those environment variables are not defined.
A "`;;`" in the value of the environment variable
is replaced by the default path.

## `package.preload`

A table to store loaders for specific modules
(see `require`).

This variable is only a reference to the real table;
assignments to this variable do not change the
table used by `require`.
The real table is stored in the C registry,
indexed by the key `LUA_PRELOAD_TABLE`, a string.

## `package.searchers`

A table used by `require` to control how to find modules.

Each entry in this table is a _searcher function_.
When looking for a module,
`require` calls each of these searchers in ascending order,
with the module name (the argument given to `require`) as its
sole argument.
If the searcher finds the module,
it returns another function, the module _loader_,
plus an extra value, a _loader data_,
that will be passed to that loader and
returned as a second result by `require`.
If it cannot find the module,
it returns a string explaining why
(or **nil** if it has nothing to say).

Lua initializes this table with four searcher functions.

The first searcher simply looks for a loader in the
`package.preload` table.

The second searcher looks for a loader as a Lua library,
using the path stored at `package.path`.
The search is done as described in function `package.searchpath`.

The third searcher looks for a loader as a C library,
using the path given by the variable `package.cpath`.
Again,
the search is done as described in function `package.searchpath`.
For instance,
if the C path is the string

```
"./?.so;./?.dll;/usr/local/?/init.so"
```

the searcher for module `foo`
will try to open the files `./foo.so`, `./foo.dll`,
and `/usr/local/foo/init.so`, in that order.
Once it finds a C library,
this searcher first uses a dynamic link facility to link the
application with the library.
Then it tries to find a C function inside the library to
be used as the loader.
The name of this C function is the string "`luaopen_`"
concatenated with a copy of the module name where each dot
is replaced by an underscore.
Moreover, if the module name has a hyphen,
its suffix after (and including) the first hyphen is removed.
For instance, if the module name is `a.b.c-v2.1`,
the function name will be `luaopen_a_b_c`.

The fourth searcher tries an _all-in-one loader_.
It searches the C path for a library for
the root name of the given module.
For instance, when requiring `a.b.c`,
it will search for a C library for `a`.
If found, it looks into it for an open function for
the submodule;
in our example, that would be `luaopen_a_b_c`.
With this facility, a package can pack several C submodules
into one single library,
with each submodule keeping its original open function.

All searchers except the first one (preload) return as the extra value
the file path where the module was found,
as returned by `package.searchpath`.
The first searcher always returns the string "`:preload:`".

Searchers should raise no errors and have no side effects in Lua.
(They may have side effects in C,
for instance by linking the application with a library.)

## `package.searchpath (name, path [, sep [, rep]])`

Searches for the given `name` in the given `path`.

A path is a string containing a sequence of
_templates_ separated by semicolons.
For each template,
the function replaces each interrogation mark (if any)
in the template with a copy of `name`
wherein all occurrences of `sep`
(a dot, by default)
were replaced by `rep`
(the system's directory separator, by default),
and then tries to open the resulting file name.

For instance, if the path is the string

```
"./?.lua;./?.lc;/usr/local/?/init.lua"
```

the search for the name `foo.a`
will try to open the files
`./foo/a.lua`, `./foo/a.lc`, and
`/usr/local/foo/a/init.lua`, in that order.

Returns the resulting name of the first file that it can
open in read mode (after closing the file),
or **fail** plus an error message if none succeeds.
(This error message lists all file names it tried to open.)
