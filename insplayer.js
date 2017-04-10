var InsPlayer = {
    start: function (video_selector) {
        $(video_selector).each(function () {
            new InsVideo(this);
        })
    }
};

var InsVideo = function (el) {
    this.$video    = $(el);
    this.$wrapper  = $(el).parent().addClass('paused');
    this.$wrapper.css({"display": "inline-block", "position": "relative", "z-index": 100});
    this.$wrapper.append('<div class="video-controls video-controls--show"><button data-media="play-pause"></button></div>');
    this.$controls = this.$wrapper.find('.video-controls');
    //if width < 320 then set controlss btns border --> 20px 0 20px 40px
    if(this.$video.width() < 150) {
        this.$wrapper.find('[data-media="play-pause"]').css({"border-width": "15px 0 15px 30px"});
    }else if(this.$video.width() < 250) {
        this.$wrapper.find('[data-media="play-pause"]').css({"border-width": "20px 0 20px 40px"});
    }

    // remove native controls
    this.$video.removeAttr('controls');

    // check if video should autoplay
    if(!!this.$video.attr('autoplay')) {
        this.$wrapper.removeClass('paused').addClass('playing');
    }

    // check if video is muted
    if(this.$video.attr('muted') === 'true' || this.$video[0].volume === 0) {
        this.$video[0].muted = true;
        this.$wrapper.addClass('muted');
    }

    // attach event handlers
    this.attachEvents();
};

InsVideo.prototype.attachEvents = function () {

    var self = this,
        _t; // keep track of timeout for controls
    var playing = false;

    // attach handlers to data attributes
    this.$wrapper.on('click', '[data-media]', function () {

        var data = $(this).data('media');

        if(data === 'play-pause') {
            self.playPause();
        }
        if(data === 'mute-unmute') {
            self.muteUnmute();
        }
    });

    this.$video.on('click', function () {
        self.playPause();
    });

    this.$video.on('play', function () {
        self.$wrapper.removeClass('paused').addClass('playing');
        playing = true;
        if($(this).width() < 150){
            self.$wrapper.find('[data-media="play-pause"]').css({"border-width": "10px", "width": "30px", "height": "30px"});
        }else if($(this).width() < 250) {
            self.$wrapper.find('[data-media="play-pause"]').css({"border-width": "13px", "width": "40px", "height": "40px"});
        }
    });

    this.$video.on('pause', function () {
        self.$wrapper.removeClass('playing').addClass('paused');
        // show controls
        self.$controls.addClass('video-controls--show');
        playing = false;
        clearTimeout(_t);
        if ($(this).width() < 150){
            self.$wrapper.find('[data-media="play-pause"]').css({"border-width": "15px 0 15px 30px", "width": 0, "height": 0});
        }else if($(this).width() < 250) {
            self.$wrapper.find('[data-media="play-pause"]').css({"border-width": "20px 0 20px 40px", "width": 0, "height": 0});
        }
    });

    this.$video.on('volumechange', function () {
        if($(this)[0].muted) {
            self.$wrapper.addClass('muted');
        }
        else {
            self.$wrapper.removeClass('muted');
        }
    });

    this.$wrapper.on('mousemove', function () {

        // show controls
        self.$controls.addClass('video-controls--show');

        // clear original timeout
        clearTimeout(_t);

        // start a new one to hide controls after specified time
        if (playing) {
            _t = setTimeout(function () {
                self.$controls.removeClass('video-controls--show');
            }, 2250);
        }

    }).on('mouseleave', function () {
        if(playing) {
            self.$controls.removeClass('video-controls--show');
        }
    });
};

InsVideo.prototype.playPause = function () {
    if (this.$video[0].paused) {
        this.$video[0].play();
    } else {
        this.$video[0].pause();
    }
};

InsVideo.prototype.muteUnmute = function () {
    this.$video[0].muted = this.$video[0].muted === false;
};
