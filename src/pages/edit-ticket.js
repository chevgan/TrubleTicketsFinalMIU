import Head from 'next/head';
import {
  Box,
  Container, Grid,
  Stack,
  Typography
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import TicketsForm from './Tickets/TicketsForm';




const Page = () => {
  return (
    <>
      <Head>
        <title>
          Редактирование тикета
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Box>
          <Container maxWidth="xl">
            <Stack spacing={3}>
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <Stack spacing={1}>
                  <Typography variant="h4">
                    Редактирование тикета
                  </Typography>
                </Stack>
              </Stack>

              <Stack
                alignItems="center"
                direction="row"
                spacing={1}
              >
                <TicketsForm />
              </Stack>
            </Stack>

          </Container>
        </Box>
      </Box>
    </>
  )
}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
