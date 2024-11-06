---
sidebar_position: 2
---

Here we list all functions from the C API in
alphabetical order.
Each function has an indicator like this:
`[-o, +p, x]`

The first field, `o`,
is how many elements the function pops from the stack.
The second field, `p`,
is how many elements the function pushes onto the stack.
(Any function always pushes its results after popping its arguments.)
A field in the form `x|y` means the function can push (or pop)
`x` or `y` elements,
depending on the situation;
an interrogation mark '`?`' means that
we cannot know how many elements the function pops/pushes
by looking only at its arguments.
(For instance, they may depend on what is in the stack.)
The third field, `x`,
tells whether the function may raise errors:
'`-`' means the function never raises any error;
'`m`' means the function may raise only out-of-memory errors;
'`v`' means the function may raise the errors explained in the text;
'`e`' means the function can run arbitrary Lua code,
either directly or through metamethods,
and therefore may raise any errors.

## `lua_absindex`

`[-0, +0, -]`

```c
int lua_absindex (lua_State *L, int idx);
```

Converts the acceptable index `idx`
into an equivalent absolute index
(that is, one that does not depend on the stack size).

## `lua_arith`

`[-(2|1), +1, e]`

```c
void lua_arith (lua_State *L, int op);
```

Performs an arithmetic or bitwise operation over the two values
(or one, in the case of negations)
at the top of the stack,
with the value on the top being the second operand,
pops these values, and pushes the result of the operation.
The function follows the semantics of the corresponding Lua operator
(that is, it may call metamethods).

The value of `op` must be one of the following constants:

- **`LUA_OPADD`:** performs addition (`+`)
- **`LUA_OPSUB`:** performs subtraction (`-`)
- **`LUA_OPMUL`:** performs multiplication (`*`)
- **`LUA_OPDIV`:** performs float division (`/`)
- **`LUA_OPIDIV`:** performs floor division (`//`)
- **`LUA_OPMOD`:** performs modulo (`%`)
- **`LUA_OPPOW`:** performs exponentiation (`^`)
- **`LUA_OPUNM`:** performs mathematical negation (unary `-`)
- **`LUA_OPBNOT`:** performs bitwise NOT (`~`)
- **`LUA_OPBAND`:** performs bitwise AND (`&`)
- **`LUA_OPBOR`:** performs bitwise OR (`|`)
- **`LUA_OPBXOR`:** performs bitwise exclusive OR (`~`)
- **`LUA_OPSHL`:** performs left shift (`<<`)
- **`LUA_OPSHR`:** performs right shift (`>>`)

## `lua_atpanic`

`[-0, +0, -]`

```c
lua_CFunction lua_atpanic (lua_State *L, lua_CFunction panicf);
```

Sets a new panic function and returns the old one.

## `lua_call`

`[-(nargs+1), +nresults, e]`

```c
void lua_call (lua_State *L, int nargs, int nresults);
```

Calls a function.
Like regular Lua calls,
`lua_call` respects the `__call` metamethod.
So, here the word "function"
means any callable value.

To do a call you must use the following protocol:
first, the function to be called is pushed onto the stack;
then, the arguments to the call are pushed
in direct order;
that is, the first argument is pushed first.
Finally you call `lua_call`;
`nargs` is the number of arguments that you pushed onto the stack.
When the function returns,
all arguments and the function value are popped
and the call results are pushed onto the stack.
The number of results is adjusted to `nresults`,
unless `nresults` is `LUA_MULTRET`.
In this case, all results from the function are pushed;
Lua takes care that the returned values fit into the stack space,
but it does not ensure any extra space in the stack.
The function results are pushed onto the stack in direct order
(the first result is pushed first),
so that after the call the last result is on the top of the stack.

Any error while calling and running the function is propagated upwards
(with a `longjmp`).

The following example shows how the host program can do the
equivalent to this Lua code:

```c
a = f("how", t.x, 14)
```

Here it is in C:

```c
lua_getglobal(L, "f");                  /* function to be called */
lua_pushliteral(L, "how");                       /* 1st argument */
lua_getglobal(L, "t");                    /* table to be indexed */
lua_getfield(L, -1, "x");        /* push result of t.x (2nd arg) */
lua_remove(L, -2);                  /* remove 't' from the stack */
lua_pushinteger(L, 14);                          /* 3rd argument */
lua_call(L, 3, 1);     /* call 'f' with 3 arguments and 1 result */
lua_setglobal(L, "a");                         /* set global 'a' */
```

Note that the code above is _balanced_:
at its end, the stack is back to its original configuration.
This is considered good programming practice.

## `lua_callk`

`[-(nargs + 1), +nresults, e]`

```c
void lua_callk (lua_State *L,
                int nargs,
                int nresults,
                lua_KContext ctx,
                lua_KFunction k);
```

This function behaves exactly like `lua_call`,
but allows the called function to yield.

## `lua_checkstack`

`[-0, +0, -]`

```c
int lua_checkstack (lua_State *L, int n);
```

Ensures that the stack has space for at least `n` extra elements,
that is, that you can safely push up to `n` values into it.
It returns false if it cannot fulfill the request,
either because it would cause the stack
to be greater than a fixed maximum size
(typically at least several thousand elements) or
because it cannot allocate memory for the extra space.
This function never shrinks the stack;
if the stack already has space for the extra elements,
it is left unchanged.

## `lua_close`

`[-0, +0, -]`

```c
void lua_close (lua_State *L);
```

Close all active to-be-closed variables in the main thread,
release all objects in the given Lua state
(calling the corresponding garbage-collection metamethods, if any),
and frees all dynamic memory used by this state.

On several platforms, you may not need to call this function,
because all resources are naturally released when the host program ends.
On the other hand, long-running programs that create multiple states,
such as daemons or web servers,
will probably need to close states as soon as they are not needed.

