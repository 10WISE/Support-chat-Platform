export declare class UserInfoL {
  idUser: string;
  name?: string;
  lastName?: string;
  photo?: string;
  userType?: string;
  servicePoint?: string;
  documentId?: string;
  userEncrypt: string;
  passwordEncrypt: string;
  theme?: string;
}
export declare class TicketL {
  idTicket: string;
  conversation?: Conversation;
  createdDate?: string;
  updatedDate?: string;
  projectName?: string;
  idProject?: string;
  idProjectAllocator?: string;
  projectIcon?: string;
  idProduct: string;
  productName: string;
  loggedIn?: string;
  sophia?: TicketL.SophiaL;
  user?: TicketL.User;
  state: string;
  idBug: string;
  isAns: string;
  dateAns: Date;
  iconAns: string;
  isAsignador: string;
  solved: string;
  notificado: string;
}

export declare namespace TicketL {
  class SophiaL {
    userInfo: UserInfoL;
  }
  class User {
    userInfo: UserInfoL;
  }
}

export declare class Conversation {
  idConversation: string;
  title?: string;
  description?: string;
  users?: ConversationL.UserL[];
  attributes?: string;
  /**
   * Identifica la cantidad de mensajes no leídos
   */
  unreadMessagesCount: string;
  /**
   * Identifica el id de la conversación de un proyecto en espefico
   */
  idConversationProject: string;
}

export declare namespace ConversationL {
  class UserL {
    userInfo: UserInfoL;
    creator?: string;
    userMod?: string;
  }
}

/**
 * Objeto que contiene la información de los mensajes.
 * 
 */
export declare class MessageL {
  idMessage: string;
  idConversation?: string;
  createdDate?: string;
  content?: string;
  type?: string;
  user?: MessageL.User;
  usersRead: MessageL.UserRead[];
  eliminado: string;
  dateEliminado: Date;
}

export declare namespace MessageL {
  class User {
      userInfo: UserInfoL;
      type?: string;
  }
  /**
   * Objeto que contiene la información de un usuario que lee un mensaje.
   */
  class UserRead {
      /**
       * Información de ususarios de una conversación.
       */
      userInfo: UserInfoL;
      /**
       * Atributo que indica si ha leído el mensaje "0" No leído "1" Leído
       */
      hasRead: string;
      /**
       * Obtiene la información de la fecha de lectura del mensaje
       */
      date: string;
  }
}

class connion {
  connionId: string;
  server: string;
  ipAddress: string;
  user: connion.User;
}

namespace connion {
  export class User {
    userInfo: UserInfoL;
  }
}

/**
 * Objeto de respuesta Web estandar para HADS
 */
export class HADSResponse {
  /**
   * Código de respuesta con los siguientes códigos:
   * 0 -> OK;
   * 1 -> info;
   * 2 -> error;
   */
  code: string;
  message: string;
  data: string;
}

export class ResponseWs {
  id: string;
  mensaje: string;
}

export class TicketType {
  id: string;
  name: string;
  description: string;
  active: string;
}

export class SubType {
  id: string;
  name: string;
  active: string;
}

export class Specification {
  id: string;
  name: string;
  active: string;
}

export class SophiaInfo {
  userInfo: UserInfoL;
  /**
   * 0 -> Incativo
   * 1 -> Activo
   */
  state: string;
}

export class MessageShareScreen {
  messageType: string;
  value: string;
  project: string;
  ticket: string;
  idConversation: string;
  idUser: string;
  userInfo: UserInfoL;
}

/**
 * Objeto que contiene la información de las estadisticas.
 * (Tickets Pendientes, En trámite y solucionados)
 */
export class StatisticsL {
  inAtention: string;
  pendding: string;
  solved: string;
}

/**
 * Objeto que contiene la información de un proyecto.
 */
export class ProjectL {
  idProject: string;
  name: string;
  conversation?: Conversation;
}

/**
 * Objeto que contiene la información de un proyecto.
 */
export class ProductL {
  idProduct: string;
  nameProduct: string;
  projects?: ProjectL[];
  messagesCount: number;
  pinned?: number;
}

/**
 * Objeto que contiene la información De usuario Logeado, sus
 * estadísticas y proyectos asociadas.
 */
export class loggedUserL {
  products?: ProductL[];
  statistics: StatisticsL;
  userInfo: UserInfoL;
}

export class File {
  file?: string;
  name: string;
}

/**
 * Objeto que contiene la información para injectar un bug en devops
 */
export class InjectBugDevops {
  idSupport: string;
  idConversation: string;
  title: string;
  label: string;
  step: string;
  idProject: string;
  description: string;
  userInfo: UserInfoL;
  idBug: string;
  files: File[];
}

/**
 * Objeto que contiene la información para obtener StickyNotes
 */
export class StickyNotes {
  userInfo: UserInfoL;
  idSticky: string;
  project: ProjectL;
  titleSticky: string;
  bodySticky: string;
  colorSticky: string;
  filesSticky: File[];
  newSticky: string;
}

/**
 * Objeto que contiene la información de los motivos por los
 * cuales un operador se desconecta
 */
export class MotivesSignOut {
  idMotiveSignOut: string;
  details: string;
}

export declare class TimeProjectAns {
  idProject: string;
  time: string;
}

export declare class HADSTool {
  idHerramienta: string;
  idProducto: string;
  idProyecto: string;
  url: string;
  name: string;
  descripcion: string;
}

export declare class Portal {
  idProject: string;
  idPortal: string;
  Portal: string;
}

/**
 * Objeto que contiene la información de una Wiki.
 */
export declare class WikiL {
  idWiki: string;
  name: string;
}

/**
 * Objeto que contiene la información de las referencias Wiki.
 */
export declare class RefWikiL {
  idRef: string;
  idWiki: string;
  name: string;
  descripcion: string;
  file: string;
}

/**
 * Objeto que contiene la información de links para tabla de content.
 */
export declare class LinkL {
  idLink: string;
  href: string;
  text: string;
}

/**
 * Objeto que contiene la información de los numerales.
 */
export declare class Numerales {
  numeral: string;
  detalle: string;
  is_numeral_bloqueo?: string;
}
