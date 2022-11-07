import { ReactNode } from "react"

type LayoutChildren = { className:string,  children:ReactNode }

const Container:React.FC<LayoutChildren> = ({ className, children}) =>{ 
    
    return(
        <div className={`md:container mx-auto ${className}`}>{children}</div>
    )
}

export default Container