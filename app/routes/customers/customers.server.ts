
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc  } from "firebase/firestore"; 
import { db } from '~/utils/firebase.config'
import { RecurringOrder, Customer } from "./customer.types";

const converter = {
    toFirestore: (data: Customer) => data,
    fromFirestore: (snap: any): Customer => {
        const data = snap.data()

        return {
            address: data.address || '',
            email: data.email || '',
            name: data.name || '',
            phone: data.phone || '',
            recurringOrders: data.recurringOrders || undefined,
            userId: data.userId || undefined
        }
    }
}
  

export const customerLoader = async ():Promise<Array<Customer>> => {
    const customers  = await getDocs(collection(db, "customers"));
    
    const customersData = customers.docs.map((customer:any) => {
        const { id } = customer
        const customerData = {id,  ...customer.data()}
        return customerData
    })

    return customersData
};

export const addCustomer =async (customer:Customer) => {
    const newCustomerRef = doc(collection(db, "customers")).withConverter(converter);
    const customerData = await setDoc(newCustomerRef, customer);    

    return customerData
}

export const deleteCustomer = async (id: string):Promise<boolean> => {
    try {
        await deleteDoc(doc(collection(db, "customers"), id))
        return true
    } catch (e) {
        console.log(e)
        return false
    }
}