import { inject } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SharedStateService } from 'shared-state';
import { ApplicationService } from '../../features/permission/services/application/application.service';
import { permissionsSignal } from '../../interfaces/Permissions';
import { tokenSignal } from '../../interfaces/token-description.model';
import { RolesService } from '../../services/roles/roles.service';
import { UserTokenService } from '../../services/user/user-token.service';
import { UserService } from '../../services/user/user.service';
import { PermissionConstant } from '../constant/PermissionConstant';
export const token =
  'eyJ4NXQjUzI1NiI6InBHbGg3RTdpSndmRGhNbnJDU3RNV0ZpelZkNTBXcTFwZFBZdVNzcWhvM1EiLCJ4NXQiOiI0MEIxWUhCc1dJOVhBZmhaSDNrcEtNQ2lveEEiLCJraWQiOiJTSUdOSU5HX0tFWSIsImFsZyI6IlJTMjU2In0.eyJjbGllbnRfb2NpZCI6Im9jaWQxLmRvbWFpbmFwcC5vYzEuc2EtYm9nb3RhLTEuYW1hYWFhYWFoZ3BvaHNxYXlqZ2ZnNGliZ3NmbGJtcWptbmFkYjdqaW41Yms3bnEzdno1ZzV1bjYyNXRhIiwidXNlcl90eiI6IkFtZXJpY2EvQ2hpY2FnbyIsInN1YiI6InNzdWFyZXpAaW5mb2RvYy5jb20uY28iLCJ1c2VyX2xvY2FsZSI6ImVuIiwic2lkbGUiOjQ4MCwidXNlci50ZW5hbnQubmFtZSI6ImlkY3MtYWUwNGM2YzMzODVhNGQ0Mzk1MjdiZmZlYzVmZjg3MzciLCJpc3MiOiJodHRwczovL2lkZW50aXR5Lm9yYWNsZWNsb3VkLmNvbS8iLCJkb21haW5faG9tZSI6InNhLWJvZ290YS0xIiwiY2Ffb2NpZCI6Im9jaWQxLnRlbmFuY3kub2MxLi5hYWFhYWFhYXE1cW9kZDZ1NXhhdDZodDZ6cjU0M2UyN2U3aHhncjUyZTZkbTRpZWFvMnRxNnQzMnRuZGEiLCJ1c2VyX3RlbmFudG5hbWUiOiJpZGNzLWFlMDRjNmMzMzg1YTRkNDM5NTI3YmZmZWM1ZmY4NzM3IiwiY2xpZW50X2lkIjoiZDQ1YzQyMDJlYTViNGE4ZDg1ZmU2OWUzNTIwMzI2N2UiLCJkb21haW5faWQiOiJvY2lkMS5kb21haW4ub2MxLi5hYWFhYWFhYTUydGJ4ZnVrNTZiZHVnYWxqNmdxNmRxY3diYXZxbXpkZnJzaGJ5emlhbzUyb3hrcGpsNXEiLCJzdWJfdHlwZSI6InVzZXIiLCJzY29wZSI6ImdhdGV3YXkuYWNjZXNzZnVsbCBvZmZsaW5lX2FjY2VzcyIsInVzZXJfb2NpZCI6Im9jaWQxLnVzZXIub2MxLi5hYWFhYWFhYWNrdHJtbzY1M3Y3c3liY3J6b295aHFpbXk1NWJpYnJqcXlhdGVveW11am9iZGh2eDR3Z3EiLCJjbGllbnRfdGVuYW50bmFtZSI6ImlkY3MtYWUwNGM2YzMzODVhNGQ0Mzk1MjdiZmZlYzVmZjg3MzciLCJyZWdpb25fbmFtZSI6InNhLWJvZ290YS1pZGNzLTEiLCJ1c2VyX2xhbmciOiJlbiIsImV4cCI6MTc0NjQ2NDM0MCwiaWF0IjoxNzQ2NDYwNzQwLCJjbGllbnRfZ3VpZCI6IjU0MGJhZTIzN2Y0MTQxYTE4MDMxZmRhMDMzY2ExZDEzIiwiY2xpZW50X25hbWUiOiJhcGlnYXRld2F5X3Jlc291cmNlX2NsaWVudCIsInRlbmFudCI6ImlkY3MtYWUwNGM2YzMzODVhNGQ0Mzk1MjdiZmZlYzVmZjg3MzciLCJqdGkiOiJmZmJjMTJiM2Y2MDg0NGFlYTJiOTllNDFmYWZkOGM1MyIsImd0cCI6InJvIiwidXNlcl9kaXNwbGF5bmFtZSI6IlNlYmFzdGlhbiBBbmRyZXMgU3VhcmV6IEd1em1hbiIsIm9wYyI6ZmFsc2UsInN1Yl9tYXBwaW5nYXR0ciI6InVzZXJOYW1lIiwicHJpbVRlbmFudCI6ZmFsc2UsInRva190eXBlIjoiQVQiLCJhdWQiOiJhcGktZ2F0ZXdheSIsImNhX25hbWUiOiJpZHNvcG9ydGUiLCJ1c2VyX2lkIjoiYWViY2E0MWE4ZTRkNGNkNTgyNjI1OTYzZTIzM2RmNDciLCJydF9qdGkiOiI4NDkzYzBhYWE5NmY0YjNiODU0NjlhZTQ1NTIxZDRhNiIsImRvbWFpbiI6IlNHREVBX0RPTUFJTiIsInRlbmFudF9pc3MiOiJodHRwczovL2lkY3MtYWUwNGM2YzMzODVhNGQ0Mzk1MjdiZmZlYzVmZjg3MzcuaWRlbnRpdHkub3JhY2xlY2xvdWQuY29tOjQ0MyIsInJlc291cmNlX2FwcF9pZCI6ImM1M2Y0NmMyOWQyNTQyMzNhOWM4NmFhOGRhZGVkMDkwIn0.FRS7XsWJS5QuyeJP2SyBhdGSHJ3s9Si5RBkr9pwG0ITzgJv3aW04LI9GtCV7cWa-BTIpARgKlKCSyMw4VUA3yhoat5diuAUv5you9tRMOGz1vJ1rohn-GOOBBOLsb2L3I5yW2UuFJcuLseV6mNtdJP6-MYV5itPz7PlHyruV7fLUXNs-4neayExYXIqSDO2kTCEF9Fiolkc3C0s-Mpl5z7gcbm8o1g17O88h8H7f_hUi2-KU3jVwXlSmFLxWcMEypZN8nuY_qgbHc4xdFI9FbPx0mezNGAGo10u8uzfmEapBCkwAj--Ji_lplAY0qXVhU66YPv38k7_oHBETR6D7YQ';

