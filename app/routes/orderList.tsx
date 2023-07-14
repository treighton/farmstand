import type { 
    LoaderFunction, 
} from "@remix-run/server-runtime";
import Cover from '~/components/cover'
import {
    useLoaderData,
} from "@remix-run/react";
import { json , redirect} from "@remix-run/node";

import { getOrders } from '~/utils/orders.server'
import { getUserData } from '~/utils/session.server';

type LoaderData = {
    user: Awaited<ReturnType<typeof getUserData>>
    orders: Awaited<ReturnType<typeof getOrders>>
};

export const loader:LoaderFunction = async ({ request }) => {
    const user = await getUserData(request);

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

    return (
        <>
            <Cover title="Orders" />
            <div className="flex-1 flex mx-auto my-10 h-full md:w-3/4 w-full">
                <div className="content flex-1 flex xr">
                    {
                        Array.isArray(orders) && orders.map(({orderDate, addresses, orders}) => {
                            const destination = addresses.shift()
                            const waypoints = addresses.join('|')
                            const startingLocation = `10464 franklin blvd elk grove ca 95757`
                            return (
                            <div key={new Date(orderDate).getTime()} className="w-full">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl my-10 font-bold font-serif">{orderDate}</h2>
                                    <a target="_blank" href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURI(startingLocation)}&waypoints=${encodeURI(waypoints)}&destination=${destination}`}>Deliveries map</a>
                                </div>
                                <hr />
                                <div>
                                    <div className="p-4 grid grid-cols-6">
                                        <h3 className="font-bold font-serif">Name</h3>
                                        <h3 className="font-bold font-serif">Order Type</h3>
                                        <h3 className="font-bold font-serif">Items</h3>
                                        <h3 className="font-bold font-serif">Phone</h3>
                                        <h3 className="font-bold font-serif">Address</h3>
                                        <p  className="font-bold font-serif text-right">total</p>
                                    </div>
                                    {Array.isArray(orders) && orders.map((order, i) => {
                                    return (
                                        <div key={`${order.name}-${i}`} className="p-4 grid grid-cols-6">
                                            <h3 className="text-xl font-serif mb-4">{order.name}</h3>
                                            <div>
                                                <h3>Order Type:</h3>
                                                {order.orderType}
                                            </div>
                                            <ul className="mb-4 ml-4 list-disc">
                                                { Array.isArray(order.items) && order.items.map((item, i) => (
                                                    <li key={`${item}-${i}`}>{item}</li>
                                                )) }
                                            </ul>
                                            <a href={`tel:+1${order.phone}`}>{order.phone}</a>
                                            { (order.orderType == "delivery") ? (
                                                <a target="_blank" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURI(order.address)}`}>{order.address}</a>
                                            ) : <p>pickup</p> }
                                            <p className="mt-2 text-right">${order.total}.00</p>
                                        </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )})
                    }
                </div>
            </div>
        </>
    )
}

export default Confirmation