## `lua_closeslot`

`[-0, +0, e]`

```c
void lua_closeslot (lua_State *L, int index);
```

Close the to-be-closed slot at the given index and set its value to **nil**.
The index must be the last index previously marked to be closed
(see `lua_toclose`) that is still active (that is, not closed yet).

A `__close` metamethod cannot yield
when called through this function.

(This function was introduced in release 5.4.3.)

## `lua_closethread`

`[-0, +?, -]`

```c
int lua_closethread (lua_State *L, lua_State *from);
```

Resets a thread, cleaning its call stack and closing all pending
to-be-closed variables.
Returns a status code:
`LUA_OK` for no errors in the thread
(either the original error that stopped the thread or
errors in closing methods),
or an error status otherwise.
In case of error,
leaves the error object on the top of the stack.

The parameter `from` represents the coroutine that is resetting `L`.
If there is no such coroutine,
this parameter can be `NULL`.

(This function was introduced in release 5.4.6.)

## `lua_compare`

`[-0, +0, e]`

```c
int lua_compare (lua_State *L, int index1, int index2, int op);
```

Compares two Lua values.
Returns 1 if the value at index `index1` satisfies `op`
when compared with the value at index `index2`,
following the semantics of the corresponding Lua operator
(that is, it may call metamethods).
Otherwise returns 0.
Also returns 0 if any of the indices is not valid.

The value of `op` must be one of the following constants:

- **`LUA_OPEQ`:** compares for equality (`==`)
- **`LUA_OPLT`:** compares for less than (`<`)
- **`LUA_OPLE`:** compares for less or equal (`<=`)

## `lua_concat`

`[-n, +1, e]`

```c
void lua_concat (lua_State *L, int n);
```

Concatenates the `n` values at the top of the stack,
pops them, and leaves the result on the top.
If `n` is 1, the result is the single value on the stack
(that is, the function does nothing);
if `n` is 0, the result is the empty string.
Concatenation is performed following the usual semantics of Lua.

## `lua_copy`

`[-0, +0, -]`

```c
void lua_copy (lua_State *L, int fromidx, int toidx);
```

Copies the element at index `fromidx`
into the valid index `toidx`,
replacing the value at that position.
Values at other positions are not affected.

## `lua_createtable`

`[-0, +1, m]`

```c
void lua_createtable (lua_State *L, int narr, int nrec);
```

Creates a new empty table and pushes it onto the stack.
Parameter `narr` is a hint for how many elements the table
will have as a sequence;
parameter `nrec` is a hint for how many other elements
the table will have.
Lua may use these hints to preallocate memory for the new table.
This preallocation may help performance when you know in advance
how many elements the table will have.
Otherwise you can use the function `lua_newtable`.

## `lua_dump`

`[-0, +0, -]`

```c
int lua_dump (lua_State *L,
                  lua_Writer writer,
                  void *data,
                  int strip);
```

Dumps a function as a binary chunk.
Receives a Lua function on the top of the stack
and produces a binary chunk that,
if loaded again,
results in a function equivalent to the one dumped.
As it produces parts of the chunk,
`lua_dump` calls function `writer` (see `lua_Writer`)
with the given `data`
to write them.

If `strip` is true,
the binary representation may not include all debug information
about the function,
to save space.

The value returned is the error code returned by the last
call to the writer;
0 means no errors.

This function does not pop the Lua function from the stack.

## `lua_error`

`[-1, +0, v]`

```c
int lua_error (lua_State *L);
```

Raises a Lua error,
using the value on the top of the stack as the error object.
This function does a long jump,
and therefore never returns
(see `luaL_error`).

## `lua_gc`

`[-0, +0, -]`

```c
int lua_gc (lua_State *L, int what, ...);
```

Controls the garbage collector.

This function performs several tasks,
according to the value of the parameter `what`.
For options that need extra arguments,
they are listed after the option.

- **`LUA_GCCOLLECT`:**
  Performs a full garbage-collection cycle.

- **`LUA_GCSTOP`:**
  Stops the garbage collector.

- **`LUA_GCRESTART`:**
  Restarts the garbage collector.

- **`LUA_GCCOUNT`:**
  Returns the current amount of memory (in Kbytes) in use by Lua.

- **`LUA_GCCOUNTB`:**
  Returns the remainder of dividing the current amount of bytes of
  memory in use by Lua by 1024.

- **`LUA_GCSTEP` `(int stepsize)`:**
  Performs an incremental step of garbage collection,
  corresponding to the allocation of `stepsize` Kbytes.

- **`LUA_GCISRUNNING`:**
  Returns a boolean that tells whether the collector is running
  (i.e., not stopped).

- **`LUA_GCINC` (int pause, int stepmul, stepsize):**
  Changes the collector to incremental mode
  with the given parameters.
  Returns the previous mode (`LUA_GCGEN` or `LUA_GCINC`).

- **`LUA_GCGEN` (int minormul, int majormul):**
  Changes the collector to generational mode
  with the given parameters.
  Returns the previous mode (`LUA_GCGEN` or `LUA_GCINC`).

For more details about these options,
see `collectgarbage`.

This function should not be called by a finalizer.

## `lua_getallocf`

`[-0, +0, -]`

```c
lua_Alloc lua_getallocf (lua_State *L, void **ud);
```

Returns the memory-allocation function of a given state.
If `ud` is not `NULL`, Lua stores in `*ud` the
opaque pointer given when the memory-allocator function was set.

## `lua_getfield`

`[-0, +1, e]`

```c
int lua_getfield (lua_State *L, int index, const char *k);
```

Pushes onto the stack the value `t[k]`,
where `t` is the value at the given index.
As in Lua, this function may trigger a metamethod
for the "index" event.

Returns the type of the pushed value.

