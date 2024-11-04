---
sidebar_position: 1
---

# lua

```lua
local love = require("love")
local table = require("table")
local io = require("io")

local b = {}

-- constant values --

b.ss = 25 -- square size for grid
b.w = 10 -- width
b.h = 20 -- height
b.sh = 3 -- spawn height, playfield must have 3 extra spawn rows
b.ts = { EMPTY = 1, FILLED = 2, ACTIVE = 3} -- block types


-- playfield is upside down!
-- (3, 3) is top left, (23,23) is bottom right, rows 1-3 are spawn rows
b.pf = {}

-- reset and init playfield
b.reinit_playfield = function ()
  for _=1,b.sh+b.h do
    local curr = {}
    for _=1,b.w do
      table.insert(curr, b.ts.EMPTY);
    end
    table.insert(b.pf, curr);
  end
end
```

:::tip

That's how it's done.

:::
