import Head from 'next/head';
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import NextLink from 'next/link';
import TicketsData from './Tickets/TicketsData';

const now = new Date();

const Page = () => {

  return (
    <>
      <Head>
        <title>
          Tickets
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={5}>
                <Typography variant="h4">
                  Tickets
                </Typography>
              </Stack>
              <div>
                <NextLink href="/create-tickets" passHref>
                  <Button
                    startIcon={
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                  >
                    Добавить
                  </Button>
                </NextLink>
              </div>
            </Stack>
            <TicketsData/>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
