'use strict';

var createOffer = function (num) {
  var OFFER_TYPES = [
    'palace',
    'flat',
    'house',
    'bungalo'
  ];

  var offer = {};
  var mapWidth = document.querySelector('main').offsetWidth;

  offer.author = {avatar: 'img/avatars/user0' + num + '.png'};
  offer.offer = {type: OFFER_TYPES[Math.round(Math.random() * 3)]};
  offer.location = {
    x: Math.round(Math.random() * mapWidth),
    y: Math.round(Math.random() * (630 - 130) + 130)
  };

  return offer;
};

var createPin = function (offer) {
  var pin = pinTemplate.cloneNode(true);
  var img = pin.querySelector('img');
  pin.style = 'left: ' + (offer.location.x - 25) + 'px; top:' + (offer.location.y - 70) + 'px;';
  img.src = offer.author.avatar;
  img.alt = 'заголовок объявления';

  return pin;
};

var offers = [];

for (var i = 1; i <= 8; i++) {
  offers.push(createOffer(i));
}

document.querySelector('.map').classList.remove('map--faded');

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var fragment = document.createDocumentFragment();

for (i = 0; i < offers.length; i++) {
  fragment.appendChild(createPin(offers[i]));
}

document.querySelector('.map__pins').appendChild(fragment);
