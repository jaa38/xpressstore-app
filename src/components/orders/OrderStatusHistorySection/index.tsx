import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { AppText } from "@/components/ui/AppText";

import { spacing } from "@/theme";

import { Order } from "@/types/order";

import { OrderStatusHistoryItem } from "../OrderStatusHistoryItem";

interface Props {
  order: Order;
}

export function OrderStatusHistorySection({
  order,
}: Props) {
  return (
    <Card
      style={{
        marginTop: spacing.lg,
      }}
    >
      <AppText variant="h3">
        Status History
      </AppText>

      <Divider
        style={{
          marginVertical: spacing.lg,
        }}
      />

      {order.statusHistory.map(
        (history) => (
          <OrderStatusHistoryItem
            key={history.id}
            history={history}
          />
        )
      )}
    </Card>
  );
}