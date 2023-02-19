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
    const orderRef = ref(rt);
    try {
        const order = await get(child(orderRef, `orders`));
        
        if (!order.exists()) {
            return { 
                error: 'looks like something went wrong'
            }
        }

        const orders = order.val()

        const sortedOrderDates = Object
                                    .keys(orders)
                                    .sort((a:any, b:any) => new Date(b).getTime() - new Date(a).getTime())

        const sortedOrders = sortedOrderDates.map(orderDate => {
            const dateOrdersRaw = orders[orderDate]
            const dateOrderKeys = Object.keys(dateOrdersRaw)
            const dateOrders = dateOrderKeys.map(orderId => ({orderId, ...dateOrdersRaw[orderId]}))
            const dateOrderDeliveries = dateOrders.filter(order => order.orderType === 'delivery').map(order => order.address)

            return {
                orderDate, 
                addresses: dateOrderDeliveries,
                orders: dateOrders
            }
        })

        return sortedOrders

    } catch (error) {
        console.log(error)
    }
}