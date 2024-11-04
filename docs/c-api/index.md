# c-api

Here we list all functions and types from the C API in alphabetical order. Each function has an indicator like this:[-o, +p, x]

The first field, o, is how many elements the function pops from the stack. The second field, p, is how many elements the function pushes onto the stack. (Any function always pushes its results after popping its arguments.) A field in the form x|y means the function can push (or pop) x or y elements, depending on the situation; an interrogation mark '?' means that we cannot know how many elements the function pops/pushes by looking only at its arguments (e.g., they may depend on what is on the stack). The third field, x, tells whether the function may throw errors: '-' means the function never throws any error; 'e' means the function may throw errors; 'v' means the function may throw an error on purpose.
