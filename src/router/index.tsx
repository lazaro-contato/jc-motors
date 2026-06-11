import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import AppLayout from '@/components/layout/AppLayout'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import DesignSystemPage from '@/features/dashboard/pages/DesignSystemPage'
import { VehiclesPage } from '@/features/vehicles/pages/VehiclesPage'
import { VehicleCreatePage } from '@/features/vehicles/pages/VehicleCreatePage'
import { VehicleEditPage } from '@/features/vehicles/pages/VehicleEditPage'
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
import { ProfileCreatePage } from '@/features/optionals/pages/ProfileCreatePage'

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

const vehiclesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/vehicles',
  component: VehiclesPage,
})

const vehicleCreateRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/vehicles/new',
  component: VehicleCreatePage,
})

const vehicleEditRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/vehicles/$id/edit',
  component: VehicleEditPage,
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

const profileCreateRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/optionals/profiles/new',
  component: ProfileCreatePage,
})

const routeTree = rootRoute.addChildren([
  loginRoute,
  appRoute.addChildren([
    dashboardRoute,
    vehiclesRoute,
    vehicleCreateRoute,
    vehicleEditRoute,
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
    profileCreateRoute,
  ]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
