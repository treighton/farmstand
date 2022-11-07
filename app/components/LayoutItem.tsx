import { ReactNode } from "react";

type LayoutItem = {
  children: ReactNode
}

export const LayoutItem:React.FC<LayoutItem> = ({children}) => (
  <article className="flex flex-col justify-between bg-white px-6 pt-10 pb-8 shadow-xl w-full sm:mx-auto sm:rounded-lg sm:px-10">
    {children}
  </article>
)