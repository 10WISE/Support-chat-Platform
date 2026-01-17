import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  MessageL as MessageHADS,
  TicketL as TicketHADS,
  UserInfoL,
  ProductL,
  ProjectL,
  Numerales
} from 'utils/HADSObjectsLocal';

type Message = MessageHADS & { color: string };
import {
  TicketL as TicketLHADS,
  TimeProjectAns,
  loggedUserL,
  MessageL,
} from 'utils/HADSObjectsLocal';
type TicketL = TicketLHADS & { color: string};
import * as _ from 'lodash';
import { AlertColor } from '@mui/lab/Alert';

export interface User {
  userInfo: UserInfoL;
  creator: string;
  userMod: string;
}

export interface Conversation {
  idConversation: string;
  title: string;
  description: string;
  users: User;
  attributes: string;
}

export interface MessageInformation {
  isVisible: boolean;
  message: string;
  type: string;
}

export interface WrittenMessageConversation {
  idTicket: string;
  message: string;
}

export interface AppState {
  loggedUser: loggedUserL;
  tickets: TicketL[];
  ticketSelected: TicketL;
  projectSelected: ProductL;
  ticketSelectedProject: ProjectL;
  ticketsNew: {
    idTicket: string;
    projectName: string;
    message: string;
    color: AlertColor;
    potTicket: boolean;
    colorTicket: string;
  }[];
  messagesSelected: MessageL[];
  meetingSelected: string;
  messagesSelectedProject: MessageL[];
  meetingSelectedProject: string;
  messageInformation: MessageInformation;
  writtenMessageConversation: WrittenMessageConversation[];
  shareOnline: string;
  idProject: string;
  fileDrop: boolean;
  timeProject: TimeProjectAns[];
  loadingWait: boolean;
  Dragging: boolean;
  numerales: Numerales[];
  messagesFlag: number;
}

