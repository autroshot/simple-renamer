import { extendTheme, StyleFunctionProps } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Form: {
      variants: {
        floating: (props: StyleFunctionProps) => ({
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label':
              {
                ...activeLabelStyles,
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: 'absolute',
              backgroundColor: props.colorMode === 'light' ? 'white' : 'gray.800',
              pointerEvents: 'none',
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: 'left top',
            },
          },
        }),
      },
    },
  },
});

const activeLabelStyles = {
  transform: 'scale(0.85) translateY(-24px)',
};

export default theme;
