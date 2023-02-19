
import { collection, getDocs, addDoc } from "firebase/firestore"; 
import { db } from '~/utils/firebase.config'
import { RecurringOrder, Customer } from "./customer.types";

const converter = {
    toFirestore: (data: Customer) => data,
    fromFirestore: (snap: any) =>
      snap.data() as Customer
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

export const addCustomer =async (customer:Customer):Promise<Customer> => {
    const customerData = await addDoc(collection(db, "customers"), customer);
    return customerData.withConverter(converter)
}