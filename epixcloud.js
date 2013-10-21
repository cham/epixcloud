/*
 * EPIXCLOUD by D Neame
 * Builds word clouds really quickly
 * Requires $, Underscore.js and Require.js
 *
 * TOPICS CLOUD, HOOOOOO!
 *
 * required options:
 *   topics               Array   An array of topic object in the following format:
 *       {
 *         weight         Number  required  any positive value, range is normalised to a linear scale of 0 to 10
 *         text           String  required  the topic text, ideally this should be one or two words
 *         url            String  optional  the URL to apply on the A element wrapping the topic text, defaults to #
 *         title          String  optional  the TITLE attribute to apply to the wrapping A element, defaults to topic text
 *         customClass    String  optional  this string is appended to the class name given to the span representing the topic in the cloud
 *         dataAttributes Object  optional  any data-X attributes that should be applied to the SPAN wrapping the topic.
                                            Applied as key-value pairs
 *       }
 *   $el                  $     The container for the cloud. Must have a defined width and height,
                                position: relative will be set programatically
 *
 * optional options (!)
 *   wordClass            String  Class name given to all topics in the cloud
 *   weightClass          String  Prepended to the class used for the normalised weight (0 to 10)
 *   idHead               String  The head of the ID for each topic
 *   async                Bool    If set true then the cloud runs asynchronously, but you probably don't need this
 *
 * Example Usage:
 *
 *   new EpixCloud({
 *     topics: topicsToUse,
 *     $el: $cloudContainer
 *   }).render();

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
 /     '                      \        \  .'   `.\        ( \                                      .
.      ;                      `.        \/       \         `. \                                     .\
|     '                        |        (o        )         `.                 /  `-.__\.        _    .
|    '                                   |\      /|          `.              ,'          `.  .  ( \   |
|    |                        ,|         | `----' |           |             /              `\ `. `-' .'
|    |                       /           |        |/           |          .'                 '--\.,-'
|    |                                   |      .-'/           \         /
|    |                                   `.    / .'             )       /
|    |                                    `.  / / |             |+.    /+
|    |                                    `. / / |              |  `+.+'
| .-.|                                    | / /  |              |     /
|'.-.|                                    / / ---.              |    /
''   |                                *-.| |      `--._         |   '.
     |                                 `,| |          _>        | .' |
     |                                   (_(_`-------'          |'   |
     |                                                          |    |
     |.-.   .-.   .-.   .-.   .-.   .-.   .-.   .-.   .-.   .-. | _.-'
     |.-.`-'.-.`-'.-.`-'.-.`-'.-.`-'.-.`-'.-.`-'.-.`-'.-.`-'_.-'
     '   `-'   `-'   `-'   `-'   `-'   `-'   `-'   `-'   `-'

*/
define(['jquery', 'underscore'], function($, _){
    'use strict';

    // intersection algorithms
    function lineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
        var d = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4),
            xi,yi;
        if(d === 0){
            return false;
        }

        xi = ((x3-x4)*(x1*y2-y1*x2)-(x1-x2)*(x3*y4-y3*x4))/d;
        yi = ((y3-y4)*(x1*y2-y1*x2)-(y1-y2)*(x3*y4-y3*x4))/d;

        if((xi < Math.min(x1,x2) || xi > Math.max(x1,x2)) ||
           (xi < Math.min(x3,x4) || xi > Math.max(x3,x4))){
            return false;
        }

        return true;
    }
    function boxIntersect(a,b){
        return a[2]>=b[0] && a[0]<=b[2] && a[3]>=b[1] && a[1]<=b[3];
    }

    function EpixCloud(options){
        if(!options.topics || !_.isArray(options.topics)){
            throw new Error('EpixCloud must be initialised with a topics array');
        }
        if(!(options.$el && _.isObject(options.$el) && options.$el instanceof $)){
            throw new Error('EpixCloud must be initialised with a container $el');
        }

        this.topics = options.topics;
        this.$el = options.$el;
        this.$el.css({position:'relative'});

        this.wordClass = options.wordClass || 'epixword';
        this.weightClass = options.weightClass || 'epixweight-';
        this.idHead = options.idHead || 'epixcloud-';

        this.init();
    }

    EpixCloud.prototype.init = function(){
        var self = this;

        this.$el.empty();

        this.containerSize = [this.$el.width(),this.$el.height()];
        this.aspect = this.containerSize[0] / this.containerSize[1];
        this.figureSpace = [];
        this.takenSpaces = [];

        if(!this.topics.length){ return; }

        this.topics.sort(function(a, b){
            if(a.weight < b.weight){
                return 1;
            }else if(a.weight > b.weight){
                return -1;
            }
            return 0;
        });

        // cache yon adjusted weights and if no difference can be foundeth, set all weights to 5
        if(this.topics[0].weight===this.topics[this.topics.length-1].weight){
            _(this.topics).each(function(topic){
                topic.adjustedWeight = 5;
            });
        }else{
            _(this.topics).each(function(topic){
                topic.adjustedWeight = self.getAdjustedWeight(topic);
            });
        }
    };

    EpixCloud.prototype.measureTopicBox = function(topic){
        // place ye topic in yonder document, measuring it deftly
        var $m = $('<span class="'+this.wordClass+' '+this.weightClass+''+this.getAdjustedWeight(topic)+'">'+
                        '<a>'+topic.text+'</a>'+
                    '</span>'),
            w,h;

        this.$el.append($m);
        w = $m.outerWidth();
        h = $m.outerHeight();
        $m.remove();

        return {width:w,height:h};
    };

    EpixCloud.prototype.calculateFigureSpace = function(){
        var self = this;

        this.figureSpace = _(this.topics).map(function(topic){
            return self.measureTopicBox(topic);
        });
    };

    EpixCloud.prototype.isBoxInContainer = function(box){
        return box[0] > 0 && box[1] > 0 && box[2] < this.containerSize[0] && box[3] < this.containerSize[1];
    };

    EpixCloud.prototype.isSpaceAvailable = function(box){
        return !_(this.takenSpaces).find(function(ts){
            // check line intersect as well as box intersect to cover cases where the box is inside a taken space
            return  lineIntersection(box[0],box[1]+1,box[2],box[1]-1,ts[0],ts[1],ts[2],ts[1]) || // t
                    lineIntersection(box[2]+1,box[1],box[2]-1,box[3],ts[2],ts[1],ts[2],ts[3]) || // r
                    lineIntersection(box[2],box[3]+1,box[0],box[3]-1,ts[2],ts[3],ts[0],ts[3]) || // b
                    lineIntersection(box[0]+1,box[3],box[0]-1,box[1],ts[0],ts[3],ts[0],ts[1]) || // l
                    boxIntersect(box,ts);
        });
    };

    EpixCloud.prototype.findPlaceForTopic = function(bbox,baseIndex){
        // beginneth at yon central point, then merrily spiral outwards
        var x,y,i,angle,testbox,
            centerx = Math.floor(this.containerSize[0]/2),
            centery = Math.floor(this.containerSize[1]/2),
            baseSpiralSize = 6,
            maxRotation = 360,
            baseI = baseIndex || 0,
            found = false;

        for (i=baseI; i<maxRotation; i++) {
            angle = 0.1 * i;
            x = Math.floor((centerx + (baseSpiralSize * angle) * Math.cos(angle)  * this.aspect) - (bbox[0]/2));
            y = Math.floor(centery + (baseSpiralSize * angle) * Math.sin(angle));
            testbox = [x,y,x+bbox[0],y+bbox[1]];
            if(this.isBoxInContainer(testbox) && this.isSpaceAvailable(testbox)){
                this.takenSpaces.push(testbox);
                found = true;
                break;
            }
        }

        if(!found){
            /* globals console */
            console.warn('Topic #'+baseIndex+' omitted with bounding box',bbox);
        }

        return found ? [testbox[0],testbox[1]] : false;
    };

    EpixCloud.prototype.getAdjustedWeight = function(topic){
        var topicWeight = topic.weight,
            highestWeight = this.topics[0].weight,
            lowestWeight = this.topics[this.topics.length - 1].weight,
            w = Math.round((topicWeight - lowestWeight) / (highestWeight - lowestWeight) * 9.0) + 1;

        return isNaN(w) ? 10 : w;
    };

    EpixCloud.prototype.placeTopic = function(topic,topicIndex){
        var weight = topic.adjustedWeight,
            bbox = [
                this.figureSpace[topicIndex].width,
                this.figureSpace[topicIndex].height
            ],
            coords = this.findPlaceForTopic(bbox,topicIndex),
            topicData = topic.dataAttributes || {},
            url = topic.url || '#',
            title = topic.title || topic.text,
            customClass = topic.customClass || '',
            $topicSpan = $('<span id="'+this.idHead+''+topicIndex+'" '+
                                'class="'+this.wordClass+' '+this.weightClass+''+weight+' '+customClass+'" '+
                                'style="position:absolute;left:'+coords[0]+'px;top:'+coords[1]+'px;">'+
                                    '<a href="'+url+'" title="'+title+'">'+topic.text+'</a>'+
                                '</span>').data(topicData);

        if(coords){
            this.$el.append($topicSpan);
        }
    };

    EpixCloud.prototype.render = function(){
        var self = this;

        if(!this.$el.filter(':visible').length){
            return this;
        }

        this.init();

        // doth thou knowest yon figureSpace?
        this.calculateFigureSpace();

        // charge fourth valiantly
        _(this.topics).each(function(topic,i){
            self.placeTopic(topic,i);
        });

        return this;
    };

    EpixCloud.prototype.getEl = function(){
        return this.$el;
    };

    return EpixCloud;

