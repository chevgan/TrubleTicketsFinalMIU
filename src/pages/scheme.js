import Head from 'next/head';
import {
  Box,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';



const Page = () => {
  return (
    <>
      <Head>
        <title>
          Схемы
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
                justifyContent="center"
                spacing={4}
              >
                <Stack spacing={1}>
                  <Typography variant="h4">
                    Схемы
                  </Typography>
                </Stack>
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
