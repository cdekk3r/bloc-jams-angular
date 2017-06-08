(function() {
    function seekBar($document) {

      /**
      * @function calculatePercent
      * @desc calculates horizontal percent along seek bar
      * @type {number}
      */

        var calculatePercent = function(seekBar, event) {
            var offsetX = event.pageX - seekBar.offset().left;
            var seekBarWidth = seekBar.width();
            var offsetXPercent = offsetX / seekBarWidth;
            offsetXPercent = Math.max(0, offsetXPercent);
            offsetXPercent = Math.min(1, offsetXPercent);
            return offsetXPercent;
        }

        return {
            templateUrl: '/templates/directives/seek_bar.html',
            replace: true,
            restrict: 'E',
            scope: {
                onChange: '&'
            },
            link: function(scope, element, attributes) {
                scope.value = 0;
                scope.max = 100;

                /**
                * @desc Holds the element that matches the directive (<seek-bar>) as a jQuery object so we can call jQuery methods on it
                * @type {object}
                */

                var seekBar = $(element);

                attributes.$observe('value', function(newValue) {
                    scope.value = newValue;
                });

                attributes.$observe('max', function(newValue) {
                    scope.max = newValue;
                });

                /**
                * @function percentString
                * @desc determine position of thumb
                * @type {number}
                */

                var percentString = function() {
                    var value = scope.value;
                    var max = scope.max;
                    var percent = value / max * 100;
                    return percent + '%';
                };

                /**
                * @function fillStyle
                * @desc determines width of seek bar playback
                * @type {object}
                */

                scope.fillStyle = function() {
                    return {width: percentString()};
                };

                /**
                * @function thumbStyle
                * @desc updates position of seek bar thumb
                * @type {object}
                */

                scope.thumbStyle = function() {
                    return {left: percentString()};
                };

                /**
                * @function onClickSeekBar
                * @desc updates seek bar value based on seek bar's width and location of the click on seek bar
                * @type {number}
                */

                scope.onClickSeekBar = function(event) {
                    var percent = calculatePercent(seekBar, event);
                    scope.value = percent * scope.max;
                    console.log(percent);
                    console.log(scope.max);
                    notifyOnChange(scope.value);
                };


                /**
                * @function trackThumb
                * @desc changes value of scope.value as user drags thumb.
                * @type {number}
                */

                scope.trackThumb = function() {
                    $document.bind('mousemove.thumb', function(event) {
                        var percent = calculatePercent(seekBar, event);
                        scope.$apply(function() {
                            scope.value = percent * scope.max;
                            notifyOnChange(scope.value);
                        });
                    });

                    $document.bind('mouseup.thumb', function() {
                        $document.unbind('mousemove.thumb');
                        $document.unbind('mouseup.thumb');
                    });
                };

                /**
                * @function notifyOnChange
                * @desc notifies onChange that scope.value has changed
                * @type {number}
                */

                var notifyOnChange = function(newValue) {
                    if (typeof scope.onChange === 'function') {
                        scope.onChange({value: newValue});
                    }
                };

            }
        };
    }

    angular
        .module('blocJams')
        .directive('seekBar', ['$document', seekBar]);
})();
