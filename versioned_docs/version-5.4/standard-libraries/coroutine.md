---
sidebar_position: 2
---

This library comprises the operations to manipulate coroutines,
which come inside the table `coroutine`.

## `coroutine.close (co)`

Closes coroutine `co`,
that is,
closes all its pending to-be-closed variables
and puts the coroutine in a dead state.
The given coroutine must be dead or suspended.
In case of error
(either the original error that stopped the coroutine or
errors in closing methods),
returns **false** plus the error object;
otherwise returns **true**.

## `coroutine.create (f)`

Creates a new coroutine, with body `f`.
`f` must be a function.
Returns this new coroutine,
an object with type `"thread"`.

## `coroutine.isyieldable ([co])`

Returns **true** when the coroutine `co` can yield.
The default for `co` is the running coroutine.

A coroutine is yieldable if it is not the main thread and
it is not inside a non-yieldable C function.

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
(when the coroutine yields) or any values returned by the body function
(when the coroutine terminates).
If there is any error,
`resume` returns **false** plus the error message.

## `coroutine.running ()`

Returns the running coroutine plus a boolean,
**true** when the running coroutine is the main one.

## `coroutine.status (co)`

Returns the status of the coroutine `co`, as a string:
`"running"`,
if the coroutine is running
(that is, it is the one that called `status`);
`"suspended"`, if the coroutine is suspended in a call to `yield`,
or if it has not started running yet;
`"normal"` if the coroutine is active but not running
(that is, it has resumed another coroutine);
and `"dead"` if the coroutine has finished its body function,
or if it has stopped with an error.

## `coroutine.wrap (f)`

Creates a new coroutine, with body `f`;
`f` must be a function.
Returns a function that resumes the coroutine each time it is called.
Any arguments passed to this function behave as the
extra arguments to `resume`.
The function returns the same values returned by `resume`,
except the first boolean.
In case of error,
the function closes the coroutine and propagates the error.

## `coroutine.yield (...)`

Suspends the execution of the calling coroutine.
Any arguments to `yield` are passed as extra results to `resume`.
