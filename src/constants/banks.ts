/**
 * ============================================================================
 * BANK CONSTANTS
 * ============================================================================
 */

export type BankConfig = {
  label: string;
  code: string;
  logo: any;
  background: string;
  logoBackground: string;
};

/**
 * ============================================================================
 * BANK CONFIGURATION
 * ============================================================================
 */

export const BANK_CONFIG: Record<string, BankConfig> = {
  "Access Bank": {
    label: "Access Bank",
    code: "044",
    logo: require("../../assets/banks/access-bank.png"),
    background: "#991F22",
    logoBackground: "#FFFFFF",
  },

  GTBank: {
    label: "GTBank",
    code: "058",
    logo: require("../../assets/banks/gtbank.png"),
    background: "#F96A16",
    logoBackground: "#FFFFFF",
  },

  "First Bank": {
    label: "First Bank",
    code: "011",
    logo: require("../../assets/banks/first-bank.png"),
    background: "#003B7A",
    logoBackground: "#FFFFFF",
  },

  "Zenith Bank": {
    label: "Zenith Bank",
    code: "057",
    logo: require("../../assets/banks/zenith-bank.png"),
    background: "#E21D2B",
    logoBackground: "#FFFFFF",
  },

  UBA: {
    label: "UBA",
    code: "033",
    logo: require("../../assets/banks/uba.png"),
    background: "#D71920",
    logoBackground: "#FFFFFF",
  },

  Opay: {
    label: "Opay",
    code: "999992",
    logo: require("../../assets/banks/opay.png"),
    background: "#00B875",
    logoBackground: "#FFFFFF",
  },

  PalmPay: {
    label: "PalmPay",
    code: "999991",
    logo: require("../../assets/banks/palmpay.png"),
    background: "#7C3AED",
    logoBackground: "#FFFFFF",
  },
};

/**
 * ============================================================================
 * BANK OPTIONS
 * ============================================================================
 */

export const BANK_OPTIONS = Object.values(BANK_CONFIG).map(
  ({ label, code }) => ({
    label,
    value: code,
  })
);

/**
 * ============================================================================
 * BANK HELPERS
 * ============================================================================
 */

export function getBankConfig(bankName?: string) {
  if (!bankName) {
    return undefined;
  }

  const normalizedBankName = bankName.trim().toLowerCase().replace(/\s+/g, " ");

  const bank = Object.values(BANK_CONFIG).find(
    ({ label }) =>
      label.toLowerCase().replace(/\s+/g, " ") === normalizedBankName
  );

  return bank;
}

export function getBankLogo(bankName?: string) {
  return getBankConfig(bankName)?.logo;
}
