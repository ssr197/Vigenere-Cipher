// Simple Vigenere Cipher - A simple tool that encrypts text
// using manually decryptable polyalphabetic substitution
// (Vigenere cipher).
// Copyright (C) 2018 Guney Ozsan
//
// This file is part of Simple Vigenere Cipher.
//
// Simple Vigenere Cipher is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
//
// Simple Vigenere Cipher is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Simple Vigenere Cipher.  If not, see <http://www.gnu.org/licenses/>.
// ---------------------------------------------------------------------

const VERSION = 'v1.0.0';
const AUTHOR = '<a href="http://www.guneyozsan.com" target="_blank">Guney Ozsan</a>';
const PROJECT_PAGE = '<a href="https://github.com/guneyozsan/simple-vigenere-cipher" target="_blank">Github</a>';
const ISSUES_PAGE = '<a href="https://github.com/guneyozsan/simple-vigenere-cipher/issues" target="_blank">Github issues</a>';
const LICENSE_PAGE = '<a href="https://github.com/guneyozsan/simple-vigenere-cipher/blob/master/LICENSE" target="blank">license</a>';

let currentCryptOperation;

const Crypt = {
  ENCRYPT: 'encrypt',
  DECRYPT: 'decrypt',
};

$(document).ready(function() {
  reset();
  bindUi();
  updateHtmlConstants();
});

function reset() {
  resetInputFieldContents($('input'));
  resetOutputFieldContents();
  disableInputFields($('input'));
  updateOutputField('');
}

function bindUi() {
  bindSelectCryptOperation();
  bindInputInputText();
  bindInputEncryptionKey();
}

function updateHtmlConstants() {
  $('.version').html(VERSION);
  $('.author').html(AUTHOR);
  $('.license').html(LICENSE_PAGE);
  $('.project-page').html(PROJECT_PAGE);
  $('.issues-page').html(ISSUES_PAGE);
}

function bindSelectCryptOperation() {
  bindUiFunctionality();

  function bindUiFunctionality() {
    $('#btn-select-encrypt').on('click', function() {
      clickSelection($(this), Crypt.ENCRYPT);
    });
    $('#btn-select-decrypt').on('click', function() {
      clickSelection($(this), Crypt.DECRYPT);
    });
  }

  function clickSelection(selectedButton, selectedOperation) {
    currentCryptOperation = selectedOperation;
    
    // Reset
    resetUiTexts();
    resetInputFieldContents($('input'));
    resetOutputFieldContents();
    disableBox($('.box').not('.box-crypt'));
    disableInputFields($('input').not('#input-text'));
    disableButtons($('.btn').not('.btn-select-crypt'));
    deselectButtons($('.btn').not('.btn-select-crypt'));
    
    // Set
    highlightButton(selectedButton, $('.btn-select-crypt'));
    setActiveBox(false, $('.box-' + selectedOperation + '-active'));
    setActiveBox(true, $('#box-input-text'));
    setActiveBox(true, $('.box-' + getOppositeCrypt(selectedOperation) + '-passive'));
    enableBoxContents($('#box-input-text'), $('#btn-input-text'));
    updateInputPromptText();
  }
}

function bindInputInputText() {
  bindInputFunctionality();

  function bindInputFunctionality() {
    $('#input-text').on('input', function() {
      setActiveBox(true, $('#box-input-encryption-key, #box-output'));
      enableBoxContents($('#box-input-encryption-key'), $('#button-start'));
      updateInputPromptText();
      updateEncryptionKeyPromptText();
      
      let outputText = cryptResult();
      updateOutputBoxTitleText();
      updateOutputField(outputText);
    });
  }
}

function bindInputEncryptionKey() {
  bindInputFunctionality();

  function bindInputFunctionality() {
    $('#input-encryption-key').on('input', function() {
      let outputText = cryptResult();
      updateOutputBoxTitleText();
      updateOutputField(outputText);
    });
  }  
}

function resetEncryptionKeyPromptText() {
  $('#text-input-encryption-key').html('Encryption key:');
}

function resetOutputText() {
  $('#text-output-title').html('Output:');
}

function updateInputPromptText() {
  const encryptionIndicator = currentCryptOperation === Crypt.ENCRYPT ? ' ORIGINAL ' : ' ENCRYPTED ';
  $('#text-input-text').html('Enter ' + encryptionIndicator + ' text:');
}

function updateEncryptionKeyPromptText() {
  const encryptionIndicator = currentCryptOperation === Crypt.ENCRYPT ? 'Choose a NEW ' : 'Enter ';
  $('#text-input-encryption-key').html(encryptionIndicator + 'password for ' + currentCryptOperation + 'ion:');
}

function updateOutputBoxTitleText() {
  const encryptionIndicator = currentCryptOperation === Crypt.ENCRYPT ? 'ENCRYPTED' : 'ORIGINAL';
  $('#text-output-title').html(encryptionIndicator + ' text is:');
}

