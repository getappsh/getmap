import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

enum RegexPatternFor{
  version = "version"
}

@ValidatorConstraint({ name: 'regex-validator', async: false })
export class RegexVoldation implements ValidatorConstraintInterface {
  validationFor: RegexPatternFor
  regexPattern: RegExp


  constructor(validationFor: RegexPatternFor){
    this.setRegPattern(validationFor)
  }

  setRegPattern(validationFor: RegexPatternFor) {
    this.validationFor = validationFor
    
    switch (validationFor) {
      case RegexPatternFor.version:
        this.regexPattern = new RegExp(/^(\d+\.)*\d+$/)
        break;
    
      default:
        break;
    }
  }
  
  validate(text: string, args: ValidationArguments) {
    console.log(args);
    
    if(typeof args.value !== "string"){
      return false
    }

    this.setRegPattern(args.constraints[0])

    if(this.regexPattern){
      return this.regexPattern.test(text)
    }
    return true
  }

  defaultMessage(args: ValidationArguments) {

    if(typeof args.value !== "string"){
      return args.property + " most be a string"
    }else{
      switch (this.validationFor) {
        case RegexPatternFor.version:
          return args.property + " is not a valid pattern, it most be only digits separate with one dot - 1.1.1"
      
        default:
          return 'Not vailid!';
      }
    }
    
  }
}