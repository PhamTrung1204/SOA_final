import { Box, Grid2 } from '@mui/material';
import { CustomPageContainer, HighLightCard, Loading } from '../../../../components';
import { useReadAllOrdersAdmin } from '../../../../api/queries';
import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs';

const breadcrumbs = [
  { path: '/', title: 'Home' },
  { path: '/reports', title: 'Báo cáo' },
  { path: '/reports/accounts', title: 'Khách hàng' }
]

const monthlyData = {
  "0": { month: '1', count: 0, totalAmount: 0, paidOrder: 0, days: [] },
  "1": { month: '2', count: 0, totalAmount: 0, paidOrder: 0, days: [] },
  "2": { month: '3', count: 0, totalAmount: 0, paidOrder: 0, days: [] },
  "3": { month: '4', count: 0, totalAmount: 0, paidOrder: 0, days: [] },
  "4": { month: '5', count: 0, totalAmount: 0, paidOrder: 0, days: [] },
  "5": { month: '6', count: 0, totalAmount: 0, paidOrder: 0, days: [] },
  "6": { month: '7', count: 0, totalAmount: 0, paidOrder: 0, days: [] },
  "7": { month: '8', count: 0, totalAmount: 0, paidOrder: 0, days: [] },
  "8": { month: '9', count: 0, totalAmount: 0, paidOrder: 0, days: [] },
  "9": { month: '10', count: 0, totalAmount: 0, paidOrder: 0, days: [] },
  "10": { month: '11', count: 0, totalAmount: 0, paidOrder: 0, days: [] },
  "11": { month: '12', count: 0, totalAmount: 0, paidOrder: 0, days: [] },
};

