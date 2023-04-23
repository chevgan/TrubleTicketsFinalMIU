import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { useAuthContext } from '../../contexts/auth-context';

export const AccountPopover = (props) => {
  const { user } = useAuthContext();
  const { anchorEl, onClose, open } = props;
  const router = useRouter();
  const auth = useAuth();
  const { signOut } = useAuthContext();
  const handleSignOut = useCallback(
    () => {
      onClose?.();
      signOut(); // Используйте signOut из контекста аутентификации
      router.push('/auth/login');
    },
    [onClose, signOut, router] // Обновите зависимости
  );

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2
        }}
      >
        <Typography variant="overline">
          Аккаунт
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {user && user.name}
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {user && user.email}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: '8px',
          '& > *': {
            borderRadius: 1
          }
        }}
      >
        <MenuItem onClick={handleSignOut}>
          Выйти
        </MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};
