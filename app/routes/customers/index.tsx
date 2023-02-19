import type { 
    LoaderFunction, 
    ActionFunction
} from "@remix-run/server-runtime";
import Cover from '~/components/cover'
import {
    Form,
    Link,
    useLoaderData,
} from "@remix-run/react";
import { json , redirect} from "@remix-run/node";

import { getUserData } from '~/utils/session.server';
import { addCustomer, customerLoader } from "./customers.server";

type LoaderData = {
    user: Awaited<ReturnType<typeof getUserData>>;
    customers: Awaited<ReturnType<typeof customerLoader>>
};

export const loader:LoaderFunction = async ({ request }) => {
    const user = await getUserData(request);

    if (!user?.isAdmin) {
        return redirect('/')
    }

    const customers = await customerLoader();

    const data: LoaderData = {
       user,
       customers
    };
    return json(data);
};

export const action: ActionFunction = async ({request}) => {
    const form = await request.formData();

    const name = form.get("name") || '';
    const streetAddress = form.get("street-address") || '';
    const zip = form.get("postal-code") || '';
    const city = form.get("city") || '';
    const email = form.get("email") || '';
    const phone = form.get("phone") || '';
    const userId = form.get("userId") || '';

    const address = `${streetAddress} ${city} ${zip}`

    const customerData = {
        name,
        address,
        phone,
        email, 
        userId,
    }
    
    const customer = await addCustomer(customerData);
    return redirect(`/customers`);
};

const Customers:React.FC = () => {
    const {customers} = useLoaderData()

    return (
        <>
            <Cover title="Customers" />
            <h1>Customers</h1>
            { customers.map((customer:any) => {
                return (
                    <div>
                        <h2>{customer.name}</h2>
                        <ul>
                            <li>{customer.address}</li>
                            <li>{customer.email}</li>
                            <li>{customer.phone}</li>
                            <li>{customer.recurringOrders}</li>
                            <li>{customer.userId}</li>
                        </ul>
                    </div>
                )
            } )}
            <h1>Add Customer</h1>
            <Form method="post" className="my-10 w-3/4">
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
                <div className="flex flex-row w-full">
                    <div className="form-group flex flex-col w-full">
                        <label htmlFor="street-address">Street address</label>
                        <input type="text" id="street-address" name="street-address" required/>
                    </div>
                    <div className="form-group flex flex-col w-full mx-3">
                        <label htmlFor="postal-code">ZIP or postal code</label>
                        <input className="postal-code" id="postal-code" name="postal-code" type="text" required/>
                    </div>
                    <div className="form-group flex flex-col w-full">
                        <label htmlFor="city">City</label>
                        <input type="text" id="city" name="city"/>
                    </div>
                </div>
                <button type="submit" className="flex w-full items-center justify-center rounded-md border border-transparent px-3 py-3 mt-5 text-base font-medium hover:bg-dark hover:text-white md:text-lg">
                Order
                </button>
            </Form> 
        </>
    )
}
export default Customers