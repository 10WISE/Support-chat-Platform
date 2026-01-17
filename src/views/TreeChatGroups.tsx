import * as React from 'react';
import {Box} from '@mui/material'
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps } from '@mui/lab/TreeItem';
import Label from '@mui/icons-material/Label';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import {
  setTicketSelectedProject,
  updateLoggedUser,
  setLoadingWait,
} from 'slices/app';
import { useDispatch } from 'react-redux';
import * as _ from 'lodash';
import ConnectHub from 'ConnectHub';

import { useSelector } from 'slices';

import { Typography, Badge, SvgIconProps, Button } from '@mui/material';

import { ProductL } from 'utils/HADSObjectsLocal';

declare module 'csstype' {
  interface Properties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

const content = {
  color: '#7BB7FA',
  borderTopRightRadius: 2,
  borderBottomRightRadius: 2,
  paddingRight: 1,
  fontWeight: 'typography.fontWeightMedium',
  '$expanded > &': {
    fontWeight: 'typography.fontWeightRegular',
  },
}as const;


type GroupChatProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon?: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText: string;
  index: number;
  item?: any;
  tkSelected?: boolean;
  themeMode: string;
};

const GroupChat = (props: GroupChatProps) => {

  const {
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    color,
    bgColor,
    index,
    item,
    tkSelected,
    themeMode,
    ...other
  } = props;

  return (
    <TreeItem
      label={
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          color: themeMode === 'dark' ? '#7BB7FA' : '#101010'
      }}>
          {LabelIcon !== undefined && <LabelIcon sx={{marginRight: 1, color: themeMode === 'dark' ? '#7BB7FA' : '#101010'}} />}
          <Typography
            variant="body2"
            sx={{fontWeight: 'inherit'}}
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '8.5rem',
              fontSize: '8pt',
              color: themeMode === 'dark' ? '#FFF' : '#101010'
            }}
          >
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
            <Badge
              sx={{zIndex: 1}}
              color={'error'}
              overlap="circular"
              invisible={
                item?.conversation?.unreadMessagesCount > 0 ? false : true
              }
              badgeContent={item?.conversation?.unreadMessagesCount}
            />
          </Typography>
        </Box>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      sx={{
        width:{
          xs : '90px',
          sm : '100px',
          md: '110px',
          lg: '125px',
          xl : '160px'
        },
        color: themeMode === 'dark' ? '#7BB7FA' : '#101010',
        content: content,
        group: {
                  marginLeft: 0,
                  '& $content': {
                    paddingLeft: 2,
                  },
                },
        label: {
          fontWeight: 'inherit',
          color: themeMode === 'dark' ? '#7BB7FA' : '#101010'
        },
      }}
      {...other}
    />
  );
};

interface TreeChatGroupsProps {
  themeMode: string;
}

const TreeChatGroups = (props: TreeChatGroupsProps) => {
  const { themeMode } = props;
  const dispatch = useDispatch();

  const {
    loggedUser,
    ticketSelectedProject,
    ticketSelected
  } = useSelector((state) => state.app);
  const isConnected = useSelector((state) => state.connectHub.isConnected);

  const refTree = React.useRef<HTMLInputElement>(null);

  const [pos, setPos] = React.useState('0');
  const [posChildren, setPosChildren] = React.useState('0');
  const [expanded, setExpanded] = React.useState([]);
  
  React.useEffect(() => {
    loggedUser.products.map((product: ProductL, i) => {
      product.projects.map((project, j) => {
        if (
          project.conversation.idConversation ==
          ticketSelectedProject?.conversation.idConversation
        ) {
          setPos(i.toString());
          setPosChildren(i.toString() + j.toString());
        }
      });
    });
  }, [
    open,
    ticketSelectedProject?.conversation.idConversation,
    loggedUser.products[0].projects[0].conversation.idConversation,
  ]);

  const handleClick = (item: ProductL, index: number, i: number) => {
    if (isConnected) {
      try {
        if (
          ticketSelectedProject?.conversation.idConversation !=
          item.projects[index].conversation.idConversation
        ) {
          let obj = {
            idProduct: item.idProduct,
            nameProduct: item.nameProduct,
            projects: [
              {
                idProject: item.projects[index].idProject,
                name: item.projects[index].name,
                conversation: {
                  idConversation:
                    item.projects[index].conversation.idConversation,
                },
              },
            ],
          };
          // dispatch(setProjectSelected(obj));

          dispatch(
            setTicketSelectedProject({
              idProject: item.projects[index].idProject,
              name: item.projects[index].name,
              conversation: {
                idConversation:
                  item.projects[index].conversation.idConversation,
              },
            })
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  React.useEffect(() => {
    if (ticketSelectedProject != undefined) {
      ConnectHub.invoke(
        'ReadByHADS',
        ticketSelectedProject.conversation.idConversation,
        loggedUser.userInfo.idUser
      )
        .done((res) => {
          if (res.code == '0') {
            const samplePayload = {
              idConversation: ticketSelectedProject.conversation.idConversation,
              value: '0',
              orderBy: false,
            };
            dispatch(updateLoggedUser(samplePayload));
          }
        })
        .catch((err) => {
          dispatch(setLoadingWait(false));
          console.error(err);
        });
    }
  }, [ticketSelectedProject?.conversation.idConversation]);

  return (
    <TreeView
      key={0}
      sx={{
        height: 620,
        flexGrow: 1,
        maxWidth: 400,
        overflowY: 'auto',
        overFlowX: 'none',
        maxHeight: 620,
      }}
      defaultExpanded={['0']}
      expanded={expanded}
      selected={[pos, posChildren]}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      ref={refTree}
    >
      <Typography
        component="h2"
        sx={{color: '#7BB7FA' , marginTop: '5px'}}
      >
        Chats grupales
      </Typography>
      {loggedUser.products.map((product: ProductL, i) => {
        return (
          <div key={i}>
            <Badge
              color={'error'}
              overlap="circular"
              invisible={product.messagesCount > 0 ? false : true}
              badgeContent={product.messagesCount}
              sx={{"& .MuiBadge-badge": {
                right: '1%',
              }}}
            >
              <GroupChat
                index={i}
                nodeId={i.toString()}
                labelText={product.nameProduct}
                labelIcon={Label}
                themeMode={themeMode}
                onClick={() => {
                  const expandedNew = [...expanded];
                  const index = expandedNew.indexOf(i.toString());
                  if (index > -1) {
                    expandedNew.splice(index, 1);
                    setExpanded(expandedNew);
                  } else {
                    setExpanded((prevArray) => [...prevArray, i.toString()]);
                  }
                }}
              >
                {product.projects.map((project, j) => {
                  return (
                    <div key={j}>
                      <GroupChat
                        index={j}
                        nodeId={i.toString() + j.toString()}
                        item={project}
                        labelText={project.name}
                        themeMode={themeMode}
                        onClick={() => {
                          handleClick(product, j, i);
                        }}
                        // labelInfo="90"
                        color="#e3742f"
                        bgColor="#e6f4ea"
                        tkSelected={
                          ticketSelected?.idProject ==
                          product.projects[j].idProject
                        }
                      />
                    </div>
                  );
                })}
              </GroupChat>
            </Badge>
          </div>
        );
      })}
    </TreeView>
  );
};

export default TreeChatGroups;
