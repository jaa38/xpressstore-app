import QRCode from "qrcode";

export async function generateReceiptQrCode(
    url: string
) {
    return QRCode.toDataURL(url);
}