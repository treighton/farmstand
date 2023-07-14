import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';

import Cover from "~/components/cover";
import Container from "~/components/container";
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

  return (
    <div 
        className="flex flex-col"
    >
        <Cover title="Products" />
            <Container className="p-12">
                <h2 className="text-4xl mb-4">
                    Apologies
                </h2>
                <p className="mb-4">
                    This has been an exciting and eventful year for us far, but unfortunately with the good also has come some hardship. At the beginning of the summer we had an incident on the farm that resulted in the loss of 30% of our laying flock, and couple that with the move to our new farm and the outrageous heat, and our flock continues to dwindle.
                </p>
                <p className="mb-4">
                    We will work to rebuild the flock, but in the mean time we will no longer be able to take orders online. Until we are back up to a more robust production level orders can be placed via instagram <a href="https://instagram.com/barbell_farm">@barbell_farm</a>, or by text message 916-228-1623. We wont be able to fill all the egg orders we receive, so if we can set up a recurring weekly delivery you'll be more likely to receive eggs.
                </p>
                <p className="mb-4">
                    Thank you all so much for your understanding and continued support!
                </p>
            </Container>
    </div>
  );
}
