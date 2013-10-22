epixcloud
=========

[![Build Status](https://travis-ci.org/BrandwatchLtd/epixcloud.png?branch=master)](https://travis-ci.org/BrandwatchLtd/epixcloud)

Builds word clouds really quickly

Requires $, Underscore.js and Require.js

TOPICS CLOUD, HOOOOOO!

#### required options:
```
   topics               Array   An array of topic object in the following format:
       {
         weight         Number  required  any positive value, range is normalised to a linear scale of 0 to 10
         text           String  required  the topic text, ideally this should be one or two words
         url            String  optional  the URL to apply on the A element wrapping the topic text, defaults to #
         title          String  optional  the TITLE attribute to apply to the wrapping A element, defaults to topic text
         customClass    String  optional  this string is appended to the class name given to the span representing the topic in the cloud
         dataAttributes Object  optional  any data-X attributes that should be applied to the SPAN wrapping the topic.
                                          Applied as key-value pairs
       }
   $el                  $     The container for the cloud. Must have a defined width and height,
                              position: relative will be set programatically
```

#### optional options (!)
   * **wordClass**            *String*  Class name given to all topics in the cloud
   * **weightClass**          *String*  Prepended to the class used for the normalised weight (0 to 10)
   * **idHead**               *String*  The head of the ID for each topic
   * **async**                *Bool*    If set true then the cloud runs asynchronously, but you probably don't need this

### Example Usage:

```
   new EpixCloud({
     topics: topicsToUse,
     $el: $cloudContainer
   }).render();
```

<pre>
                                            .-.
                                        .-.( ; )-.
                                       ( ;(); ).-.)
                                      ( ; )(:)( ; )
                                       (:)   ( ; )
                                              (:)
                                           .-'._.`-.
                                          /         `.                 _,,...._
                                          | /`-.     .                |```````.```-.
                                          | |   `.__.|                |           `-.`.
                                          | |   == \=|                |              `.\
                             .--.---'-----\  \     //                 |                \\_
                           .'    `.\ _:,----. \    /------.           |         __..---''
                         .'        )) /.     \ \__/ / \    `.          __..---''_..--''-''
                       .'         // ,'       `----'  |      \__..,--''__...--''       ||
                     .'          ; : |           |   _....--''  _...--''   .-.         ||
                    /-         .' |_ \       __..--''  _,.,..--':   |     / .(_\       ||
                   /_.+-+-+..___ .' `-,._.-''  _,..---'.         `.+.+ +.+  ) / )      ||
                  <( + + + .-.-./      (  _.-'' '   /   `.       (+ + + + +  (_//      ||
                   `+MJP..( (( (|       ;"    .'   ;      `.       + + + + ._(_/)      ||
                  '''    __\ \\ \\     ;    .'  .-'         ``-----'+'+'     (_/       '|
                  ..---''   `-'`-'`._.'    _..-'\                     |          /\    /\
                             .  ' `--  '--'      \                    |         /  )  /  \
                             |   /                |                   \    _,,-;   `'- -.:
                             |  |    .---.   .-------.                 _.-' _,'            `.
                            _`  (_.-'     `.((=#=#=#=#)            _.-'                     `.
                                 \         \ ((=#=#=#=)         .-'                  . -.    (
                                  \         \ (#=#=#=#______..-'             /      `.(_.'    \
 '     /'                          \         . =#=#=      .' |                                 .
/     /'                            \     _^_ . #=       / |                                    \
     '                      \        \  .'   `.\        ( \                                      .
     ;                      `.        \/       \         `. \                                     .\
    '                        |        (o        )         `.                 /  `-.__\.        _    .
   '                                   |\      /|          `.              ,'          `.  .  ( \   |
   |                        ,|         | `----' |           |             /              `\ `. `-' .'
   |                       /           |        |/           |          .'                 '--\.,-'
   |                                   |      .-'/           \         /
   |                                   `.    / .'             )       /
   |                                    `.  / / |             |+.    /+
   |                                    `. / / |              |  `+.+'
.-.|                                    | / /  |              |     /
.-.|                                    / / ---.              |    /
   |                                *-.| |      `--._         |   '.
   |                                 `,| |          _>        | .' |
   |                                   (_(_`-------'          |'   |
   |                                                          |    |
   |.-.   .-.   .-.   .-.   .-.   .-.   .-.   .-.   .-.   .-. | _.-'
   |.-.`-'.-.`-'.-.`-'.-.`-'.-.`-'.-.`-'.-.`-'.-.`-'.-.`-'_.-'
   '   `-'   `-'   `-'   `-'   `-'   `-'   `-'   `-'   `-'
</pre>
