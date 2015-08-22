app.controller('BlogCtrl', function ($scope, $http) {
    var $slySlidee = $('#posts-list > .slidee'),
        activatePost = function ($el) {
            $http.get('blog/' + $el.attr('post'))
                .then(function (res) {
                    $scope.activePost = {
                        image_url: res.data.image,
                        content: res.data.content,
                        title: $el.children('.title').first().text()
                    };
                }, function (err) {
                    console.log(err);
                });
        },
        activateLatestPost = function () {
            activatePost($slySlidee.children('li').first());
        },
        SlyCtrl = function () {
            var slyOptions = { horizontal: true
                             , itemNav: 'forceCentered'
                             , mouseDragging: true
                             , touchDragging: true
                             , releaseSwing: true
                             , elasticBounds: true
                             , activateOn: 'click'
                             , prev: '#blog-later'
                             , next: '#blog-earlier'
                             , smart: true
                             , speed: 1000
                             , swingSpeed: 0.08
                             , easing: 'swing'
                             },
                slyEvents = { active: function () { activatePost($slySlidee.children('.active').first()); } },
                postsListSly = new Sly("#posts-list", slyOptions, slyEvents).init();

            return {
                resetPostsList: function () {
                    var activeItem = postsListSly.rel.activeItem || 0
                      , $postsListFrame = $('#posts-list').remove();

                    $('#posts-list-wrapper').append($postsListFrame);
                    if (postsListSly) {
                        postsListSly.destroy();
                    };
                    setTimeout(function () {
                        postsListSly = new Sly("#posts-list", slyOptions, slyEvents).init();
                        postsListSly.activate(activeItem);
                    }, 1000);
                },
                slyObj: postsListSly
            };
        },
        slyCtrl = new SlyCtrl(),
        slideInText = function () {
            $('#blog-main')
                .animate({'margin-left':'-=1vw'}, 50, 'linear')
                .animate({'margin-left':'-=99vw'}, 450, 'linear');

            // If I don't do this, the button doesn't show up unless you resize
            // the screen or change the orientation of the device
            setTimeout(function () {
                $('.bottom-bar').hide().fadeIn('fast');
            }, 600);
        },
        backToCover = function () {
            $('#blog-main')
                .animate({'margin-left':'+=1vw'}, 50, 'linear')
                .animate({'margin-left':'+=99vw'}, 450, 'linear');

            // If you don't fade-out the entire bar, it overlaps the posts-list and prevents scrolling
            $('.bottom-bar').fadeOut('fast');
        },
        refreshBackButton = function () {
            $('.back').hide().show();
        };

    $scope.page = "blog";
    activateLatestPost();
    slyCtrl.resetPostsList();

    // The items don't refresh properly on orientation change by default.  The postsList needs to be
    // throttled and refreshed manually for the posts list to display as expected on orientation
    // change and browser resize.
    $(window).on('orientationchange', slyCtrl.resetPostsList);
    $(window).on('resize', slyCtrl.resetPostsList);
    $('.btn.read').on('click touch', slideInText);
    $('.btn.back').on('click touch', backToCover);
    // If you don't refresh the button while scrolling, it 'sticks' on mobile devices.
    $('#blog-main').on('scroll', refreshBackButton);
    $('.hard').on('touchmove', function (e) {
        console.log('moved');
    });
});
