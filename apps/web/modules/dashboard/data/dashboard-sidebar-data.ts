import {
  IconBuildingSkyscraper,
  IconCurrencyDollar,
  IconFileText,
  IconHelpCircle,
  IconHome,
  IconList,
  IconMessageCircle,
  IconReceipt,
  IconUsers,
} from "@tabler/icons-react";
import type {
  DashboardNavMainItem,
  DashboardNavSecondaryItem,
} from "@/modules/dashboard/types/dashboard.types";

export const dashboardNavMain: DashboardNavMainItem[] = [
  {
    title: "Inicio",
    url: "/dashboard",
    icon: IconHome,
  },
  {
    title: "Propiedades",
    icon: IconBuildingSkyscraper,
    url: "/dashboard/properties",
  },
  {
    title: "Gastos",
    url: "/dashboard/expenses",
    icon: IconReceipt,
  },
  {
    title: "Pagos",
    url: "/dashboard/payments",
    icon: IconCurrencyDollar,
  },
  {
    title: "Inquilinos",
    url: "/dashboard/tenants",
    icon: IconUsers,
  },
  {
    title: "Contratos",
    url: "/dashboard/contracts",
    icon: IconFileText,
  },
  {
    title: "Auditorías",
    url: "/dashboard/audits",
    icon: IconList,
  },
];

export const dashboardNavSecondary: DashboardNavSecondaryItem[] = [
  {
    title: "Soporte",
    url: "#",
    icon: IconHelpCircle,
  },
  {
    title: "Feedback",
    url: "#",
    icon: IconMessageCircle,
  },
];
