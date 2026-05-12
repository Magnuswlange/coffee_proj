import { NTFY_UUID } from "../config";
import type { Drink } from "../../../shared/types/drink";

export const sendOrder = async (order: Drink) => {
  const res = await fetch(`https://ntfy.sh/${NTFY_UUID}`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      Title: "Coffee Order",
    },
    body: JSON.stringify(order),
  });

  if (!res.ok) throw new Error("Failed to send order");
};
