'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var avatarFileChooser = document.querySelector('#avatar');
  var avatar = document.querySelector('.ad-form-header__preview img');

  var isFileMatches = function (file) {
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    return matches;
  };

  avatarFileChooser.addEventListener('change', function () {
    var file = avatarFileChooser.files[0];

    if (file) {
      if (isFileMatches(file)) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          avatar.src = reader.result;
        });

        reader.readAsDataURL(file);
      }
    }
  });

  var resetAvatar = function () {
    var INITIAL_AVATAR_SRC = 'img/muffin-grey.svg';

    avatar.src = INITIAL_AVATAR_SRC;
  };

  var galleryFileChooser = document.querySelector('#images');
  var galleryContainer = document.querySelector('.ad-form__photo-container');
  var galleryBlock = document.querySelector('.ad-form__photo');
  var galleryBlockTemplate = galleryBlock.cloneNode();


  var onGalleryChange = function () {
    resetGallery();

    var files = Array.from(galleryFileChooser.files);

    galleryBlock.parentNode.removeChild(galleryBlock);

    if (files) {
      files.forEach(function (file) {
        if (isFileMatches(file)) {
          var reader = new FileReader();

          reader.addEventListener('load', function () {
            var galleryItem = galleryBlockTemplate.cloneNode();
            var img = document.createElement('img');

            galleryItem.appendChild(img);

            galleryContainer.appendChild(galleryItem);
            img.className = 'ad-form__photo';
            img.src = reader.result;
          });

          reader.readAsDataURL(file);
        }
      });
    }
  };

  galleryFileChooser.addEventListener('change', onGalleryChange);

  var resetGallery = function () {
    var galleryItems = Array.from(galleryContainer.querySelectorAll('div .ad-form__photo'));

    galleryItems.forEach(function (item) {
      item.parentNode.removeChild(item);
    });

    galleryContainer.appendChild(galleryBlock);
  };

  window.upload = {
    resetAvatar: resetAvatar,
    resetGallery: resetGallery
  };
})();
