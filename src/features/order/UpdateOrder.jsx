/* eslint-disable react-refresh/only-export-components */
import { useFetcher } from "react-router-dom";
import Button from "../../ui/Button";
import { updateOrder } from "../../services/apiRestaurant";

function UpdateOrder() {
  const fetcher = useFetcher();

  // To update data using fetcher use te form component provided by the fetcher
  return (
    // Patch method is when you want to updated only a part of the data on the server
    <fetcher.Form method="PATCH" className="text-right">
      <Button>Make Priority</Button>;
    </fetcher.Form>
  );
}

export async function action({ /*request, */ params }) {
  const data = { priority: true };
  await updateOrder(params.orderId, data);
}

export default UpdateOrder;