## `lua_getextraspace`

`[-0, +0, -]`

```c
void *lua_getextraspace (lua_State *L);
```

Returns a pointer to a raw memory area associated with the
given Lua state.
The application can use this area for any purpose;
Lua does not use it for anything.

Each new thread has this area initialized with a copy
of the area of the main thread.

By default, this area has the size of a pointer to void,
but you can recompile Lua with a different size for this area.
(See `LUA_EXTRASPACE` in `luaconf.h`.)

## `lua_getglobal`

`[-0, +1, e]`

```c
int lua_getglobal (lua_State *L, const char *name);
```

Pushes onto the stack the value of the global `name`.
Returns the type of that value.

## `lua_geti`

`[-0, +1, e]`

```c
int lua_geti (lua_State *L, int index, lua_Integer i);
```

Pushes onto the stack the value `t[i]`,
where `t` is the value at the given index.
As in Lua, this function may trigger a metamethod
for the "index" event.

Returns the type of the pushed value.

## `lua_getmetatable`

`[-0, +(0|1), -]`

```c
int lua_getmetatable (lua_State *L, int index);
```

If the value at the given index has a metatable,
the function pushes that metatable onto the stack and returns 1.
Otherwise,
the function returns 0 and pushes nothing on the stack.

## `lua_gettable`

`[-1, +1, e]`

```c
int lua_gettable (lua_State *L, int index);
```

Pushes onto the stack the value `t[k]`,
where `t` is the value at the given index
and `k` is the value on the top of the stack.

This function pops the key from the stack,
pushing the resulting value in its place.
As in Lua, this function may trigger a metamethod
for the "index" event.

Returns the type of the pushed value.

## `lua_gettop`

`[-0, +0, -]`

```c
int lua_gettop (lua_State *L);
```

Returns the index of the top element in the stack.
Because indices start at 1,
this result is equal to the number of elements in the stack;
in particular, 0 means an empty stack.

## `lua_getiuservalue`

`[-0, +1, -]`

```c
int lua_getiuservalue (lua_State *L, int index, int n);
```

Pushes onto the stack the `n`-th user value associated with the
full userdata at the given index and
returns the type of the pushed value.

If the userdata does not have that value,
pushes **nil** and returns `LUA_TNONE`.

## `lua_insert`

`[-1, +1, -]`

```c
void lua_insert (lua_State *L, int index);
```

Moves the top element into the given valid index,
shifting up the elements above this index to open space.
This function cannot be called with a pseudo-index,
because a pseudo-index is not an actual stack position.

## `lua_isboolean`

`[-0, +0, -]`

```c
int lua_isboolean (lua_State *L, int index);
```

Returns 1 if the value at the given index is a boolean,
and 0 otherwise.

## `lua_iscfunction`

`[-0, +0, -]`

```c
int lua_iscfunction (lua_State *L, int index);
```

Returns 1 if the value at the given index is a C function,
and 0 otherwise.

## `lua_isfunction`

`[-0, +0, -]`

```c
int lua_isfunction (lua_State *L, int index);
```

Returns 1 if the value at the given index is a function
(either C or Lua), and 0 otherwise.

## `lua_isinteger`

`[-0, +0, -]`

```c
int lua_isinteger (lua_State *L, int index);
```

Returns 1 if the value at the given index is an integer
(that is, the value is a number and is represented as an integer),
and 0 otherwise.

## `lua_islightuserdata`

`[-0, +0, -]`

```c
int lua_islightuserdata (lua_State *L, int index);
```

Returns 1 if the value at the given index is a light userdata,
and 0 otherwise.

## `lua_isnil`

`[-0, +0, -]`

```c
int lua_isnil (lua_State *L, int index);
```

Returns 1 if the value at the given index is **nil**,
and 0 otherwise.

## `lua_isnone`

`[-0, +0, -]`

```c
int lua_isnone (lua_State *L, int index);
```

Returns 1 if the given index is not valid,
and 0 otherwise.

## `lua_isnoneornil`

`[-0, +0, -]`

```c
int lua_isnoneornil (lua_State *L, int index);
```

Returns 1 if the given index is not valid
or if the value at this index is **nil**,
and 0 otherwise.

## `lua_isnumber`

`[-0, +0, -]`

```c
int lua_isnumber (lua_State *L, int index);
```

Returns 1 if the value at the given index is a number
or a string convertible to a number,
and 0 otherwise.

## `lua_isstring`

`[-0, +0, -]`

```c
int lua_isstring (lua_State *L, int index);
```

Returns 1 if the value at the given index is a string
or a number (which is always convertible to a string),
and 0 otherwise.

## `lua_istable`

`[-0, +0, -]`

```c
int lua_istable (lua_State *L, int index);
```

Returns 1 if the value at the given index is a table,
and 0 otherwise.

## `lua_isthread`

`[-0, +0, -]`

```c
int lua_isthread (lua_State *L, int index);
```

Returns 1 if the value at the given index is a thread,
and 0 otherwise.

## `lua_isuserdata`

`[-0, +0, -]`

```c
int lua_isuserdata (lua_State *L, int index);
```

Returns 1 if the value at the given index is a userdata
(either full or light), and 0 otherwise.

## `lua_isyieldable`

`[-0, +0, -]`

```c
int lua_isyieldable (lua_State *L);
```

Returns 1 if the given coroutine can yield,
and 0 otherwise.

## `lua_len`

`[-0, +1, e]`

```c
void lua_len (lua_State *L, int index);
```

Returns the length of the value at the given index.
It is equivalent to the '`#`' operator in Lua and
may trigger a metamethod for the "length" event.
The result is pushed on the stack.

## `lua_load`

`[-0, +1, -]`

```c
int lua_load (lua_State *L,
              lua_Reader reader,
              void *data,
              const char *chunkname,
              const char *mode);
```

