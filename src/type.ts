export type note = {
    user?: string,
    title?: string,
    body?: string,
    color?: string,
  }
  
  export type RequestType = {
    type: 'add' | 'update' | 'remove' | 'read' | 'list';
    user?: string;
    title?: string;
    newtitle?: string;
    body?: string;
    color?: string;
  }

  export type ResponseType = {
    type: 'add' | 'update' | 'remove' | 'read' | 'list';
    success: boolean;
    message: [string[], string?]
    notes?: note[];
  }