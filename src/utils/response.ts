export class Response {
  public static transform(data: any) {
    if (data instanceof Array) {
      return data.map((dt) => {
        let { _doc: assign } = Object.assign({}, dt);
        if (!assign) assign = Object.assign({}, dt);
        if (assign) {
          const id = assign._id;
          delete assign._id;
          delete assign.createdBy;
          delete assign.createdAt;
          delete assign.updatedAt;
          delete assign.deletedAt;
          delete assign.__v;
          return {
            id,
            ...assign,
          };
        }
      });
    } else if (data) {
      const { _doc: assign } = Object.assign({}, data);
      if (assign) {
        const id = assign._id;
        delete assign._id;
        delete assign.createdBy;
        delete assign.createdAt;
        delete assign.updatedAt;
        delete assign.deletedAt;
        delete assign.__v;
        return {
          id,
          ...assign,
        };
      }
    }
    return null;
  }
}

export const successResponse = (message: string, data) => {
  return {
    success: true,
    message,
    data: Response.transform(data),
  };
};

export const errorResponse = (error) => {
  return {
    success: false,
    message: error,
    data: null,
  };
};
