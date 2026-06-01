import {
  CountryCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

export function validatePhoneNumber(
  phoneNumber: string,
  countryCode: string
) {
  const parsed =
    parsePhoneNumberFromString(
      phoneNumber,
      countryCode as CountryCode
    );

  return parsed?.isValid() ?? false;
}

export function formatPhoneNumber(
  phoneNumber: string,
  countryCode: string
) {
  const parsed =
    parsePhoneNumberFromString(
      phoneNumber,
      countryCode as CountryCode
    );

  return (
    parsed?.formatInternational() ??
    phoneNumber
  );
}