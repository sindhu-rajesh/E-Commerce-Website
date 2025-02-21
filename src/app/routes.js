import ShoppingPage from '../Pages/ShoppingPage'
import MyOrdersPage from '../Pages/MyOrdersPage'
import CartPage from '../Pages/CartPage'
import LoginPage from '../Pages/LoginPage'
import AdminPage from '../Pages/AdminPage'

import ProductPage from '../Pages/ProductPage'

import Dashboard from '../../src/Components/admin-page/dashboard/Dashboard'
import Orders from '../Components/admin-page/orders/OrderList'
import Products from '../Components/admin-page/products/ProductListt'

import PrivateRoute from '../Components/shared/PrivateRoute';

const routes=[
    {
        path: '/',
        element:<ShoppingPage />,
    },
    {
        path: '/my-orders',
        element:<MyOrdersPage />,
    },
    {
        path: '/cart',
        element:<CartPage />,
    },
    {
        path: '/admin',
        element:<LoginPage />,
    },
    {
        path: '/:id',
        element:<ProductPage />,
    },
    {
        path: '/admin-page',
        element:<AdminPage />,
        auth:true,
        children:[
            {
                index:true,
                element:<Dashboard />,
            },
            {
                path: 'orders',
                element:<Orders />,
            },
            {
                path: 'products',
                element:<Products />,
            },
        ]
    },
]

const authCheck = routes => routes.map(route => {
	if (route?.auth) {
		route.element = <PrivateRoute>{route.element}</PrivateRoute>
	}
	if (route?.children) {
		route.children = authCheck(route.children)
	}
	return route
})


export default authCheck(routes)