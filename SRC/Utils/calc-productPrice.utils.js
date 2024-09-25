import {discountType} from "./index.js";

export const calcProductPrice = (price, discount) => {
  let appliedPrice = price;
  if (discount.type === discountType.PERCENTAGE) {
    appliedPrice = price - (price * discount.amount) / 100;
  } else if (discount.type === discountType.FIXED) {
    appliedPrice = price - discount.amount * 100;
  } 
  return appliedPrice;
};
