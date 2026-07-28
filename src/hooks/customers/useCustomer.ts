import { useCustomerStore } from "@/store/customer/customerStore";

export function useCustomer() {
  const customer = useCustomerStore(
    (state) => state.customer
  );

  const updateCustomer = useCustomerStore(
    (state) => state.updateCustomer
  );

  const resetCustomer = useCustomerStore(
    (state) => state.resetCustomer
  );

  return {
    customer,
    updateCustomer,
    resetCustomer,
  };
}