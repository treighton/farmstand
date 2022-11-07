import type { 
    LoaderFunction, 
  } from "@remix-run/server-runtime";
import { useSearchParams } from "@remix-run/react";
import Cover from '~/components/cover'
import {
    useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";

import { getOrder } from '~/utils/orders.server'
import { getOrderDateString } from '~/utils/getOrderDate'


type LoaderData = {
    order: Awaited<ReturnType<typeof getOrder>>;
  };

export const loader:LoaderFunction = async ({
    request,
  }) => {
    const url = new URL(request.url);
    const term = url.searchParams.get("order") || '';
    const order = await getOrder(term);
    const data: LoaderData = {
        order
    };
    return json(data);
};

const DeliveryNote = ({ items, total }) => {
    return (
        <div className="mt-5">
            <h2 className="text-xl font-serif text-center">
                Thanks for placing an order for delivery on { getOrderDateString() } between 10am and 1pm.
            </h2>
            <div className="w-3/4 mx-auto mt-5">    
                <p>
                    We will be reaching out through text within 72hrs to confirm that we have everything in stock for your order. 
                </p>
                <p className="text-lg my-5">
                    the items in your order are:
                </p>
                <ul className="list-disc ml-4">
                    {
                        items.map((item, i) => <li key={`${item}+${i}`}>{item}</li>)
                    }
                </ul>
                <p className="mt-5">Your total will be {total}. We accept Venmo, Cash, Check, and EBT, and you can after we deliver!</p>
            </div>
        </div>
    )
}

const PickUpNote = ({ items, total }) => {
    return (
        <div className="mt-5">
            <h2 className="text-xl font-serif text-center">
                Thanks for placing an order for pick up on { getOrderDateString() }.
            </h2>
            <div className="w-3/4 mx-auto mt-5">
                <p>
                    We will be reaching out through text within 72hrs to confirm that we have everything in stock for your order, and to coordinate a pickup time and location. 
                </p>
                <p className="text-lg mt-5">
                    The items in your order are:
                </p>
                <ul className="list-disc ml-4">
                    {
                        items.map((item, i) => <li key={`${item}+${i}`}>{item}</li>)
                    }
                </ul>
                <p className="mt-5">Your total will be ${total}.00. We accept Venmo, Cash, Check, and EBT, and you can at pick up!</p>
            </div>
        </div>
    )
}

const Confirmation:React.FC = () => {
    const [searchParams] = useSearchParams();
    const { order } = useLoaderData()
    const orderNo = searchParams.getAll("order");
    return (
        <>
            <Cover title="Thanks for your order!" />
            <div className="flex-1 flex mx-auto my-10 h-full md:w-3/4 w-full">
            <div className="content flex-1 flex items-start">
                    <h1 className="text-xl font-serif text--zinc-900">Order No. {orderNo}</h1>
                    { order.orderType === 'pickup' ?
                        <PickUpNote total={order.total} items={order.items} /> :
                        <DeliveryNote total={order.total} items={order.items} />
                    }
                </div>
            </div>
        </>
    )
}

export default Confirmation