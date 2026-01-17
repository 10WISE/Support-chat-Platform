import * as React from 'react';
import { Typography, colors } from '@mui/material';

export const Label = (props: any) => {
  const { className, variant, color, shape, children, style, ...rest } = props;


  const finalStyle = { ...style };

  if (variant === 'contained') {
    finalStyle.backgroundColor = color;
    finalStyle.color = '#FFF';
  } else {
    finalStyle.border = `1px solid ${color}`;
    finalStyle.color = color;
  }

  return (
    <Typography
      {...rest}
      style={finalStyle}
      variant="overline"
    >
      {children}
    </Typography>
  );
};

// Label.propTypes = {
//   children: PropTypes.node,
//   className: PropTypes.string,
//   color: PropTypes.string,
//   shape: PropTypes.oneOf(['square', 'rounded']),
//   style: PropTypes.object,
//   variant: PropTypes.oneOf(['contained', 'outlined']),
// };

// Label.defaultProps = {
//   style: {},
//   color: colors.grey[600],
//   variant: 'contained',
//   shape: 'square',
// };
