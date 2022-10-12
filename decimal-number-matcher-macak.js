// noinspection JSUnusedGlobalSymbols

const Decimal = require("decimal.js");
const ValidationResult = require("./validation-result");
const maxNumberOfDigits = 11;
/**
 * Matcher validates that string value represents a decimal number or null.
 * Decimal separator is always "."
 * In addition, it must comply to the rules described below.
 *
 * @param params - Matcher can take 0 to 2 parameters with following rules:
 * - no parameters: validates that number of digits does not exceed the maximum value of 11.
 * - one parameter: the parameter specifies maximum length of number for the above rule (parameter replaces the default value of 11)
 * - two parameters:
 *   -- first parameter represents the total maximum number of digits,
 *   -- the second parameter represents the maximum number of decimal places.
 *   -- both conditions must be met in this case.
 */
class DecimalNumberMatcher {
  constructor(...params) {
    this.params = params;
  }

  validateDecimalNumber(value) {
    try {
      return new Decimal(value);
    } catch (e) {
      return null;
    }
  }

  match(value) {
    const result = new ValidationResult();

    if (value != null) {
      let number = this.validateDecimalNumber(value);
      if(!number) {
        result.addInvalidTypeError("doubleNumber.e001", "The value is not a valid decimal number.");
      }
      if (number) {
        if (this.params.length === 0) {
          if (number.precision(true) > maxNumberOfDigits) {
            result.addInvalidTypeError("doubleNumber.e002", "The value exceeded maximum number of digits.");
          }
        }
        if (this.params.length === 1) {
          if (number.precision(true) > this.params[0]) {
            result.addInvalidTypeError("doubleNumber.e002", "The value exceeded maximum number of digits.");
          }
        }
        if (this.params.length === 2) {
          if (number.precision(true) > this.params[0]) {
            result.addInvalidTypeError("doubleNumber.e002", "The value exceeded maximum number of digits.");
          }
          if (number.decimalPlaces() > this.params[1]) {
            result.addInvalidTypeError("doubleNumber.e003", "The value exceeded maximum number of decimal places.");
          }
        }
      }
    }
    return result;
  }
}

module.exports = DecimalNumberMatcher;
