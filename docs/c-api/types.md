---
sidebar_position: 1
---

Here we list all types from the C API in
alphabetical order.

## `lua_Alloc`

```c
typedef void * (*lua_Alloc) (void *ud,
                             void *ptr,
                             size_t osize,
                             size_t nsize);
```

The type of the memory-allocation function used by Lua states.
The allocator function must provide a
functionality similar to `realloc`,
but not exactly the same.
Its arguments are
`ud`, an opaque pointer passed to `lua_newstate`;
`ptr`, a pointer to the block being allocated/reallocated/freed;
`osize`, the original size of the block;
`nsize`, the new size of the block.
`ptr` is `NULL` if and only if `osize` is zero.
When `nsize` is zero, the allocator must return `NULL`;
if `osize` is not zero,
it should free the block pointed to by `ptr`.
When `nsize` is not zero, the allocator returns `NULL`
if and only if it cannot fill the request.
When `nsize` is not zero and `osize` is zero,
the allocator should behave like `malloc`.
When `nsize` and `osize` are not zero,
the allocator behaves like `realloc`.
Lua assumes that the allocator never fails when
`osize >= nsize`.

Here is a simple implementation for the allocator function.
It is used in the auxiliary library by `luaL_newstate`.

```c
static void *l_alloc (void *ud, void *ptr, size_t osize,
                                           size_t nsize) {
  (void)ud;  (void)osize;  /* not used */
  if (nsize == 0) {
    free(ptr);
    return NULL;
  }
  else
    return realloc(ptr, nsize);
}
```

This code assumes
that `free(NULL)` has no effect and that
`realloc(NULL, size)` is equivalent to `malloc(size)`.
ANSI C ensures both behaviors.

## `lua_CFunction`

```c
typedef int (*lua_CFunction) (lua_State *L);
```

Type for C functions.

In order to communicate properly with Lua,
a C function must use the following protocol,
which defines the way parameters and results are passed:
a C function receives its arguments from Lua in its stack
in direct order (the first argument is pushed first).
So, when the function starts,
`lua_gettop(L)` returns the number of arguments received by the function.
The first argument (if any) is at index 1
and its last argument is at index `lua_gettop(L)`.
To return values to Lua, a C function just pushes them onto the stack,
in direct order (the first result is pushed first),
and returns the number of results.
Any other value in the stack below the results will be properly
discarded by Lua.
Like a Lua function, a C function called by Lua can also return
many results.

As an example, the following function receives a variable number
of numerical arguments and returns their average and sum:

```c
static int foo (lua_State *L) {
  int n = lua_gettop(L);    /* number of arguments */
  lua_Number sum = 0;
  int i;
  for (i = 1; i <= n; i++) {
    if (!lua_isnumber(L, i)) {
      lua_pushstring(L, "incorrect argument");
      lua_error(L);
    }
    sum += lua_tonumber(L, i);
  }
  lua_pushnumber(L, sum/n);        /* first result */
  lua_pushnumber(L, sum);         /* second result */
  return 2;                   /* number of results */
}
```

## `lua_Debug`

```c
typedef struct lua_Debug {
  int event;
  const char *name;           /* (n) */
  const char *namewhat;       /* (n) */
  const char *what;           /* (S) */
  const char *source;         /* (S) */
  int currentline;            /* (l) */
  int nups;                   /* (u) number of upvalues */
  int linedefined;            /* (S) */
  int lastlinedefined;        /* (S) */
  char short_src[LUA_IDSIZE]; /* (S) */
  /* private part */
  <other fields>
} lua_Debug;
```

A structure used to carry different pieces of
information about an active function.
`lua_getstack` fills only the private part
of this structure, for later use.
To fill the other fields of `lua_Debug` with useful information,
call `lua_getinfo`.

The fields of `lua_Debug` have the following meaning:

- **`source`:**
  If the function was defined in a string,
  then `source` is that string.
  If the function was defined in a file,
  then `source` starts with a '`@`' followed by the file name.

- **`short_src`:**
  a "printable" version of `source`, to be used in error messages.

