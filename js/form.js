'use strict';

(function () {

  var enebleForm = function (formEnabled) {
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

      document.querySelector('.map__pins').appendChild(window.data.renderPins(offers));
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

  var offers = window.data.createOfferList(8);
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
    enebleForm: enebleForm
  };
})();
