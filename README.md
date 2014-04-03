# shooter.io (HTML5)

HTML5 client for the [shooter-server][4] that powers [shooter.io][3].

This is a work in progress :-).

## How to run the site

It's easy. Open your favorite terminal and type:

```
git clone https://github.com/xiam/shooter-html5.git
cd ./shooter-html5/src
python -m SimpleHTTPServer
```

The last command will run a HTTP server on `localhost`, fire up Chrome and type
`http://localhost:8000` to see the game.

Running a local `shooter-server` is not required, as this client will connect
to the main [shooter.io][3] game server by itself.

## How to collaborate

You may...

* [Take an issue][1] and fix it.
* [Open an issue][1] and justify it.
* Or [report a bug][1].

## Acknowledgements

Thanks to [Kenney Vleugels][2] for his awesome art and assets.

```
###############################################################################

	Space Shooter (Redux, plus fonts and sounds) by Kenney Vleugels (www.kenney.nl)

			------------------------------

			        License (CC0)
	       http://creativecommons.org/publicdomain/zero/1.0/

	You may use these graphics in personal and commercial projects.
	Credit (Kenney or www.kenney.nl) would be nice but is not mandatory.

###############################################################################
```

## License
>
> Copyright (c) 2014 José Carlos Nieto, https://menteslibres.net/xiam
>
> Permission is hereby granted, free of charge, to any person obtaining
> a copy of this software and associated documentation files (the
> "Software"), to deal in the Software without restriction, including
> without limitation the rights to use, copy, modify, merge, publish,
> distribute, sublicense, and/or sell copies of the Software, and to
> permit persons to whom the Software is furnished to do so, subject to
> the following conditions:
>
> The above copyright notice and this permission notice shall be
> included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
> MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
> NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
> LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
> OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
> WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[1]: https://github.com/xiam/shooter-html5/issues
[2]: http://kenney.nl/
[3]: http://shooter.io
[4]: https://github.com/xiam/shooter-server
