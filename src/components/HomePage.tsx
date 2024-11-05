import "@site/src/css/home.css";

export default function HomePage() {
  return (
    <>
      <div className="flexy">
        <div className="flexyblock">
          <h2>What is Lua?</h2>
          <p>
            Lua is a powerful, efficient, lightweight, embeddable scripting language. It supports
            procedural programming, object-oriented programming, functional programming, data-driven
            programming, and data description.
          </p>
          <p>
            Lua combines simple procedural syntax with powerful data description constructs based on
            associative arrays and extensible semantics. Lua is dynamically typed, runs by
            interpreting bytecode with a register-based virtual machine, and has automatic memory
            management with incremental garbage collection, making it ideal for configuration,
            scripting, and rapid prototyping.
          </p>
          <p>(copied from lua.org/about.html)</p>
        </div>
        <div className="flexyblock">
          <h2>Why is Lua just better?</h2>
          <p>
            Lua is just simple and fast. Only has 22 keywords (in v5.4), only one multi-purpose data
            structure (the table!), concise syntax (kinda), and an interface with C for embedding,
            etc. It's so simple; in fact, the documentation for its standard libraries is a plain
            html file in the version manual. Without a dark mode.
          </p>
          <p>
            Some would call such simplicity beautiful. I decided to take it upon myself to parse
            over the docs into something slightly better. Over the course of three days, I cracked
            out the horrors of Docusaurus and React for these lua-docs, returning briefly to the
            desolate space of web development.
          </p>
        </div>
        <div className="flexyblock">
          <h2>And Some Crediting!</h2>
          <p>
            A big thanks to the team at PUC-Rio who created Lua. It's a pretty cool language. The documentation here is meant to be an aesthetic replica of the manual from their website. There may be some innaccuracies in parsing it over.
            <hr/>
Lua is free software distributed under the terms of the MIT license reproduced here. Lua may be used for any purpose, including commercial purposes, at absolutely no cost. No paperwork, no royalties, no GNU-like "copyleft" restrictions, either. Just download it and use it.
          </p>
          <p>(copied from lua.org/license.html)</p>
        </div>
      </div>
    </>
  );
}
