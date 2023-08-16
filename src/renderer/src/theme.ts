import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Table: {
      variants: {
        simple: {
          table: {
            tableLayout: 'fixed',
          },
          th: {
            borderWidth: '0px 1px 1px 1px',
          },
        },
      },
    },
  },
});

export default theme;
