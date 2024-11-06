# c-api

This section describes the C API for Lua, that is,
the set of C functions available to the host program to communicate
with Lua.
All API functions and related types and constants
are declared in the header file `lua.h`.

Even when we use the term "function",
any facility in the API may be provided as a macro instead.
Except where stated otherwise,
all such macros use each of their arguments exactly once
(except for the first argument, which is always a Lua state),
and so do not generate any hidden side-effects.

As in most C libraries,
the Lua API functions do not check their arguments
for validity or consistency.
However, you can change this behavior by compiling Lua
with the macro `LUA_USE_APICHECK` defined.

The Lua library is fully reentrant:
it has no global variables.
It keeps all information it needs in a dynamic structure,
called the _Lua state_.

Each Lua state has one or more threads,
which correspond to independent, cooperative lines of execution.
The type `lua_State` (despite its name) refers to a thread.
(Indirectly, through the thread, it also refers to the
Lua state associated to the thread.)

A pointer to a thread must be passed as the first argument to
every function in the library, except to `lua_newstate`,
which creates a Lua state from scratch and returns a pointer
to the _main thread_ in the new state.

## The Stack

Lua uses a _virtual stack_ to pass values to and from C.
Each element in this stack represents a Lua value
(**nil**, number, string, etc.).
Functions in the API can access this stack through the
Lua state parameter that they receive.

Whenever Lua calls C, the called function gets a new stack,
which is independent of previous stacks and of stacks of
C functions that are still active.
This stack initially contains any arguments to the C function
and it is where the C function can store temporary
Lua values and must push its results
to be returned to the caller (see `lua_CFunction`).

For convenience,
most query operations in the API do not follow a strict stack discipline.
Instead, they can refer to any element in the stack
by using an _index_:
A positive index represents an absolute stack position,
starting at 1 as the bottom of the stack;
a negative index represents an offset relative to the top of the stack.
More specifically, if the stack has _n_ elements,
then index 1 represents the first element
(that is, the element that was pushed onto the stack first)
and
index _n_ represents the last element;
index -1 also represents the last element
(that is, the element at the top)
and index _-n_ represents the first element.

### Stack Size

When you interact with the Lua API,
you are responsible for ensuring consistency.
In particular,
_you are responsible for controlling stack overflow_.
When you call any API function,
you must ensure the stack has enough room to accommodate the results.

There is one exception to the above rule:
When you call a Lua function
without a fixed number of results (see `lua_call`),
Lua ensures that the stack has enough space for all results.
However, it does not ensure any extra space.
So, before pushing anything on the stack after such a call
you should use `lua_checkstack`.

Whenever Lua calls C,
it ensures that the stack has space for
at least `LUA_MINSTACK` extra elements;
that is, you can safely push up to `LUA_MINSTACK` values into it.
`LUA_MINSTACK` is defined as 20,
so that usually you do not have to worry about stack space
unless your code has loops pushing elements onto the stack.
Whenever necessary,
you can use the function `lua_checkstack`
to ensure that the stack has enough space for pushing new elements.

### Valid and Acceptable Indices

Any function in the API that receives stack indices
works only with _valid indices_ or _acceptable indices_.

A _valid index_ is an index that refers to a
position that stores a modifiable Lua value.
It comprises stack indices between 1 and the stack top
(`1 <= abs(index) <= top`)

plus _pseudo-indices_,
which represent some positions that are accessible to C code
but that are not in the stack.
Pseudo-indices are used to access the registry
and the upvalues of a C function.

Functions that do not need a specific mutable position,
but only a value (e.g., query functions),
can be called with acceptable indices.
An _acceptable index_ can be any valid index,
but it also can be any positive index after the stack top
within the space allocated for the stack,
that is, indices up to the stack size.
(Note that 0 is never an acceptable index.)
Indices to upvalues greater than the real number
of upvalues in the current C function are also acceptable (but invalid).
Except when noted otherwise,
functions in the API work with acceptable indices.

Acceptable indices serve to avoid extra tests
against the stack top when querying the stack.
For instance, a C function can query its third argument
without the need to check whether there is a third argument,
that is, without the need to check whether 3 is a valid index.

For functions that can be called with acceptable indices,
any non-valid index is treated as if it
contains a value of a virtual type `LUA_TNONE`,
which behaves like a nil value.

### Pointers to strings

