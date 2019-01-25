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

var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

function encrypt(originalText, key, includeNumerals) {
  return crypt(originalText, key, true, includeNumerals);
}

function decrypt(encryptedText, key, includeNumerals) {
  return crypt(encryptedText, key, false, includeNumerals);
}

function crypt(inputText, key, encrypting, includeNumerals) {
  var vigenereOperator;
  
  if (encrypting) {
    vigenereOperator = 1;
  }
  else {
    vigenereOperator = -1;
  }
  
  var keyNoSpace;

  if (key) {
    keyNoSpace = key.replace(/\s/g,'');
    
    // If key consist only of white spaces.
    if (keyNoSpace.length === 0) {
      keyNoSpace = " ";
    }
  }
  else {
    keyNoSpace = " ";
  }
  
  var keyIndexOffset = 0;
  var outputText = '';
  
  for (i = 0; i < inputText.length; i++) {
    var inputChar = inputText.charAt(i);
    var upperCase;
    
    if (inputChar.toUpperCase() == inputChar) {
      upperCase = true;
    }
    else {
      upperCase = false;
    }
    
    // Key is not case-sensitive
    //
    // Whitespaces in input text are omitted and not processed.
    // The key index progresses only when there is no space.
    //
    if (inputChar == ' ') {
      keyIndexOffset -= 1;
    }
    
    var processedChar;
    var processedCharIndex;
    var keyChar = keyNoSpace.charAt(mod((i + keyIndexOffset), keyNoSpace.length)).toLowerCase();
    
    // To prevent confusion, encryption of each character is processed
    // within the same set of input character regardless of the set that 
    // the corresponding key character belongs. 
    //
    // In other words, alphabetic inputs are processed within alphabet sequence
    // and numeric inputs are processed in digits sequence, regardless of
    // the encrypting key character is a letter or number.
    //
    if (alphabet.includes(inputChar.toLowerCase())) {
      processedCharIndex = vigenereIndex(alphabet.indexOf(inputChar.toLowerCase()), keyCharIndex(keyChar), vigenereOperator, alphabet.length);
      processedChar = alphabet[processedCharIndex];
      if (upperCase) {
        processedChar = processedChar.toUpperCase();
      }
    }
    else if (!isNaN(inputChar) && inputChar != ' ') {
      processedCharIndex = vigenereIndex(parseInt(inputChar), keyCharIndex(keyChar), vigenereOperator, 10);
      processedChar = processedCharIndex.toString();
    }
    else {
      processedChar = inputText.charAt(i);
    }
    outputText += processedChar;
  }

  return outputText;
}

function keyCharIndex(keyChar) {
  if (alphabet.includes(keyChar)) {
    return alphabet.indexOf(keyChar);
  }
  else if (!isNaN(keyChar) && keyChar != ' ') {
    return parseInt(keyChar);
  }
  else {
    // Key character is not alphanumeric.
    return 0;
  }
}

// Vigenere function given input index, key index and input set size.
function vigenereIndex(inputCharIndex, keyCharIndex, vigenereOperator, inputSetLength) {
  return mod((inputCharIndex + vigenereOperator * keyCharIndex), inputSetLength);
}

function mod(n, m) {
  return ((n % m) + m) % m;
}
