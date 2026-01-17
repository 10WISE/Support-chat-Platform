import * as React from 'react';
import { TextValidator } from 'react-material-ui-form-validator';
import ReactQuill from 'react-quill';
import * as Quill from 'quill';
import { DropzoneArea } from 'react-mui-dropzone';
import { InjectBugDevops, File } from 'utils/HADSObjectsLocal';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import {
  Card,
  CardContent,
  Grid,
  Divider,
  MenuItem,
  colors,
  Typography,
} from '@mui/material';


const previewChip ={
  minWidth: 160,
  maxWidth: 210,
}as const;

interface AddFormProps {
  dataAddBug: InjectBugDevops;
  setDataAddBug: React.Dispatch<React.SetStateAction<InjectBugDevops>>;
}

const AddBugForm = (props: AddFormProps) => {
  const { dataAddBug, setDataAddBug } = props;

  const handleChange = (event: any) => {
    event.persist();
    setDataAddBug({
      ...dataAddBug,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeReactQuillDescription = (
    content: string,
    delta: Quill.Delta,
    source: Quill.Sources,
    editor: any
  ) => {
    setDataAddBug({
      ...dataAddBug,
      description: content,
    });
  };

  const handleChangeReactQuillSteps = (
    content: string,
    delta: Quill.Delta,
    source: Quill.Sources,
    editor: any
  ) => {
    setDataAddBug({
      ...dataAddBug,
      step: content,
    });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image', 'pdf'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image'
  ];

  const labes = [
    { id: 'Producción', name: 'Producción' },
    { id: 'pruebas', name: 'Pruebas' },
  ];

  var filesTemp = [];

  const readAsDataURL = (file: any) => {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onerror = reject;
      fr.onload = function () {
        resolve(fr.result);
      };
      fr.readAsDataURL(file);
    });
  };

  const handleChangeFile = async (event: File[]) => {
    if (event.length > 0) {
      try {
        let dataTemp = [];
        for (let i = 0; i < event.length; ++i) {
          const file = event[i];
          const url = await readAsDataURL(file);
          dataTemp.push({ file: url.toString(), name: event[i].name });
        }
        setDataAddBug({
          ...dataAddBug,
          files: dataTemp,
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Error al generar binario de los archivos',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    }
  };

  return (
    <Card>
      <Divider />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            <TextValidator
              fullWidth
              label="Titulo del Bug"
              onChange={handleChange}
              placeholder="Escribe Titulo del Bug"
              minRows={2}
              value={dataAddBug.title}
              name={'title'}
              multiline
              inputProps={{ 'aria-label': '' }}
              validators={['required']}
              errorMessages={['Campo requerido']}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <TextValidator
              id="standard-select-currency"
              fullWidth
              select
              value={dataAddBug.label}
              name={'label'}
              onChange={handleChange}
              label="Etiqueta"
              helperText="Seleccione una opción"
              validators={['required']}
              errorMessages={['Campo requerido']}
            >
              {labes.map((option: any) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextValidator>
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography sx={{color : 'primary.main'}}>Repro Steps</Typography>
            <ReactQuill
              theme="snow"
              value={dataAddBug.step}
              onChange={handleChangeReactQuillSteps}
              modules={modules}
              formats={formats}
              placeholder={'Pasos del bug:'}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography sx={{color : 'primary.main'}}>System Info</Typography>
            <ReactQuill
              theme="snow"
              value={dataAddBug.description}
              onChange={handleChangeReactQuillDescription}
              modules={modules}
              formats={formats}
              placeholder={'Escribe descripcion del bug'}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <DropzoneArea
              showPreviews={true}
              showPreviewsInDropzone={false}
              useChipsForPreview
              previewGridProps={{
                container: { spacing: 1, direction: 'row' },
              }}
              previewText="Selected files"
              onChange={handleChangeFile}
              filesLimit={5}
              acceptedFiles={['application/pdf']}
              dropzoneText="Déjelo caer aquí los archivos pdf y/o click para adjuntar"
              onDelete={(event) => {
                let dataTemp = _.filter(dataAddBug.files, (item) => {
                  return item.name !== event.name;
                });
                setDataAddBug({
                  ...dataAddBug,
                  files: dataTemp,
                });
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
    </Card>
  );
};

export default AddBugForm;
