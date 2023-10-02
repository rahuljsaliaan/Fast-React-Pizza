/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */

import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import { formatCurrency } from "../../utils/helpers";
import { fetchAddress } from "../user/userSlice";
import Button from "../../ui/Button";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

// const fakeCart = [
//   {
//     pizzaId: 12,
//     name: "Mediterranean",
//     quantity: 2,
//     unitPrice: 16,
//     totalPrice: 32,
//   },
//   {
//     pizzaId: 6,
//     name: "Vegetale",
//     quantity: 1,
//     unitPrice: 13,
//     totalPrice: 13,
//   },
//   {
//     pizzaId: 11,
//     name: "Spinach and Mushroom",
//     quantity: 1,
//     unitPrice: 15,
//     totalPrice: 15,
//   },
// ];

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const dispatch = useDispatch();

  const {
    userName,
    status: addressStatus,
    address,
    position,
    error: errorAddress,
  } = useSelector((state) => state.user);
  const isLoadingAddress = addressStatus === "loading";

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formErrors = useActionData();

  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * (20 / 100) : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  function handleFetchLocation(e) {
    e.preventDefault();
    dispatch(fetchAddress());
  }

  // If no cart then redirect to EmptyCart
  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">
        Ready to order? Let&rsquo;s go!
      </h2>

      {/* React Router Form */}
      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            className="input grow"
            type="text"
            name="customer"
            defaultValue={userName}
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-center text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <div className="flex grow gap-2">
              <input
                className="input grow"
                disabled={isLoadingAddress}
                defaultValue={address}
                type="text"
                name="address"
                required
              />
              {!position?.latitude && !position?.longitude && (
                <Button
                  type="small"
                  disabled={isLoadingAddress}
                  onClick={handleFetchLocation}
                >
                  Get Location
                </Button>
              )}
            </div>
            {addressStatus === "error" && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-center text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <input
            type="hidden"
            name="position"
            value={
              position?.longitude && position?.latitude
                ? `${position.longitude}, ${position.latitude}`
                : ""
            }
          />
          <label htmlFor="priority font-md">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          {/* also submit the cart*/}
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <Button disabled={isSubmitting || isLoadingAddress}>
            {isSubmitting
              ? "Placing Order..."
              : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();

  // transform a list of key-value pairs to an object (like map to object)
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  // * Construct the errors object and return if any error
  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please give us your correct phone number. We might need it to contact you.";

  if (Object.keys(errors).length > 0) return errors;

  // * send the order data to the API
  const newOrder = await createOrder(order);

  console.log(newOrder);

  // * Hack to call dispatch in a non component function (but do not overuse it)
  store.dispatch(clearCart());

  // * redirect function can be used within a non-component function (otherwise the navigate function is used)
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
