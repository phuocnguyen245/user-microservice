import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory, AppAbility } from '../casl-ability.factory';
import {
  PermissionHandler,
  PERMISSION_KEY,
} from '../decorators/permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PermissionHandler[]>(
        PERMISSION_KEY,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.createForUser(user);

    return policyHandlers.every((handler) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PermissionHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
