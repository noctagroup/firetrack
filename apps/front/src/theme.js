import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#333333', // cinza escuro
    },
    secondary: {
      main: '#ff9800', // laranja (tom Material Design)
    },
  },
});

export default theme;