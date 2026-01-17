import * as React from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { CirclePicker } from 'react-color';
import {Box, createTheme} from '@mui/material'
import { useEffect, useState, useRef } from 'react';
import {
  ProjectL,
  StickyNotes as StickyNotesHADS,
  ProductL,
} from 'utils/HADSObjectsLocal';
type StickyNotes = StickyNotesHADS & { isNew: string; tipoSticky: number };
import { useSelector } from 'slices';
import * as _ from 'lodash';

/**
 * ICONS
 */
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NoteIcon from '@mui/icons-material/Note';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import Swal from 'sweetalert2';
import { blue, green, purple } from '@mui/material/colors';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  AppBar,
  Tabs,
  Tab,
  Typography,
  DialogProps,
  Tooltip,
  Zoom,
  Fab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  TextareaAutosize,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';

import ProgressCircular from 'utils/ProgressCircular';
import { DropzoneArea } from 'react-mui-dropzone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const fabStyle = {
      animation: `$flicker`,
      animationDuration: '1s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
      '@-moz-keyframes flicker': {
        '0%': { opacity: 1.0 },
        '50%': { opacity: 0.0 },
        '100%': { opacity: 1.0 },
      },
      '@-webkit-keyframes flicker': {
        '0%': { opacity: 1.0 },
        '50%': { opacity: 0.0 },
        '100%': { opacity: 1.0 },
      },
      '@keyframes flicker': {
        '0%': { opacity: 1.0 },
        '50%': { opacity: 0.0 },
        '100%': { opacity: 1.0 },
      },
      color: 'common.white',
      backgroundColor: green[500],
      '&:hover': {
      backgroundColor: green[600],
      }
}as const;
/*************************************** NOTES LIST ***************************************/
interface NotesListProps {
  notes: StickyNotes[];
  callbackPage: any;
  setFavorite: any;
  noteType: number;
  handleOpenEditSticky: any;
  handleOpenModalDeleteSticky: any;
  handleopenImage: any;
  setValue: any;
  value: any;
  hasProfile: any;
}
const StickyNoteList = (props: NotesListProps) => {
  const {
    notes,
    callbackPage,
    setFavorite,
    noteType,
    handleOpenEditSticky,
    handleOpenModalDeleteSticky,
    handleopenImage,
    setValue,
    value,
    hasProfile,
  } = props;


  const pdf = 'data:application/pdf;';

  const covertToPdf = (file: any) => {
    var fixFile = file.slice(28, file.length);
    let pdfWindow = window.open('');
    pdfWindow.document.write(
      "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
        encodeURI(fixFile) +
        "'></iframe>"
    );
  };

  return (
    <>
      <Grid sx={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridAutoRows: 'minmax(100px, auto)',
          gridAutoColumns: 'auto',
          overflowY: 'scroll',
          maxHeight: '400px',
          minHeight: '150px',
          scrollBehavior: 'smooth',
          marginTop: '10px',
        }} 
        id="notes-list"
      >
        {notes &&
          notes.map((note: StickyNotes, key: any) => (
            <Card
              key={key}
              sx={{
                borderRadius: '10px',
                padding: '1rem',
                minHeight: '170px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                marginTop: '5px'
              }}
              style={{ background: note.colorSticky }}
            >
              <Typography sx={{color: '#101010'}} component="div">
                <b>
                  {note.idSticky + '.'} {note.titleSticky}
                </b>
                {hasProfile ? (
                  <EditIcon
                    sx={{float: 'right',color: '#101010'}}
                    cursor="pointer"
                    onClick={() => {
                      handleOpenEditSticky(note);
                    }}
                  ></EditIcon>
                ) : (
                  noteType === 2 && (
                    <EditIcon
                      sx={{float: 'right',color: '#101010'}}
                      cursor="pointer"
                      onClick={() => {
                        handleOpenEditSticky(note);
                      }}
                    ></EditIcon>
                  )
                )}
                {note.isNew?.length == 0 && (
                  <Chip
                    label="new"
                    //color="primary"
                    size="small"
                    style={{
                      float: 'right',
                      backgroundColor: '#40D664',
                      borderStyle: 'solid',
                      borderColor: '#EBF3ED',
                    }}
                  />
                )}
              </Typography>
              <TextareaAutosize
                key={note.idSticky}
                style={{ backgroundColor: note.colorSticky, border: 'none',resize: 'none' }}
                readOnly={true}
                value={note.bodySticky}
                maxRows={6}
              ></TextareaAutosize>
              {note.filesSticky[0].file !== '' &&
              note.filesSticky[0].file.includes(pdf) ? (
                <>
                  <Tooltip title={`${note.filesSticky[0].name}`}>
                    <PictureAsPdfIcon
                      name={note.filesSticky[0].name}
                      onClick={() => {
                        covertToPdf(note.filesSticky[0].file);
                      }}
                      cursor="pointer"
                      style={{ color: '#101010' }}
                    ></PictureAsPdfIcon>
                  </Tooltip>
                </>
              ) : (
                note.filesSticky[0].file !== '' && (
                  <Button
                    onClick={() => {
                      ///var url = note.filesSticky[0].file;
                      var name = note.filesSticky[0].name;
                      handleopenImage(note.filesSticky[0].file, name);
                    }}
                    src={note.filesSticky[0].file}
                    style={{ height: '30px', width: '30px' }}
                  ></Button>
                )
              )}
              <Button className="note-footer" id="footer">
                <FileCopyIcon
                  cursor="pointer"
                  fontSize="small"
                  onClick={() => {
                    callbackPage(note.bodySticky);
                    setFavorite(note);
                  }}
                  style={{ color: '#101010' }}
                ></FileCopyIcon>
                {hasProfile ? (
                  <DeleteIcon
                    cursor="pointer"
                    onClick={() => {
                      handleOpenModalDeleteSticky(note);
                    }}
                    style={{ color: '#101010' }}
                  ></DeleteIcon>
                ) : (
                  noteType === 2 && (
                    <DeleteIcon
                      cursor="pointer"
                      onClick={() => {
                        handleOpenModalDeleteSticky(note);
                      }}
                      style={{ color: '#101010' }}
                    ></DeleteIcon>
                  )
                )}
              </>
            </Card>
          ))}
      </Grid>
    </>
  );
};
/***************************************END NOTES LIST ***************************************/

