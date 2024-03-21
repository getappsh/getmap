import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

enum RegexPatternFor {
  VERSION = "version",
  MAC = "MAC",
  IP = "IP",
  B_BOX = "bbox"
}

@ValidatorConstraint({ name: 'regex-validator', async: false })
export class RegexValidation implements ValidatorConstraintInterface {
  validationFor: RegexPatternFor
  regexPattern: RegExp


  constructor(validationFor: RegexPatternFor) {
    this.setRegPattern(validationFor)
  }

  setRegPattern(validationFor: RegexPatternFor) {
    this.validationFor = validationFor

    switch (validationFor) {
      case RegexPatternFor.VERSION:
        this.regexPattern = new RegExp(/^(\d+\.)*\d+$/)
        break;
      case RegexPatternFor.MAC:
        this.regexPattern = new RegExp(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)
        break;
      case RegexPatternFor.IP:
        this.regexPattern = new RegExp(/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)
        break;
      case RegexPatternFor.B_BOX:
        this.regexPattern = new RegExp(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?(?:,-?\d+(\.\d+)?){0,},-?\d+(\.\d+)?$/)
        break;

      default:
        break;
    }
  }

  validate(text: string, args: ValidationArguments) {
    if (typeof args.value !== "string") {
      return false
    }

    this.setRegPattern(args.constraints[0])

    if (this.regexPattern) {
      return this.regexPattern.test(text)
    }
    return true
  }

  defaultMessage(args: ValidationArguments) {

    if (typeof args.value !== "string") {
      return args.property + " most be a string"
    } else {
      switch (this.validationFor) {
        case RegexPatternFor.VERSION:
          return args.property + " is not a valid pattern, it must be only digits separate with one dot - 1.1.1"
        case RegexPatternFor.MAC:
        case RegexPatternFor.IP:
          return args.property + " is not a valid pattern"
        case RegexPatternFor.B_BOX:
          return args.property + " is not a valid pattern for bbox, it must be number separate with one coma - 34,32,34,31"

        default:
          return 'Not valid!';
      }
    }

  }
}