function enableBoxContents(box, exception) {
  box.find('*').not(exception).removeClass('disabled').removeAttr('disabled');
}

function setActiveBox(setActive, box) {
  const removePart = setActive ? '-passive' : '-active';
  const addPart = setActive ? '-active' : '-passive';

  box.each(function() {
    let cryptOperation;
    if ($(this).is('.box-encrypt-active, .box-encrypt-passive')) {
      cryptOperation = 'encrypt';
    }
    else if ($(this).is('.box-decrypt-active, .box-decrypt-passive')){
      cryptOperation = 'decrypt';
    }
    else if ($(this).hasClass('box-disabled')) {
      if (setActive) {
        $(this).removeClass('box-disabled');
        cryptOperation = currentCryptOperation;
      }
    }

    if (cryptOperation != undefined) {
      $(this).removeClass('box-' + cryptOperation + removePart).addClass('box-' + cryptOperation + addPart);
    }
  });
}

function disableBox(box) {
  const oppositeCrypt = getOppositeCrypt(currentCryptOperation);
  box.removeClass('box-' + currentCryptOperation + '-active').removeClass('box-' + currentCryptOperation + '-passive');
  box.removeClass('box-' + oppositeCrypt + '-active').removeClass('box-' + oppositeCrypt + '-passive');
  box.addClass('box-disabled');
}

function disableInputFields(inputFields) {
  inputFields.attr('disabled', true);
}

function disableButtons(buttons) {
  buttons.addClass('disabled');
}

function highlightButton(selectedButton, buttonSet) {
  if (buttonSet != undefined) {
    buttonSet.not(selectedButton).removeClass('btn-primary').addClass('btn-light');
  }
  selectedButton.removeClass('btn-light').addClass('btn-primary');
}

function deselectButtons(buttons) {
  buttons.addClass('btn-light').removeClass('btn-primary');
}

function resetOutputFieldContents() {
  updateOutputField('');
  $('#text-output').val('');
  $('#text-output').attr('disabled', true);
}

function resetInputFieldContents(input) {
  input.val('');
}

function resetUiTexts() {
  resetEncryptionKeyPromptText();
  resetOutputText();
}

function updateOutputField(cryptResult) {
  const key = $('#input-encryption-key').val();
  let inputText = $('#input-text').val();

  let correspondingKeySequence = '';
  const keyNoSpace = key.replace(/\s/g,'');
  let keyCharIndex = 0;
  
  if (keyNoSpace) {
    for (i = 0; i < inputText.length; i++) {
      let keyChar;
      if (inputText[i] === ' ') {
        keyChar = ' ';
      }
      else {
        keyChar = keyNoSpace[keyCharIndex];
        keyCharIndex = (keyCharIndex + 1) % keyNoSpace.length;
      }
      correspondingKeySequence += keyChar;
    }
  }
  else {
    for (i = 0; i < inputText.length; i++) {
      correspondingKeySequence += ' ';
    }    
  }
  
  const formattedInputText = tagNumbers(inputText);
  const formattedCryptResult = tagNumbers(cryptResult);
  
  const content =
      '<strong>INPUT   :</strong> ' + formattedInputText          + ' (case-SENSITIVE)      </br>'
    + '<strong>PASSWORD:</strong> ' + correspondingKeySequence + ' (case does NOT matter)</br>'
    + '<strong>OUTPUT  :</strong> ' + formattedCryptResult        + ' (case SAME AS INPUT)  </br>'

    $('#text-encryption-details').html(content).removeAttr('disabled');

  const formattedOutput = (cryptResult === '') ? '</br>' : formattedCryptResult;
  $('#text-output').html(formattedOutput).removeAttr('disabled');
}

function tagNumbers(str) {
  let markedStr = '';
  let lastCharIsNumber = false;
  const opener = '<span class="number">';
  const closer = '</span>';

  for(i = 0; i < str.length; i++) {
    if (isNaN(str[i])) {
      markedStr += str[i];
      lastCharIsNumber = false;
    }
    else {
      if (lastCharIsNumber) {
        markedStr = markedStr.substr(0, markedStr.length - closer.length) + str[i];
      }
      else {
        markedStr += opener + str[i];
        lastCharIsNumber = true;
      }
      markedStr += closer;
    }
  }

  return markedStr;
}

function getOppositeCrypt(cryptOperation) {
  if (cryptOperation === Crypt.ENCRYPT) {
    return Crypt.DECRYPT;
  }
  else if (cryptOperation === Crypt.DECRYPT) {
    return Crypt.ENCRYPT;
  }  
  else {
    return null;
  }
}

function cryptResult() {
  const inputText = $('#input-text').val();
  const key = $('#input-encryption-key').val();
  let outputText;

  if (currentCryptOperation === Crypt.ENCRYPT) {
    outputText = encrypt(inputText, key, false);
  }
  else if (currentCryptOperation === Crypt.DECRYPT) {
    outputText = decrypt(inputText, key, false);
  }

  return outputText;
}