/*
                                       /\
                                      /`:\
                                     /`'`:\
                                    /`'`'`:\
                                   /`'`'`'`:\
                                  /`'`'`'`'`:\
                                   |`'`'`'`:|
     _ _  _  _  _                  |] ,-.  :|_  _  _  _
    ||| || || || |                 |  |_| ||| || || || |
    |`' `' `' `'.|                 | _'=' |`' `' `' `'.|
    :          .:;                 |'-'   :          .:;
     \-..____..:/  _  _  _  _  _  _| _  _'-\-..____..:/
      :--------:_,' || || || || || || || `.::--------:
      |]     .:|:.  `' `'_`' `' `' `' `'    | '-'  .:|
      |  ,-. .[|:._     '-' ____     ___    |   ,-.'-|
      |  | | .:|'--'_     ,'____`.  '---'   |   | |.:|
      |  |_| .:|:.'--' ()/,| |`|`.\()   __  |   |_|.:|
      |  '=' .:|:.     |::_|_|_|\|::   '--' |  _'='.:|
      | __   .:|:.     ;||-,-,-,-,|;        | '--' .:|
      |'--'  .:|:. _  ; ||       |:|        |      .:|
      |      .:|:.'-':  ||       |;|     _  |]     _:|
      |      '-|:.   ;  ||       :||    '-' |     '--|
      |  _   .:|].  ;   ||       ;||]       |   _  .:|
      | '-'  .:|:. :   [||      ;|||        |  '-' .:|
  ,', ;._____.::-- ;---->'-,--,:-'<'--------;._____.::.`.
 ((  (          )_;___,' ,' ,  ; //________(          ) ))
  `. _`--------' : -,' ' , ' '; //-       _ `--------' ,'
       __  .--'  ;,' ,'  ,  ': //    -.._    __  _.-  -
   `-   --    _ ;',' ,'  ,' ,;/_  -.       ---    _,
       _,.   /-:,_,_,_,_,_,_(/:-\   ,     ,.    _
     -'   `-'--'-'-'-'-'-'-'-''--'-' `-'`'  `'`' `
*/

});
