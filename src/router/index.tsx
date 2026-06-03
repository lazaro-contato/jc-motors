import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import AppLayout from '@/components/layout/AppLayout'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import DesignSystemPage from '@/features/dashboard/pages/DesignSystemPage'
import { CarsPage } from '@/features/cars/pages/CarsPage'
import { CarCreatePage } from '@/features/cars/pages/CarCreatePage'
import { CarEditPage } from '@/features/cars/pages/CarEditPage'
import ProvidersPage from '@/features/providers/pages/ProvidersPage'
import ProviderCreatePage from '@/features/providers/pages/ProviderCreatePage'
import { CustomersPage } from '@/features/customers/pages/CustomersPage'
import { CustomerCreatePage } from '@/features/customers/pages/CustomerCreatePage'
import { EmployeesPage } from '@/features/employees/pages/EmployeesPage'
import { EmployeeCreatePage } from '@/features/employees/pages/EmployeeCreatePage'
import { SalesPage } from '@/features/sales/pages/SalesPage'
import { SaleCreatePage } from '@/features/sales/pages/SaleCreatePage'
import { MyTasksPage } from '@/features/workflow/pages/MyTasksPage'
import { OptionalsPage } from '@/features/optionals/pages/OptionalsPage'

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

const carCreateRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/cars/new',
  component: CarCreatePage,
})

const carEditRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/cars/$id/edit',
  component: CarEditPage,
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

const employeesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/employees',
  component: EmployeesPage,
})

const employeeCreateRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/employees/new',
  component: EmployeeCreatePage,
})

const salesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/sales',
  component: SalesPage,
})

const saleCreateRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/sales/new',
  component: SaleCreatePage,
})

const myTasksRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/my-tasks',
  component: MyTasksPage,
})

const optionalsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/optionals',
  component: OptionalsPage,
})

const routeTree = rootRoute.addChildren([
  loginRoute,
  appRoute.addChildren([
    dashboardRoute,
    carsRoute,
    carCreateRoute,
    carEditRoute,
    designSystemRoute,
    providersRoute,
    providerCreateRoute,
    customersRoute,
    customerCreateRoute,
    employeesRoute,
    employeeCreateRoute,
    salesRoute,
    saleCreateRoute,
    myTasksRoute,
    optionalsRoute,
  ]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
