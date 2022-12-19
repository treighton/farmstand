import * as sgMail from '@sendgrid/mail'

const key = process.env.SENDGRID_API_KEY || ''

sgMail.setApiKey(key)

const sendEmail = ({action, payload}) => {
    switch(action) {
        case 'CONFIRMATION':
            sendOrderConfirmationEmail(payload)
            sendOrdernotification(payload)
            break
        default:
            console.error(`${action} does not exist`)
            break
    }
}

const sendOrderConfirmationEmail = async ({orderId, orderDate, order}) => {
    const items = order.items.map((item) => `<li>${item}</li>`).join('')
    const msg = {
        to: order.email, // Change to your recipient
        from: 'treighton@barbellfarm.com', // Change to your verified sender
        subject: `Order confirmation ${orderId} for ${order.orderType} on ${orderDate}`,
        html: `
        <h2> 
            Thanks for placing an order for ${order.orderType} ${ order.orderType === 'delivery' ? ` on ${ orderDate } between 10am and 1pm` : ''}.
        </h2>
        <p>
            We will be reaching out through text within 72hrs to confirm that we have everything in stock for your order${ order.orderType === 'pickup' ? `, and coordinate pickup` : ''}. 
        </p>
        <p>
            the items in your order are:
        </p>
        <ul>
            ${items}
        </ul>
        <p className="mt-5">Your total will be $${order.total}.00.</p>
        <p>We accept Venmo, Cash, Check, and EBT, and you can at pick up!</p>
        `,
    }

    sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })
}

const sendOrdernotification = async ({orderId, orderDate, order}) => {
    const items = order.items.map((item) => `<li>${item}</li>`).join('')
    const msg = {
        to: 'treighton@barbellfarm.com, brooke@helmstudio.co', // Change to your recipient
        from: 'treighton@barbellfarm.com', // Change to your verified sender
        subject: `Order confirmation ${orderId} for ${order.orderType} on ${orderDate}`,
        text: 'and easy to do anywhere, even with Node.js',
        html: `
        <h2> 
            ${order.name} Placed an order for ${order.orderType} ${ order.orderType === 'delivery' ? ` on ${ orderDate } between 10am and 1pm` : ''}.
        </h2>
        <p>
            the items in their order are:
        </p>
        <ul>
            ${items}
        </ul>
        <p className="mt-5">Your total will be $${order.total}.00.</p>
        `,
    }

    sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })
}

export { sendEmail }