Several functions in the API return pointers (`const char*`)
to Lua strings in the stack.
(See `lua_pushfstring`, `lua_pushlstring`,
`lua_pushstring`, and `lua_tolstring`.
See also `luaL_checklstring`, `luaL_checkstring`,
and `luaL_tolstring` in the auxiliary library.)

In general,
Lua's garbage collection can free or move internal memory
and then invalidate pointers to internal strings.
To allow a safe use of these pointers,
the API guarantees that any pointer to a string in a stack index
is valid while the string value at that index is not removed from the stack.
(It can be moved to another index, though.)
When the index is a pseudo-index (referring to an upvalue),
the pointer is valid while the corresponding call is active and
the corresponding upvalue is not modified.

Some functions in the debug interface
also return pointers to strings,
namely `lua_getlocal`, `lua_getupvalue`,
`lua_setlocal`, and `lua_setupvalue`.
For these functions, the pointer is guaranteed to
be valid while the caller function is active and
the given closure (if one was given) is in the stack.

Except for these guarantees,
the garbage collector is free to invalidate
any pointer to internal strings.

## C Closures

When a C function is created,
it is possible to associate some values with it,
thus creating a _C closure_
(see `lua_pushcclosure`);
these values are called _upvalues_ and are
accessible to the function whenever it is called.

Whenever a C function is called,
its upvalues are located at specific pseudo-indices.
These pseudo-indices are produced by the macro
`lua_upvalueindex`.
The first upvalue associated with a function is at index
`lua_upvalueindex(1)`, and so on.
Any access to `lua_upvalueindex(n)`,
where _n_ is greater than the number of upvalues of the
current function
(but not greater than 256,
which is one plus the maximum number of upvalues in a closure),
produces an acceptable but invalid index.

A C closure can also change the values
of its corresponding upvalues.

## Registry

Lua provides a _registry_,
a predefined table that can be used by any C code to
store whatever Lua values it needs to store.
The registry table is always accessible at pseudo-index
`LUA_REGISTRYINDEX`.
Any C library can store data into this table,
but it must take care to choose keys
that are different from those used
by other libraries, to avoid collisions.
Typically, you should use as key a string containing your library name,
or a light userdata with the address of a C object in your code,
or any Lua object created by your code.
As with variable names,
string keys starting with an underscore followed by
uppercase letters are reserved for Lua.

The integer keys in the registry are used
by the reference mechanism (see `luaL_ref`)
and by some predefined values.
Therefore, integer keys in the registry
must not be used for other purposes.

When you create a new Lua state,
its registry comes with some predefined values.
These predefined values are indexed with integer keys
defined as constants in `lua.h`.
The following constants are defined:

- **`LUA_RIDX_MAINTHREAD`:** At this index the registry has
  the main thread of the state.
  (The main thread is the one created together with the state.)

- **`LUA_RIDX_GLOBALS`:** At this index the registry has
  the global environment.

## Error Handling in C

Internally, Lua uses the C `longjmp` facility to handle errors.
(Lua will use exceptions if you compile it as C++;
search for `LUAI_THROW` in the source code for details.)
When Lua faces any error,
such as a memory allocation error or a type error,
it _raises_ an error;
that is, it does a long jump.
A _protected environment_ uses `setjmp`
to set a recovery point;
any error jumps to the most recent active recovery point.

Inside a C function you can raise an error explicitly
by calling `lua_error`.

Most functions in the API can raise an error,
for instance due to a memory allocation error.
The documentation for each function indicates whether
it can raise errors.

If an error happens outside any protected environment,
Lua calls a _panic function_ (see `lua_atpanic`)
and then calls `abort`,
thus exiting the host application.
Your panic function can avoid this exit by
never returning
(e.g., doing a long jump to your own recovery point outside Lua).

The panic function,
as its name implies,
is a mechanism of last resort.
Programs should avoid it.
As a general rule,
when a C function is called by Lua with a Lua state,
it can do whatever it wants on that Lua state,
as it should be already protected.
However,
when C code operates on other Lua states
(e.g., a Lua-state argument to the function,
a Lua state stored in the registry, or
the result of `lua_newthread`),
it should use them only in API calls that cannot raise errors.

The panic function runs as if it were a message handler;
in particular, the error object is on the top of the stack.
However, there is no guarantee about stack space.
To push anything on the stack,
the panic function must first check the available space.

### Status Codes

Several functions that report errors in the API use the following
status codes to indicate different kinds of errors or other conditions:

- **`LUA_OK`:** no errors.

