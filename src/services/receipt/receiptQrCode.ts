import QRCode from "qrcode";

export async function generateReceiptQrCode(url: string): Promise<string> {
  const svg = await QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 2,
    width: 180,
    color: {
      dark: "#111827",
      light: "#FFFFFF",
    },
  });

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
