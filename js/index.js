// console.clear()

// How to get an access token:
// http://jelled.com/instagram/access-token

var galleryFeed = new Instafeed({
  get: "user",
  userId: 3292822371,
  accessToken: "3292822371.b7df4d9.9047817bf3c5412cbe9b4350a7fd92c8",
  resolution: "standard_resolution",
  useHttp: "true",
  limit: 20,
  template:
  // we can use the template to fetch the data for each post and can then remodel/extract it for later use
  '<div class="grid-item">'+
    '<div class="img-featured-container">'+
      '<div class="img-backdrop"></div>'+
      '<div class="description-container">'+
        '<p class="caption">{{caption}}</p>'+
        '<span class="likes">'+
          '<i class="icon ion-heart"></i>'+
           '{{likes}}'+
        '</span>'+
        '<span class="comments"><i class="icon ion-chatbubble"></i> {{comments}}</span>'+
      '</div>'+
      '<img src="{{image}}" class="{{type}} {{orientation}}">'+
      // '<video><source src="{{model.videos.standard_resolution.url}}" type="video/mp4"></video>'+
    '</div>'+
  '</div>',

  target: "instafeed-gallery-feed",
  // filter: function(image) {
  //   return image.type === "image";
  //   console.log('filter')
  // },
  after: function() {
    // disable button if no more results to load
    if (!this.hasNext()) {
      console.log('no more posts to load')
      TweenMax.to($btnInstafeedLoad, 0.5, {opacity:0.5, onComplete: function(){
        $btnInstafeedLoad.attr('disabled', 'disabled');
      }}, 0)
    }

    initMasonry();
  },
});

galleryFeed.run();

var $btnInstafeedLoad = $('#btn-instafeed-load');
$btnInstafeedLoad.on('click', function() {
  galleryFeed.next();
  // initMasonry();
});


function initMasonry() {
  var $grid = $('.grid');

  $grid.masonry({
    // use outer width of grid-sizer for columnWidth
    columnWidth: '.grid-sizer',
    itemSelector: '.grid-item',
    percentPosition: true
  });

  // layout Masonry after each image loads
  $grid.imagesLoaded().progress( function() {
    $grid.masonry('layout');
  }).done( function( instance ) {
    console.log('all images successfully loaded');
    initModal();
  })
}


// MODAL - WIP
function initModal() {

  var $gridItem = $('.grid-item'),
      $gridItemTotal = $gridItem.length,
      $modalContainer = $('.modal-container'),
      $modalCloseContainer = $('.modal-close-container'),
      $modalBody = $('.modal-body'),
      $modalNextBtn = $('.modal-next'),
      $modalPrevBtn = $('.modal-prev'),
      $modalBackdrop = $('.modal-backdrop');

  var $thisGridItemImgObj;
  var counter = 0;

  // grid item clicks
  $gridItem.each(function() {

    $(this).on('click', function(){
      var $thisGridItem = $(this);
      counter = $thisGridItem.index();

      addModalContent($thisGridItem)

      console.log('Clicked grid item:', $thisGridItem.index(), $thisGridItem)

      showModal();
    });
  });


  // click handlers
  $modalCloseContainer.on('click', function() {
    hideModal();
  })

  $modalBackdrop.on('click', function() {
    hideModal();
  });

  $modalNextBtn.on('click', function() {
    nextContent();
    updateContent();
  })

  $modalPrevBtn.on('click', function() {
    prevContent();
    updateContent();
  })

  // functions
  function showModal() {
    var tl = new TimelineMax();

    tl.set($modalContainer, {scale:0, xPercent:-50, yPercent:-50}, 0);
    tl.set($modalBody, {autoAlpha:0, yPercent:-100}, 0);

    tl.to($modalBackdrop, 0.3, {autoAlpha:1}, '+=0');
    tl.to($modalContainer, 0.5, {autoAlpha:1, scale:1, ease: Back.easeOut.config(1.7)}, '+=0');
    tl.to($modalBody, 0.3, {autoAlpha:1, yPercent:0}, '+=0.1');
  }

  function hideModal() {
    var tl = new TimelineMax();

    tl.to($modalBackdrop, 0.3, {autoAlpha:0}, 0);
    tl.to($modalContainer, 0.3, {autoAlpha:0}, 0);
  }

  function updateContent() {
    console.log(counter);
    var $thisGridItem = $gridItem.eq(counter);

    addModalContent($thisGridItem);
  }

  function nextContent() {
    counter++
    if (counter > $gridItemTotal-1) counter = 0;
  }

  function prevContent() {
    counter--
    if (counter < 0) counter = $gridItemTotal-1;
  }

  function addModalContent(_this) {
    var $thisGridItem = _this;
    var $thisImg = $thisGridItem.find('img');

    $modalContainer.find('.modal-title').html($thisGridItem.find('.caption').text());
    // $modalContainer.find('.modal-description').html($thisGridItem.find('.comments'));
    $modalContainer.find('img').attr('src', $thisImg.attr('src'));
  }
}