Loads a Lua chunk without running it.
If there are no errors,
`lua_load` pushes the compiled chunk as a Lua
function on top of the stack.
Otherwise, it pushes an error message.

The `lua_load` function uses a user-supplied `reader` function
to read the chunk (see `lua_Reader`).
The `data` argument is an opaque value passed to the reader function.

The `chunkname` argument gives a name to the chunk,
which is used for error messages and in debug information.

`lua_load` automatically detects whether the chunk is text or binary
and loads it accordingly (see program `luac`).
The string `mode` works as in function `load`,
with the addition that
a `NULL` value is equivalent to the string "`bt`".

`lua_load` uses the stack internally,
so the reader function must always leave the stack
unmodified when returning.

`lua_load` can return
`LUA_OK`, `LUA_ERRSYNTAX`, or `LUA_ERRMEM`.
The function may also return other values corresponding to
errors raised by the read function.

If the resulting function has upvalues,
its first upvalue is set to the value of the global environment
stored at index `LUA_RIDX_GLOBALS` in the registry.
When loading main chunks,
this upvalue will be the `_ENV` variable.
Other upvalues are initialized with **nil**.

## `lua_newstate`

`[-0, +0, -]`

```c
lua_State *lua_newstate (lua_Alloc f, void *ud);
```

Creates a new independent state and returns its main thread.
Returns `NULL` if it cannot create the state
(due to lack of memory).
The argument `f` is the allocator function;
Lua will do all memory allocation for this state
through this function (see `lua_Alloc`).
The second argument, `ud`, is an opaque pointer that Lua
passes to the allocator in every call.

## `lua_newtable`

`[-0, +1, m]`

```c
void lua_newtable (lua_State *L);
```

Creates a new empty table and pushes it onto the stack.
It is equivalent to `lua_createtable(L, 0, 0)`.

## `lua_newthread`

`[-0, +1, m]`

```c
lua_State *lua_newthread (lua_State *L);
```

Creates a new thread, pushes it on the stack,
and returns a pointer to a `lua_State` that represents this new thread.
The new thread returned by this function shares with the original thread
its global environment,
but has an independent execution stack.

Threads are subject to garbage collection,
like any Lua object.

## `lua_newuserdatauv`

`[-0, +1, m]`

```c
void *lua_newuserdatauv (lua_State *L, size_t size, int nuvalue);
```

This function creates and pushes on the stack a new full userdata,
with `nuvalue` associated Lua values, called `user values`,
plus an associated block of raw memory with `size` bytes.
(The user values can be set and read with the functions
`lua_setiuservalue` and `lua_getiuservalue`.)

The function returns the address of the block of memory.
Lua ensures that this address is valid as long as
the corresponding userdata is alive.
Moreover, if the userdata is marked for finalization,
its address is valid at least until the call to its finalizer.

## `lua_next`

`[-1, +(2|0), v]`

```c
int lua_next (lua_State *L, int index);
```

Pops a key from the stack,
and pushes a key-value pair from the table at the given index,
the "next" pair after the given key.
If there are no more elements in the table,
then `lua_next` returns 0 and pushes nothing.

A typical table traversal looks like this:

```c
/* table is in the stack at index 't' */
lua_pushnil(L);  /* first key */
while (lua_next(L, t) != 0) {
  /* uses 'key' (at index -2) and 'value' (at index -1) */
  printf("%s - %s\n",
        lua_typename(L, lua_type(L, -2)),
        lua_typename(L, lua_type(L, -1)));
  /* removes 'value'; keeps 'key' for next iteration */
  lua_pop(L, 1);
}
```

While traversing a table,
avoid calling `lua_tolstring` directly on a key,
unless you know that the key is actually a string.
Recall that `lua_tolstring` may change
the value at the given index;
this confuses the next call to `lua_next`.

This function may raise an error if the given key
is neither **nil** nor present in the table.
See function `next` for the caveats of modifying
the table during its traversal.

## `lua_numbertointeger`

```c
int lua_numbertointeger (lua_Number n, lua_Integer *p);
```

Tries to convert a Lua float to a Lua integer;
the float `n` must have an integral value.
If that value is within the range of Lua integers,
it is converted to an integer and assigned to `*p`.
The macro results in a boolean indicating whether the
conversion was successful.
(Note that this range test can be tricky to do
correctly without this macro, due to rounding.)

This macro may evaluate its arguments more than once.

## `lua_pcall`

`[-(nargs + 1), +(nresults|1), -]`

```c
int lua_pcall (lua_State *L, int nargs, int nresults, int msgh);
```

Calls a function (or a callable object) in protected mode.

Both `nargs` and `nresults` have the same meaning as
in `lua_call`.
If there are no errors during the call,
`lua_pcall` behaves exactly like `lua_call`.
However, if there is any error,
`lua_pcall` catches it,
pushes a single value on the stack (the error object),
and returns an error code.
Like `lua_call`,
`lua_pcall` always removes the function
and its arguments from the stack.

If `msgh` is 0,
then the error object returned on the stack
is exactly the original error object.
Otherwise, `msgh` is the stack index of a
_message handler_.
(This index cannot be a pseudo-index.)
In case of runtime errors,
this handler will be called with the error object
and its return value will be the object
returned on the stack by `lua_pcall`.

Typically, the message handler is used to add more debug
information to the error object, such as a stack traceback.
Such information cannot be gathered after the return of `lua_pcall`,
since by then the stack has unwound.

The `lua_pcall` function returns one of the following status codes:
`LUA_OK`, `LUA_ERRRUN`, `LUA_ERRMEM`, or `LUA_ERRERR`.

## `lua_pcallk`

`[-(nargs + 1), +(nresults|1), -]`

