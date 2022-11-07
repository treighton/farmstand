import { collection, getDocs } from "firebase/firestore"; 
import { db } from '~/utils/firebase.config'

type Product = {
    options: ProductOption[];
    productTitle: string;
    stock: number;
};

type ProductOption = {
    optionPrice: number;
    optionTitle: string;
}

export const productLoader = async ():Promise<Array<Product>> => {
    const products:any  = await getDocs(collection(db, "products"));
    
    const productData = products.docs.map((product: any) => {
        const { id } = product
        const productData = {id,  ...product.data()}
        return productData
    })
    return productData
};