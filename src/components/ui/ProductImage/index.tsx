import { Image, ImageStyle, StyleProp } from "react-native";

import { radius } from "@/theme";

interface ProductImageProps {
  image?: string | null;
  size?: number;
  borderRadius?: number;
  style?: StyleProp<ImageStyle>;
}

export function ProductImage({
  image,
  size = 64,
  borderRadius = radius.xs,
  style,
}: ProductImageProps) {
  return (
    <Image
      source={
        image?.trim()
          ? { uri: image }
          : require("../../assets/images/ankara-tote-bag.png")
      }
      resizeMode="cover"
      style={[
        {
          width: size,
          height: size,
          borderRadius,
        },
        style,
      ]}
    />
  );
}