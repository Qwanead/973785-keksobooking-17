'use strict';

(function () {

  var MAP_HEIGHT = 630;
  var MAP_PADDING_TOP = 130;
  var MAP_PIN_WIDTH = 65;
  var MAP_PIN_HEIGHT = 87;

  var mapWidth = document.querySelector('main').offsetWidth;

  var getMapPinCoordinates = function (mapPin) {
    var coordinates = {};
    coordinates.x = parseInt(mapPin.style.left, 10) + Math.round(MAP_PIN_WIDTH / 2);
    coordinates.y = parseInt(mapPin.style.top, 10) + MAP_PIN_HEIGHT;

    return coordinates;
  };

  var writeInputValue = function (input, value) {
    if (input === address) {
      var mapPinCoordinates = getMapPinCoordinates(value);

      input.value = mapPinCoordinates.x + ', ' + mapPinCoordinates.y;
    }
  };

  var mapPin = document.querySelector('.map__pin--main');
  var address = document.querySelector('input[name=address]');

  window.form.enable(false);

  writeInputValue(address, mapPin);

  // перемещение mapPin

  var isFormEnabled = false;

  var isPinCoordXOnMap = function (pin) {
    var pinCoordX = pin.offsetLeft + Math.round(MAP_PIN_WIDTH / 2);
    var result = true;

    if (pinCoordX < 0) {
      pin.style.left = 0 - Math.round(MAP_PIN_WIDTH / 2) + 'px';
      result = false;
    }

    if (pinCoordX > mapWidth) {
      pin.style.left = mapWidth - Math.round(MAP_PIN_WIDTH / 2) + 'px';
      result = false;
    }

    return result;
  };

  var isPinCoordYOnMap = function (pin) {
    var pinCoordY = pin.offsetTop + MAP_PIN_HEIGHT;
    var result = true;

    if (pinCoordY < MAP_PADDING_TOP) {
      pin.style.top = MAP_PADDING_TOP - MAP_PIN_HEIGHT + 'px';
      result = false;
    }

    if (pinCoordY > MAP_HEIGHT) {
      pin.style.top = MAP_HEIGHT - MAP_PIN_HEIGHT + 'px';
      result = false;
    }

    return result;
  };

  mapPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    if (!isFormEnabled) {
      window.form.enable(true);
    }

    var startPinCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startPinCoords.x - moveEvt.clientX,
        y: startPinCoords.y - moveEvt.clientY,
      };

      mapPin.style.left = mapPin.offsetLeft - shift.x + 'px';
      mapPin.style.top = mapPin.offsetTop - shift.y + 'px';

      if (isPinCoordXOnMap(mapPin)) {
        startPinCoords.x = moveEvt.clientX;
      }

      if (isPinCoordYOnMap(mapPin)) {
        startPinCoords.y = moveEvt.clientY;
      }

      writeInputValue(address, mapPin);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      writeInputValue(address, mapPin);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
