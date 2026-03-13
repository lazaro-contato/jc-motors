import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import AppLayout from '@/components/layout/AppLayout'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import LoginPage from '@/features/auth/pages/LoginPage'
import DesignSystemPage from '@/features/dashboard/pages/DesignSystemPage'
import CarsPage from '@/features/cars/pages/CarsPage'
import ProvidersPage from '@/features/providers/pages/ProvidersPage'
import ProviderCreatePage from '@/features/providers/pages/ProviderCreatePage'
import { CustomersPage } from '@/features/customers/pages/CustomersPage'
import { CustomerCreatePage } from '@/features/customers/pages/CustomerCreatePage'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: AppLayout,
})

const dashboardRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/',
  component: DashboardPage,
})

const carsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/cars',
  component: CarsPage,
})

const designSystemRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/design-system',
  component: DesignSystemPage,
})

const providersRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/providers',
  component: ProvidersPage,
})

const providerCreateRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/providers/new',
  component: ProviderCreatePage,
})

const customersRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/customers',
  component: CustomersPage,
})

const customerCreateRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/customers/new',
  component: CustomerCreatePage,
})

const routeTree = rootRoute.addChildren([
  loginRoute,
  appRoute.addChildren([
    dashboardRoute,
    carsRoute,
    designSystemRoute,
    providersRoute,
    providerCreateRoute,
    customersRoute,
    customerCreateRoute,
  ]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
