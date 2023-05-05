import ListBulletIcon from '@heroicons/react/24/solid/ListBulletIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import { SvgIcon } from '@mui/material';
import {
  DocumentChartBarIcon,
  ExclamationCircleIcon,
  TruckIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/20/solid';

export const items = [
  {
    title: 'Тикеты',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ListBulletIcon />
      </SvgIcon>
    )
  },
/*  {
    title: 'Контакты',
    path: '/contacts',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },*/
/*  {
    title: 'Заявки на выезд',
    path: '/\n' + 'repair-requests',
    icon: (
      <SvgIcon fontSize="small">
        <TruckIcon />
      </SvgIcon>
    )
  },*/
  {
    title: 'Схемы',
    path: '/\n' + 'scheme',
    icon: (
      <SvgIcon fontSize="small">
        <DocumentChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Журнал эсколации',
    path: '/\n' + 'escalation-log',
    icon: (
      <SvgIcon fontSize="small">
        <ExclamationCircleIcon />
      </SvgIcon>
    )
  },
  {
    title: `Настройки станций`,
    path: '/\n' + 'station-settings',
    icon: (
      <SvgIcon fontSize="small">
        <WrenchScrewdriverIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Аккаунт',
    path: '/account',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },
/*  {
    title: 'Настройки',
    path: '/settings',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    )
  },*/

];