```c
int lua_pcallk (lua_State *L,
                int nargs,
                int nresults,
                int msgh,
                lua_KContext ctx,
                lua_KFunction k);
```

This function behaves exactly like `lua_pcall`,
except that it allows the called function to yield.

## `lua_pop`

`[-n, +0, e]`

```c
void lua_pop (lua_State *L, int n);
```

Pops `n` elements from the stack.
It is implemented as a macro over `lua_settop`.

## `lua_pushboolean`

`[-0, +1, -]`

```c
void lua_pushboolean (lua_State *L, int b);
```

Pushes a boolean value with value `b` onto the stack.

## `lua_pushcclosure`

`[-n, +1, m]`

```c
void lua_pushcclosure (lua_State *L, lua_CFunction fn, int n);
```

Pushes a new C closure onto the stack.
This function receives a pointer to a C function
and pushes onto the stack a Lua value of type `function` that,
when called, invokes the corresponding C function.
The parameter `n` tells how many upvalues this function will have.

Any function to be callable by Lua must
follow the correct protocol to receive its parameters
and return its results (see `lua_CFunction`).

When a C function is created,
it is possible to associate some values with it,
the so called upvalues;
these upvalues are then accessible to the function whenever it is called.
This association is called a C closure.
To create a C closure,
first the initial values for its upvalues must be pushed onto the stack.
(When there are multiple upvalues, the first value is pushed first.)
Then `lua_pushcclosure`
is called to create and push the C function onto the stack,
with the argument `n` telling how many values will be
associated with the function.
`lua_pushcclosure` also pops these values from the stack.

The maximum value for `n` is 255.

When `n` is zero,
this function creates a _light C function_,
which is just a pointer to the C function.
In that case, it never raises a memory error.

## `lua_pushcfunction`

`[-0, +1, -]`

```c
void lua_pushcfunction (lua_State *L, lua_CFunction f);
```

Pushes a C function onto the stack.
This function is equivalent to `lua_pushcclosure` with no upvalues.

## `lua_pushfstring`

`[-0, +1, v]`

```c
const char *lua_pushfstring (lua_State *L, const char *fmt, ...);
```

Pushes onto the stack a formatted string
and returns a pointer to this string.
It is similar to the ISO C function `sprintf`,
but has two important differences.
First,
you do not have to allocate space for the result;
the result is a Lua string and Lua takes care of memory allocation
(and deallocation, through garbage collection).
Second,
the conversion specifiers are quite restricted.
There are no flags, widths, or precisions.
The conversion specifiers can only be
'`%%`' (inserts the character '`%`'),
'`%s`' (inserts a zero-terminated string, with no size restrictions),
'`%f`' (inserts a `lua_Number`),
'`%I`' (inserts a `lua_Integer`),
'`%p`' (inserts a pointer),
'`%d`' (inserts an `int`),
'`%c`' (inserts an `int` as a one-byte character), and
'`%U`' (inserts a `long int` as a UTF-8 byte sequence).

This function may raise errors due to memory overflow
or an invalid conversion specifier.

## `lua_pushglobaltable`

`[-0, +1, -]`

```c
void lua_pushglobaltable (lua_State *L);
```

Pushes the global environment onto the stack.

## `lua_pushinteger`

`[-0, +1, -]`

```c
void lua_pushinteger (lua_State *L, lua_Integer n);
```

Pushes an integer with value `n` onto the stack.

## `lua_pushlightuserdata`

`[-0, +1, -]`

```c
void lua_pushlightuserdata (lua_State *L, void *p);
```

Pushes a light userdata onto the stack.

Userdata represent C values in Lua.
A _light userdata_ represents a pointer, a `void*`.
It is a value (like a number):
you do not create it, it has no individual metatable,
and it is not collected (as it was never created).
A light userdata is equal to "any"
light userdata with the same C address.

## `lua_pushliteral`

`[-0, +1, m]`

```c
const char *lua_pushliteral (lua_State *L, const char *s);
```

This macro is equivalent to `lua_pushstring`,
but should be used only when `s` is a literal string.
(Lua may optimize this case.)

## `lua_pushlstring`

`[-0, +1, m]`

```c
const char *lua_pushlstring (lua_State *L, const char *s, size_t len);
```

Pushes the string pointed to by `s` with size `len`
onto the stack.
Lua will make or reuse an internal copy of the given string,
so the memory at `s` can be freed or reused immediately after
the function returns.
The string can contain any binary data,
including embedded zeros.

Returns a pointer to the internal copy of the string.

## `lua_pushnil`

`[-0, +1, -]`

```c
void lua_pushnil (lua_State *L);
```

Pushes a nil value onto the stack.

## `lua_pushnumber`

`[-0, +1, -]`

```c
void lua_pushnumber (lua_State *L, lua_Number n);
```

Pushes a float with value `n` onto the stack.

## `lua_pushstring`

`[-0, +1, m]`

```c
const char *lua_pushstring (lua_State *L, const char *s);
```

Pushes the zero-terminated string pointed to by `s`
onto the stack.
Lua will make or reuse an internal copy of the given string,
so the memory at `s` can be freed or reused immediately after
the function returns.

Returns a pointer to the internal copy of the string.

If `s` is `NULL`, pushes **nil** and returns `NULL`.

## `lua_pushthread`

`[-0, +1, -]`

```c
int lua_pushthread (lua_State *L);
```

Pushes the thread represented by `L` onto the stack.
Returns 1 if this thread is the main thread of its state.

## `lua_pushvalue`

`[-0, +1, -]`

```c
void lua_pushvalue (lua_State *L, int index);
```

Pushes a copy of the element at the given index
onto the stack.

## `lua_pushvfstring`

`[-0, +1, v]`

```c
const char *lua_pushvfstring (lua_State *L,
                              const char *fmt,
                              va_list argp);
```

