'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var lastTimeout;
  var debounce = function (cb) {
    var DEBOUNCE_INTERVAL = 500;
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(cb, DEBOUNCE_INTERVAL);
  };

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

    pin.data = offer;
    pin.classList.add('map__pin--offer');

    pin.style.left = (offer.location.x - OFFER_PIN_WIDTH / 2) + 'px';
    pin.style.top = (offer.location.y - OFFER_PIN_HEIGHT) + 'px';
    img.src = offer.author.avatar;
    img.alt = offer.offer.title;

    return pin;
  };

  var removeCard = function () {
    var card = document.querySelector('.map__card');

    if (card) {
      card.pin.classList.remove('map__pin--active');
      card.parentNode.removeChild(card);
    }

    document.removeEventListener('keydown', onCardEscPress);
  };

  var onCardEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      evt.preventDefault();
      removeCard();
    }
  };

  var renderCard = function (pin) {
    removeCard();

    var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
    var card = cardTemplate.cloneNode(true);
    var avatar = card.querySelector('.popup__avatar');
    var title = card.querySelector('.popup__title');
    var address = card.querySelector('.popup__text--address');
    var price = card.querySelector('.popup__text--price');
    var type = card.querySelector('.popup__type');
    var capacity = card.querySelector('.popup__text--capacity');
    var time = card.querySelector('.popup__text--time');
    var description = card.querySelector('.popup__description');

    card.pin = pin;

    avatar.src = pin.data.author.avatar;
    title.textContent = pin.data.offer.title;
    address.textContent = pin.data.offer.address;
    price.textContent = pin.data.offer.price + '\u20bd' + '/ночь';
    description.textContent = pin.data.offer.description;


    switch (pin.data.offer.type) {
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

    capacity.textContent = pin.data.offer.rooms + ' комнаты для ' + pin.data.offer.guests + ' гостей';
    time.textContent = 'Заезд после ' + pin.data.offer.checkin + ', выезд до ' + pin.data.offer.checkout;

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

    pin.data.offer.features.forEach(function (feature) {
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

    pin.data.offer.photos.forEach(function (srcPhoto) {
      var insertedPhoto = photo.cloneNode();
      insertedPhoto.src = srcPhoto;
      photosList.appendChild(insertedPhoto);
    });

    document.querySelector('.map__filters-container').insertAdjacentElement('beforebegin', card);

    var closeButton = document.querySelector('.popup__close');
    closeButton.addEventListener('click', function () {
      removeCard();
    });

    document.addEventListener('keydown', onCardEscPress);
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

  var addHandlersOnPins = function (pins) {
    pins.forEach(function (pin) {
      pin.addEventListener('click', function () {
        pin.classList.add('map__pin--active');
        renderCard(pin);
      });
    });
  };

  var onLoad = function (offers) {
    loadedOffers = offers;

    document.querySelector('.map__pins').appendChild(renderPins(loadedOffers));

    var pins = document.querySelectorAll('.map__pin--offer');
    addHandlersOnPins(pins);
  };

  var resetPage = function () {
    removeCard();
    enableForm(false);
    removePins();
    resetMapPin();
    window.form.isEnabled = false;
    window.upload.resetAvatar();
    window.upload.resetGallery();
  };

  var resetMapPin = function () {
    var MAP_PIN_INITIAL_COORD_X = 570;
    var MAP_PIN_INITIAL_COORD_Y = 375;
    var INITIAL_ADDRESS_VALUE = '603, 462';

    var mapPin = document.querySelector('.map__pin--main');
    var address = document.querySelector('input[name=address]');

    address.value = INITIAL_ADDRESS_VALUE;

    mapPin.style.left = MAP_PIN_INITIAL_COORD_X + 'px';
    mapPin.style.top = MAP_PIN_INITIAL_COORD_Y + 'px';
  };

  var removeMessage = function () {
    var message = document.querySelector('.success');

    message.parentNode.removeChild(message);

    document.removeEventListener('click', onMessageClick);
    document.removeEventListener('keydown', onMessageEscPress);
  };

  var onMessageClick = function () {
    removeMessage();
  };

  var onMessageEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      evt.preventDefault();
      removeMessage();
    }
  };

  var showSuccessMessage = function () {
    var messageTemplate = document.querySelector('#success').content.querySelector('.success');
    var message = messageTemplate.cloneNode(true);

    document.querySelector('body').appendChild(message);

    document.addEventListener('click', onMessageClick);
    document.addEventListener('keydown', onMessageEscPress);
  };

  var onSave = function () {
    resetPage();
    showSuccessMessage();
  };

  var removeErrorMessage = function () {
    var error = document.querySelector('.error');

    error.parentNode.removeChild(error);

    document.removeEventListener('keydown', onErrorEscPress);
  };

  var onErrorClick = function () {
    removeErrorMessage();
  };

  var onErrorEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      evt.preventDefault();
      removeErrorMessage();
    }
  };

  var onError = function (response) {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorBlock = errorTemplate.cloneNode(true);
    var errorMessage = errorBlock.querySelector('.error__message');

    errorMessage.textContent = response;
    document.querySelector('body').appendChild(errorBlock);

    var closeErrorButton = document.querySelector('.error__button');

    closeErrorButton.addEventListener('click', onErrorClick);
    document.addEventListener('keydown', onErrorEscPress);
  };

  var isFormEnabled = false;

  var enableForm = function (formEnabled) {
    var form = document.querySelector('.ad-form');
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
      form.classList.remove('ad-form--disabled');

      window.backend.load(onLoad, onError);
    } else {
      document.querySelector('.map').classList.add('map--faded');
      form.reset();
      form.classList.add('ad-form--disabled');
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

  var disableOptions = function (numsOfOptions) {
    Array.from(capacity.options).forEach(function (option, index) {
      option.disabled = numsOfOptions.indexOf(index) !== -1;
    });
  };

  var selectOption = function (numOfOption) {
    capacity.options[numOfOption].selected = true;
  };

  var syncRoomAndCapacity = function () {
    switch (roomsSelect.value) {
      case '1':
        disableOptions([0, 1, 3]);
        selectOption(2);
        break;
      case '2':
        disableOptions([0, 3]);
        selectOption(1);
        break;
      case '3':
        disableOptions([3]);
        selectOption(0);
        break;
      case '100':
        disableOptions([0, 1, 2]);
        selectOption(3);
        break;
    }
  };

  var roomsSelect = document.querySelector('select[name=rooms]');
  var capacity = document.querySelector('select[name=capacity]');

  roomsSelect.addEventListener('change', function () {
    syncRoomAndCapacity();
  });

  var updatePins = function () {
    var resultPins = loadedOffers;

    removePins();
    removeCard();

    if (resultPins) {
      var housingType = document.querySelector('select[name=housing-type]');
      switch (housingType.value) {
        case 'palace':
          resultPins = resultPins.filter(function (pins) {
            return pins.offer.type === 'palace';
          });
          break;
        case 'flat':
          resultPins = resultPins.filter(function (pins) {
            return pins.offer.type === 'flat';
          });
          break;
        case 'house':
          resultPins = resultPins.filter(function (pins) {
            return pins.offer.type === 'house';
          });
          break;
        case 'bungalo':
          resultPins = resultPins.filter(function (pins) {
            return pins.offer.type === 'bungalo';
          });
          break;
      }

      var housingPrice = document.querySelector('select[name=housing-price]');

      switch (housingPrice.value) {
        case 'middle':
          resultPins = resultPins.filter(function (pins) {
            return (pins.offer.price >= 10000) && (pins.offer.price <= 50000);
          });
          break;
        case 'low':
          resultPins = resultPins.filter(function (pins) {
            return pins.offer.price < 10000;
          });
          break;
        case 'high':
          resultPins = resultPins.filter(function (pins) {
            return pins.offer.price > 50000;
          });
          break;
      }

      var housingRoom = document.querySelector('select[name=housing-rooms]');

      switch (housingRoom.value) {
        case '1':
          resultPins = resultPins.filter(function (pins) {
            return pins.offer.rooms === 1;
          });
          break;
        case '2':
          resultPins = resultPins.filter(function (pins) {
            return pins.offer.rooms === 2;
          });
          break;
        case '3':
          resultPins = resultPins.filter(function (pins) {
            return pins.offer.rooms === 3;
          });
          break;
      }

      var housingGuest = document.querySelector('select[name=housing-guests]');

      switch (housingGuest.value) {
        case '2':
          resultPins = resultPins.filter(function (pins) {
            return pins.offer.guests === 2;
          });
          break;
        case '1':
          resultPins = resultPins.filter(function (pins) {
            return pins.offer.guests === 1;
          });
          break;
        case '0':
          resultPins = resultPins.filter(function (pins) {
            return pins.offer.guests === 0;
          });
          break;
      }

      var wifi = document.querySelector('#filter-wifi');

      if (wifi.checked) {
        resultPins = resultPins.filter(function (pins) {
          return pins.offer.features.indexOf('wifi') !== -1;
        });
      }

      var dishwasher = document.querySelector('#filter-dishwasher');

      if (dishwasher.checked) {
        resultPins = resultPins.filter(function (pins) {
          return pins.offer.features.indexOf('dishwasher') !== -1;
        });
      }

      var parking = document.querySelector('#filter-parking');

      if (parking.checked) {
        resultPins = resultPins.filter(function (pins) {
          return pins.offer.features.indexOf('parking') !== -1;
        });
      }

      var washer = document.querySelector('#filter-washer');

      if (washer.checked) {
        resultPins = resultPins.filter(function (pins) {
          return pins.offer.features.indexOf('washer') !== -1;
        });
      }

      var elevator = document.querySelector('#filter-elevator');

      if (elevator.checked) {
        resultPins = resultPins.filter(function (pins) {
          return pins.offer.features.indexOf('elevator') !== -1;
        });
      }

      var conditioner = document.querySelector('#filter-conditioner');

      if (conditioner.checked) {
        resultPins = resultPins.filter(function (pins) {
          return pins.offer.features.indexOf('conditioner') !== -1;
        });
      }

      if (resultPins.length > 0) {
        document.querySelector('.map__pins').appendChild(renderPins(resultPins));

        var pins = document.querySelectorAll('.map__pin--offer');
        addHandlersOnPins(pins);
      }
    }
  };

  var formMapFilter = document.querySelector('.map__filters');
  var filterSelectors = Array.from(formMapFilter.querySelectorAll('select'));
  var filterInputs = Array.from(formMapFilter.querySelectorAll('input'));
  var formFiltrs = filterSelectors.concat(filterInputs);

  formFiltrs.forEach(function (filter) {
    filter.addEventListener('change', function () {
      debounce(updatePins);
    });
  });


  var form = document.querySelector('.ad-form');

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(form), onSave, onError);
  });

  var resetButton = form.querySelector('.ad-form__reset');

  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    resetPage();
  });

  window.form = {
    enable: enableForm,
    isEnabled: isFormEnabled
  };
})();
