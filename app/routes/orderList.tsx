import type { 
    LoaderFunction, 
  } from "@remix-run/server-runtime";
import { useSearchParams } from "@remix-run/react";
import Cover from '~/components/cover'
import {
    useLoaderData,
} from "@remix-run/react";
import { json , redirect} from "@remix-run/node";

import { getOrders } from '~/utils/orders.server'

import { getUserData } from '~/utils/session.server';
import { limit } from "firebase/firestore";

type LoaderData = {
  user: Awaited<ReturnType<typeof getUserData>>
  orders: Awaited<ReturnType<typeof getOrders>>
};
export const loader:LoaderFunction = async ({ request }) => {
  const user = await getUserData();

  if (!user?.isAdmin) {
    return redirect('/')
  }

  const orders = await getOrders()
  const data: LoaderData = {
    user,
    orders
  };
  return json(data);
};

const Confirmation:React.FC = () => {
    const { orders } = useLoaderData()
    
    const pickups = Object.values(orders).filter(order => order.orderType === 'pickup') 
    const deliveries = Object.values(orders).filter(order => order.orderType === 'delivery')
    
    return (
        <>
            <Cover title="Thanks for your order!" />
            <div className="flex-1 flex mx-auto my-10 h-full md:w-3/4 w-full">
                <div className="content flex-1 flex items-start">

                    { pickups.length > 0 && (
                        <>
                            <h2 className="text-2xl font-serif mb-4">Orders for pickup</h2>
                            {pickups.map((order, i) => {
                                return (
                                    <div key={`${order.name}-${i}`} className="p-4 grid grid-cols-3 w-full">
                                        <h3 className="text-xl font-serif mb-4">{order.name}</h3>
                                        <ul className="mb-4 ml-4 list-disc">
                                            { order.items.map((item, i ) => (
                                                <li key={`${item}-${i}`}>{item}</li>
                                            )) }
                                        </ul>
                                        <p className="mt-2 text-right">${order.total}.00</p>
                                    </div>
                                )
                            })}    
                        </>
                    ) } 
                    { deliveries.length > 0 && (
                        <>
                            <h2 className="text-2xl font-serif mb-4">Orders for delivery</h2>
                            {deliveries.map((order, i) => {
                                return (
                                    <div key={`${order.name}-${i}`} className="p-4 grid grid-cols-4 w-full">
                                        <h3 className="text-xl font-serif mb-4">{order.name}</h3>
                                        <ul className="mb-4 ml-4 list-disc">
                                            { order.items.map((item, i) => (
                                                <li key={`${item}-${i}`}>{item}</li>
                                            )) }
                                        </ul>
                                        <a target="_blank" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURI(order.address)}`}>{order.address}</a>
                                        <p className="mt-2 text-right">${order.total}.00</p>
                                    </div>
                                )
                            })}
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default Confirmation