const OrderDashboard = () => {
  const [currentDay, setCurrentDay] = useState(new Date())
  const [ordersByMonth, setOrdersByMonth] = useState([]);
  const [ordersByDay, setOrdersByDay] = useState([]);
  const [thisMonthOrders, setThisMonthOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0); // New state for total orders
  const [averageOrderValue, setAverageOrderValue] = useState(0); // New state for average order value

  const { data: orders } = useReadAllOrdersAdmin();

  useEffect(() => {
    if (!orders) return;
    //init days
    Object.values(monthlyData).forEach(
      month => {
        const numberOfDate = new Date(currentDay.getFullYear(), month.month, 0).getDate();
        month.days = Array.from({ length: numberOfDate }, (_, i) => ({ totalAmount: 0, count: 0, day: i + 1 }));
      }
    )


    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      console.log(orderDate);

      if (orderDate.getFullYear() !== currentDay.getFullYear()) return;
      const month = orderDate.getMonth();
      const day = orderDate.getDate();

      monthlyData[month].count += 1;

      monthlyData[month].days[day - 1].count += 1;
      if (order.paymentStatus === 'paid') {
        monthlyData[month].paidOrder += 1;

        monthlyData[month].totalAmount += order.totalAmount;
        monthlyData[month].days[day - 1].totalAmount += order.TotalAmount;
      }
    });
    setTotalOrders(orders.length);
    setOrdersByMonth(Object.values(monthlyData));
    console.log(monthlyData);


    setOrdersByDay(monthlyData[currentDay.getMonth()].days)

    const thisMonthData = monthlyData[currentDay.getMonth()];
    setThisMonthOrders(thisMonthData.count + "");
    setAverageOrderValue(thisMonthData.paidOrder > 0 ? thisMonthData.totalAmount / thisMonthData.paidOrder + "" : "0");

  }, [orders]);

  useEffect(() => {
    if (!orders) return;
    setOrdersByMonth(Object.values(monthlyData));
    setOrdersByDay(monthlyData[currentDay.getMonth()].days)
    const thisMonthData = monthlyData[currentDay.getMonth()];

    setThisMonthOrders(thisMonthData.count + "");
    setAverageOrderValue(thisMonthData.paidOrder > 0 ? thisMonthData.totalAmount / thisMonthData.paidOrder + "" : "0");
  }, [currentDay]);


  return (
    <CustomPageContainer
      breadCrumbs={breadcrumbs}
      title='Báo cáo khách hàng'
      slots={{
        toolbar: () => <DatePicker
          label="picker"
          value={dayjs(currentDay)}
          onChange={(newValue) => setCurrentDay(new Date(newValue))}
        />
      }}
    >
      <Grid2 container spacing={2}>
        {/* Thống kê tổng quát */}
        <Grid2 size={{ md: 4, xs: 12 }} sx={{ boxShadow: '0 0 5px 0 rgba(0,0,0,0.3)' }} padding={{ xs: 2, md: 3 }} borderRadius={1} height={160}>
          <HighLightCard isLoading={!totalOrders} title="Tổng số đơn hàng" value={totalOrders} />
        </Grid2>
        <Grid2 size={{ md: 4, xs: 12 }} sx={{ boxShadow: '0 0 5px 0 rgba(0,0,0,0.3)' }} padding={{ xs: 2, md: 3 }} borderRadius={1} height={160}>
          <HighLightCard isLoading={!thisMonthOrders} title="Đơn hàng trong tháng" value={thisMonthOrders} />
        </Grid2>
        <Grid2 size={{ md: 4, xs: 12 }} sx={{ boxShadow: '0 0 5px 0 rgba(0,0,0,0.3)' }} padding={{ xs: 2, md: 3 }} borderRadius={1} height={160}>
          <HighLightCard isLoading={!averageOrderValue} title="Tổng doanh thu tháng" value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(averageOrderValue)} />
        </Grid2>
        <Grid2 size={{ md: 6, xs: 12 }} sx={{ boxShadow: '0 0 5px 0 rgba(0,0,0,0.3)' }} padding={{ xs: 2, md: 3 }} borderRadius={1}>
          {
            !ordersByMonth ?
              <Box display='flex' alignItems='center' height="100%" width="100%" justifyContent='center'>
                <Loading />
              </Box> :
              <BarChart
                dataset={ordersByMonth}
                xAxis={[{
                  scaleType: 'band', dataKey: 'month', label: 'Tháng'
                }]}
                yAxis={[{ label: 'Đơn hàng' }]}
                series={[
                  { dataKey: 'count', label: 'Số đơn hàng', color: '#0672cb' }
                ]}
                height={300}
              />
          }
        </Grid2>
        <Grid2 size={{ md: 6, xs: 12 }} sx={{ boxShadow: '0 0 5px 0 rgba(0,0,0,0.3)' }} padding={{ xs: 2, md: 3 }} borderRadius={1}>
          {
            !ordersByMonth ?
              <Box display='flex' alignItems='center' height="100%" width="100%" justifyContent='center'>
                <Loading />
              </Box> :
              <BarChart
                dataset={ordersByMonth}
                xAxis={[{
                  scaleType: 'band', dataKey: 'month', label: 'Tháng'
                }]}
                yAxis={[{ label: 'Đơn hàng' }]}
                series={[
                  { dataKey: 'totalAmount', label: 'Tổng giá trị đơn', color: '#0672cb' }
                ]}
                height={300}
              />
          }
        </Grid2>
        <Grid2 size={{ md: 6, xs: 12 }} sx={{ boxShadow: '0 0 5px 0 rgba(0,0,0,0.3)' }} padding={{ xs: 2, md: 3 }} borderRadius={1}>
          {
            !ordersByDay ?
              <Box display='flex' alignItems='center' height="100%" width="100%" justifyContent='center'>
                <Loading />
              </Box> :
              <BarChart
                dataset={ordersByDay}
                xAxis={[{
                  scaleType: 'band', dataKey: 'day', label: 'Ngày'
                }]}
                yAxis={[{ label: 'Đơn hàng' }]}
                series={[
                  { dataKey: 'count', label: 'Số đơn hàng', color: '#0672cb' }
                ]}
                height={300}
              />
          }
        </Grid2>
        <Grid2 size={{ md: 6, xs: 12 }} sx={{ boxShadow: '0 0 5px 0 rgba(0,0,0,0.3)' }} padding={{ xs: 2, md: 3 }} borderRadius={1}>
          {
            !ordersByDay ?
              <Box display='flex' alignItems='center' height="100%" width="100%" justifyContent='center'>
                <Loading />
              </Box> :
              <BarChart
                dataset={ordersByDay}
                xAxis={[{
                  scaleType: 'band', dataKey: 'day', label: 'Ngày'
                }]}
                yAxis={[{ label: 'Đơn hàng' }]}
                series={[
                  { dataKey: 'totalAmount', label: 'Tổng giá trị đơn', color: '#0672cb' }
                ]}
                height={300}
              />
          }
        </Grid2>
      </Grid2>
    </CustomPageContainer>
  );
};

export default OrderDashboard;
