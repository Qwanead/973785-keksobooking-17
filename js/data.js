'use strict';

(function () {
  var MAP_HEIGHT = 630;
  var MAP_PADDING_TOP = 130;
  var OFFER_PIN_WIDTH = 50;
  var OFFER_PIN_HEIGHT = 70;
  var MAP_PIN_WIDTH = 65;
  var MAP_PIN_HEIGHT = 87;

  var mapWidth = document.querySelector('main').offsetWidth;

  var createOffer = function (num) {
    var OFFER_TYPES = [
      'palace',
      'flat',
      'house',
      'bungalo'
    ];

    var offer = {};

    offer.author = {avatar: 'img/avatars/user0' + num + '.png'};
    offer.offer = {type: OFFER_TYPES[Math.round(Math.random() * 3)]};
    offer.location = {
      x: Math.round(Math.random() * mapWidth),
      y: Math.round(Math.random() * (MAP_HEIGHT - MAP_PADDING_TOP) + MAP_PADDING_TOP)
    };

    return offer;
  };

  var createPin = function (offer) {
    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var pin = pinTemplate.cloneNode(true);
    var img = pin.querySelector('img');

    pin.style.left = (offer.location.x - OFFER_PIN_WIDTH / 2) + 'px';
    pin.style.top = (offer.location.y - OFFER_PIN_HEIGHT) + 'px';
    img.src = offer.author.avatar;
    img.alt = 'заголовок объявления';

    return pin;
  };

  var createOfferList = function (num) {
    var offersList = [];
    for (var i = 1; i <= num; i++) {
      offersList.push(createOffer(i));
    }

    return offersList;
  };

  var renderPins = function (offers) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < offers.length; i++) {
      fragment.appendChild(createPin(offers[i]));
    }

    return fragment;
  };

  window.data = {
    MAP_HEIGHT: MAP_HEIGHT,
    MAP_PADDING_TOP: MAP_PADDING_TOP,
    OFFER_PIN_WIDTH: OFFER_PIN_WIDTH,
    OFFER_PIN_HEIGHT: OFFER_PIN_HEIGHT,
    MAP_PIN_WIDTH: MAP_PIN_WIDTH,
    MAP_PIN_HEIGHT: MAP_PIN_HEIGHT,
    mapWidth: mapWidth,
    createOfferList: createOfferList,
    renderPins: renderPins
  };
})();
