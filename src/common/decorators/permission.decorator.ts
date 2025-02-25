import { SetMetadata } from '@nestjs/common';
import { AppAbility } from '../casl-ability.factory';

type PermissionHandlerCallback = (ability: AppAbility) => boolean;

interface IPermissionHandler {
  handle(ability: AppAbility): boolean;
}

export type PermissionHandler = IPermissionHandler | PermissionHandlerCallback;

export const PERMISSION_KEY = 'permission_key';
export const CheckPermissions = (...handlers: PermissionHandler[]) =>
  SetMetadata(PERMISSION_KEY, handlers);
