define([
    'jquery',
    'epixcloud',
    'css!../css/epixcloud.css'
], function(
    $,
    EpixCloud
){
    'use strict';

    var testTopics = [
        {
            text: 'Beedog',
            weight: 2,
            url: 'http://beedogs.com',
            title: 'The best site in the WORRRRLDDDDDD'
        },
        {
            text: 'Topic',
            weight: 10,
            dataAttributes: {
                foo: 'bar',
                bish: 'bosh'
            },
            url: 'http://www.google.co.uk/images?q=goatse'
        },
        {
            text: 'Raptor',
            weight: 5
        },
        {
            text: 'LOL u said LOL',
            weight: 1,
            dataAttributes: {
                test: 'ing',
                bee: 'dog'
            },
            title: 'loltastic'
        }
    ];

    describe('epixcloud', function(){
        var cloud;
        afterEach(function(){
            if(cloud){
                cloud.getEl().remove();
            }
            cloud = undefined;
        });

        describe('initialisation', function(){
            describe('topics option',function(){
                it('throws an error if not initialised with a topics array', function(){
                    var err;

                    try{
                        cloud = new EpixCloud({$el:$('div')});
                    }catch(e){
                        err = e;
                    }

                    expect(err).toBeDefined();
                    expect(err.message).toEqual('EpixCloud must be initialised with a topics array');
                });
                it('throws an error if topics is not an array', function(){
                    var err;

                    try{
                        cloud = new EpixCloud({$el:$('div'),topics:{}});
                    }catch(e){
                        err = e;
                    }

                    expect(err).toBeDefined();
                    expect(err.message).toEqual('EpixCloud must be initialised with a topics array');
                });
            });

            describe('$el option',function(){
                it('throws an error if not initialised with a container $el', function(){
                    var err;

                    try{
                        cloud = new EpixCloud({topics:[]});
                    }catch(e){
                        err = e;
                    }

                    expect(err).toBeDefined();
                    expect(err.message).toEqual('EpixCloud must be initialised with a container $el');
                });

                it('throws an error if $el is not an object', function(){
                    var err;

                    try{
                        cloud = new EpixCloud({topics:[],$el:true});
                    }catch(e){
                        err = e;
                    }

                    expect(err).toBeDefined();
                    expect(err.message).toEqual('EpixCloud must be initialised with a container $el');
                });

                it('throws an error if $el is not a jQuery object', function(){
                    var err;

                    try{
                        cloud = new EpixCloud({topics:[],$el:{}});
                    }catch(e){
                        err = e;
                    }

                    expect(err).toBeDefined();
                    expect(err.message).toEqual('EpixCloud must be initialised with a container $el');
                });

                it('applies position:relative to $el',function(){
                    cloud = new EpixCloud({topics:[],$el:$('<div/>')});
                    expect(cloud.$el.css('position')).toEqual('relative');
                });
            });

            describe('wordClass property',function(){
                it('defaults wordClass to "epixword"',function(){
                    cloud = new EpixCloud({topics:[],$el:$('<div/>')});
                    expect(cloud.wordClass).toEqual('epixword');
                });

                it('correctly sets wordClass',function(){
                    cloud = new EpixCloud({
                        topics:[],
                        $el:$('<div/>'),
                        wordClass: 'RAPTOR'
                    });
                    expect(cloud.wordClass).toEqual('RAPTOR');
                });
            });

            describe('weightClass property',function(){
                it('defaults weightClass to "epixweight-"',function(){
                    cloud = new EpixCloud({topics:[],$el:$('<div/>')});
                    expect(cloud.weightClass).toEqual('epixweight-');
                });

                it('correctly sets weightClass',function(){
                    cloud = new EpixCloud({
                        topics:[],
                        $el:$('<div/>'),
                        weightClass: 'beedogger-'
                    });
                    expect(cloud.weightClass).toEqual('beedogger-');
                });
            });

            describe('idHead property',function(){
                it('defaults idHead to "epixcloud-"',function(){
                    cloud = new EpixCloud({topics:[],$el:$('<div/>')});
                    expect(cloud.idHead).toEqual('epixcloud-');
                });

                it('correctly sets idHead',function(){
                    cloud = new EpixCloud({
                        topics:[],
                        $el:$('<div/>'),
                        idHead: 'senator-neigh-'
                    });
                    expect(cloud.idHead).toEqual('senator-neigh-');
                });
            });

            describe('calculated properties',function(){
                it('correctly calculates containerSize',function(){
                    cloud = new EpixCloud({
                        topics: [],
                        $el: $('<div style="width:501px;height:678px;"/>')
                    });
                    expect(cloud.containerSize).toEqual([501,678]);
                });

                it('correctly calculates container aspect ratio',function(){
                    cloud = new EpixCloud({
                        topics: [],
                        $el: $('<div style="width:100px;height:50px;"/>')
                    });
                    expect(cloud.aspect).toEqual(2);
                });
            });

            it('correctly initialises figureSpace',function(){
                cloud = new EpixCloud({topics:[],$el:$('<div/>')});
                expect(cloud.figureSpace).toEqual([]);
            });

            it('correctly initialises takenSpaces',function(){
                cloud = new EpixCloud({topics:[],$el:$('<div/>')});
                expect(cloud.takenSpaces).toEqual([]);
            });

            it('sorts passed topics by weight',function(){
                cloud = new EpixCloud({topics:testTopics,$el:$('<div/>')});
                expect(cloud.topics[0].text).toEqual('Topic');
                expect(cloud.topics[1].text).toEqual('Raptor');
                expect(cloud.topics[2].text).toEqual('Beedog');
                expect(cloud.topics[3].text).toEqual('LOL u said LOL');
            });
        });

        it('returns the container element when getEl is called',function(){
            var $el = $('<div/>');

            cloud = new EpixCloud({topics:testTopics,$el:$el});

            expect(cloud.getEl()).toEqual($el);
        });

        describe('measurement in the DOM',function(){
            var $testArea;
            beforeEach(function(){
                $testArea = $('<div/>');
                $('body').append($testArea);
            });
            afterEach(function(){
                $testArea.remove();
            });

            describe('topic box measurement',function(){
                /* NB the actualy measurements will vary from browser to browser, so don't directly compare against a known good */
                it('measureTopicBox correctly measures the bounding box of the topic',function(){
                    cloud = new EpixCloud({topics:testTopics,$el:$testArea});

                    expect(cloud.measureTopicBox(cloud.topics[0])).toBeDefined();
                    expect(cloud.measureTopicBox(cloud.topics[1])).toBeDefined();
                    expect(cloud.measureTopicBox(cloud.topics[2])).toBeDefined();
                    expect(cloud.measureTopicBox(cloud.topics[3])).toBeDefined();
                });

                it('correctly calculates figureSpace values',function(){
                    cloud = new EpixCloud({topics:testTopics,$el:$testArea});
                    cloud.calculateFigureSpace();

                    expect(cloud.figureSpace.length).toEqual(4);
                    expect(cloud.figureSpace[0]).toEqual(cloud.measureTopicBox(cloud.topics[0]));
                    expect(cloud.figureSpace[1]).toEqual(cloud.measureTopicBox(cloud.topics[1]));
                    expect(cloud.figureSpace[2]).toEqual(cloud.measureTopicBox(cloud.topics[2]));
                    expect(cloud.figureSpace[3]).toEqual(cloud.measureTopicBox(cloud.topics[3]));
                });
            });
        });

        describe('measurements in memory',function(){
            describe('checking if a bounding box is within the container',function(){
                it('isBoxInContainer returns true if the box fits in the container size',function(){
                    cloud = new EpixCloud({
                        topics: [],
                        $el: $('<div style="width:200px;height:200px;"/>')
                    });
                    expect(cloud.isBoxInContainer([10,10,199,199])).toEqual(true);
                });

                it('isBoxInContainer returns false if the box would flow outside the container in x',function(){
                    cloud = new EpixCloud({
                        topics: [],
                        $el: $('<div style="width:200px;height:200px;"/>')
                    });
                    expect(cloud.isBoxInContainer([10,10,201,199])).toEqual(false);
                });

                it('isBoxInContainer returns false if the box would flow outside the container in y',function(){
                    cloud = new EpixCloud({
                        topics: [],
                        $el: $('<div style="width:200px;height:200px;"/>')
                    });
                    expect(cloud.isBoxInContainer([10,10,201,199])).toEqual(false);
                });

                it('isBoxInContainer returns false if the box starts outside the left edge of the container',function(){
                    cloud = new EpixCloud({
                        topics: [],
                        $el: $('<div style="width:200px;height:200px;"/>')
                    });
                    expect(cloud.isBoxInContainer([-1,10,199,199])).toEqual(false);
                });

                it('isBoxInContainer returns false if the box starts above the top edge of the container',function(){
                    cloud = new EpixCloud({
                        topics: [],
                        $el: $('<div style="width:200px;height:200px;"/>')
                    });
                    expect(cloud.isBoxInContainer([10,-1,199,199])).toEqual(false);
                });
            });

            it('adds an entry in takenSpaces when a box is successfully placed',function(){
                cloud = new EpixCloud({
                    topics: [],
                    $el: $('<div style="width:200px;height:200px;"/>')
                });
                cloud.findPlaceForTopic([1,1,2,2],0);

                expect(cloud.takenSpaces.length).toEqual(1);
                expect(cloud.takenSpaces[0]).toEqual([99, 100, 100, 101]); // see findPlaceForTopic tests below to explain these values
            });

            describe('finding a place for bounding boxes',function(){
                it('calls isBoxInContainer in order to find a position for each topic', function(){
                    var inContainerStub = sinon.stub(EpixCloud.prototype, 'isBoxInContainer');

                    cloud = new EpixCloud({topics: [], $el: $('<div style="width:200px;height:200px;"/>')});
                    cloud.findPlaceForTopic([10,10,150,37],0);

                    expect(inContainerStub.called).toEqual(true);
                    inContainerStub.restore();
                });

                it('correctly finds a place for the first topic passed, starting in the center of the $el',function(){
                    cloud = new EpixCloud({
                        topics: [],
                        $el: $('<div style="width:200px;height:200px;"/>')
                    });
                    cloud.findPlaceForTopic([10,10,150,37],0);
                    expect(cloud.takenSpaces[0]).toEqual([95, 100, 105, 110]);
                });

                it('spirals outwards from the center for each topic placed after the first',function(){
                    cloud = new EpixCloud({
                        topics: [],
                        $el: $('<div style="width:200px;height:200px;"/>')
                    });

                    cloud.findPlaceForTopic([10,10,150,37],0);
                    expect(cloud.takenSpaces[0]).toEqual([95, 100, 105, 110]);

                    cloud.findPlaceForTopic([10,10,150,37],1);
                    expect(cloud.takenSpaces[1]).toEqual([84, 109, 94, 119]);

                    cloud.findPlaceForTopic([10,10,150,37],2);
                    expect(cloud.takenSpaces[2]).toEqual([75, 98, 85, 108]);
                });

                it('spirals outwards from the center for each topic placed after the first',function(){
                    cloud = new EpixCloud({
                        topics: [],
                        $el: $('<div style="width:200px;height:200px;"/>')
                    });

                    cloud.findPlaceForTopic([10,10,150,37],0);
                    expect(cloud.takenSpaces[0]).toEqual([95, 100, 105, 110]);

                    cloud.findPlaceForTopic([10,10,150,37],1);
                    expect(cloud.takenSpaces[1]).toEqual([84, 109, 94, 119]);

                    cloud.findPlaceForTopic([10,10,150,37],2);
                    expect(cloud.takenSpaces[2]).toEqual([75, 98, 85, 108]);
                });

                it('considers the baseIndex to be optional',function(){
                    cloud = new EpixCloud({
                        topics: [],
                        $el: $('<div style="width:200px;height:200px;"/>')
                    });

                    cloud.findPlaceForTopic([10,10,150,37],0);
                    expect(cloud.takenSpaces[0]).toEqual([95, 100, 105, 110]);

                    cloud.findPlaceForTopic([10,10,150,37],0);
                    expect(cloud.takenSpaces[1]).toEqual([84, 109, 94, 119]);

                    cloud.findPlaceForTopic([10,10,150,37],0);
                    expect(cloud.takenSpaces[2]).toEqual([75, 98, 85, 108]);
                });

                it('supplying the baseIndex skips a known-taken position',function(){
                    var spaceAvailSpy;

                    cloud = new EpixCloud({
                        topics: [],
                        $el: $('<div style="width:200px;height:200px;"/>')
                    });

                    spaceAvailSpy = sinon.spy(EpixCloud.prototype,'isSpaceAvailable');
                    cloud.findPlaceForTopic([10,10,150,37],0);
                    expect(spaceAvailSpy.callCount).toEqual(1);
                    spaceAvailSpy.restore();

                    spaceAvailSpy = sinon.spy(EpixCloud.prototype,'isSpaceAvailable');
                    cloud.findPlaceForTopic([10,10,150,37],0);
                    expect(spaceAvailSpy.callCount).toEqual(25);
                    spaceAvailSpy.restore();

                    spaceAvailSpy = sinon.spy(EpixCloud.prototype,'isSpaceAvailable');
                    cloud.findPlaceForTopic([10,10,150,37],0);
                    expect(spaceAvailSpy.callCount).toEqual(33);
                    spaceAvailSpy.restore();

                    cloud.getEl().remove();
                    cloud = undefined;
                    cloud = new EpixCloud({
                        topics: [],
                        $el: $('<div style="width:200px;height:200px;"/>')
                    });

                    spaceAvailSpy = sinon.spy(EpixCloud.prototype,'isSpaceAvailable');
                    cloud.findPlaceForTopic([10,10,150,37],0);
                    expect(spaceAvailSpy.callCount).toEqual(1);
                    spaceAvailSpy.restore();

                    spaceAvailSpy = sinon.spy(EpixCloud.prototype,'isSpaceAvailable');
                    cloud.findPlaceForTopic([10,10,150,37],1);
                    expect(spaceAvailSpy.callCount).toEqual(24);
                    spaceAvailSpy.restore();

                    spaceAvailSpy = sinon.spy(EpixCloud.prototype,'isSpaceAvailable');
                    cloud.findPlaceForTopic([10,10,150,37],2);
                    expect(spaceAvailSpy.callCount).toEqual(31);
                    spaceAvailSpy.restore();
                });
            });

            describe('checking taken spaces',function(){
                it('isSpaceAvailable returns true if the bounding box area is available',function(){
                    cloud = new EpixCloud({
                        topics: [],
                        $el: $('<div style="width:200px;height:200px;"/>')
                    });
                    cloud.findPlaceForTopic([1,1,2,2],0);

                    expect(cloud.isSpaceAvailable([97,98,98,100])).toEqual(true);
                });

                it('isSpaceAvailable returns false if the top edge intersects with a previous box',function(){
                    cloud = new EpixCloud({
                        topics: [],
                        $el: $('<div style="width:200px;height:200px;"/>')
                    });
                    cloud.findPlaceForTopic([1,1,2,2],0);

                    expect(cloud.isSpaceAvailable([99,98,101,100])).toEqual(false);
                });

                it('isSpaceAvailable returns false if the left edge intersects with a previous box',function(){
                    cloud = new EpixCloud({
                        topics: [],
                        $el: $('<div style="width:200px;height:200px;"/>')
                    });
                    cloud.findPlaceForTopic([1,1,2,2],0);

                    expect(cloud.isSpaceAvailable([97,99,101,100])).toEqual(false);
                });

                it('isSpaceAvailable returns false if the right edge intersects with a previous box',function(){
                    cloud = new EpixCloud({
                        topics: [],
                        $el: $('<div style="width:200px;height:200px;"/>')
                    });
                    cloud.findPlaceForTopic([1,1,2,2],0);

                    expect(cloud.isSpaceAvailable([97,98,101,101])).toEqual(false);
                });

                it('isSpaceAvailable returns false if the bottom edge intersects with a previous box',function(){
                    cloud = new EpixCloud({
                        topics: [],
                        $el: $('<div style="width:200px;height:200px;"/>')
                    });
                    cloud.findPlaceForTopic([1,1,2,2],0);

                    expect(cloud.isSpaceAvailable([97,98,100,100])).toEqual(false);
                });

                it('isSpaceAvailable returns false if two boxes intersect',function(){
                    cloud = new EpixCloud({
                        topics: [],
                        $el: $('<div style="width:200px;height:200px;"/>')
                    });
                    cloud.findPlaceForTopic([1,1,2,2],0);

                    expect(cloud.isSpaceAvailable([98,98,101,101])).toEqual(false);
                });
            });
        });

        describe('weight adjustment',function(){
            it('correctly returns adjusted weight values for the topics based on a linear scale of 1 to 10',function(){
                var moreTestTopics = [
                        { text: 'foo', weight: 1 },
                        { text: 'foo', weight: 2 },
                        { text: 'foo', weight: 6 },
                        { text: 'foo', weight: 23 },
                        { text: 'foo', weight: 56 },
                        { text: 'foo', weight: 19 },
                        { text: 'foo', weight: 63 },
                        { text: 'foo', weight: 81 },
                        { text: 'foo', weight: 162 },
                        { text: 'foo', weight: 1 },
                        { text: 'foo', weight: 98 },
                        { text: 'foo', weight: 63 },
                        { text: 'foo', weight: 123 },
                        { text: 'foo', weight: 21 },
                        { text: 'foo', weight: 54 },
                        { text: 'foo', weight: 82 },
                        { text: 'foo', weight: 91 },
                        { text: 'foo', weight: 7 },
                        { text: 'foo', weight: 7 },
                        { text: 'foo', weight: 12 }
                    ];

                cloud = new EpixCloud({
                    topics: moreTestTopics,
                    $el: $('<div/>')
                });

                //moreTestTopics will now be sorted numerically descending
                expect(cloud.getAdjustedWeight(moreTestTopics[0])).toEqual(10);
                expect(cloud.getAdjustedWeight(moreTestTopics[1])).toEqual(8);
                expect(cloud.getAdjustedWeight(moreTestTopics[2])).toEqual(6);
                expect(cloud.getAdjustedWeight(moreTestTopics[3])).toEqual(6);
                expect(cloud.getAdjustedWeight(moreTestTopics[4])).toEqual(6);
                expect(cloud.getAdjustedWeight(moreTestTopics[5])).toEqual(5);
                expect(cloud.getAdjustedWeight(moreTestTopics[6])).toEqual(4);
                expect(cloud.getAdjustedWeight(moreTestTopics[7])).toEqual(4);
                expect(cloud.getAdjustedWeight(moreTestTopics[8])).toEqual(4);
                expect(cloud.getAdjustedWeight(moreTestTopics[9])).toEqual(4);
                expect(cloud.getAdjustedWeight(moreTestTopics[10])).toEqual(2);
                expect(cloud.getAdjustedWeight(moreTestTopics[11])).toEqual(2);
                expect(cloud.getAdjustedWeight(moreTestTopics[12])).toEqual(2);
                expect(cloud.getAdjustedWeight(moreTestTopics[13])).toEqual(2);
                expect(cloud.getAdjustedWeight(moreTestTopics[14])).toEqual(1);
                expect(cloud.getAdjustedWeight(moreTestTopics[15])).toEqual(1);
                expect(cloud.getAdjustedWeight(moreTestTopics[16])).toEqual(1);
                expect(cloud.getAdjustedWeight(moreTestTopics[17])).toEqual(1);
                expect(cloud.getAdjustedWeight(moreTestTopics[18])).toEqual(1);
                expect(cloud.getAdjustedWeight(moreTestTopics[19])).toEqual(1);
            });

            it('applies a calculated adjustedWeight property to each topic passed on initialisation',function(){
                var moreTestTopics = [
                        { text: 'foo', weight: 1 },
                        { text: 'foo', weight: 2 },
                        { text: 'foo', weight: 6 },
                        { text: 'foo', weight: 23 },
                        { text: 'foo', weight: 56 },
                        { text: 'foo', weight: 19 },
                        { text: 'foo', weight: 63 },
                        { text: 'foo', weight: 81 },
                        { text: 'foo', weight: 162 },
                        { text: 'foo', weight: 1 },
                        { text: 'foo', weight: 98 },
                        { text: 'foo', weight: 63 },
                        { text: 'foo', weight: 123 },
                        { text: 'foo', weight: 21 },
                        { text: 'foo', weight: 54 },
                        { text: 'foo', weight: 82 },
                        { text: 'foo', weight: 91 },
                        { text: 'foo', weight: 7 },
                        { text: 'foo', weight: 7 },
                        { text: 'foo', weight: 12 }
                    ];

                cloud = new EpixCloud({
                    topics: moreTestTopics,
                    $el: $('<div/>')
                });
                expect(cloud.topics[0].adjustedWeight).toEqual(10);
                expect(cloud.topics[1].adjustedWeight).toEqual(8);
                expect(cloud.topics[2].adjustedWeight).toEqual(6);
                expect(cloud.topics[3].adjustedWeight).toEqual(6);
                expect(cloud.topics[4].adjustedWeight).toEqual(6);
                expect(cloud.topics[5].adjustedWeight).toEqual(5);
                expect(cloud.topics[6].adjustedWeight).toEqual(4);
                expect(cloud.topics[7].adjustedWeight).toEqual(4);
                expect(cloud.topics[8].adjustedWeight).toEqual(4);
                expect(cloud.topics[9].adjustedWeight).toEqual(4);
                expect(cloud.topics[10].adjustedWeight).toEqual(2);
                expect(cloud.topics[11].adjustedWeight).toEqual(2);
                expect(cloud.topics[12].adjustedWeight).toEqual(2);
                expect(cloud.topics[13].adjustedWeight).toEqual(2);
                expect(cloud.topics[14].adjustedWeight).toEqual(1);
                expect(cloud.topics[15].adjustedWeight).toEqual(1);
                expect(cloud.topics[16].adjustedWeight).toEqual(1);
                expect(cloud.topics[17].adjustedWeight).toEqual(1);
                expect(cloud.topics[18].adjustedWeight).toEqual(1);
                expect(cloud.topics[19].adjustedWeight).toEqual(1);
            });

            it('sets adjustedWeight to 5 for all topics passed if they all weigh the same',function(){
                var moreTestTopics = [
                        { text: 'foo', weight: 123 },
                        { text: 'foo', weight: 123 },
                        { text: 'foo', weight: 123 },
                        { text: 'foo', weight: 123 },
                        { text: 'foo', weight: 123 },
                        { text: 'foo', weight: 123 },
                        { text: 'foo', weight: 123 },
                        { text: 'foo', weight: 123 },
                        { text: 'foo', weight: 123 }
                    ];

                cloud = new EpixCloud({
                    topics: moreTestTopics,
                    $el: $('<div/>')
                });

                expect(cloud.topics[0].adjustedWeight).toEqual(5);
                expect(cloud.topics[1].adjustedWeight).toEqual(5);
                expect(cloud.topics[2].adjustedWeight).toEqual(5);
                expect(cloud.topics[3].adjustedWeight).toEqual(5);
                expect(cloud.topics[4].adjustedWeight).toEqual(5);
                expect(cloud.topics[5].adjustedWeight).toEqual(5);
                expect(cloud.topics[6].adjustedWeight).toEqual(5);
                expect(cloud.topics[7].adjustedWeight).toEqual(5);
                expect(cloud.topics[8].adjustedWeight).toEqual(5);
            });
        });



        describe('placing topics in the DOM',function(){
            var $testArea;
            beforeEach(function(){
                $testArea = $('<div style="width:600px;height:600px;"/>');
                $('body').append($testArea);
            });
            afterEach(function(){
                $testArea.remove();
            });

            it('correctly places topics in the DOM',function(){
                cloud = new EpixCloud({topics:testTopics,$el:$testArea});
                cloud.calculateFigureSpace();

                cloud.placeTopic(cloud.topics[0],0);
                cloud.placeTopic(cloud.topics[1],1);
                cloud.placeTopic(cloud.topics[2],2);
                cloud.placeTopic(cloud.topics[3],3);

                expect($testArea.find('.epixword').length).toEqual(4);
            });

            describe('classes',function(){
                it('supplies the correct classes to topics placed in the DOM',function(){
                    cloud = new EpixCloud({topics:testTopics,$el:$testArea});
                    cloud.calculateFigureSpace();

                    cloud.placeTopic(cloud.topics[0],0);

                    expect($testArea.find('.epixword').hasClass('epixweight-10')).toEqual(true);
                });

                it('alters classes placed in the DOM if the relevant options are supplied on initialisation',function(){
                    cloud = new EpixCloud({topics:testTopics,$el:$testArea,
                        wordClass: 'testeytest',
                        weightClass: 'weighteyweight-'
                    });
                    cloud.calculateFigureSpace();

                    cloud.placeTopic(cloud.topics[0],0);
                    cloud.placeTopic(cloud.topics[1],1);
                    cloud.placeTopic(cloud.topics[2],2);
                    cloud.placeTopic(cloud.topics[3],3);

                    expect($testArea.find('.testeytest').length).toEqual(4);
                    expect($testArea.find('.testeytest:eq(0)').hasClass('weighteyweight-10')).toEqual(true);
                    expect($testArea.find('.testeytest:eq(1)').hasClass('weighteyweight-5')).toEqual(true);
                    expect($testArea.find('.testeytest:eq(2)').hasClass('weighteyweight-2')).toEqual(true);
                    expect($testArea.find('.testeytest:eq(3)').hasClass('weighteyweight-1')).toEqual(true);
                });
            });

            describe('id',function(){
                it('supplies the correct id to topics placed in the DOM',function(){
                    cloud = new EpixCloud({topics:testTopics,$el:$testArea});
                    cloud.calculateFigureSpace();

                    cloud.placeTopic(cloud.topics[0],0);
                    cloud.placeTopic(cloud.topics[1],1);
                    cloud.placeTopic(cloud.topics[2],2);
                    cloud.placeTopic(cloud.topics[3],3);

                    expect($testArea.find('#epixcloud-0').length).toEqual(1);
                    expect($testArea.find('#epixcloud-1').length).toEqual(1);
                    expect($testArea.find('#epixcloud-2').length).toEqual(1);
                    expect($testArea.find('#epixcloud-3').length).toEqual(1);
                });

                it('alters the id if the corresponding option is set on initialisation',function(){
                    cloud = new EpixCloud({topics:testTopics,$el:$testArea,
                        idHead: 'elRaptor-'
                    });
                    cloud.calculateFigureSpace();

                    cloud.placeTopic(cloud.topics[0],0);
                    cloud.placeTopic(cloud.topics[1],1);
                    cloud.placeTopic(cloud.topics[2],2);
                    cloud.placeTopic(cloud.topics[3],3);

                    expect($testArea.find('#elRaptor-0').length).toEqual(1);
                    expect($testArea.find('#elRaptor-1').length).toEqual(1);
                    expect($testArea.find('#elRaptor-2').length).toEqual(1);
                    expect($testArea.find('#elRaptor-3').length).toEqual(1);
                });
            });

            it('gives topics left and top coordinates',function(){
                cloud = new EpixCloud({topics:testTopics,$el:$testArea});
                cloud.calculateFigureSpace();

                cloud.placeTopic(cloud.topics[0],0);
                cloud.placeTopic(cloud.topics[1],1);
                cloud.placeTopic(cloud.topics[2],2);
                cloud.placeTopic(cloud.topics[3],3);

                expect($testArea.find('#epixcloud-0').css('left')).toBeDefined();
                expect($testArea.find('#epixcloud-0').css('top')).toBeDefined();
                expect($testArea.find('#epixcloud-1').css('left')).toBeDefined();
                expect($testArea.find('#epixcloud-1').css('top')).toBeDefined();
                expect($testArea.find('#epixcloud-2').css('left')).toBeDefined();
                expect($testArea.find('#epixcloud-2').css('top')).toBeDefined();
                expect($testArea.find('#epixcloud-3').css('left')).toBeDefined();
                expect($testArea.find('#epixcloud-3').css('top')).toBeDefined();
            });

            it('supplies the correct data attributes to DOM elements placed if supplied on initialisation',function(){
                cloud = new EpixCloud({topics:testTopics,$el:$testArea});
                cloud.calculateFigureSpace();

                cloud.placeTopic(cloud.topics[0],0);
                cloud.placeTopic(cloud.topics[1],1);
                cloud.placeTopic(cloud.topics[2],2);
                cloud.placeTopic(cloud.topics[3],3);

                expect($testArea.find('#epixcloud-0').data()).toEqual({ foo : 'bar', bish : 'bosh' });
                expect($testArea.find('#epixcloud-1').data()).toEqual({});
                expect($testArea.find('#epixcloud-2').data()).toEqual({});
                expect($testArea.find('#epixcloud-3').data()).toEqual({ test : 'ing', bee : 'dog' });
            });

            it('uses the url for the href of the anchor if specified and # if not',function(){
                cloud = new EpixCloud({topics:testTopics,$el:$testArea});
                cloud.calculateFigureSpace();

                cloud.placeTopic(cloud.topics[0],0);
                cloud.placeTopic(cloud.topics[1],1);
                cloud.placeTopic(cloud.topics[2],2);
                cloud.placeTopic(cloud.topics[3],3);

                expect($testArea.find('#epixcloud-0 > a').attr('href')).toEqual('http://www.google.co.uk/images?q=goatse');
                expect($testArea.find('#epixcloud-1 > a').attr('href')).toEqual('#');
                expect($testArea.find('#epixcloud-2 > a').attr('href')).toEqual('http://beedogs.com');
                expect($testArea.find('#epixcloud-3 > a').attr('href')).toEqual('#');
            });

            it('uses title for the title attribute of the anchor if specified and the topic text',function(){
                cloud = new EpixCloud({topics:testTopics,$el:$testArea});
                cloud.calculateFigureSpace();

                cloud.placeTopic(cloud.topics[0],0);
                cloud.placeTopic(cloud.topics[1],1);
                cloud.placeTopic(cloud.topics[2],2);
                cloud.placeTopic(cloud.topics[3],3);

                expect($testArea.find('#epixcloud-0 > a').attr('title')).toEqual('Topic');
                expect($testArea.find('#epixcloud-1 > a').attr('title')).toEqual('Raptor');
                expect($testArea.find('#epixcloud-2 > a').attr('title')).toEqual('The best site in the WORRRRLDDDDDD');
                expect($testArea.find('#epixcloud-3 > a').attr('title')).toEqual('loltastic');
            });

            describe('render method',function(){
                it('renders all topics in the list',function(){
                    cloud = new EpixCloud({topics:testTopics,$el:$testArea});
                    cloud.render();

                    expect($testArea.find('span').length).toEqual(4);
                });

                it('does not render if the container is not visible',function(){
                    $testArea.hide();

                    cloud = new EpixCloud({topics:testTopics,$el:$testArea});
                    cloud.render();

                    expect($testArea.find('span').length).toEqual(0);
                });

                it('renders once the container is visible and a subsequent render() is called',function(){
                    $testArea.hide();

                    cloud = new EpixCloud({topics:testTopics,$el:$testArea});
                    cloud.render();

                    expect($testArea.find('span').length).toEqual(0);

                    $testArea.show();

                    cloud.render();

                    expect($testArea.find('span').length).toEqual(4);
                });

                it('correctly resets takenSpaces, figureSpace before render',function(){
                    var ts, fs;

                    cloud = new EpixCloud({topics:testTopics,$el:$testArea});
                    cloud.render();

                    fs = cloud.figureSpace;
                    ts = cloud.takenSpaces;

                    expect(fs).toBeDefined();
                    expect(ts).toBeDefined();

                    cloud.topics.push({
                        text: 'Beecats',
                        weight: 2,
                        url: 'http://beecats.tumblr.com/',
                        title: 'Mysterious and magical'
                    });
                    cloud.render();

                    expect(cloud.figureSpace).not.toEqual(fs);
                    expect(cloud.takenSpaces).not.toEqual(ts);
                });
            });

            describe('autoFit', function(){
                it('executes autoFit on render by default', function(){
                    var autoFitStub = sinon.stub(EpixCloud.prototype, 'autoFit');

                    cloud = new EpixCloud({topics: testTopics, $el: $testArea});
                    cloud.render();

                    expect(autoFitStub.calledOnce).toEqual(true);
                    autoFitStub.restore();
                });

                it('does not execute autoFit if the noscale option is passed on initialisation', function(){
                    var autoFitStub = sinon.stub(EpixCloud.prototype, 'autoFit');

                    cloud = new EpixCloud({topics: testTopics, $el: $testArea, noscale: true});
                    cloud.render();

                    expect(autoFitStub.calledOnce).toEqual(false);
                    autoFitStub.restore();
                });
            });

            describe('circular rendering', function(){
                it('resizes the viewport to a square on render if the circle option is set', function(){
                    $testArea.css({
                        width: 300,
                        height: 200
                    });

                    cloud = new EpixCloud({circle: true, topics: [], $el: $testArea});
                    cloud.render();

                    expect(cloud.getEl().css('width')).toEqual('200px');
                    expect(cloud.getEl().css('margin-left')).toEqual('50px');
                });
            });
        });

    });
});
