---
sidebar_position: 2
---

The operations related to coroutines comprise a sub-library of
the basic library and come inside the table `coroutine`.

## `coroutine.create (f)`

Creates a new coroutine, with body `f`.
`f` must be a Lua function.
Returns this new coroutine,
an object with type `"thread"`.

## `coroutine.resume (co [, val1, ...])`

Starts or continues the execution of coroutine `co`.
The first time you resume a coroutine,
it starts running its body.
The values `val1`, ... are passed
as the arguments to the body function.
If the coroutine has yielded,
`resume` restarts it;
the values `val1`, ... are passed
as the results from the yield.

If the coroutine runs without any errors,
`resume` returns **true** plus any values passed to `yield`
(if the coroutine yields) or any values returned by the body function
(if the coroutine terminates).
If there is any error,
`resume` returns **false** plus the error message.

## `coroutine.running ()`

Returns the running coroutine,
or **nil** when called by the main thread.

## `coroutine.status (co)`

Returns the status of coroutine `co`, as a string:
`"running"`,
if the coroutine is running (that is, it called `status`);
`"suspended"`, if the coroutine is suspended in a call to `yield`,
or if it has not started running yet;
`"normal"` if the coroutine is active but not running
(that is, it has resumed another coroutine);
and `"dead"` if the coroutine has finished its body function,
or if it has stopped with an error.

## `coroutine.wrap (f)`

Creates a new coroutine, with body `f`.
`f` must be a Lua function.
Returns a function that resumes the coroutine each time it is called.
Any arguments passed to the function behave as the
extra arguments to `resume`.
Returns the same values returned by `resume`,
except the first boolean.
In case of error, propagates the error.

## `coroutine.yield (...)`

Suspends the execution of the calling coroutine.
The coroutine cannot be running a C function,
a metamethod, or an iterator.
Any arguments to `yield` are passed as extra results to `resume`.
