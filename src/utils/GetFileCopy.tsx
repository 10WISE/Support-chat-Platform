import _axios from '../api/AxiosConfig';
import _axios_ from '../api/AxiosConfigConnect';
import https from 'mixins/https';

const dataToFile = (file: any, filename: string, mime: string) => {
  var bstr = atob(file),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const getFile2Copy = async (ev: any, loggedUser: any, ticketSelected: any) => {
  let currentFile = ev.dataTransfer.getData('text');
  let nameFile = ev.dataTransfer.getData('name');
  if (currentFile) {
    const file = await https.GetConnect(`copy_file`, {
      name: currentFile,
    });
    if (file.code == '1') {
      var newFile = dataToFile(
        file.data.file,
        file.data.name,
        file.data.mimetype
      );
    }
    let metadata = {
      type: 'image/*',
    };
    let fileTemp = new File([newFile], nameFile, metadata);
    var formData = new window.FormData();
    formData.append('files[]', fileTemp);
    formData.append('meeting', ticketSelected?.conversation?.idConversation);
    formData.append('idBpm', loggedUser.userInfo.idUser);
    formData.append('description', '_s');
    const data = await https.PostConnect(`Upload`, formData);
    return data;
  }
};

export default {
  getFile2Copy,
};
