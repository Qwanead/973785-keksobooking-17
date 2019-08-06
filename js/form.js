'use strict';

(function () {
  var loadedOffers;

  var createPin = function (offer) {
    var OFFER_PIN_WIDTH = 50;
    var OFFER_PIN_HEIGHT = 70;

    if (!offer) {
      return undefined;
    }

    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var pin = pinTemplate.cloneNode(true);
    var img = pin.querySelector('img');

    pin.style.left = (offer.location.x - OFFER_PIN_WIDTH / 2) + 'px';
    pin.style.top = (offer.location.y - OFFER_PIN_HEIGHT) + 'px';
    img.src = offer.author.avatar;
    img.alt = offer.offer.title;

    return pin;
  };

  var renderCard = function (pin) {
    var card = document.querySelector('#card').content.querySelector('.map__card');
    var avatar = card.querySelector('.popup__avatar');
    var title = card.querySelector('.popup__title');
    var address = card.querySelector('.popup__text--address');
    var price = card.querySelector('.popup__text--price');
    var type = card.querySelector('.popup__type');
    var capacity = card.querySelector('.popup__text--capacity');
    var time = card.querySelector('.popup__text--time');
    var description = card.querySelector('.popup__description');

    avatar.src = pin.author.avatar;
    title.textContent = pin.offer.title;
    address.textContent = pin.offer.address;
    price.textContent = pin.offer.price + '\u20bd' + '/ночь';
    description.textContent = pin.offer.description;


    switch (pin.offer.type) {
      case 'flat':
        type.textContent = 'Квартира';
        break;
      case 'bungalo':
        type.textContent = 'Бунгало';
        break;
      case 'house':
        type.textContent = 'Дом';
        break;
      case 'palace':
        type.textContent = 'Дворец';
        break;
    }

    capacity.textContent = pin.offer.rooms + ' комнаты для ' + pin.offer.guests + ' гостей';
    time.textContent = 'Заезд после ' + pin.offer.checkin + ', выезд до ' + pin.offer.checkout;

    var featuresList = card.querySelector('.popup__features');
    var wifi = featuresList.querySelector('.popup__feature--wifi');
    var dishwasher = featuresList.querySelector('.popup__feature--dishwasher');
    var parking = featuresList.querySelector('.popup__feature--parking');
    var washer = featuresList.querySelector('.popup__feature--washer');
    var elevator = featuresList.querySelector('.popup__feature--elevator');
    var conditioner = featuresList.querySelector('.popup__feature--conditioner');

    while (featuresList.lastChild) {
      featuresList.removeChild(featuresList.lastChild);
    }

    pin.offer.features.forEach(function (feature) {
      switch (feature) {
        case 'wifi':
          featuresList.appendChild(wifi);
          break;
        case 'dishwasher':
          featuresList.appendChild(dishwasher);
          break;
        case 'parking':
          featuresList.appendChild(parking);
          break;
        case 'washer':
          featuresList.appendChild(washer);
          break;
        case 'elevator':
          featuresList.appendChild(elevator);
          break;
        case 'conditioner':
          featuresList.appendChild(conditioner);
          break;
      }
    });

    var photosList = card.querySelector('.popup__photos');
    var photo = photosList.querySelector('.popup__photo');

    photosList.removeChild(photo);

    pin.offer.photos.forEach(function (srcPhoto) {
      var insertedPhoto = photo.cloneNode();
      insertedPhoto.src = srcPhoto;
      photosList.appendChild(insertedPhoto);
    });

    document.querySelector('.map__filters-container').insertAdjacentElement('beforebegin', card);
  };

  var removePins = function () {
    var pins = document.querySelector('.map__offers');

    if (pins) {
      pins.parentNode.removeChild(pins);
    }
  };

  var renderPins = function (offers) {
    var NUM_OF_PINS = 5;

    if (offers.length === 0) {
      return undefined;
    }

    var fragment = document.createDocumentFragment();
    var div = document.createElement('div');
    div.className = 'map__offers';
    fragment.appendChild(div);

    offers.slice(0, NUM_OF_PINS).forEach(function (pin) {
      if (pin.offer) {
        div.appendChild(createPin(pin));
      }
    });

    return fragment;
  };

  var onLoad = function (offers) {
    loadedOffers = offers;
    document.querySelector('.map__pins').appendChild(renderPins(loadedOffers));
    renderCard(offers[0]);
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

  var updatePins = function () {
    var resultPins = loadedOffers;

    removePins();

    if (loadedOffers) {
      switch (housingType.value) {
        case 'palace':
          resultPins = loadedOffers.filter(function (pins) {
            return pins.offer.type === 'palace';
          });
          break;
        case 'flat':
          resultPins = loadedOffers.filter(function (pins) {
            return pins.offer.type === 'flat';
          });
          break;
        case 'house':
          resultPins = loadedOffers.filter(function (pins) {
            return pins.offer.type === 'house';
          });
          break;
        case 'bungalo':
          resultPins = loadedOffers.filter(function (pins) {
            return pins.offer.type === 'bungalo';
          });
          break;
      }

      if (resultPins.length > 0) {
        document.querySelector('.map__pins').appendChild(renderPins(resultPins));
      }
    }
  };

  var housingType = document.querySelector('select[name=housing-type]');

  housingType.addEventListener('change', function () {
    updatePins();
  });

  window.form = {
    enable: enableForm
  };
})();