- **`linedefined`:**
  the line number where the definition of the function starts.

- **`lastlinedefined`:**
  the line number where the definition of the function ends.

- **`what`:**
  the string `"Lua"` if the function is a Lua function,
  `"C"` if it is a C function,
  `"main"` if it is the main part of a chunk,
  and `"tail"` if it was a function that did a tail call.
  In the latter case,
  Lua has no other information about the function.

- **`currentline`:**
  the current line where the given function is executing.
  When no line information is available,
  `currentline` is set to -1.

- **`name`:**
  a reasonable name for the given function.
  Because functions in Lua are first-class values,
  they do not have a fixed name:
  some functions can be the value of multiple global variables,
  while others can be stored only in a table field.
  The `lua_getinfo` function checks how the function was
  called to find a suitable name.
  If it cannot find a name,
  then `name` is set to `NULL`.

- **`namewhat`:**
  explains the `name` field.
  The value of `namewhat` can be
  `"global"`, `"local"`, `"method"`,
  `"field"`, `"upvalue"`, or `""` (the empty string),
  according to how the function was called.
  (Lua uses the empty string when no other option seems to apply.)

- **`nups`:**
  the number of upvalues of the function.

## `lua_Hook`

```c
typedef void (*lua_Hook) (lua_State *L, lua_Debug *ar);
```

Type for debugging hook functions.

Whenever a hook is called, its `ar` argument has its field
`event` set to the specific event that triggered the hook.
Lua identifies these events with the following constants:
`LUA_HOOKCALL`, `LUA_HOOKRET`,
`LUA_HOOKTAILRET`, `LUA_HOOKLINE`,
and `LUA_HOOKCOUNT`.
Moreover, for line events, the field `currentline` is also set.
To get the value of any other field in `ar`,
the hook must call `lua_getinfo`.
For return events, `event` can be `LUA_HOOKRET`,
the normal value, or `LUA_HOOKTAILRET`.
In the latter case, Lua is simulating a return from
a function that did a tail call;
in this case, it is useless to call `lua_getinfo`.

While Lua is running a hook, it disables other calls to hooks.
Therefore, if a hook calls back Lua to execute a function or a chunk,
this execution occurs without any calls to hooks.

## `lua_Integer`

```c
typedef ptrdiff_t lua_Integer;
```

The type used by the Lua API to represent integral values.

By default it is a `ptrdiff_t`,
which is usually the largest signed integral type the machine handles
"comfortably".

## `lua_Number`

```c
typedef double lua_Number;
```

The type of numbers in Lua.
By default, it is double, but that can be changed in `luaconf.h`.

Through the configuration file you can change
Lua to operate with another type for numbers (e.g., float or long).

## `lua_Reader`

```c
typedef const char * (*lua_Reader) (lua_State *L,
                                    void *data,
                                    size_t *size);
```

The reader function used by `lua_load`.
Every time it needs another piece of the chunk,
`lua_load` calls the reader,
passing along its `data` parameter.
The reader must return a pointer to a block of memory
with a new piece of the chunk
and set `size` to the block size.
The block must exist until the reader function is called again.
To signal the end of the chunk,
the reader must return `NULL` or set `size` to zero.
The reader function may return pieces of any size greater than zero.

## `lua_State`

```c
typedef struct lua_State lua_State;
```

Opaque structure that keeps the whole state of a Lua interpreter.
The Lua library is fully reentrant:
it has no global variables.
All information about a state is kept in this structure.

A pointer to this state must be passed as the first argument to
every function in the library, except to `lua_newstate`,
which creates a Lua state from scratch.

## `lua_Writer`

```c
typedef int (*lua_Writer) (lua_State *L,
                           const void* p,
                           size_t sz,
                           void* ud);
```

The type of the writer function used by `lua_dump`.
Every time it produces another piece of chunk,
`lua_dump` calls the writer,
passing along the buffer to be written (`p`),
its size (`sz`),
and the `data` parameter supplied to `lua_dump`.

The writer returns an error code:
0 means no errors;
any other value means an error and stops `lua_dump` from
calling the writer again.