- **`LUA_ERRRUN`:** a runtime error.

- **`LUA_ERRMEM`:**
  memory allocation error.
  For such errors, Lua does not call the message handler.

- **`LUA_ERRERR`:** error while running the message handler.

- **`LUA_ERRSYNTAX`:** syntax error during precompilation.

- **`LUA_YIELD`:** the thread (coroutine) yields.

- **`LUA_ERRFILE`:** a file-related error;
  e.g., it cannot open or read the file.

These constants are defined in the header file `lua.h`.

## Handling Yields in C

Internally, Lua uses the C `longjmp` facility to yield a coroutine.
Therefore, if a C function `foo` calls an API function
and this API function yields
(directly or indirectly by calling another function that yields),
Lua cannot return to `foo` any more,
because the `longjmp` removes its frame from the C stack.

To avoid this kind of problem,
Lua raises an error whenever it tries to yield across an API call,
except for three functions:
`lua_yieldk`, `lua_callk`, and `lua_pcallk`.
All those functions receive a _continuation function_
(as a parameter named `k`) to continue execution after a yield.

We need to set some terminology to explain continuations.
We have a C function called from Lua which we will call
the _original function_.
This original function then calls one of those three functions in the C API,
which we will call the _callee function_,
that then yields the current thread.
This can happen when the callee function is `lua_yieldk`,
or when the callee function is either `lua_callk` or `lua_pcallk`
and the function called by them yields.

Suppose the running thread yields while executing the callee function.
After the thread resumes,
it eventually will finish running the callee function.
However,
the callee function cannot return to the original function,
because its frame in the C stack was destroyed by the yield.
Instead, Lua calls a _continuation function_,
which was given as an argument to the callee function.
As the name implies,
the continuation function should continue the task
of the original function.

As an illustration, consider the following function:

```c
int original_function (lua_State *L) {
  ...     /* code 1 */
  status = lua_pcall(L, n, m, h);  /* calls Lua */
  ...     /* code 2 */
}
```

Now we want to allow
the Lua code being run by `lua_pcall` to yield.
First, we can rewrite our function like here:

```c
int k (lua_State *L, int status, lua_KContext ctx) {
  ...  /* code 2 */
}

int original_function (lua_State *L) {
  ...     /* code 1 */
  return k(L, lua_pcall(L, n, m, h), ctx);
}
```

In the above code,
the new function `k` is a
_continuation function_ (with type `lua_KFunction`),
which should do all the work that the original function
was doing after calling `lua_pcall`.
Now, we must inform Lua that it must call `k` if the Lua code
being executed by `lua_pcall` gets interrupted in some way
(errors or yielding),
so we rewrite the code as here,
replacing `lua_pcall` by `lua_pcallk`:

```c
int original_function (lua_State *L) {
  ...     /* code 1 */
  return k(L, lua_pcallk(L, n, m, h, ctx2, k), ctx1);
}
```

Note the external, explicit call to the continuation:
Lua will call the continuation only if needed, that is,
in case of errors or resuming after a yield.
If the called function returns normally without ever yielding,
`lua_pcallk` (and `lua_callk`) will also return normally.
(Of course, instead of calling the continuation in that case,
you can do the equivalent work directly inside the original function.)

Besides the Lua state,
the continuation function has two other parameters:
the final status of the call and the context value (`ctx`) that
was passed originally to `lua_pcallk`.
Lua does not use this context value;
it only passes this value from the original function to the
continuation function.
For `lua_pcallk`,
the status is the same value that would be returned by `lua_pcallk`,
except that it is `LUA_YIELD` when being executed after a yield
(instead of `LUA_OK`).
For `lua_yieldk` and `lua_callk`,
the status is always `LUA_YIELD` when Lua calls the continuation.
(For these two functions,
Lua will not call the continuation in case of errors,
because they do not handle errors.)
Similarly, when using `lua_callk`,
you should call the continuation function
with `LUA_OK` as the status.
(For `lua_yieldk`, there is not much point in calling
directly the continuation function,
because `lua_yieldk` usually does not return.)

Lua treats the continuation function as if it were the original function.
The continuation function receives the same Lua stack
from the original function,
in the same state it would be if the callee function had returned.
(For instance,
after a `lua_callk` the function and its arguments are
removed from the stack and replaced by the results from the call.)
It also has the same upvalues.
Whatever it returns is handled by Lua as if it were the return
of the original function.