const initialState: AppState = {
  loggedUser: {
    statistics: { inAtention: '0', pendding: '0', solved: '0' },
    products: [],
    userInfo: { idUser: '', userEncrypt: '', passwordEncrypt: '', theme: '' },
  },
  tickets: [],
  ticketSelected: undefined,
  projectSelected: undefined,
  ticketSelectedProject: undefined,
  ticketsNew: [],
  messagesSelected: [],
  meetingSelected: '',
  messagesSelectedProject: [],
  meetingSelectedProject: '',
  messageInformation: { isVisible: false, message: '', type: 'success' },
  writtenMessageConversation: [],
  shareOnline: null,
  idProject: null,
  fileDrop: false,
  timeProject: [],
  loadingWait: false,
  Dragging: false,
  numerales: [],
  messagesFlag: 0
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoggedUser: (state, { payload }: PayloadAction<loggedUserL>) => {
      state.loggedUser = payload;
    },
    setTickets: (state, { payload }) => {
      state.tickets = payload;
    },
    setTimeAns: (state, { payload }) => {
      state.timeProject = payload;
    },
    addTicket: (state, { payload }) => {
      let tickets = state.tickets;
      tickets.unshift(payload);
      state.tickets = tickets;
    },
    removeTicket: (state, { payload }) => {
      let tickets = state.tickets;
      tickets.splice(payload, 1);
      state.tickets = tickets;
      state.messagesSelected = [];
    },
    updateMessagesFlag: (state, { payload }) => {
      let messages = state.messagesFlag;
      messages += payload;
      state.messagesFlag = messages;
    },
    updateTicket: (state, { payload }) => {
      let tickets = state.tickets;
      tickets.forEach(function (item, i) {
        if (item.conversation.idConversation == payload.idConversation) {
          if (payload.orderBy) {
            tickets.splice(i, 1);
          }
          if (payload.value == '0') {
            item.conversation.unreadMessagesCount = '0';
          } else if (payload.value == '1') {
            item.conversation.unreadMessagesCount = (
              parseInt(item.conversation.unreadMessagesCount) +
              parseInt(payload.value)
            ).toString();
          } else if (payload.value == '2') {
            item.solved = 'I';
            if (item.conversation.idConversation == state.ticketSelected?.conversation?.idConversation) {
              let ticketSelected = state.ticketSelected;
              ticketSelected.solved = 'I';
            }
          } else if (payload.value == '3') {
            item.isAsignador = '2'
          } else if (payload.value == '4') {
            if (item.notificado != '1') {
              item.notificado = '1';
              let ticketSelected = state.ticketSelected;
              ticketSelected.notificado = '1';
            } else{
              item.notificado = '0';
              let ticketSelected = state.ticketSelected;
              ticketSelected.notificado = '0';
            }
          }

          if (payload.color) {
            item.color = payload.color;
          }

          if (payload.orderBy) {
            tickets.unshift(item);
          }
        }
      });

      if (state.ticketSelected != undefined || state.ticketSelected != null) {
        state.tickets = tickets;
        let ticketSelected = state.ticketSelected;
        ticketSelected.conversation.unreadMessagesCount = (
          parseInt(ticketSelected.conversation.unreadMessagesCount) +
          parseInt(payload.value)
        ).toString();
        state.ticketSelected = ticketSelected;
      }

    },
    updateAns: (state, { payload }) => {
      let tickets = state.tickets;
      tickets.forEach(function (item, i) {
        if (item.conversation.idConversation == payload.idConversation && item.isAns == '1') {
          if (payload?.isAns) {
            item.isAns = payload?.isAns;
            item.dateAns = payload.dateAns;
          }

          item.iconAns = payload.iconAns;
          item.color = payload.color;
        }
      });
      state.tickets = tickets;
      if (state.ticketSelected) {
        let ticketSelected = state.ticketSelected;
        ticketSelected.isAns = payload?.isAns;
        ticketSelected.dateAns = payload.dateAns;
        ticketSelected.iconAns = payload.iconAns;
        state.ticketSelected = ticketSelected;
      }
    },
    setTicketSelected: (state, { payload }) => {
      state.ticketSelected = payload;
    },
    setTicketsNew: (state, { payload }) => {
      let ticketsNew = state.ticketsNew;
      const pos = _.findIndex(ticketsNew, (o) => {
        return o.idTicket == payload.idTicket;
      });
      if (pos != -1) {
        ticketsNew.splice(pos, 1);
      }
      ticketsNew.push(payload);
      state.ticketsNew = ticketsNew;
      if (payload.potTicket >= 0) {
        state.tickets[payload.potTicket].color = payload.colorTicket;
      }
    },
    removeTicketsNew: (state, { payload }) => {
      let ticketsNew = state.ticketsNew;
      if (payload != -1) {
        ticketsNew.splice(payload, 1);
        state.ticketsNew = ticketsNew;
      }
    },
    setMessagesSelected: (state, { payload }) => {
      state.messagesSelected = payload;
      state.loadingWait = false;
    },
    addMessagesSelected: (state, { payload }) => {
      let messagesSelected = state.messagesSelected;
      messagesSelected.push(payload);
      state.messagesSelected = messagesSelected;
    },
    addMessagesSelectedPaginate: (state, { payload }) => {
      let messagesSelected = state.messagesSelected;
      state.messagesSelected = payload.concat(messagesSelected);
      state.loadingWait = false;
    },
    addBug: (state, { payload }) => {
      let tickets = state.tickets;
      let pos = _.findIndex(tickets, (o) => {
        return o.idTicket == state.ticketSelected.idTicket;
      });
      tickets[pos].idBug = payload;
      state.ticketSelected.idBug = payload;

      state.tickets = tickets;
    },
    addIdNewMessage: (state, { payload }) => {

      let messages = state.messagesSelected;
      let pos = _.findIndex(messages, (o: MessageL) => {
        return o.idMessage == '-1' && o.user.userInfo.idUser == state.loggedUser.userInfo.idUser;
      });
      messages[pos].idMessage = payload;
      state.messagesSelected = messages;
    },
    setMeetingSelected: (state, { payload }) => {
      state.meetingSelected = payload;
    },
    setMessagesSelectedProject: (state, { payload }) => {
      state.messagesSelectedProject = payload;
      state.loadingWait = false;
    },
    addMessagesSelectedProject: (state, { payload }) => {
      let messagesSelectedProject = state.messagesSelectedProject;
      messagesSelectedProject.push(payload);
      state.messagesSelectedProject = messagesSelectedProject;
    },
    setMeetingSelectedProject: (state, { payload }) => {
      state.meetingSelectedProject = payload;
    },
    addMessagesSelectedProjectPaginate: (state, { payload }) => {
      let messagesSelectedProject = state.messagesSelectedProject;
      state.messagesSelectedProject = payload.concat(messagesSelectedProject);
    },
    setMessageInformation: (state, { payload }) => {
      state.messageInformation = payload;
    },
    setWrittenMessageConversation: (state, { payload }) => {
      let writtenMessageConversation = state.writtenMessageConversation;
      const pos = _.findIndex(writtenMessageConversation, (o) => {
        return o.idTicket == payload.idTicket;
      });
      if (pos != -1) {
        writtenMessageConversation.splice(pos, 1);
      }
      writtenMessageConversation.push({
        idTicket: payload.idTicket,
        message: payload.message,
      });
    },
    setShareOnline: (state, { payload }) => {
      state.shareOnline = payload;
    },
    setStatisticsUsers: (state, { payload }) => {
      if (1 == payload.option) {
        let oldState = state.loggedUser.statistics;
        oldState.inAtention = payload.value;
        state.loggedUser.statistics = oldState;
      } else if (3 == payload.option) {
        let oldState = state.loggedUser.statistics;
        oldState.solved = payload.value;
        state.loggedUser.statistics = oldState;
      }
    },
    setProjectSelected: (state, { payload }) => {
      state.projectSelected = payload;
    },
    setTicketSelectedProject: (state, { payload }) => {
      state.ticketSelectedProject = payload;
    },
    setUsersConversationProject: (state, { payload }) => {
      state.ticketSelectedProject.conversation.users = payload;
    },
    updateLoggedUser: (state, { payload }) => {
      let productsTemp = state.loggedUser.products;
      productsTemp.map((product, i) => {
        let messagesCount = 0;
        product.projects.map((project, j) => {
          if (project.conversation.idConversation == payload.idConversation) {
            if (payload.value == '0') {
              project.conversation.unreadMessagesCount = '0';
            } else {
              state.loggedUser.products[i].projects[
                j
              ].conversation.unreadMessagesCount = (
                parseInt(project.conversation.unreadMessagesCount) +
                parseInt(payload.value)
              ).toString();
            }
          }

          messagesCount += parseInt(
            state.loggedUser.products[i].projects[j].conversation
              .unreadMessagesCount
          );
        });
        product.messagesCount = messagesCount;
      });

      let ticketSelectedProject = state.ticketSelectedProject;
      ticketSelectedProject.conversation.unreadMessagesCount = (
        parseInt(ticketSelectedProject.conversation.unreadMessagesCount) +
        parseInt(payload.value)
      ).toString();
      state.projectSelected = ticketSelectedProject;
    },
    updateProduct: (state, { payload }) => {
      let productsTemp = state.loggedUser.products;
      productsTemp.map((product: ProductL, i: number) => {
        if (product.idProduct == payload.idProduct) {
          if (payload.value == '0') {
            product.pinned = 0;
          } else {
            product.pinned = 1;
          }
        }
      });
      state.loggedUser.products = productsTemp;
    },
    setLoadingWait: (state, { payload }) => {
      state.loadingWait = payload;
    },
    setDragging: (state, { payload }) => {
      state.Dragging = payload;
    },
    setNumerales: (state, { payload }) => {
      state.numerales = payload;
    },
  },
});

export const {
  setLoggedUser,
  setTickets,
  setTimeAns,
  addTicket,
  removeTicket,
  updateMessagesFlag,
  updateTicket,
  updateAns,
  setTicketSelected,
  setTicketsNew,
  removeTicketsNew,
  setMessagesSelected,
  addMessagesSelected,
  addMessagesSelectedPaginate,
  setMeetingSelected,
  setMessagesSelectedProject,
  addMessagesSelectedProject,
  addMessagesSelectedProjectPaginate,
  addBug,
  addIdNewMessage,
  setMeetingSelectedProject,
  setMessageInformation,
  setWrittenMessageConversation,
  setShareOnline,
  setStatisticsUsers,
  setProjectSelected,
  setTicketSelectedProject,
  setUsersConversationProject,
  updateLoggedUser,
  updateProduct,
  setLoadingWait,
  setDragging,
  setNumerales
} = appSlice.actions;

export const appReducer = appSlice.reducer;
