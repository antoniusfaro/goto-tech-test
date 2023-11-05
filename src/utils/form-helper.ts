import { isAlphaNumeric } from "./string-helper";

const parseAndSetFormValue = (fieldName: string, value: string, formData: any) => {
  const keys = fieldName.split('.');
  let temp = formData;

  for (let i = 0; i < keys.length - 1; i++) {
    temp = temp[keys[i]];
  }

  temp[keys[keys.length - 1]] = value;

  return { ...formData };
}

const validateField = (fieldName: string, value: any, rule: any) => {
  if (!rule) return

  const arrayRule = Object.keys(rule)
  let error = ""

  for (let i = 0; i < arrayRule.length; i++) {
    switch (arrayRule[i]) {
      case "required":
        if (!value && rule.required) {
          error = "This field is required"
        }
        break;
      case "minLength":
        if (value.length < rule.minLength) {
          error = `Minimum length is ${rule.minLength}`
        }
        break;
      case "maxLength":
        if (value.length > rule.maxLength) {
          error = `Maximum length is ${rule.maxLength}`
        }
        break;
      case "alphanumeric":
        if (!isAlphaNumeric(value)) {
          error = "Only alphanumeric allowed"
        }
        break;
    }
    if (error) break
  }
  return error
};

export {
  parseAndSetFormValue,
  validateField
};
