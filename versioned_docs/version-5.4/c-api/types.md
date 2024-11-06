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
`osize`, the original size of the block or some code about what
is being allocated;
and `nsize`, the new size of the block.

When `ptr` is not `NULL`,
`osize` is the size of the block pointed by `ptr`,
that is, the size given when it was allocated or reallocated.

When `ptr` is `NULL`,
`osize` encodes the kind of object that Lua is allocating.
`osize` is any of
`LUA_TSTRING`, `LUA_TTABLE`, `LUA_TFUNCTION`,
`LUA_TUSERDATA`, or `LUA_TTHREAD` when (and only when)
Lua is creating a new object of that type.
When `osize` is some other value,
Lua is allocating memory for something else.

Lua assumes the following behavior from the allocator function:

When `nsize` is zero,
the allocator must behave like `free`
and then return `NULL`.

When `nsize` is not zero,
the allocator must behave like `realloc`.
In particular, the allocator returns `NULL`
if and only if it cannot fulfill the request.

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

Note that ISO C ensures
that `free(NULL)` has no effect and that
`realloc(NULL,size)` is equivalent to `malloc(size)`.

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
and returns in C the number of results.
Any other value in the stack below the results will be properly
discarded by Lua.
Like a Lua function, a C function called by Lua can also return
many results.

As an example, the following function receives a variable number
of numeric arguments and returns their average and their sum:

```c
static int foo (lua_State *L) {
  int n = lua_gettop(L);    /* number of arguments */
  lua_Number sum = 0.0;
  int i;
  for (i = 1; i <= n; i++) {
    if (!lua_isnumber(L, i)) {
      lua_pushliteral(L, "incorrect argument");
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
  size_t srclen;              /* (S) */
  int currentline;            /* (l) */
  int linedefined;            /* (S) */
  int lastlinedefined;        /* (S) */
  unsigned char nups;         /* (u) number of upvalues */
  unsigned char nparams;      /* (u) number of parameters */
  char isvararg;              /* (u) */
  char istailcall;            /* (t) */
  unsigned short ftransfer;   /* (r) index of first value transferred */
  unsigned short ntransfer;   /* (r) number of transferred values */
  char short_src[LUA_IDSIZE]; /* (S) */
  /* private part */
  <other fields>
} lua_Debug;
```

A structure used to carry different pieces of
information about a function or an activation record.
`lua_getstack` fills only the private part
of this structure, for later use.
To fill the other fields of `lua_Debug` with useful information,
you must call `lua_getinfo` with an appropriate parameter.
(Specifically, to get a field,
you must add the letter between parentheses in the field's comment
to the parameter `what` of `lua_getinfo`.)

The fields of `lua_Debug` have the following meaning:

- **`source`:**
  the source of the chunk that created the function.
  If `source` starts with a '`@`',
  it means that the function was defined in a file where
  the file name follows the '`@`'.
  If `source` starts with a '`=`',
  the remainder of its contents describes the source in a user-dependent manner.
  Otherwise,
  the function was defined in a string where
  `source` is that string.

- **`srclen`:**
  The length of the string `source`.

- **`short_src`:**
  a "printable" version of `source`, to be used in error messages.

- **`linedefined`:**
  the line number where the definition of the function starts.

- **`lastlinedefined`:**
  the line number where the definition of the function ends.

- **`what`:**
  the string `"Lua"` if the function is a Lua function,
  `"C"` if it is a C function,
  `"main"` if it is the main part of a chunk.

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

- **`istailcall`:**
  true if this function invocation was called by a tail call.
  In this case, the caller of this level is not in the stack.

- **`nups`:**
  the number of upvalues of the function.

- **`nparams`:**
  the number of parameters of the function
  (always 0 for C functions).

- **`isvararg`:**
  true if the function is a variadic function
  (always true for C functions).

- **`ftransfer`:**
  the index in the stack of the first value being "transferred",
  that is, parameters in a call or return values in a return.
  (The other values are in consecutive indices.)
  Using this index, you can access and modify these values
  through `lua_getlocal` and `lua_setlocal`.
  This field is only meaningful during a
  call hook, denoting the first parameter,
  or a return hook, denoting the first value being returned.
  (For call hooks, this value is always 1.)

