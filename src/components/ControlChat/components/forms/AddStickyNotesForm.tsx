import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Card,
  Divider,
  CardContent,
  Grid,
  MenuItem,
  Typography,
  Chip,
} from '@mui/material';
import { ProjectL, StickyNotes as StickyNotesHADS } from 'utils/HADSObjectsLocal';
type StickyNotes = StickyNotesHADS & { tipoSticky: number };
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { DropzoneArea } from 'react-mui-dropzone';
import { CirclePicker } from 'react-color';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import http from 'mixins/https';
import { setLoadingWait } from 'slices/app';
import { useDispatch } from 'react-redux';

interface AddStickyNotesProps {
  dataAddStickyNotes: StickyNotes;
  setDataAddStickyNotes: React.Dispatch<React.SetStateAction<StickyNotes>>;
  Add: any;
  noteType: number;
  hasProfile: any;
}

const AddStickyNotesForm = (props: AddStickyNotesProps) => {
  const {
    dataAddStickyNotes,
    setDataAddStickyNotes,
    Add,
    noteType,
    hasProfile,
  } = props;
  const [projects, setProjects] = useState<ProjectL[]>([]);
  const [showSelectProjects, setShowSelectProjects] = useState(false);

  const dispatch = useDispatch();

  const handleSetColor = (color: any) => {
    setDataAddStickyNotes({
      ...dataAddStickyNotes,
      colorSticky: color.hex,
    });
  };

  useEffect(() => {
    if (2 == dataAddStickyNotes.tipoSticky) {
      setShowSelectProjects(true);
    }
  }, []);

  useEffect(() => {
    if (hasProfile) {
      const fetchData = async () => {
        try {
          dispatch(setLoadingWait(true));
          const { data } = await http.GetHADS(`StickyNotes/proyectos/0`);
          setProjects(data);
          dispatch(setLoadingWait(false));
        } catch (error) {
          dispatch(setLoadingWait(false));
        }
      };
      fetchData();
    }
  }, []);

  const handleChange = (event: any) => {
    event.persist();
    setDataAddStickyNotes({
      ...dataAddStickyNotes,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeType = (event: any) => {
    if (2 == event.target.value) {
      setShowSelectProjects(true);
    } else {
      setShowSelectProjects(false);
    }
    event.persist();
    setDataAddStickyNotes({
      ...dataAddStickyNotes,
      tipoSticky: event.target.value,
    });
  };

  const handleChangeProject = (event: any) => {
    event.persist();
    setDataAddStickyNotes({
      ...dataAddStickyNotes,
      project: { idProject: event.target.value, name: '' },
    });
  };

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
        setDataAddStickyNotes({
          ...dataAddStickyNotes,
          filesSticky: dataTemp,
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
      <CardContent>
        <Grid container spacing={3}>
          {hasProfile && (
            <Grid item md={12} xs={12}>
              <TextValidator
                id="select-product"
                sx={{
                  display: 'inline-flex',
                  marginBottom: 6,
                  height: '30px'
                }}
                fullWidth
                select
                value={dataAddStickyNotes.tipoSticky}
                name={''}
                onChange={handleChangeType}
                label="Tipo Sticky Note"
                helperText={'Selecciona un tipo'}
                validators={['required']}
                errorMessages={['Campo requerido']}
              >
                <MenuItem value={1}>Nota General </MenuItem>
                <MenuItem value={2}>Nota Proyecto</MenuItem>
                <MenuItem value={3}>Nota Personal</MenuItem>
              </TextValidator>
              {showSelectProjects && (
                <TextValidator
                  id="select-product"
                  sx={{
                    display: 'inline-flex',
                    marginBottom: 6,
                    height: '30px'
                  }}
                  fullWidth
                  select
                  value={dataAddStickyNotes.project?.idProject}
                  name={dataAddStickyNotes.project?.name}
                  onChange={handleChangeProject}
                  label="Proyecto"
                  helperText={'Selecciona un proyecto (si es necesario)'}
                  validators={['required']}
                  errorMessages={['Campo requerido']}
                >
                  {projects.map((option: ProjectL) => (
                    <MenuItem key={option.idProject} value={option.idProject}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextValidator>
              )}
            </Grid>
          )}
          <Grid item md={12} xs={12}>
            <TextValidator
              fullWidth
              label="Titulo Sticky"
              onChange={handleChange}
              placeholder="Escribe Titulo del Sticky"
              minRows={1}
              name={'titleSticky'}
              value={dataAddStickyNotes.titleSticky}
              multiline
              inputProps={{ 'aria-label': '' }}
              validators={['required']}
              errorMessages={['Campo requerido']}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <TextValidator
              fullWidth
              label="Cuerpo Sticky"
              onChange={handleChange}
              placeholder="Escribe cuerpo del Sticky"
              minRows={5}
              name={'bodySticky'}
              value={dataAddStickyNotes.bodySticky}
              multiline
              inputProps={{ 'aria-label': '' }}
              validators={['required']}
              errorMessages={['Campo requerido']}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography>Color</Typography>
            <CirclePicker
              color={dataAddStickyNotes.colorSticky}
              onChangeComplete={handleSetColor}
            ></CirclePicker>
          </Grid>
          <Grid item md={12} xs={12}>
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
              filesLimit={1}
              acceptedFiles={['image/jpeg, image/png ,application/pdf']}
              dropzoneText="Déje caer aquí los archivos (pdf,Imagenes) y/o  click para adjuntar"
            />
            {dataAddStickyNotes.filesSticky.length >= 1 && (
              <Chip
                icon={<AttachFileIcon />}
                label={`${dataAddStickyNotes.filesSticky[0].name}`}
                //color="primary"
                size="medium"
                variant="outlined"
                style={{
                  marginTop: '2px',
                  float: 'left',
                  backgroundColor: '#F1F7F3',
                  borderStyle: 'solid',
                  borderColor: '#DCDDDC',
                }}
              />
            )}
          </Grid>
            {dataAddStickyNotes.filesSticky.length >= 1 && (
              <Chip
                icon={<AttachFileIcon />}
                label={`${dataAddStickyNotes.filesSticky[0].name}`}
                //color="primary"
                size="medium"
                variant="outlined"
                style={{
                  marginTop: '2px',
                  float: 'left',
                  backgroundColor: '#F1F7F3',
                  borderStyle: 'solid',
                  borderColor: '#DCDDDC',
                }}
              />
            )}
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
    </Card>
  );
};
export default AddStickyNotesForm;
