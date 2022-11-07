import { v4 as uuid } from 'uuid';
import { rt } from '~/utils/firebase.config';
import { ref, set, child, get } from "firebase/database";
import { getOrderDateString } from '~/utils/getOrderDate'
import { sendEmail } from '~/utils/email.server'

type Order  = {
    name: FormDataEntryValue
    address?: string
    phone: FormDataEntryValue
    orderType: FormDataEntryValue
    total: FormDataEntryValue
    email?: FormDataEntryValue
    userId?: FormDataEntryValue
    items: FormDataEntryValue[]
}

export const createOrder = (order:Order) => {
    const orderId = uuid()
    const orderDate = getOrderDateString()
    set(ref(rt, `orders/${orderDate}/${orderId}`), order);
    sendEmail({action:'CONFIRMATION', payload: {
        orderDate,
        orderId,
        order
    }})
    return orderId
}

export const getOrder = async (orderId:string) => {
    const orderDate = getOrderDateString()
    const orderRef = ref(rt);
    try {
        const order = await get(child(orderRef, `orders/${orderDate}/${orderId}`));
        if (!order.exists()) {
            return { 
                error: 'looks like something went wrong'
            }
        }
        return order.val()

    } catch (error) {
        console.log(error)
    }
}

export const getOrders = async () => {
    const orderDate = getOrderDateString()
    const orderRef = ref(rt);
    try {
        const order = await get(child(orderRef, `orders/${orderDate}`));
        if (!order.exists()) {
            return { 
                error: 'looks like something went wrong'
            }
        }
        return order.val()

    } catch (error) {
        console.log(error)
    }
}