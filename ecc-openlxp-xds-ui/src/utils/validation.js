'use strict';

/**
 * @description given a string, returns true if it is a valid email address
 * @param {string} email - the email address to validate
 * @returns {boolean} - true if the email is valid, false otherwise
 */

export function isValidEmail(email) {
  // regex from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
}

export function isLongEnough(string, minLength) {
  return string.length >= minLength;
}

/**
 * @description given a string, returns true if it contains at least one number
 * @param string
 * @returns {boolean}
 */

export function containsNumber(string) {
  const regex = /\d/;
  return regex.test(string);
}

/**
 * @description given a string, returns true if the string contains at least one upper case letter
 * @param string
 * @returns {boolean}
 */

export function containsUppercase(string) {
  return /[A-Z]/.test(string);
}

/**
 * @description given a string, returns true if the string contains at least one lower case letter
 */

export function containsLowercase(string) {
  return /[a-z]/.test(string);
}

/**
 * @description given a string, returns true if the string contains at least one special character
 * @param string
 * @returns {boolean}
 */

export function containsSpecialCharacter(string) {
  // regex from https://stackoverflow.com/questions/154059/how-do-you-check-for-special-characters-in-a-string
  const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\`~]/;
  return regex.test(string);
}

export function containsSpace(string) {
  return /\s/.test(string);
}
