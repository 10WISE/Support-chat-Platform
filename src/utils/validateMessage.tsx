import * as _ from 'lodash';

export default (name = '', opacity = 48) => {
  const array = [
    {
      message: 'El usuario ha abandonado la conversación',
      color: `rgb(67 167 250 / ${opacity}%)`,
      type: 'info',
    },
    {
      message: 'El usuario finalizó la consulta',
      color: `rgb(250 91 61 / ${opacity}%)`,
      type: 'error',
    },
    {
      message: 'El usuario se ha desconectado',
      color: `rgb(67 169 250 / ${opacity}%)`,
      type: 'info',
    },
    {
      message: 'Usuario reconectado',
      color: `rgb(49 198 103 / ${opacity}%)`,
      type: 'success',
    },
    {
      message: 'Nuevo Ticket',
      color: `rgb(49 198 103 / ${opacity}%)`,
      type: 'success',
    },
    {
      message: 'Ticket escalado',
      color: `rgb(246 178 70 / ${opacity}%)`,
      type: 'warning',
    },
  ];

  let result = _.find(array, (obj) => {
    return name?.toUpperCase().includes(obj.message.toUpperCase());
  });
  return result;
};
