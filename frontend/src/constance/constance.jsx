import {
  AccountBoxOutlined,
  CategoryOutlined,
  Dashboard,
  Done,
  DoNotDisturbAltOutlined,
  Drafts,
  HourglassBottomOutlined,
  People,
  ViewCarouselOutlined,
  WarehouseOutlined,
  Warning,
} from "@mui/icons-material";
import {
  BoxIcon,
  CartIcon,
  OrderIcon,
  OrderTextIcon,
  VoucherIcon,
} from "../icons/CustomIcons";
import {
  ManageAccount,
  ManageInventory,
  ManageOrder,
  ManageProduct,
  ManageVoucher,
  Voucher,
  Dashboard as DashboardPage,
  ManageCriteria,
  ManageSliderBanner,
  CustomerDashboard,
  OrderDashboard,
} from "../_root/pages";
import Orders from "../_root/pages/customer/Orders";
import Cart from "../_root/pages/customer/Cart";
import { element } from "prop-types";

export const adminNav = [
  {
    kind: "header",
    title: "Quản lý hàng hóa",
  },
  {
    title: "Sản phẩm",
    segment: "manage-product",
    icon: <BoxIcon />,
    element: <ManageProduct />,
  },
  {
    segment: "manage-criteria",
    title: "Phân loại",
    icon: <CategoryOutlined />,
    element: <ManageCriteria />,
  },
  {
    segment: "manage-inventory",
    title: "Kho hàng",
    icon: <WarehouseOutlined />,
    element: <ManageInventory />,
  },
  {
    kind: "header",
    title: "Quản lý cửa hàng",
  },
  {
    segment: "manage-slider-banner",
    title: "Slider Banner",
    icon: <ViewCarouselOutlined />,
    element: <ManageSliderBanner />,
  },
  {
    segment: "manage-voucher",
    title: "Mã giảm giá",
    icon: <VoucherIcon />,
    element: <ManageVoucher />,
  },
  {
    segment: "manage-order",
    title: "Đơn hàng",
    icon: <OrderTextIcon />,
    element: <ManageOrder />,
  },
  {
    kind: "header",
    title: "Quản lý tài khoản",
  },
  {
    segment: "manage-account",
    title: "Tài khoản",
    icon: <AccountBoxOutlined />,
    element: <ManageAccount />,
  },
  {
    kind: "header",
    title: "Báo cáo",
  },
  {
    segment: 'reports',
    title: 'Thống kê',
    icon: <Dashboard />,
    children: [
      {
        segment: 'customers',
        title: 'Khách hàng',
        icon: <People />,
        element: <CustomerDashboard />
      },
      {
        segment: 'orders',
        title: 'Đơn hàng',
        icon: <OrderIcon />,
        element: <OrderDashboard />
      },
    ],
  }
];

export const customerNav = [
  {
    title: "Khuyến mãi",
    icon: <VoucherIcon />,
    segment: "/vouchers",
    element: <Voucher />,
  },
  {
    title: "Đơn của tôi",
    icon: <OrderIcon />,
    segment: "/orders",
    element: <Orders />,
  },
  {
    title: "Giỏ hàng",
    icon: <CartIcon />,
    segment: "/shopingcart",
    element: <Cart />,
  },
];

export const productStatuses = {
  available: {
    label: 'available',
    color: 'success',
    icon: Done,
  },
  unavailable: {
    label: 'unavailable',
    color: 'error',
    icon: DoNotDisturbAltOutlined,
  },
  outOfStock: {
    label: 'out of stock',
    color: 'warning',
    icon: Warning,
  },
  incoming: {
    label: 'incoming',
    color: 'secondary',
    icon: HourglassBottomOutlined,
  },
  draft: {
    label: 'draft',
    color: 'whitesmoke',
    icon: Drafts,
  },
}
