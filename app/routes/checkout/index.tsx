import type {
    ActionFunction,
    LoaderFunction,
  } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import {
    Form,
    Link,
    useLoaderData,
} from "@remix-run/react";

import { Fragment, useMemo, useState } from "react";

import Cover from "~/components/cover";
import { useCart } from "~/components/cartContext";

import { getUserData } from '~/utils/session.server';
import { getOrderDateString } from '~/utils/getOrderDate'
import { createOrder } from '~/utils/orders.server'

type LoaderData = {
    user: Awaited<ReturnType<typeof getUserData>>;
  };

export const loader:LoaderFunction = async ({ request }) => {
  const user = await getUserData(request);

  const data: LoaderData = {
    user
  };
  return json(data);
};

export const action: ActionFunction = async ({request}) => {
    const form = await request.formData();

    const name = form.get("name");
    const streetAddress = form.get("street-address");
    const zip = form.get("postal-code");
    const city = form.get("city");
    const email = form.get("email");
    const items = form.getAll("items")
    const phone = form.get("phone")
    const userId = form.get("userId")
    const orderType = form.get("orderType")
    const total = form.get("total")

    const address = `${streetAddress} ${city} ${zip}`

    const order = {
        name,
        address,
        phone,
        orderType,
        total, 
        email, 
        userId,
        items, 
    }
    
    const orderId = await createOrder(order);
    return redirect(`/confirmation?order=${orderId}`);
};

export default function Checkout() {
  const {state, dispatch} = useCart()
  const { user } = useLoaderData();
  const [orderType, setOrderType] = useState('delivery')
  const { items } = state

  const total = useMemo(() => items.reduce((prev, current) => {
    return prev + current.price
    }, 0), [items])

  const removeFromCart = (item:any) => {
    dispatch({ type: "REMOVE", payload: item })
  }

  return (
    <div 
        className="flex flex-1 flex-col"
    >
        <Cover title="Checkout" />
        <div className="flex-1 flex mx-auto my-10 h-full md:w-3/4 w-full">
            <div className="content flex-1 flex items-center justify-center">
                { 
                    items.length === 0 ? 
                    <h2>Sorry cart is empty</h2> : 
                    <h2 className="mt-10 text-2xl font-serif text--zinc-900">Order Form for { getOrderDateString() }</h2> 
                }
                {
                    user ?
                    (
                        <p className="mb-10">Welcome back {user.displayName}!</p>
                    ) :
                    (
                        <p className="mb-10">Sign up to make checkout easier <Link to="/login" className="underline">Sign up!</Link></p>
                    )
                }
                { items.length > 0 && 
                    <Fragment>
                        <div className="grid grid-cols-3 gap-2 w-3/4">
                            <p className="text-xl font-serif text--zinc-900">Product</p>
                            <p className="text-xl font-serif text--zinc-900">Price</p>
                            <p className="text-xl font-serif text--zinc-900 text-right">Remove</p>
                            {items.map( 
                                item => (
                                        <Fragment key={item.id}>
                                            <p className="text-xl text--zinc-900">{item.title}</p>
                                            <p className="text-xl text--zinc-900">${item.price}.00</p>
                                            <div className="text-right">
                                                <button onClick={ () => removeFromCart(item) }>X</button>
                                            </div>
                                        </Fragment>
                                    
                                ) 
                            )}
                        </div>   
                        <div className="grid grid-cols-3 gap-2 w-3/4 border-t-dark border-t-2 mt-2 py-2">
                            <p className="text-xl font-serif text--zinc-900">Total:</p>
                            <p className="text-xl text--zinc-900">${ total }.00</p>
                        </div>     
                    </Fragment>
                }
                <Form method="post" className="my-10 w-3/4">
                    <fieldset className="form-group mt-3">
                        <legend className="sr-only">
                        Delivery or pick up?
                    </legend>
                    <label className={orderType === "delivery" ? "border-light-alt border-b-4" : ''}>
                        <input
                        type="radio"
                        name="orderType"
                        value="delivery"
                        onChange={() => setOrderType("delivery")}
                        defaultChecked={true}
                        />{" "}
                        Delivery
                    </label>
                    <label className={orderType === "pickup" ? "border-light-alt border-b-4" : ''}>
                        <input
                        type="radio"
                        name="orderType"
                        value="pickup"
                        onChange={() => setOrderType("pickup")}
                        />{" "}
                        Pickup
                    </label>
                    </fieldset>
                    <div className="form-group flex flex-col">
                            <label htmlFor="Name">Name</label>
                            <input type="text" name="name" id="name" required />
                    </div>
                    <div className="form-group flex flex-col">
                        <label htmlFor="email">E-mail</label>
                        <input type="text" name="email" id="email" required/>
                    </div>
                    <div className="form-group flex flex-col">
                        <label htmlFor="phone">Phone</label>
                        <input type="text" name="phone" id="phone" required />
                    </div>
                    { orderType === "delivery" && (
                        <>
                            <div className="form-group flex flex-col">
                                <label htmlFor="street-address">Street address</label>
                                <input type="text" id="street-address" name="street-address" required/>
                            </div>
                            <div className="form-group flex flex-col">
                                <label htmlFor="postal-code">ZIP or postal code</label>
                                <input className="postal-code" id="postal-code" name="postal-code" type="text" required/>
                            </div>
                            <div className="form-group flex flex-col">
                                <label htmlFor="city">City</label>
                                <input type="text" id="city" name="city"/>
                            </div>
                        </>
                    ) } 
                    {items.map( 
                        item => <input 
                                    key={`order-${item.id}`} 
                                    type="hidden"
                                    name={`items`}
                                    value={item.title} 
                                />
                        
                    )}
                    {
                        user &&
                         <input type="hidden" name="userId" value={user.uid} /> }
                    { 
                        total > 0 &&
                        <input type="hidden" name="total" value={total} />
                    }
                    { orderType === "pickup" ? <p>We will text you within 72hrs to coordinate your pick up!</p> : '' }
                    <button type="submit" className="flex w-full items-center justify-center rounded-md border border-transparent px-3 py-3 mt-5 text-base font-medium hover:bg-dark hover:text-white md:text-lg">
                    Order
                    </button>
                </Form>     
            </div>
        </div>
    </div>
  );
}
