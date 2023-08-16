import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Table: {
      variants: {
        simple: {
          th: {
            position: 'relative',
            borderWidth: '0px 1px 1px 1px',
          },
          td: {
            borderWidth: '1px 1px 0px 1px',
          },
        },
      },
    },
  },
});

export default theme;
