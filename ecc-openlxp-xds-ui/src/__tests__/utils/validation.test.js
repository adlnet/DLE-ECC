'use strict';

import * as validation from '@/utils/validation';

describe('validation', () => {
  it('isEmail', () => {
    expect(validation.isValidEmail('test@test.com')).toBeTruthy();
    expect(validation.isValidEmail('test@test')).toBeFalsy();
  });
  it('isLongEnough', () => {
    expect(validation.isLongEnough('test', 4)).toBeTruthy();
    expect(validation.isLongEnough('test', 5)).toBeFalsy();
  });
  it('contains space', () => {
    expect(validation.containsSpace('test')).toBeFalsy();
    expect(validation.containsSpace('test test')).toBeTruthy();
  });
  it('contains number', () => {
    expect(validation.containsNumber('test')).toBeFalsy();
    expect(validation.containsNumber('test1')).toBeTruthy();
  });
  it('containse uppercse', () => {
    expect(validation.containsUppercase('test')).toBeFalsy();
    expect(validation.containsUppercase('tesT')).toBeTruthy();
  });
  it('contains lowercase', () => {
    expect(validation.containsLowercase('TEST')).toBeFalsy();
    expect(validation.containsLowercase('test')).toBeTruthy();
  });
  it("contains special char", ()=>{
    expect(validation.containsSpecialCharacter('test')).toBeFalsy();
    expect(validation.containsSpecialCharacter('test!')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test@')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test#')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test$')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test%')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test^')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test&')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test*')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test(')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test)')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test-')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test_')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test+')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test=')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test{')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test}')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test[')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test]')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test|')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test\\')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test:')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test;')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test"')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test\'')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test<')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test>')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test,')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test.')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test?')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test/')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test`')).toBeTruthy();
    expect(validation.containsSpecialCharacter('test~')).toBeTruthy();
  })
});
