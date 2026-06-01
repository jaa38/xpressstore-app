import {
  parsePhoneNumberFromString,
} from "libphonenumber-js";

export function validatePhoneNumber(
  phoneNumber: string,
  countryCode: string
) {
  const fullNumber =
    `${countryCode}${phoneNumber}`;

  const parsed =
    parsePhoneNumberFromString(
      fullNumber
    );

  return parsed?.isValid() ?? false;
}

export function formatPhoneNumber(
  phoneNumber: string,
  countryCode: string
) {
  const fullNumber =
    `${countryCode}${phoneNumber}`;

  const parsed =
    parsePhoneNumberFromString(
      fullNumber
    );

  return (
    parsed?.formatInternational() ??
    fullNumber
  );
}