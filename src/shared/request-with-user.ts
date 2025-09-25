import { Request } from "express";

import { User } from "../users/entities/user.entity";

export interface RequestWithUserField extends Request {
  user: User;
}
