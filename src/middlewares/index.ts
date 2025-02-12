import AuthJWT from './auth-jwt.handler';
import CheckUserRole from "./check-user-role.handler";
import CheckAdminScopes from "./check-admin-scopes.handler";
import SetUserDevice from "./set-user-device.handler";
import SetBusinessVars from "./set-business-vars.handler";
import SetResponseCorsHeaders from "./set-cors-headers.handler";
import { SetCsrfToken,doubleCsrfUtils } from "./set-csrf-token.handler";
import { DecryptData,EncryptData } from './encryption.handlers';
import CheckValidation from "./check-validation.handler";
import SetUserSession from "./set-user-session.handler";
import SendJson from "./send-json.handler";
import PageNotFound from "./not-found.handler";
import ErrorHandler from "./error.handler";

export {
  AuthJWT,
  CheckUserRole,
  CheckAdminScopes,
  SetResponseCorsHeaders,
  SetCsrfToken,
  doubleCsrfUtils,
  SetBusinessVars,
  SetUserDevice,
  DecryptData,
  EncryptData,
  CheckValidation,
  SetUserSession,
  SendJson,
  PageNotFound,
  ErrorHandler,
};
export const PostMiddleware = [
  EncryptData,
  SetUserSession,
  SendJson,
];