- **`ntransfer`:**
  The number of values being transferred (see previous item).
  (For calls of Lua functions,
  this value is always equal to `nparams`.)

## `lua_Hook`

```c
typedef void (*lua_Hook) (lua_State *L, lua_Debug *ar);
```

Type for debugging hook functions.

Whenever a hook is called, its `ar` argument has its field
`event` set to the specific event that triggered the hook.
Lua identifies these events with the following constants:
`LUA_HOOKCALL`, `LUA_HOOKRET`,
`LUA_HOOKTAILCALL`, `LUA_HOOKLINE`,
and `LUA_HOOKCOUNT`.
Moreover, for line events, the field `currentline` is also set.
To get the value of any other field in `ar`,
the hook must call `lua_getinfo`.

For call events, `event` can be `LUA_HOOKCALL`,
the normal value, or `LUA_HOOKTAILCALL`, for a tail call;
in this case, there will be no corresponding return event.

While Lua is running a hook, it disables other calls to hooks.
Therefore, if a hook calls back Lua to execute a function or a chunk,
this execution occurs without any calls to hooks.

Hook functions cannot have continuations,
that is, they cannot call `lua_yieldk`,
`lua_pcallk`, or `lua_callk` with a non-null `k`.

Hook functions can yield under the following conditions:
Only count and line events can yield;
to yield, a hook function must finish its execution
calling `lua_yield` with `nresults` equal to zero
(that is, with no values).

## `lua_Integer`

```c
typedef ... lua_Integer;
```

The type of integers in Lua.

By default this type is `long long`,
(usually a 64-bit two-complement integer),
but that can be changed to `long` or `int`
(usually a 32-bit two-complement integer).
(See `LUA_INT_TYPE` in `luaconf.h`.)

Lua also defines the constants
`LUA_MININTEGER` and `LUA_MAXINTEGER`,
with the minimum and the maximum values that fit in this type.

## `lua_KContext`

```c
typedef ... lua_KContext;
```

The type for continuation-function contexts.
It must be a numeric type.
This type is defined as `intptr_t`
when `intptr_t` is available,
so that it can store pointers too.
Otherwise, it is defined as `ptrdiff_t`.

## `lua_KFunction`

```c
typedef int (*lua_KFunction) (lua_State *L, int status, lua_KContext ctx);
```

Type for continuation functions.

## `lua_Number`

```c
typedef ... lua_Number;
```

The type of floats in Lua.

By default this type is double,
but that can be changed to a single float or a long double.
(See `LUA_FLOAT_TYPE` in `luaconf.h`.)

## `lua_Reader`

```c
typedef const char * (*lua_Reader) (lua_State *L,
                                    void *data,
                                    size_t *size);
```

The reader function used by `lua_load`.
Every time `lua_load` needs another piece of the chunk,
it calls the reader,
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

An opaque structure that points to a thread and indirectly
(through the thread) to the whole state of a Lua interpreter.
The Lua library is fully reentrant:
it has no global variables.
All information about a state is accessible through this structure.

A pointer to this structure must be passed as the first argument to
every function in the library, except to `lua_newstate`,
which creates a Lua state from scratch.

## `lua_Unsigned`

```c
typedef ... lua_Unsigned;
```

The unsigned version of `lua_Integer`.

## `lua_WarnFunction`

```c
typedef void (*lua_WarnFunction) (void *ud, const char *msg, int tocont);
```

The type of warning functions, called by Lua to emit warnings.
The first parameter is an opaque pointer
set by `lua_setwarnf`.
The second parameter is the warning message.
The third parameter is a boolean that
indicates whether the message is
to be continued by the message in the next call.

See `warn` for more details about warnings.

## `lua_Writer`

```c
typedef int (*lua_Writer) (lua_State *L,
                           const void* p,
                           size_t sz,
                           void* ud);
```

The type of the writer function used by `lua_dump`.
Every time `lua_dump` produces another piece of chunk,
it calls the writer,
passing along the buffer to be written (`p`),
its size (`sz`),
and the `ud` parameter supplied to `lua_dump`.

The writer returns an error code:
0 means no errors;
any other value means an error and stops `lua_dump` from
calling the writer again.
