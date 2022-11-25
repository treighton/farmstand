import { Link } from "@remix-run/react"
import { useMemo, useState } from "react"
import { CartIcon, Logo } from "~/svg"
import { useCart, Item, State } from "./cartContext"

const CartPreview: React.FC = () => {
  const { state, dispatch } = useCart()
  const { items } = state
  return (
    <div className="pop-over absolute right-0 top-20 bg-white p-4 border border-blue-gray-50 rounded-lg shadow-lg shadow-blue-gray-500/10 font-sans text-sm font-normal text-blue-gray-500 focus:outline-none break-words whitespace-normal w-80">
      <table className="w-full text-center">
        <thead className="text-dark">
          <tr>
            <th>Items</th>
            <th>Prices</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="text-dark">
              <td className="py-2">{item.title}</td>
              <td>${item.price}.00</td>
              <td>
                <button onClick={() => dispatch({payload: item, type:'REMOVE'})}>x</button>
              </td>
            </tr>
          ))}
          <tr className="text-dark ">
            <td>Total:</td>
            <td>${ (items as Item[]).reduce((prev, current):number => prev + current.price, 0) }.00</td>
            <td className="py-4"><Link to="/checkout" className="px-4 py-1 text-sm text-white bg-dark rounded-full border border-dark hover:text-dark hover:bg-white hover:border-transparent">Checkout</Link></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

type User = {
  uid: string,
  displayName: string,
  email: string,
  isAdmin: boolean
}

interface HeaderProps {
  user: User,
}

const Header: React.FC<HeaderProps> = ({user}) => {
    const { state: { items } } = useCart()
    const itemCount = useMemo( () => items.length, [items] )
    const [ showPreview, setShowPreview ] = useState(false)
    const [ showMobileNav, setShowMobileNav ] = useState(false)
    const handleShow = () => setShowPreview( !showPreview )

    return (
      <>
        <header className="
            font-serif 
            p-5 
            text-white 
            bg-dark
            flex
            items-center
            justify-between
            relative
            ">
            <Link to="/" className="logo flex items-center gap-4 uppercase">
              <Logo />
              <div className="flex flex-col">
                <span className="text-xs font-sans leading-none mb-1">food for people, not for profit</span>
                <span className="text-2xl leading-none">Barbell Farm</span>
              </div>
            </Link>
            <button 
              type="button"
              className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" 
              aria-expanded="false"
              onClick={ () => setShowMobileNav(!showMobileNav) }
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
            </button>
            <nav className="ml-auto mr-4 hidden md:block">
              <ul className="flex gap-5 text-xl leading-none">
                <li><Link to="/products">Order</Link></li>
                <li>
                  {
                  user ?
                   (
                    <form action="/logout" method="post">
                      <button type="submit">Logout</button>
                    </form>) :
                   (<Link to="/login">Login</Link>)
                  }
                </li>
                <li>
                  <button className={`flex ${showPreview ? 'text-dark-alt' : ''}`} onClick={handleShow}>
                  <CartIcon />
                  <span>({itemCount})</span>
                </button>
                </li>
              </ul>
            </nav>
          { showPreview && <CartPreview /> } 
        </header>
          {
            showMobileNav && (
            <nav className="            
            font-serif 
            p-5 
            text-white 
            bg-dark
            md:hidden
            ">
              <ul className="
                flex-column 
                gap-5 
                text-xl 
                leading-none 
                items-center
                justify-center
              ">
                <li className="p-2 text-center"><Link to="/products">Order</Link></li>
                <li className="p-2 text-center">
                  {
                  user ?
                   (
                    <form action="/logout" method="post">
                      <button type="submit">Logout</button>
                    </form>) :
                   (<Link to="/login">Login</Link>)
                  }
                </li>
                <li className="p-2 text-center flex justify-center">
                  <button className={`flex ${showPreview ? 'text-dark-alt' : ''}`} onClick={handleShow}>
                  <CartIcon />
                  <span>({itemCount})</span>
                </button>
                </li>
              </ul>
            </nav>
            )
          }
      </>
    )
}
export default Header