import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';

import Cover from "~/components/cover";
import { useCart } from "~/components/cartContext";
import { LayoutItem } from "~/components/LayoutItem";
import { Chicken, Eggs, Pork, Vegetables } from "~/svg";
import { Product } from "./products.server";
import { Dispatch } from "~/components/cartContext";
import { productLoader } from './products.server'

type ProductCardProps = {
    product: Product
    dispatch: Dispatch
}

export const loader = async () => {
    const products:any = await productLoader()

    return json({
        products
    })
};

const ProductCard:React.FC<ProductCardProps> = ({product, dispatch}) => {
    const [checkoutData, setCheckoutData] = useState({})

    const addToCart = (item:any) => {
      dispatch({ type: "ADD", payload: item })
    }
  
    const handleSelect = (e:any) => {
        const { target: { value } } = e
        const [ option, price ] = value.split(':')
      setCheckoutData( (prev:any) =>({...prev, title:`${product.productTitle} - ${option}`, price: parseInt(price)}))
    }

    useEffect(() => {
        setCheckoutData({
            title: `${product.productTitle} - ${product.options[0].optionTitle}`,
            price: product.options[0].optionPrice,
        })
    }, [product])

    return (
        <LayoutItem key={product.productTitle}>
                    <h2 className="text-xl mb-3">{product.productTitle}</h2>
                    {
                        product.productTitle === 'Eggs' && <Eggs /> ||
                        product.productTitle === 'Chicken' && <Chicken /> ||
                        product.productTitle === 'Pork' && <Pork /> ||
                        product.productTitle === 'Vegetables' && <Vegetables />
                    }
                    <div className="flex justify-between w-full align-middle pt-3 flex-col">
                        <label className="text-xs" htmlFor="productOptions">Options:</label>
                        <select name="productOptions" onChange={ handleSelect } defaultValue={product.options[0].optionPrice}>
                            {product.options.map((option:any) => (
                                <option key={option.optionTitle} value={`${option.optionTitle}:${option.optionPrice}`} >
                                    {option.optionTitle} - ${option.optionPrice}.00/{ product.productTitle === 'Pork' ? 'lb' : 'ea' }
                                </option>
                            ))}
                        </select>
                        { product.stock ? (
                            <button onClick={() => { 
                                addToCart({
                                    ...checkoutData,
                                    id: uuid()
                                })
                            }} className="mt-5 px-4 py-1 text-sm text-dark rounded-full border border-dark hover:text-white hover:bg-dark hover:border-transparent">Add to order</button>
                        ) : null }
                        
                    </div>
                </LayoutItem>
    )
}

export default function Products() {
  const {products} = useLoaderData();
  const {state, dispatch} = useCart();

  return (
    <div 
        className="flex flex-col"
    >
        <Cover title="Products" />
        <section className="grid grid-flow-row lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 p-6 bg-light gap-5">
            {products.map((product:any) => (
                <ProductCard key={product.productTitle} product={product} dispatch={dispatch}/>
            ))}
        </section>
    </div>
  );
}
