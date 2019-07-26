'use strict';

(function () {

  var createPin = function (offer) {
    var OFFER_PIN_WIDTH = 50;
    var OFFER_PIN_HEIGHT = 70;

    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var pin = pinTemplate.cloneNode(true);
    var img = pin.querySelector('img');

    pin.style.left = (offer.location.x - OFFER_PIN_WIDTH / 2) + 'px';
    pin.style.top = (offer.location.y - OFFER_PIN_HEIGHT) + 'px';
    img.src = offer.author.avatar;
    img.alt = offer.offer.title;

    return pin;
  };

  var renderPins = function (offers) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < offers.length; i++) {
      fragment.appendChild(createPin(offers[i]));
    }

    return fragment;
  };

  var onLoad = function (offers) {
    document.querySelector('.map__pins').appendChild(renderPins(offers));
  };

  var onError = function (response) {
    var errorTemplate =
      document.querySelector('#error')
      .content.querySelector('.error');
    var errorBlock = errorTemplate.cloneNode(true);
    var errorMessage = errorBlock.querySelector('.error__message');

    errorMessage.textContent = response;
    document.querySelector('body').appendChild(errorBlock);
  };

  var enableForm = function (formEnabled) {
    var fildsets = document.querySelectorAll('fieldset');
    var selects = document.querySelectorAll('select');

    for (var i = 0; i < fildsets.length; i++) {
      fildsets[i].disabled = !formEnabled;
    }

    for (i = 0; i < selects.length; i++) {
      selects[i].disabled = !formEnabled;
    }

    if (formEnabled) {
      document.querySelector('.map').classList.remove('map--faded');
      document.querySelector('.ad-form').classList.remove('ad-form--disabled');

      window.backend.load(onLoad, onError);
    }
  };

  var syncTypeAndPrice = function () {
    var BUNGALO_MIN_PRICE = 0;
    var FLAT_MIN_PRICE = 1000;
    var HOUSE_MIN_PRICE = 5000;
    var PALACE_MIN_PRICE = 10000;

    switch (typeOfHousing.value) {
      case 'bungalo':
        price.min = BUNGALO_MIN_PRICE;
        price.placeholder = BUNGALO_MIN_PRICE;
        break;
      case 'flat':
        price.min = FLAT_MIN_PRICE;
        price.placeholder = FLAT_MIN_PRICE;
        break;
      case 'house':
        price.min = HOUSE_MIN_PRICE;
        price.placeholder = HOUSE_MIN_PRICE;
        break;
      case 'palace':
        price.min = PALACE_MIN_PRICE;
        price.placeholder = PALACE_MIN_PRICE;
        break;
    }
  };

  var timein = document.querySelector('select[name=timein]');
  var timeout = document.querySelector('select[name=timeout]');
  var typeOfHousing = document.querySelector('select[name=type]');
  var price = document.querySelector('input[name=price');

  var syncTimeinAndTimeout = function () {
    timeout.selectedIndex = timein.selectedIndex;
  };

  var syncTimeoutAndTimein = function () {
    timein.selectedIndex = timeout.selectedIndex;
  };

  typeOfHousing.addEventListener('change', function () {
    syncTypeAndPrice();
  });

  timein.addEventListener('change', function () {
    syncTimeinAndTimeout();
  });

  timeout.addEventListener('change', function () {
    syncTimeoutAndTimein();
  });

  window.form = {
    enable: enableForm
  };
})();
