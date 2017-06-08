(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};

        /**
        * @desc Stores album information
        * @type {Object}
        */

        var currentAlbum = Fixtures.getAlbum();

        /**
        * @desc Buzz object audio file
        * @type {Object}
        */
        var currentBuzzObject = null;

        /**
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */
        var setSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            }

            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });

            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });

            SongPlayer.currentSong = song;
        };


        /**
        * @function playSong
        * @desc play current Buzz object
        * @param {Object} song
        */

        var playSong = function (song) {
            if (currentBuzzObject) {
              currentBuzzObject.play();
              song.playing = true;
            }
        };

        /**
        * @function stopSong
        * @desc stop current Buzz object
        * @param {Object} song
        */

        var stopSong = function(song) {
            if (currentBuzzObject) {
              currentBuzzObject.stop();
              song.playing = null;
            }
        };


        /**
        * @function getSongIndex
        * @desc Gets index of song in album object
        * @type {number}
        */

          var getSongIndex = function(song) {
              return currentAlbum.songs.indexOf(song);
          };

          /**
          * @desc Active song object from list of songs
          * @type {Object}
          */

          SongPlayer.currentSong = null;

          /**
           * @desc Current playback time (in seconds) of currently playing song
           * @type {Number}
           */
          SongPlayer.currentTime = null;

        SongPlayer.play = function(song) {
          song = song || SongPlayer.currentSong || currentAlbum.songs[0];
          if (SongPlayer.currentSong !== song) {
              setSong(song);
              playSong(song);
          } else if (SongPlayer.currentSong === song) {
               if (currentBuzzObject.isPaused()) {
                   playSong(song);
                }
            }
        };

        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };


        /**
        * @function SongPlayer.previous
        * @desc Changes to previous song
        * @type {onject} song
        */

        SongPlayer.previous = function(song) {
              song = song || SongPlayer.currentSong;
              var currentSongIndex = getSongIndex(SongPlayer.currentSong);
              currentSongIndex--;

              if (currentSongIndex < 0) {
                stopSong(song);
              } else {
                  var song = currentAlbum.songs[currentSongIndex];
                  setSong(song);
                  playSong(song);
              }
        };

        /**
        * @function SongPlayer.next
        * @desc Changes to next song
        * @type {object} song
        */

        SongPlayer.next = function(song) {
              song = song || SongPlayer.currentSong;
              var currentSongIndex = getSongIndex(SongPlayer.currentSong);
              currentSongIndex++;

              if (currentSongIndex > currentAlbum.songs.length - 1) {
                stopSong(song);
              } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
              }
        };

        /**
         * @function setCurrentTime
         * @desc Set current time (in seconds) of currently playing song
         * @param {Number} time
         */
         SongPlayer.setCurrentTime = function(time) {
             if (currentBuzzObject) {
                 currentBuzzObject.setTime(time);
             }
         };

        return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
