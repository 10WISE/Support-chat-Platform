import Swal from 'sweetalert2';

const Ok = async (title: 'Buen trabajo', message = 'ok', callback?: any) => {
  Swal.fire({title: title + '!', html: message + '!', icon: 'success', backdrop: false , allowOutsideClick: false}).then((result) =>{
    if (callback) {
      callback(result);
    }
  }
  );
};
const Error = async (title: 'Good job!', message = 'ok') => {
  Swal.fire(title + '!', message + '!', 'success').then((result) => {});
};
const Info = async (title: 'Good job!', message = 'ok') => {
  Swal.fire({
    title: '<strong>HTML <u>example</u></strong>',
    icon: 'info',
    html:
      'You can use <b>bold text</b>, ' +
      '<a href="//sweetalert2.github.io">links</a> ' +
      'and other HTML tags',
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
    confirmButtonAriaLabel: 'Thumbs up, great!',
    cancelButtonText: '<i class="fa fa-thumbs-down"></i>',
    cancelButtonAriaLabel: 'Thumbs down',
  });
};
const Confirm = async (
  title: 'Estas seguro?',
  message = 'ok',
  callback?: any
) => {
  Swal.fire({
    title: title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    backdrop: false
  }).then((result) => {
    if (callback) {
      callback(result);
    }
  });
};

export default {
  Ok,
  Error,
  Info,
  Confirm,
};
