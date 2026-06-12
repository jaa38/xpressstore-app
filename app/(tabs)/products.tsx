import { View, ScrollView, Image, Switch, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";

import { radius, spacing, theme } from "@/theme";
import { Card } from "@/components/ui/Card";
import { Ionicons } from "@expo/vector-icons";
import { SearchBar } from "@/components/ui/SearchBar";
import { useState, useMemo } from "react";
import { router } from "expo-router";
import { ROUTES } from "@/navigation/routes";
import { Input } from "@/components/ui/Input";

type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  visible: boolean;
  image: any;
};

function ProductCard({
  product,
  onToggle,
}: {
  product: Product;
  onToggle: (id: string, value: boolean) => void;
}) {
  return (
    <Card
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
      }}
    >
      <Image
        source={product.image}
        style={{
          width: 64,
          height: 64,
          borderRadius: radius.xs,
        }}
        resizeMode="cover"
      />

      <View
        style={{
          flex: 1,
          gap: spacing.xs,
        }}
      >
        <AppText variant="bodyLargeBold">{product.name}</AppText>

        <AppText variant="bodySmall" color="secondary">
          {product.category}
        </AppText>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.xs,
          }}
        >
          <AppText variant="bodyBold" color="warning">
            {product.price}
          </AppText>

          <AppText>•</AppText>

          <AppText variant="bodySmall" color="secondary">
            {product.stock} in stock
          </AppText>
        </View>
      </View>

      <View
        style={{
          width: 60,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "stretch",
        }}
      >
        <Switch
          value={product.visible}
          onValueChange={(value) => onToggle(product.id, value)}
          trackColor={{
            false: theme.toggleSwitch.inactive,
            true: theme.toggleSwitch.active,
          }}
          thumbColor="#FFFFFF"
        />
      </View>
    </Card>
  );
}

export default function ProductScreen() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Ankara Tote Bag",
      category: "Bags",
      price: "₦6,250",
      stock: 24,
      visible: true,
      image: require("../../assets/images/ankara-tote-bag.png"),
    },
    {
      id: "2",
      name: "Leather Handbag",
      category: "Bags",
      price: "₦12,500",
      stock: 8,
      visible: true,
      image: require("../../assets/images/ankara-tote-bag.png"),
    },
    {
      id: "3",
      name: "Ankara Purse",
      category: "Accessories",
      price: "₦4,500",
      stock: 12,
      visible: false,
      image: require("../../assets/images/ankara-tote-bag.png"),
    },
  ]);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  function toggleProduct(id: string, value: boolean) {
    setProducts((current) =>
      current.map((product) =>
        product.id === id
          ? {
              ...product,
              visible: value,
            }
          : product
      )
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
    >
      <StatusBar style="auto" />

      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          {/* TOP */}
          <View
            style={{
              gap: spacing.lg,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                gap: spacing.xs,
                flexDirection: "column",
              }}
            >
              <AppText variant="h1">Products</AppText>

              <AppText variant="body" color="secondary">
                Number of items in catalog
              </AppText>
            </View>
            <Button
              title="Add Product"
              variant="primary"
              onPress={() => router.push(ROUTES.ADD_PRODUCT_INFO)}
            />
          </View>
          <Card
            style={{
              marginTop: spacing.md,
              borderColor: theme.border.warning,
              backgroundColor: theme.background.warning,
              flexDirection: "row",
              gap: spacing.md,
            }}
          >
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={theme.icon.warning.icon}
            />
            <View style={{ flexDirection: "row" }}>
              <AppText variant="bodyBold" color="primary">
                2 products
              </AppText>
              <AppText variant="body" color="primary">
                {" "}
                are running low on stock
              </AppText>
            </View>
          </Card>
          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            <SearchBar placeholder="Search products" />
          </View>

          <View
            style={{
              marginTop: spacing.lg,
            }}
          >
            <FlatList
              data={sortedProducts}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ProductCard product={item} onToggle={toggleProduct} />
              )}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: spacing.md,
                  }}
                />
              )}
            />
          </View>

          <View>
          </View>
          {/* BOTTOM */}
          <View
            style={{
              paddingBottom: spacing.lg,
            }}
          ></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
