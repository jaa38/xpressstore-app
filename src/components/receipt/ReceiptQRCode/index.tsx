import QRCode from "react-native-qrcode-svg";

interface Props {
  value: string;
  size?: number;
}

export function ReceiptQRCode({
  value,
  size = 120,
}: Props) {
  return (
    <QRCode
      value={value}
      size={size}
      quietZone={8}
    />
  );
}