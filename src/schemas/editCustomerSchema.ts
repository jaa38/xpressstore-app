import { z } from "zod";

import { customerInformationSchema } from "./customerInformationSchema";
import { customerAddressSchema } from "./customerAddressSchema";

export const editCustomerSchema =
  customerInformationSchema.merge(customerAddressSchema);

export type EditCustomerForm = z.infer<
  typeof editCustomerSchema
>;