Equivalent to `lua_pushfstring`, except that it receives a `va_list`
instead of a variable number of arguments.

## `lua_rawequal`

`[-0, +0, -]`

```c
int lua_rawequal (lua_State *L, int index1, int index2);
```

Returns 1 if the two values in indices `index1` and
`index2` are primitively equal
(that is, equal without calling the `__eq` metamethod).
Otherwise returns 0.
Also returns 0 if any of the indices are not valid.

## `lua_rawget`

`[-1, +1, -]`

```c
int lua_rawget (lua_State *L, int index);
```

Similar to `lua_gettable`, but does a raw access
(i.e., without metamethods).
The value at `index` must be a table.

## `lua_rawgeti`

`[-0, +1, -]`

```c
int lua_rawgeti (lua_State *L, int index, lua_Integer n);
```

Pushes onto the stack the value `t[n]`,
where `t` is the table at the given index.
The access is raw,
that is, it does not use the `__index` metavalue.

Returns the type of the pushed value.

## `lua_rawgetp`

`[-0, +1, -]`

```c
int lua_rawgetp (lua_State *L, int index, const void *p);
```

Pushes onto the stack the value `t[k]`,
where `t` is the table at the given index and
`k` is the pointer `p` represented as a light userdata.
The access is raw;
that is, it does not use the `__index` metavalue.

Returns the type of the pushed value.

## `lua_rawlen`

`[-0, +0, -]`

```c
lua_Unsigned lua_rawlen (lua_State *L, int index);
```

Returns the raw "length" of the value at the given index:
for strings, this is the string length;
for tables, this is the result of the length operator ('`#`')
with no metamethods;
for userdata, this is the size of the block of memory allocated
for the userdata.
For other values, this call returns 0.

## `lua_rawset`

`[-2, +0, m]`

```c
void lua_rawset (lua_State *L, int index);
```

Similar to `lua_settable`, but does a raw assignment
(i.e., without metamethods).
The value at `index` must be a table.

## `lua_rawseti`

`[-1, +0, m]`

```c
void lua_rawseti (lua_State *L, int index, lua_Integer i);
```

Does the equivalent of `t[i] = v`,
where `t` is the table at the given index
and `v` is the value on the top of the stack.

This function pops the value from the stack.
The assignment is raw,
that is, it does not use the `__newindex` metavalue.

## `lua_rawsetp`

`[-1, +0, m]`

```c
void lua_rawsetp (lua_State *L, int index, const void *p);
```

Does the equivalent of `t[p] = v`,
where `t` is the table at the given index,
`p` is encoded as a light userdata,
and `v` is the value on the top of the stack.

This function pops the value from the stack.
The assignment is raw,
that is, it does not use the `__newindex` metavalue.

## `lua_register`

`[-0, +0, e]`

```c
void lua_register (lua_State *L, const char *name, lua_CFunction f);
```

Sets the C function `f` as the new value of global `name`.
It is defined as a macro:

```c
#define lua_register(L,n,f) \
      (lua_pushcfunction(L, f), lua_setglobal(L, n))
```

## `lua_remove`

`[-1, +0, -]`

```c
void lua_remove (lua_State *L, int index);
```

Removes the element at the given valid index,
shifting down the elements above this index to fill the gap.
This function cannot be called with a pseudo-index,
because a pseudo-index is not an actual stack position.

## `lua_replace`

`[-1, +0, -]`

```c
void lua_replace (lua_State *L, int index);
```

Moves the top element into the given valid index
without shifting any element
(therefore replacing the value at that given index),
and then pops the top element.

## `lua_resetthread`

`[-0, +?, -]`

```c
int lua_resetthread (lua_State *L);
```

This function is deprecated;
it is equivalent to `lua_closethread` with
`from` being `NULL`.

## `lua_resume`

`[-?, +?, -]`

```c
int lua_resume (lua_State *L, lua_State *from, int nargs,
                          int *nresults);
```

Starts and resumes a coroutine in the given thread `L`.

To start a coroutine,
you push the main function plus any arguments
onto the empty stack of the thread.
then you call `lua_resume`,
with `nargs` being the number of arguments.
This call returns when the coroutine suspends or finishes its execution.
When it returns,
`*nresults` is updated and
the top of the stack contains
the `*nresults` values passed to `lua_yield`
or returned by the body function.
`lua_resume` returns
`LUA_YIELD` if the coroutine yields,
`LUA_OK` if the coroutine finishes its execution
without errors,
or an error code in case of errors.
In case of errors,
the error object is on the top of the stack.

To resume a coroutine,
you remove the `*nresults` yielded values from its stack,
push the values to be passed as results from `yield`,
and then call `lua_resume`.

The parameter `from` represents the coroutine that is resuming `L`.
If there is no such coroutine,
this parameter can be `NULL`.

## `lua_rotate`

`[-0, +0, -]`

```c
void lua_rotate (lua_State *L, int idx, int n);
```

Rotates the stack elements between the valid index `idx`
and the top of the stack.
The elements are rotated `n` positions in the direction of the top,
for a positive `n`,
or `-n` positions in the direction of the bottom,
for a negative `n`.
The absolute value of `n` must not be greater than the size
of the slice being rotated.
This function cannot be called with a pseudo-index,
because a pseudo-index is not an actual stack position.

## `lua_setallocf`

`[-0, +0, -]`

```c
void lua_setallocf (lua_State *L, lua_Alloc f, void *ud);
```

Changes the allocator function of a given state to `f`
with user data `ud`.

## `lua_setfield`

`[-1, +0, e]`

```c
void lua_setfield (lua_State *L, int index, const char *k);
```

Does the equivalent to `t[k] = v`,
where `t` is the value at the given index
and `v` is the value on the top of the stack.

