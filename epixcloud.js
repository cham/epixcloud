/*
 * EPIXCLOUD by D Neame
 * Builds word clouds really quickly
 * Requires $, Underscore.js and Require.js
 *
 * TOPICS CLOUD, HOOOOOO!
 *
 * version 0.2
 *
 * required options:
 *   topics               Array   An array of topic object in the following format:
 *       {
 *         weight         Number  required any positive value, range is normalised to a linear scale of 0 to 10
 *         text           String  required the topic text, ideally this should be one or two words
 *         url            String  optional the URL to apply on the A element wrapping the topic text, defaults to #
 *         title          String  optional the TITLE attribute to apply to the wrapping A element, defaults to topic text
 *         customClass    String  optional this string is appended to the class name given to the span representing the topic in the cloud
 *         dataAttributes Object  optional any data-X attributes that should be applied to the SPAN wrapping the topic, as key-value pairs
 *       }
 *   $el                  jQuery  The container for the cloud. Must have a defined width and height, position: relative will be set
 *
 * optional options (!)
 *   wordClass            String  Class name given to all topics in the cloud
 *   weightClass          String  Prepended to the class used for the normalised weight (0 to 10)
 *   idHead               String  The head of the ID for each topic
 *   async                Bool    If set true then the cloud runs asynchronously, but you probably don't need this
 *   noscale              Bool    If true then the cloud doesn't fit to it's container
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
        this.$el.css({
            position:'relative',
            'margin-top': 0,
            'margin-left': 0,
            '-webkit-transform': 'scale(1)',
            '-moz-transform': 'scale(1)',
            'transform': 'scale(1)'
        });

        this.wordClass = options.wordClass || 'epixword';
        this.weightClass = options.weightClass || 'epixweight-';
        this.idHead = options.idHead || 'epixcloud-';
        this.noscale = !!options.noscale;

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
            w, h, f;

        this.$el.append($m);
        w = $m.outerWidth();
        h = $m.outerHeight();
        f = $m.css('font-size');
        $m.remove();

        return {
            width: w,
            height: h,
            fontSize: f
        };
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

    EpixCloud.prototype.getCloudBB = function(){
        var bb = [Infinity,Infinity,-Infinity,-Infinity]; //[left,top,right,bottom]

        this.$el.find('.' + this.wordClass).each(function(){
            var $this = $(this),
                pos = $this.position(),
                w = $this.outerWidth(),
                h = $this.outerHeight(),
                t = pos.top,
                l = pos.left,
                r = l + w,
                b = t + h;

            if(l < bb[0]){
                bb[0] = l;
            }
            if(t < bb[1]){
                bb[1] = t;
            }
            if(r > bb[2]){
              bb[2] = r;
            }
            if(b > bb[3]){
              bb[3] = b;
            }
        });

        return bb;
    };

    EpixCloud.prototype.autoFit = function(){
        var allTopicsBB = this.getCloudBB(),
            diffW = 1, diffH = 1,
            canvasW = this.$el.outerWidth(),
            canvasH = this.$el.outerHeight(),
            boxW = allTopicsBB[2] - allTopicsBB[0],
            boxH = allTopicsBB[3] - allTopicsBB[1],
            padding = canvasW > canvasH ? (canvasH * 0.1) : (canvasW * 0.1),
            leftAdj,
            topAdj;

        canvasW -= 2*padding;
        canvasH -= 2*padding;
        diffW = Math.floor(Math.abs(canvasW / boxW) * 100) / 100;
        diffH = Math.floor(Math.abs(canvasH / boxH) * 100) / 100;
        leftAdj = Math.floor(((canvasW - boxW) / 2) - allTopicsBB[0] + padding);
        topAdj = Math.floor(((canvasH - boxH) / 2) - allTopicsBB[1] + padding);

        // scale
        this.$el.css({
          '-webkit-transform': 'scale(' + (diffW > diffH ? diffH : diffW) + ')',
          '-moz-transform': 'scale(' + (diffW > diffH ? diffH : diffW) + ')',
          'transform': 'scale(' + (diffW > diffH ? diffH : diffW) + ')'
        });
        // center topic by topic
        this.$el.find('.' + this.wordClass).each(function(){
            var $topic = $(this);
            $topic.css({
                left: parseInt($topic.css('left'), 10) + leftAdj,
                top: parseInt($topic.css('top'), 10) + topAdj
            });
        });
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

        // cast yon eye o'er the battlefield
        if(!this.noscale){
            this.autoFit();
        }

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