export const initialResolver = () => {
  const userService = inject(UserService);
  const userTokenService = inject(UserTokenService);
  const roleService = inject(RolesService);
  const applicationService = inject(ApplicationService);
  const sharedStateService = inject(SharedStateService);

  applicationService.loadAllData();

  // desencriptar token
  userTokenService.setToken(token);

  return of(tokenSignal()).pipe(
    switchMap((info) => {
      if (info?.user_id) {
        return userService
          .getUserById('2229da2a-b6fc-4908-ad99-f2a53e26af06')
          .pipe(
            switchMap((user) => {
              if (user && user.roles && user.roles.length > 0) {
                const roleDetails$ = user.roles.map((role) =>
                  roleService.getRoleById(role.id)
                );
                console.log('roles detalles ', roleDetails$);

                return forkJoin(roleDetails$).pipe(
                  map((roleDetails) => {
                    const allActions = extractActionsFromRoles(roleDetails);
                    sharedStateService.update(allActions);
                    console.log('acciones que se estan pasando ', allActions);
                    permissionsSignal.set(roleDetails);
                    return {
                      user,
                      roles: roleDetails,
                      actions: allActions,
                    };
                  })
                );
              } else {
                permissionsSignal.set([]);

                return of({ user, roles: [], actions: [] });
              }
            })
          );
      }
      permissionsSignal.set([]);
      return of({ user: null, roles: [], actions: [] });
    })
  );
};

function extractActionsFromRoles(roleDetails: any[]): string[] {
  const allActions: string[] = [];
  console.log('el role trae los siguientes permisos', roleDetails);
  roleDetails.forEach((role: any) => {
    if (role && role.permissions) {
      role.permissions.forEach((perm: any) => {
        if (perm.aplications === PermissionConstant.APPLICATION_ID) {
          perm.aplications.forEach((app: any) => {
            if (app.modules) {
              app.modules.forEach((mod: any) => {
                if (mod.subModules) {
                  mod.subModules.forEach((sub: any) => {
                    if (sub.actions) {
                      allActions.push(...sub.actions);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
  return allActions;
}