This function pops the value from the stack.
As in Lua, this function may trigger a metamethod
for the "newindex" event.

## `lua_setglobal`

`[-1, +0, e]`

```c
void lua_setglobal (lua_State *L, const char *name);
```

Pops a value from the stack and
sets it as the new value of global `name`.

## `lua_seti`

`[-1, +0, e]`

```c
void lua_seti (lua_State *L, int index, lua_Integer n);
```

Does the equivalent to `t[n] = v`,
where `t` is the value at the given index
and `v` is the value on the top of the stack.

This function pops the value from the stack.
As in Lua, this function may trigger a metamethod
for the "newindex" event.

## `lua_setiuservalue`

`[-1, +0, -]`

```c
int lua_setiuservalue (lua_State *L, int index, int n);
```

Pops a value from the stack and sets it as
the new `n`-th user value associated to the
full userdata at the given index.
Returns 0 if the userdata does not have that value.

## `lua_setmetatable`

`[-1, +0, -]`

```c
int lua_setmetatable (lua_State *L, int index);
```

Pops a table or **nil** from the stack and
sets that value as the new metatable for the value at the given index.
(**nil** means no metatable.)

(For historical reasons, this function returns an `int`,
which now is always 1.)

## `lua_settable`

`[-2, +0, e]`

```c
void lua_settable (lua_State *L, int index);
```

Does the equivalent to `t[k] = v`,
where `t` is the value at the given index,
`v` is the value on the top of the stack,
and `k` is the value just below the top.

This function pops both the key and the value from the stack.
As in Lua, this function may trigger a metamethod
for the "newindex" event.

## `lua_settop`

`[-?, +?, e]`

```c
void lua_settop (lua_State *L, int index);
```

Accepts any index, or 0,
and sets the stack top to this index.
If the new top is greater than the old one,
then the new elements are filled with **nil**.
If `index` is 0, then all stack elements are removed.

This function can run arbitrary code when removing an index
marked as to-be-closed from the stack.

## `lua_setwarnf`

`[-0, +0, -]`

```c
void lua_setwarnf (lua_State *L, lua_WarnFunction f, void *ud);
```

Sets the warning function to be used by Lua to emit warnings
(see `lua_WarnFunction`).
The `ud` parameter sets the value `ud` passed to
the warning function.

## `lua_status`

`[-0, +0, -]`

```c
int lua_status (lua_State *L);
```

Returns the status of the thread `L`.

The status can be `LUA_OK` for a normal thread,
an error code if the thread finished the execution
of a `lua_resume` with an error,
or `LUA_YIELD` if the thread is suspended.

You can call functions only in threads with status `LUA_OK`.
You can resume threads with status `LUA_OK`
(to start a new coroutine) or `LUA_YIELD`
(to resume a coroutine).

## `lua_stringtonumber`

`[-0, +1, -]`

```c
size_t lua_stringtonumber (lua_State *L, const char *s);
```

Converts the zero-terminated string `s` to a number,
pushes that number into the stack,
and returns the total size of the string,
that is, its length plus one.
The conversion can result in an integer or a float,
according to the lexical conventions of Lua.
The string may have leading and trailing whitespaces and a sign.
If the string is not a valid numeral,
returns 0 and pushes nothing.
(Note that the result can be used as a boolean,
true if the conversion succeeds.)

## `lua_toboolean`

`[-0, +0, -]`

```c
int lua_toboolean (lua_State *L, int index);
```

