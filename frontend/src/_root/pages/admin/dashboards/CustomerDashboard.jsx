import { Box, Grid2 } from '@mui/material';
import { CustomPageContainer, HighLightCard, Loading } from '../../../../components';
import { useGetNewUsersDaily, useReadAllAccount, useReadAllOrdersAdmin } from '../../../../api/queries';
import { useEffect, useState } from 'react';
import { axisClasses, BarChart } from '@mui/x-charts'
import { isDateInCurrentMonth } from '../../../../util/datetimeHandler';

const breadcrumbs = [
  { path: '/', title: 'Home' },
  { path: '/reports', title: 'Báo cáo' },
  { path: '/reports/accounts', title: 'Khách hàng' }
]

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Get today's date in the correct format
const today = formatDate(new Date());

// const months = Array(12).fill(0); // Array to store counts for each month (0 to 11)

const monthlyData = {
  "0": { month: '1', count: 0 },
  "1": { month: '2', count: 0 },
  "2": { month: '3', count: 0 },
  "3": { month: '4', count: 0 },
  "4": { month: '5', count: 0 },
  "5": { month: '6', count: 0 },
  "6": { month: '7', count: 0 },
  "7": { month: '8', count: 0 },
  "8": { month: '9', count: 0 },
  "9": { month: '10', count: 0 },
  "10": { month: '11', count: 0 },
  "11": { month: '12', count: 0 },
};
const ageData = {};

const CustomerDashboard = () => {
  const [userByMonth, setUserByMonth] = useState();
  const [newTodayUser, setNewTodayUser] = useState();
  const [latelyActiveUsers, setLatelyActiveUsers] = useState();
  const [totalCustomers, setTotalCustomers] = useState();
  const [userByAge, setUserByAge] = useState([]);

  const { data: customers } = useReadAllAccount();
  const { data: orders } = useReadAllOrdersAdmin();
  const { data: newDailyUserStat, isPending: isLoadingNewDailyUser } = useGetNewUsersDaily();

  useEffect(() => {
    if (!customers) return;
    setTotalCustomers(customers.filter(cus => cus.accountRole !== 'admin'))

    console.log(customers);

    customers.forEach((customer) => {
      if (customer.accountRole === 'admin') return;
      const today = new Date()

      const date = new Date(customer.createdAt);
      const month = date.getUTCMonth(); // Get month index (0 = January, 11 = December)
      // months[month] += 1;
      monthlyData[month].count += 1;

      const birthDate = new Date(customer.dateOfBirth);

      if (!birthDate || birthDate > today) return;

      const age = today.getFullYear() - birthDate.getFullYear();
      console.log(age);
      const ageGroup = Math.floor(age / 10) * 10; // Group by decades (0-9, 10-19, 20-29, etc.)
      ageData[ageGroup] = (ageData[ageGroup] || 0) + 1;

    });



    setUserByMonth(Object.values(monthlyData));
    setUserByAge(Object.entries(ageData).map(([ageGroup, count]) => ({ ageGroup: `${ageGroup}-${ageGroup.substring(0, ageGroup.length - 1) + 9}`, count })));

  }, [customers]);

  useEffect(() => {
    if (!orders) return;

    setLatelyActiveUsers(
      new Set(orders.map(order => isDateInCurrentMonth(new Date(order.createdAt)) &&
        order.userId._id
      ))
    )
  }, [orders]);

  useEffect(() => {
    if (!newDailyUserStat) return;
    setNewTodayUser(Object.values(newDailyUserStat).find(({ day }) => day === today))

  }, [newDailyUserStat]);

  return (
    <CustomPageContainer
      breadCrumbs={breadcrumbs}
      title='Báo cáo khách hàng'
    >
      <Grid2 container spacing={2}>
        <Grid2 size={{ md: 4, xs: 12 }} sx={{ boxShadow: '0 0 5px 0 rgba(0,0,0,0.3)' }} padding={{ xs: 2, md: 3 }} borderRadius={1} height={160}>
          <HighLightCard isLoading={!totalCustomers} title="Tổng số khách hàng" value={totalCustomers?.length} />
        </Grid2>
        <Grid2 size={{ md: 4, xs: 12 }} sx={{ boxShadow: '0 0 5px 0 rgba(0,0,0,0.3)' }} padding={{ xs: 2, md: 3 }} borderRadius={1} height={160}>
          <HighLightCard isLoading={!latelyActiveUsers} title="Khách hàng hoạt động trong tháng" value={latelyActiveUsers?.size} />
        </Grid2>
        <Grid2 size={{ md: 4, xs: 12 }} sx={{ boxShadow: '0 0 5px 0 rgba(0,0,0,0.3)' }} padding={{ xs: 2, md: 3 }} borderRadius={1} height={160}>
          <HighLightCard isLoading={isLoadingNewDailyUser} title="Khách hàng mới hôm nay" value={newTodayUser?.count || 0} />
        </Grid2>
        <Grid2 size={{ md: 6, xs: 12 }} sx={{ boxShadow: '0 0 5px 0 rgba(0,0,0,0.3)' }} padding={{ xs: 2, md: 3 }} borderRadius={1}>

          {
            !userByMonth ?
              <Box display='flex' alignItems='center' height="100%" width="100%" justifyContent='center'>
                <Loading />
              </Box> :
              <BarChart
                dataset={userByMonth}
                xAxis={[{
                  scaleType: 'band', dataKey: 'month', label: 'Tháng'
                }]}
                yAxis={[{ label: 'Số khách hàng' }]}
                series={[
                  { dataKey: 'count', label: 'Số khách hàng đăng ký', color: '#0672cb' }
                ]}
                height={300}
              />
          }
        </Grid2>
        <Grid2 size={{ md: 6, xs: 12 }} sx={{ boxShadow: '0 0 5px 0 rgba(0,0,0,0.3)' }} padding={{ xs: 2, md: 3 }} borderRadius={1}>
          {userByAge.length === 0 ? (
            <Box display='flex' alignItems='center' height="100%" width="100%" justifyContent='center'>
              <Loading />
            </Box>
          ) : (
            <BarChart
              dataset={userByAge}
              xAxis={[{ scaleType: 'band', dataKey: 'ageGroup', label: 'Độ tuổi' }]}
              yAxis={[{ label: 'Số lượng khách hàng' }]}
              series={[{ dataKey: 'count', label: 'Khách hàng', color: '#0672cb' }]}
              height={300}
            />
          )}
        </Grid2>
      </Grid2>
    </CustomPageContainer>
  );
};

export default CustomerDashboard;