/*************************************** ADD STICKY NOTES ***************************************/
interface AddStickyNotesDialogProps {
  dataAddStickyNotes: StickyNotes;
  setDataAddStickyNotes: any;
  setSelectFilter: any;
  setButtonAdd: any;
  setSelectProject: any;
  handleSubmit: any;
  Add: any;
  setAdd: any;
  value: any;
  setValue: any;
  TitleForm: any;
  noteType: number;
  hasProfile: any;
}

const AddStickyNotes = (props: AddStickyNotesDialogProps) => {
  const {
    dataAddStickyNotes,
    setDataAddStickyNotes,
    setSelectFilter,
    setButtonAdd,
    setSelectProject,
    handleSubmit,
    Add,
    setAdd,
    value,
    setValue,
    TitleForm,
    noteType,
    hasProfile,
  } = props;

  return (
    <Box sx={{overflowY: 'scroll',maxHeight: '400px',minHeight: '150px',}}>
      <ValidatorForm onSubmit={handleSubmit}>
        <Typography
          id="alert-dialog-title"
          sx={{textAlign: 'center'}}
          style={{}}
        >
          {TitleForm ? (
            <b>{`Crear StickyNotes `}</b>
          ) : (
            <b>{`Editar StickyNotes `}</b>
          )}
        </Typography>

        <AddStickyNotesForm
          dataAddStickyNotes={dataAddStickyNotes}
          setDataAddStickyNotes={setDataAddStickyNotes}
          Add={Add}
          noteType={noteType}
          hasProfile={hasProfile}
        />
        <Button
          onClick={() => {
            setAdd(false);
            setValue({
              ...value,
              pos: value.pos,
            });
            setSelectFilter(true);
            setButtonAdd(true);
            setSelectProject(true);
          }}
          style={{ float: 'right', color: '#101010' }}
        >
          Cancelar
        </Button>
        <Button type="submit" style={{ float: 'right', color: '#101010' }}>
          Guardar
        </Button>
      </ValidatorForm>
    </Box>
  );
};
/*************************************** END ADD STICKY NOTES ***************************************/