Converts the Lua value at the given index to a C boolean
value (0 or 1).
Like all tests in Lua,
`lua_toboolean` returns true for any Lua value
different from **false** and **nil**;
otherwise it returns false.
(If you want to accept only actual boolean values,
use `lua_isboolean` to test the value's type.)

## `lua_tocfunction`

`[-0, +0, -]`

```c
lua_CFunction lua_tocfunction (lua_State *L, int index);
```

Converts a value at the given index to a C function.
That value must be a C function;
otherwise, returns `NULL`.

## `lua_toclose`

`[-0, +0, v]`

```c
void lua_toclose (lua_State *L, int index);
```

Marks the given index in the stack as a
to-be-closed slot.
Like a to-be-closed variable in Lua,
the value at that slot in the stack will be closed
when it goes out of scope.
Here, in the context of a C function,
to go out of scope means that the running function returns to Lua,
or there is an error,
or the slot is removed from the stack through
`lua_settop` or `lua_pop`,
or there is a call to `lua_closeslot`.
A slot marked as to-be-closed should not be removed from the stack
by any other function in the API except `lua_settop` or `lua_pop`,
unless previously deactivated by `lua_closeslot`.

This function raises an error if the value at the given slot
neither has a `__close` metamethod nor is a false value.

This function should not be called for an index
that is equal to or below an active to-be-closed slot.

Note that, both in case of errors and of a regular return,
by the time the `__close` metamethod runs,
the C stack was already unwound,
so that any automatic C variable declared in the calling function
(e.g., a buffer) will be out of scope.

## `lua_tointeger`

`[-0, +0, -]`

```c
lua_Integer lua_tointeger (lua_State *L, int index);
```

Equivalent to `lua_tointegerx` with `isnum` equal to `NULL`.

## `lua_tointegerx`

`[-0, +0, -]`

```c
lua_Integer lua_tointegerx (lua_State *L, int index, int *isnum);
```

Converts the Lua value at the given index
to the signed integral type `lua_Integer`.
The Lua value must be an integer,
or a number or string convertible to an integer;
otherwise, `lua_tointegerx` returns 0.

If `isnum` is not `NULL`,
its referent is assigned a boolean value that
indicates whether the operation succeeded.

## `lua_tolstring`

`[-0, +0, m]`

```c
const char *lua_tolstring (lua_State *L, int index, size_t *len);
```

Converts the Lua value at the given index to a C string.
If `len` is not `NULL`,
it sets `*len` with the string length.
The Lua value must be a string or a number;
otherwise, the function returns `NULL`.
If the value is a number,
then `lua_tolstring` also
_changes the actual value in the stack to a string_.
(This change confuses `lua_next`
when `lua_tolstring` is applied to keys during a table traversal.)

`lua_tolstring` returns a pointer
to a string inside the Lua state.
This string always has a zero ('`\0`')
after its last character (as in C),
but can contain other zeros in its body.

This function can raise memory errors only
when converting a number to a string
(as then it may create a new string).

## `lua_tonumber`

`[-0, +0, -]`

```c
lua_Number lua_tonumber (lua_State *L, int index);
```

Equivalent to `lua_tonumberx` with `isnum` equal to `NULL`.

## `lua_tonumberx`

`[-0, +0, -]`

```c
lua_Number lua_tonumberx (lua_State *L, int index, int *isnum);
```

Converts the Lua value at the given index
to the C type `lua_Number` (see `lua_Number`).
The Lua value must be a number or a string convertible to a number;
otherwise, `lua_tonumberx` returns 0.

If `isnum` is not `NULL`,
its referent is assigned a boolean value that
indicates whether the operation succeeded.

## `lua_topointer`

`[-0, +0, -]`

```c
const void *lua_topointer (lua_State *L, int index);
```

Converts the value at the given index to a generic
C pointer (`void*`).
The value can be a userdata, a table, a thread, a string, or a function;
otherwise, `lua_topointer` returns `NULL`.
Different objects will give different pointers.
There is no way to convert the pointer back to its original value.

Typically this function is used only for hashing and debug information.

## `lua_tostring`

`[-0, +0, m_]`

```c
const char *lua_tostring (lua_State *L, int index);
```

Equivalent to `lua_tolstring` with `len` equal to `NULL`.

## `lua_tothread`

`[-0, +0, -]`

```c
lua_State *lua_tothread (lua_State *L, int index);
```

Converts the value at the given index to a Lua thread
(represented as `lua_State*`).
This value must be a thread;
otherwise, the function returns `NULL`.

## `lua_touserdata`

`[-0, +0, -]`

```c
void *lua_touserdata (lua_State *L, int index);
```

If the value at the given index is a full userdata,
returns its memory-block address.
If the value is a light userdata,
returns its value (a pointer).
Otherwise, returns `NULL`.

## `lua_type`

`[-0, +0, -]`

```c
int lua_type (lua_State *L, int index);
```

Returns the type of the value in the given valid index,
or `LUA_TNONE` for a non-valid but acceptable index.
The types returned by `lua_type` are coded by the following constants
defined in `lua.h`:
`LUA_TNIL`,
`LUA_TNUMBER`,
`LUA_TBOOLEAN`,
`LUA_TSTRING`,
`LUA_TTABLE`,
`LUA_TFUNCTION`,
`LUA_TUSERDATA`,
`LUA_TTHREAD`,
and
`LUA_TLIGHTUSERDATA`.

## `lua_typename`

`[-0, +0, -]`

```c
const char *lua_typename (lua_State *L, int tp);
```

Returns the name of the type encoded by the value `tp`,
which must be one the values returned by `lua_type`.

## `lua_upvalueindex`

`[-0, +0, -]`

```c
int lua_upvalueindex (int i);
```

Returns the pseudo-index that represents the `i`-th upvalue of
the running function.
`i` must be in the range _[1,256]_.

## `lua_version`

`[-0, +0, -]`

```c
lua_Number lua_version (lua_State *L);
```

Returns the version number of this core.

## `lua_warning`

`[-0, +0, -]`

```c
void lua_warning (lua_State *L, const char *msg, int tocont);
```

Emits a warning with the given message.
A message in a call with `tocont` true should be
continued in another call to this function.

See `warn` for more details about warnings.

## `lua_xmove`

`[-?, +?, -]`

```c
void lua_xmove (lua_State *from, lua_State *to, int n);
```

Exchange values between different threads of the same state.

This function pops `n` values from the stack `from`,
and pushes them onto the stack `to`.

## `lua_yield`

`[-?, +?, v]`

```c
int lua_yield (lua_State *L, int nresults);
```

This function is equivalent to `lua_yieldk`,
but it has no continuation.
Therefore, when the thread resumes,
it continues the function that called
the function calling `lua_yield`.
To avoid surprises,
this function should be called only in a tail call.

## `lua_yieldk`

`[-?, +?, v]`

```c
int lua_yieldk (lua_State *L,
                int nresults,
                lua_KContext ctx,
                lua_KFunction k);
```

Yields a coroutine (thread).

When a C function calls `lua_yieldk`,
the running coroutine suspends its execution,
and the call to `lua_resume` that started this coroutine returns.
The parameter `nresults` is the number of values from the stack
that will be passed as results to `lua_resume`.

When the coroutine is resumed again,
Lua calls the given continuation function `k` to continue
the execution of the C function that yielded.
This continuation function receives the same stack
from the previous function,
with the `n` results removed and
replaced by the arguments passed to `lua_resume`.
Moreover,
the continuation function receives the value `ctx`
that was passed to `lua_yieldk`.

Usually, this function does not return;
when the coroutine eventually resumes,
it continues executing the continuation function.
However, there is one special case,
which is when this function is called
from inside a line or a count hook.
In that case, `lua_yieldk` should be called with no continuation
(probably in the form of `lua_yield`) and no results,
and the hook should return immediately after the call.
Lua will yield and,
when the coroutine resumes again,
it will continue the normal execution
of the (Lua) function that triggered the hook.

This function can raise an error if it is called from a thread
with a pending C call with no continuation function
(what is called a _C-call boundary_),
or it is called from a thread that is not running inside a resume
(typically the main thread).
