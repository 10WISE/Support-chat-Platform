import Axios from 'axios';
import Swal from 'sweetalert2';
/**
 * axios initialization
 */
// declare const HADS_URL: any;
const axios = Axios.create({
  baseURL: HADS_URL + 'api/',
  timeout: 60000,
  headers: {},
});

axios.interceptors.request.use(
  (config) => {
    const token = '';

    config.headers.Auth = true;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.type) {
      switch (config.type) {
        case 'FORM-DATA':
          config.transformRequest = [
            (data) => {
              return 'args=' + JSON.stringify(data);
            },
          ];
          break;
        default:
          break;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    setTimeout(() => {}, 500);
    return response;
  },
  (error) => {
    const defaultNotify = {
      message: 'error desconocido',
      icon: 'warning',
      color: 'warning',
      position: 'top',
      timeout: 1500,
      html: true,
    };
    if (
      error.code === 'ECONNABORTED' ||
      error.message.indexOf('timeout') !== -1 ||
      error.message === 'Network Error'
    ) {
      defaultNotify.message = 'anomalía de la red';
      Swal.fire({
        title: '!Atención!',
        html: defaultNotify.message,
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        reverseButtons: true,
      });
      return Promise.reject(error);
    }
    switch (error.response.status) {
      case 400:
        let data = Object.keys(error.response.data);
        let message = '';
        for (let index = 0; index < data.length; index++) {
          message += eval('error.response.data.' + data[index]) + '</br>';
        }
        defaultNotify.timeout = 10000;
        defaultNotify.message = message;
        Swal.fire({
          title: '!Atención!',
          html: defaultNotify.message,
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          reverseButtons: true,
        });
        break;
      case 401:
        defaultNotify.message = 'Token inválido';
        if (error.response.data.detail) {
          window.location.href = '/#/login';
          defaultNotify.message = error.response.data.detail;
        }
        Swal.fire({
          title: '!Atención!',
          html: defaultNotify.message,
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          reverseButtons: true,
        });
        location.reload();
        break;
      case 403:
        defaultNotify.message = 'acceso denegado(403)';
        if (error.response.data.detail) {
          defaultNotify.timeout = 5000;
          defaultNotify.message = error.response.data.detail;
          Swal.fire({
            title: '!Atención!',
            html: defaultNotify.message,
            icon: 'warning',
            confirmButtonText: 'Aceptar',
            reverseButtons: true,
          });
        }
        break;
      case 404:
        defaultNotify.message = 'El recurso no existe(404)';
        Swal.fire({
          title: '!Atención!',
          html: defaultNotify.message,
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          reverseButtons: true,
        });
        break;
      case 408:
        defaultNotify.message = 'Tiempo de espera agotado(408)';
        Swal.fire({
          title: '!Atención!',
          html: defaultNotify.message,
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          reverseButtons: true,
        });
        break;
      case 410:
        Swal.fire({
          title: '!Atención!',
          html: error.response.data.detail,
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          reverseButtons: true,
        }).then(() => {
          // const dispatch = useDispatch();
          // dispatch(setLoadingWait(false));
        });
        break;
      case 500:
        defaultNotify.message = 'Error del Servidor(500)';
        Swal.fire({
          title: '!Atención!',
          html: defaultNotify.message,
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          reverseButtons: true,
        });
        break;
      case 501:
        defaultNotify.message = ' Servicio no implementado(501)';
        Swal.fire({
          title: '!Atención!',
          html: defaultNotify.message,
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          reverseButtons: true,
        });
        break;
      case 502:
        defaultNotify.message = 'Error de red(502)';
        Swal.fire({
          title: '!Atención!',
          html: defaultNotify.message,
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          reverseButtons: true,
        });
        break;
      case 503:
        defaultNotify.message = 'El servicio no está disponible(503)';
        Swal.fire({
          title: '!Atención!',
          html: defaultNotify.message,
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          reverseButtons: true,
        });
        break;
      case 504:
        defaultNotify.message = 'tiempo de espera de la red(504)';
        Swal.fire({
          title: '!Atención!',
          html: defaultNotify.message,
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          reverseButtons: true,
        });
        break;
      case 505:
        defaultNotify.message = 'La versión HTTP no es compatible(505)';
        Swal.fire({
          title: '!Atención!',
          html: defaultNotify.message,
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          reverseButtons: true,
        });
        break;
      default:
        Swal.fire({
          title: '!Atención!',
          html: defaultNotify.message,
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          reverseButtons: true,
        });
        break;
    }
    return Promise.reject(error);
  }
);

export default axios;