/*************************************** ADD STICKY NOTES FORM ***************************************/
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
    hasProfile,
  } = props;

  const [openProjects, setOpenProjects] = useState(false);
  const [projects, setProjects] = useState<ProjectL[]>([]);
  const [showSelectProjects, setShowSelectProjects] = useState(false);

  useEffect(() => {
    if (2 == dataAddStickyNotes.tipoSticky) {
      setShowSelectProjects(true);
    }
  }, []);

  const handleSetColor = (color: any) => {
    setDataAddStickyNotes({
      ...dataAddStickyNotes,
      colorSticky: color.hex,
    });
  };
  useEffect(() => {
    if (hasProfile) {
      try {
        let url = `api/StickyNotes/proyectos/0`;
        axios
          .get(url)
          .then((res) => {
            if ('1' == res.data.code) {
              setProjects(res.data.data);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
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
        console.error(error);
      }
    }
  };
  const handleClickProject = () => {
    setOpenProjects(true);
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
                  height: '30px',
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
                <MenuItem
                  value={2}
                  onClick={() => {
                    handleClickProject;
                  }}
                >
                  Nota Proyecto
                </MenuItem>
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
                  //disabled
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
        </Grid>
      </CardContent>
      <Divider />
    </Card>
  );
};

/*************************************** END STICKY NOTES FORM ***************************************/

const muiTheme = createTheme({
  components: {
    MuiDialog: {
      styleOverrides:{
      root: {
        //position: 'initial !important',
        inset: 'initial !important',
        display: 'contents',
      },
      container: {
        height: 'auto',
      },
    }
    },
    MuiBackdrop: {
      styleOverrides:{
      root: {
        top: 'initial !important',
        left: 'initial !important',
      },
    }
    },
  },
});

interface selectObject {
  id: string;
  name: string;
}

interface StickyNotesDialogProps {
  open: boolean;
  setOpenModalStickyNotesV3: React.Dispatch<React.SetStateAction<boolean>>;
  callbackPage: any;
}

const StickyNotesDialogExternal = (props: StickyNotesDialogProps) => {
  const { open, setOpenModalStickyNotesV3, callbackPage } = props;
  const [value, setValue] = React.useState({ pos: 0 });
  const [Progress, setProgress] = useState(false);
  const [order, setOrder] = React.useState<{ fav: boolean; perso: boolean }>({
    fav: false,
    perso: false,
  });
  const [FilterProduct, setFilterProduct] = useState<{
    idProduct: number;
    name: string;
  }>({
    idProduct: 0,
    name: '',
  });
  const [FilterProject, setFilterProject] = useState<{
    idProject: number;
    name: string;
  }>({
    idProject: 0,
    name: '',
  });
  const [OpenImg, setOpenImg] = React.useState<{ url: string; name: string }>({
    url: '',
    name: '',
  });
  const [Add, setAdd] = React.useState(false);
  const [ButtonAdd, setButtonAdd] = React.useState(true);
  const [SelectFilter, setSelectFilter] = React.useState(true);
  const [selectProject, setSelectProject] = React.useState(true);
  const [TitleForm, setTitleForm] = React.useState(true);
  const [closeFab, setCloseFab] = React.useState(false);
  const [OpenFilter, setOpenFilter] = React.useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const [dataStickyNotes, setDataStickyNotes] = useState<StickyNotes[]>([]);
  const [dataAddStickyNotes, setDataAddStickyNotes] =
    useState<StickyNotes>(null);
  const [dataEditing, setDataEditing] = useState<StickyNotes>(null);
  const [dataFavsStickyNotes, setDataFavsStickyNotes] =
    useState<StickyNotes[]>(null);
  const [items, setItems] = useState<StickyNotes[]>([]);

  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

  const { ticketSelected, loggedUser } = useSelector((state) => state.app);

  const refDialog = React.useRef(null);

  const searchSticky = React.useRef(null);

  const [stickNotesFilter, setStickNotesFilter] = useState<StickyNotes[]>(null);

  const [products, setProducts] = useState<ProductL[]>([]);
  const [projects, setProjects] = useState<ProjectL[]>([]);

  const handleChangeTabs = (event: React.ChangeEvent<{}>, noteList: any) => {
    setValue({ ...value, pos: noteList });
    setAdd(false);
    setOrder({ ...order, fav: false, perso: false });
    setSelectFilter(true);
    setButtonAdd(true);
    setSelectProject(true);
  };
  const handleChangeFilter = (event: any) => {
    setValue({
      ...value,
      pos: value.pos,
    });
    setFilterProject({
      ...FilterProject,
      idProject: 0,
      name: '',
    });
    event.persist();
    setFilterProduct({
      ...FilterProduct,
      idProduct: event.target.value,
      name: event.target.name,
    });
  };
  useEffect(() => {
    try {
      setProgress(false);
      setProjects();   
    } catch (error) {}
  }, [FilterProduct]);

  const handleChangeSelectProject = (event: any) => {
    event.persist();
    setFilterProject({
      ...FilterProject,
      idProject: event.target.value,
      name: event.target.name,
    });
    setValue({
      ...value,
      pos: value.pos,
    });
  };

  const handleSetUsados = async (note: StickyNotes) => {
    try {
      let url = `api/StickyNotes/usados/${note}/update`;
      axios
        .post(url, note)
        .then((res) => {
          if ('1' == res.data.code) {
            setProgress(false);
            setValue({
              ...value,
              pos: value.pos,
            });
          }
        })
        .finally(() => {
          setProgress(false);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {}
  };

  const handleGetFavorite = async () => {
    try {
      let url = `api/StickyNotes/favoritos/`;
      axios
        .get(url)
        .then((res) => {
          if ('1' == res.data.code) {
            var obj: StickyNotes[] = res.data.data;
            setProgress(false);
            setDataFavsStickyNotes(obj);
            setValue({
              ...value,
              pos: value.pos,
            });
          }
        })
        .finally(() => {
          setProgress(false);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {}
  };

  useEffect(() => {
    try {
      if (loggedUser.userInfo.idUser) {
        let url = `api/StickyNotes/perfil/${loggedUser.userInfo.idUser}`;
        axios
          .get(url)
          .then((res) => {
            if ('1' == res.data.code) {
              var obj: any = res.data.data;
              res.data.data === '1'
                ? setHasProfile(true)
                : setHasProfile(false);
            }
          })
          .finally(() => {
            setProgress(false);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } catch (error) {}
  }, [loggedUser.userInfo]);

  useEffect(() => {
    try {
      if (document.getElementsByClassName('MuiDialog-container').length > 0) {
        document
          .getElementsByClassName('MuiDialog-container')[0]
          .removeAttribute('tabindex');
      }
    } catch (error) {}
  });

  const handleClickAdd = () => {
    setAdd(true);
    setOrder({ ...order, fav: false, perso: false });
    setTitleForm(true);
    setButtonAdd(false);
    setSelectFilter(false);
  };

  const handleClickOrderFavorite = () => {
    handleGetFavorite();
    setAdd(false);
    setOrder({ ...order, fav: true });
    setButtonAdd(true);
    setSelectFilter(true);
  };

  const handleClickSave = () => {
    setProgress(true);
    setOrder({ ...order, fav: false, perso: false });
    setButtonAdd(true);
    setSelectFilter(true);

    try {
      let url = `api/StickyNotes/personales/update/order`;

      axios
        .post(url, dataStickyNotes)
        .then((res) => {
          if ('1' == res.data.code) {
            setProgress(false);
            Swal.fire({
              title: 'Buen trabajo!',
              html: res.data.message,
              icon: 'success',
              // showCancelButton: false,
              confirmButtonText: 'Aceptar',
              // cancelButtonText: 'No, cancel!',
              reverseButtons: true,
            }).then((result: any) => {
              if (result.isConfirmed) {
                setOrder({ ...order, fav: false, perso: false });
              }
            });
          }
        })
        .finally(() => {
          setProgress(false);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {}
  };

  useEffect(() => {
    try {
      setProgress(true);
      let url = '';
      if (value.pos === 0) {
        url = `api/StickyNotes/generales/`;
      } else if (value.pos === 2) {
        url = `api/StickyNotes/personales/${loggedUser.userInfo.idUser}`;
      } else if (value.pos === 1 && FilterProject.idProject == 0) {
        url = `api/StickyNotes/2/type`;
      } else url = `api/StickyNotes/project/${FilterProject.idProject}`;

      axios
        .get(url)
        .then((res) => {
          if ('1' === res.data.code) {
            var obj: StickyNotes[] = res.data.data;
            setProgress(false);
            setDataStickyNotes(obj);
          }
        })
        .finally(() => {
          setProgress(false);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }, [value]);

  useEffect(() => {
    if (searchSticky.current) {
      const filterStickResults: StickyNotes[] = dataStickyNotes.filter(
        (item) => {
          return (
            item.titleSticky
              .toLowerCase()
              .includes(searchSticky.current.value.toLowerCase()) ||
            item.bodySticky
              .toLowerCase()
              .includes(searchSticky.current.value.toLowerCase()) ||
            item.idSticky
              .toLowerCase()
              .includes(searchSticky.current.value.toLowerCase())
          );
        }
      );
      setStickNotesFilter(filterStickResults);
    }
  }, [dataStickyNotes]);

  useEffect(() => {
    try {
      let url = `api/StickyNotes/productos/${1}`;
      axios
        .get(url)
        .then((res) => {
          setProducts(res.data.data);
        })
        .catch((error) => console.error(error));
    } catch (error) {}
  }, []);

  const handleOpenModalEditSticky = (note: StickyNotes) => {
    setDataAddStickyNotes({
      ...dataAddStickyNotes,
      userInfo: loggedUser.userInfo,
      idSticky: note.idSticky,
      titleSticky: note.titleSticky,
      bodySticky: note.bodySticky,
      colorSticky: note.colorSticky,
      filesSticky: note.filesSticky,
      tipoSticky: note.tipoSticky,
      project: note.project,
    });
    setDataEditing({
      ...dataEditing,
      userInfo: loggedUser.userInfo,
      idSticky: note.idSticky,
      titleSticky: note.titleSticky,
      bodySticky: note.bodySticky,
      colorSticky: note.colorSticky,
      filesSticky: note.filesSticky,
      tipoSticky: note.tipoSticky,
      project: note.project,
    });
    handleClickAdd();
    setTitleForm(false);
    setSelectProject(false);
  };

  const handleOpenModalDeleteSticky = (note: StickyNotes) => {
    handleConfirm(note);
  };

  const handleopenImage = (url: string, name: string) => {
    Swal.fire({
      title: `${name}`,
      imageUrl: `${url}`,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: `${name}`,
    });
  };

  const handleClickBack = () => {
    order.perso &&
      (setOrder({ ...order, fav: false, perso: false }),
      setButtonAdd(true),
      setSelectFilter(true));
  };

  const handleOpenSelect = () => {
    setOpenFilter(true);
  };

  const handleCloseSelect = () => {
    setOpenFilter(false);
  };

  const handleSubmit = () => {
    if (JSON.stringify(dataEditing) == JSON.stringify(dataAddStickyNotes)) {
      Swal.fire({
        title: 'Atencion!',
        text: `No has modificado la nota ${dataAddStickyNotes.idSticky} `,
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      }).then((result: any) => {
        if (result.isConfirmed) {
          setAdd(false);
          setValue({
            ...value,
            pos: value.pos,
          });
          setSelectFilter(true);
          setButtonAdd(true);
          setSelectProject(true);
        }
      });
    } else {
      try {
        let url;
        if (dataAddStickyNotes.idSticky.length > 0) {
          url = `api/StickyNotes/personales/${dataAddStickyNotes.idSticky}/update/`;
        } else {
          url = `api/StickyNotes/personales/`;
        }
        axios
          .post(url, dataAddStickyNotes)
          .then((res) => {
            if ('1' == res.data.code) {
              setAdd(false);
              setValue({
                ...value,
                pos: value.pos,
              });
              setSelectFilter(true);
              setButtonAdd(true);
              setSelectProject(true);
            }
          })
          .finally(() => {})
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleConfirm = async (note: StickyNotes) => {
    try {
      setProgress(true);
      let url = `api/StickyNotes/personales/${note.idSticky}/delete`;
      axios
        .post(url)
        .then((res) => {
          if ('1' == res.data.code) {
            setProgress(false);
            const arr = dataStickyNotes.filter(
              (obj) => obj.idSticky !== note.idSticky
            );
            setDataStickyNotes(arr);
          }
        })
        .finally(() => {
          setProgress(false);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const reorder = (list: any, startIndex: any, endIndex: any) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const getItemStyle = (
    isDragging: any,
    draggableStyle: any,
    colorSticky: any
  ) => ({
    ...draggableStyle,

    ...(isDragging && {
      background: colorSticky,
    }),

    ...(true && {
      background: colorSticky,
    }),
  });

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const itemss: any = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(itemss);
  };
  useEffect(() => {
    setItems(dataStickyNotes);
  }, [dataStickyNotes]);

  const fabs = [
    {
      color: 'inherit' as 'inherit',
      icon: <NoteIcon />,
      label: 'Maximizar',
    },
  ];


  const HelpText = 'Arrastra la nota hasta la posición que desees';

  return (
    <>
      {open && (
        <>
          <DialogTitle
            sx={{backgroundColor: '#5BC892'}}
            style={{ cursor: 'move' }}
            id="draggable-dialog-title"
            ref={refDialog}
          >
            <Typography sx={{float: 'inline-start', color: '#ffffff', fontSize: '2',}}>Sticky Notes</Typography>
          </DialogTitle>
          <DialogContent
            id="content"
            dividers={scroll === 'paper'}
          >
            <AppBar position="static">
              <Tabs
                value={value.pos}
                onChange={handleChangeTabs}
                aria-label="Sticky Notes"
                centered
                sx={{backgroundColor: '#5BC892'}}
              >
                <Tab label="Generales" style={{ color: '#000000' }} />
                <Tab label="Proyecto" style={{ color: '#000000' }} />
                <Tab label="Personales" style={{ color: '#000000' }} />
              </Tabs>
            </AppBar>
            <Typography
              component="div"
              //style={{ padding: 8 * 3 }}
              id="buttons-body"
              sx={{
                paddingLeft: '24px',
                paddingRight: '24px',
                paddingBottom: '4px',
                paddingTop: '4px'
              }}
            >
              {value.pos === 1 && selectProject && (
                <>
                  <Typography>
                    <b>Notas de Proyectos</b>
                  </Typography>
                  <ValidatorForm
                    onSubmit={() => {}}
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      color: '#101010'
                    }}
                  >
                    <TextValidator
                      id="select-product"
                      sx={{
                        marginRight: '15px',
                        marginTop: '5px'
                      }}
                      select
                      value={FilterProduct.idProduct}
                      name={FilterProduct.name}
                      onChange={handleChangeFilter}
                      label={
                        <Typography component={'span'} sx={{color: '#A1A2A4'}}>
                          Filtrar Producto
                        </Typography>
                      }
                      helperText={
                        <Typography component={'span'} sx={{color: '#A1A2A4'}}>
                          Selecciona una opcion
                        </Typography>
                      }
                      validators={['required']}
                      errorMessages={['Campo requerido']}
                    >
                      {products.map((option: ProductL) => (
                        <MenuItem
                          key={option.idProduct}
                          value={option.idProduct}
                          style={{ color: '#101010', backgroundColor: '#fff' }}
                        >
                          {
                            <span style={{ color: '#101010' }}>
                              {option.nameProduct}
                            </span>
                          }
                        </MenuItem>
                      ))}
                    </TextValidator>
                    <TextValidator
                      id="select-project"
                      sx={{
                        marginRight: '15px',
                        marginTop: '5px'
                      }}
                      //fullWidth
                      select
                      value={FilterProject.idProject}
                      name={FilterProject.name}
                      onChange={handleChangeSelectProject}
                      label={
                        <Typography component={'span'} sx={{color: '#A1A2A4'}}>
                          Filtrar Proyecto
                        </Typography>
                      }
                      helperText={
                        <Typography component={'span'} sx={{color: '#A1A2A4'}}>
                          Selecciona una opcion
                        </Typography>
                      }
                      validators={['required']}
                      errorMessages={['Campo requerido']}
                    >
                      {projects.map((option: ProjectL) => (
                        <MenuItem
                          key={option.idProject}
                          value={option.idProject}
                          style={{ color: '#101010', backgroundColor: '#fff' }}
                        >
                          {
                            <span style={{ color: '#101010' }}>
                              {option.name}
                            </span>
                          }
                        </MenuItem>
                      ))}
                    </TextValidator>
                  </ValidatorForm>
                </>
              )}
              {value.pos === 2 && (
                <>
                  {order.perso && (
                    <>
                      <Button
                        sx={{
                          backgroundColor: '#5CB85C',
                          '&:hover': {
                          backgroundColor: '#9bd081',
                          },
                          fontColor: '#fffff',
                          marginRight: '5px',
                           marginBottom: '4px'
                      }}
                        variant="contained"
                        onClick={() => {
                          handleClickSave();
                        }}
                      >
                        Guardar
                        <SaveIcon />
                      </Button>

                      <Button
                        sx={{
                          backgroundColor: '#FF4256',
                          '&:hover': {
                            backgroundColor: '#FD5F70',
                          },
                          fontColor: '#fffff',
                          marginRight: '5px',
                          marginBottom: '7px'
                        }}
                        variant="contained"
                        onClick={() => {
                          handleClickBack();
                        }}
                      >
                        Atras
                        <ArrowBackIcon />
                      </Button>
                      <Tooltip title={HelpText}>
                        <HelpOutlineIcon />
                      </Tooltip>
                    </>
                  )}
                  {ButtonAdd && (
                    <Button
                      sx={{
                        backgroundColor: '#5CB85C',
                        '&:hover': {
                          backgroundColor: '#9bd081',
                        },
                        fontColor: '#fffff',
                        marginRight: '5px',
                        marginBottom: '4px',
                      }}
                      variant="contained"
                      onClick={() => {
                        handleClickAdd();
                        setDataAddStickyNotes({
                          ...dataAddStickyNotes,
                          userInfo: loggedUser.userInfo,
                          idSticky: '',
                          titleSticky: '',
                          bodySticky: '',
                          colorSticky: '',
                          filesSticky: [],
                          tipoSticky: 3,
                        });
                      }}
                    >
                      Agregar Nota
                      <AddIcon />
                    </Button>
                  )}
                  {SelectFilter && (
                    <FormControl sx={{display: 'inline-flex', height: '30px'}}>
                      <InputLabel id="label-filter">Ordenar por</InputLabel>
                      <Select
                        sx={{
                          float: 'inline-start',
                          margin: 1,
                          minWidth: 120,
                          height: '15px'
                        }}
                        labelId="label-filter"
                        open={OpenFilter}
                        onClose={handleCloseSelect}
                        onOpen={handleOpenSelect}
                      >
                        <MenuItem onClick={handleClickOrderFavorite}>
                          <StarBorderIcon /> Favoritos
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </>
              )}
            </Typography>
            <Typography
              component="div"
              id="body-sticky-modal"
              sx={{
                paddingLeft: '24px',
                paddingRight: '24px',
                paddingBottom: '4px',
                paddingTop: '4px'
              }}
            >
              {Add ? (
                <AddStickyNotes
                  dataAddStickyNotes={dataAddStickyNotes}
                  setDataAddStickyNotes={setDataAddStickyNotes}
                  setSelectFilter={setSelectFilter}
                  setButtonAdd={setButtonAdd}
                  setSelectProject={setSelectProject}
                  handleSubmit={handleSubmit}
                  Add={Add}
                  setAdd={setAdd}
                  value={value}
                  setValue={setValue}
                  TitleForm={TitleForm}
                  noteType={value.pos}
                  hasProfile={hasProfile}
                ></AddStickyNotes>
              ) : order.perso ? (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <List 
                          sx={{
                            maxHeight: '40vh',
                            overflow: 'auto',
                            paddingLeft: '10px'
                          }} 
                          ref= {provided.innerRef}
                        >
                          {items.map((item, index) => (
                            <Draggable
                              key={item.idSticky}
                              draggableId={item.idSticky}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <ListItem
                                  sx={{
                                    boxShadow: '10px 1px #A3A8FA',
                                    padding: '10px',
                                    borderLeft: '5px solid',
                                    borderLeftColor: '#576197',
                                    borderTop: '2px'
                                  }}
                                  ContainerComponent="li"
                                  ContainerProps={{ ref: provided.innerRef }}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style,
                                    item.colorSticky
                                  )}
                                >
                                  <ListItemIcon>
                                    <NoteIcon sx={{float: 'left'}}>
                                      {' '}
                                    </NoteIcon>
                                    <b>{index}</b>
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={item.idSticky}

                                    // secondary={item.secondary}
                                  />
                                  <ListItemSecondaryAction>
                                    {<b>{item.titleSticky}</b>}
                                  </ListItemSecondaryAction>
                                </ListItem>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </List>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : order.fav ? (
                <StickyNoteList
                  notes={dataFavsStickyNotes}
                  callbackPage={callbackPage}
                  setFavorite={(note: StickyNotes) => {
                    handleSetUsados(note);
                  }}
                  noteType={value.pos}
                  handleOpenEditSticky={(note: StickyNotes) => {
                    handleOpenModalEditSticky(note);
                  }}
                  handleOpenModalDeleteSticky={(note: StickyNotes) => {
                    handleOpenModalDeleteSticky(note);
                  }}
                  handleopenImage={(urlImage: string, nameImage: string) => {
                    setOpenImg({
                      ...OpenImg,
                      url: urlImage,
                      name: nameImage,
                    });
                  }}
                  setValue={setValue}
                  value={value}
                  hasProfile={hasProfile}
                ></StickyNoteList>
              ) : value.pos === 1 ? (
                <StickyNoteList
                  notes={stickNotesFilter}
                  callbackPage={callbackPage}
                  setFavorite={(note: StickyNotes) => {
                    handleSetUsados(note);
                  }}
                  noteType={value.pos}
                  handleOpenEditSticky={(note: StickyNotes) => {
                    handleOpenModalEditSticky(note);
                  }}
                  handleOpenModalDeleteSticky={(note: StickyNotes) => {
                    handleOpenModalDeleteSticky(note);
                  }}
                  handleopenImage={(urlImage: string, nameImage: string) => {
                    handleopenImage(urlImage, nameImage);
                  }}
                  setValue={setValue}
                  value={value}
                  hasProfile={hasProfile}
                ></StickyNoteList>
              ) : (
                <StickyNoteList
                  notes={stickNotesFilter}
                  callbackPage={callbackPage}
                  setFavorite={(note: StickyNotes) => {
                    handleSetUsados(note);
                  }}
                  noteType={value.pos}
                  handleOpenEditSticky={(note: StickyNotes) => {
                    handleOpenModalEditSticky(note);
                  }}
                  handleOpenModalDeleteSticky={(note: StickyNotes) => {
                    handleOpenModalDeleteSticky(note);
                  }}
                  handleopenImage={(urlImage: string, nameImage: string) => {
                    handleopenImage(urlImage, nameImage);
                  }}
                  setValue={setValue}
                  value={value}
                  hasProfile={hasProfile}
                ></StickyNoteList>
              )}
            </Typography>
          </DialogContent>
          <DialogActions></DialogActions>
        </>
      )}

      <ProgressCircular open={Progress} setOpen={setProgress} />
      {closeFab &&
        fabs.map((fab, index) => (
          <Zoom
            key={fab.color}
            in={0 === index}
            unmountOnExit
          >
            <Tooltip title="Reanudar">
              <Fab
                aria-label={fab.label}
                sx={fabStyle}
                color={'secondary'}
                onClick={() => {
                  setOpenModalStickyNotesV3(true);
                  refDialog.current.style.display = 'block';
                }}
              >
                {fab.icon}
              </Fab>
            </Tooltip>
          </Zoom>
        ))}
    </>
  );
};

export default StickyNotesDialogExternal;
