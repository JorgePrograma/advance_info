import { inject } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApplicationService } from '../../features/permission/services/application/application.service';
import {
  Action,
  permissionsActionsSignal,
  permissionsSignal,
} from '../../interfaces/Permissions';
import { tokenSignal } from '../../interfaces/token-description.model';
import { RolesService } from '../../services/roles/roles.service';
import { UserTokenService } from '../../services/user/user-token.service';
import { UserService } from '../../services/user/user.service';
import { PermissionConstant } from '../constant/PermissionConstant';
import { EventBusService } from '../../services/event-bus/event-bus.service';
export const token =
  'eyJ4NXQjUzI1NiI6InBHbGg3RTdpSndmRGhNbnJDU3RNV0ZpelZkNTBXcTFwZFBZdVNzcWhvM1EiLCJ4NXQiOiI0MEIxWUhCc1dJOVhBZmhaSDNrcEtNQ2lveEEiLCJraWQiOiJTSUdOSU5HX0tFWSIsImFsZyI6IlJTMjU2In0.eyJjbGllbnRfb2NpZCI6Im9jaWQxLmRvbWFpbmFwcC5vYzEuc2EtYm9nb3RhLTEuYW1hYWFhYWFoZ3BvaHNxYXlqZ2ZnNGliZ3NmbGJtcWptbmFkYjdqaW41Yms3bnEzdno1ZzV1bjYyNXRhIiwidXNlcl90eiI6IkFtZXJpY2EvQ2hpY2FnbyIsInN1YiI6InNzdWFyZXpAaW5mb2RvYy5jb20uY28iLCJ1c2VyX2xvY2FsZSI6ImVuIiwic2lkbGUiOjQ4MCwidXNlci50ZW5hbnQubmFtZSI6ImlkY3MtYWUwNGM2YzMzODVhNGQ0Mzk1MjdiZmZlYzVmZjg3MzciLCJpc3MiOiJodHRwczovL2lkZW50aXR5Lm9yYWNsZWNsb3VkLmNvbS8iLCJkb21haW5faG9tZSI6InNhLWJvZ290YS0xIiwiY2Ffb2NpZCI6Im9jaWQxLnRlbmFuY3kub2MxLi5hYWFhYWFhYXE1cW9kZDZ1NXhhdDZodDZ6cjU0M2UyN2U3aHhncjUyZTZkbTRpZWFvMnRxNnQzMnRuZGEiLCJ1c2VyX3RlbmFudG5hbWUiOiJpZGNzLWFlMDRjNmMzMzg1YTRkNDM5NTI3YmZmZWM1ZmY4NzM3IiwiY2xpZW50X2lkIjoiZDQ1YzQyMDJlYTViNGE4ZDg1ZmU2OWUzNTIwMzI2N2UiLCJkb21haW5faWQiOiJvY2lkMS5kb21haW4ub2MxLi5hYWFhYWFhYTUydGJ4ZnVrNTZiZHVnYWxqNmdxNmRxY3diYXZxbXpkZnJzaGJ5emlhbzUyb3hrcGpsNXEiLCJzdWJfdHlwZSI6InVzZXIiLCJzY29wZSI6ImdhdGV3YXkuYWNjZXNzZnVsbCBvZmZsaW5lX2FjY2VzcyIsInVzZXJfb2NpZCI6Im9jaWQxLnVzZXIub2MxLi5hYWFhYWFhYWNrdHJtbzY1M3Y3c3liY3J6b295aHFpbXk1NWJpYnJqcXlhdGVveW11am9iZGh2eDR3Z3EiLCJjbGllbnRfdGVuYW50bmFtZSI6ImlkY3MtYWUwNGM2YzMzODVhNGQ0Mzk1MjdiZmZlYzVmZjg3MzciLCJyZWdpb25fbmFtZSI6InNhLWJvZ290YS1pZGNzLTEiLCJ1c2VyX2xhbmciOiJlbiIsImV4cCI6MTc0NjIxNzAzMywiaWF0IjoxNzQ2MjEzNDMzLCJjbGllbnRfZ3VpZCI6IjU0MGJhZTIzN2Y0MTQxYTE4MDMxZmRhMDMzY2ExZDEzIiwiY2xpZW50X25hbWUiOiJhcGlnYXRld2F5X3Jlc291cmNlX2NsaWVudCIsInRlbmFudCI6ImlkY3MtYWUwNGM2YzMzODVhNGQ0Mzk1MjdiZmZlYzVmZjg3MzciLCJqdGkiOiJjYmQ1ZGJkOTY1YWM0YzA3ODhmMzdmZTI5MDRlZjk0OSIsImd0cCI6InJvIiwidXNlcl9kaXNwbGF5bmFtZSI6IlNlYmFzdGlhbiBBbmRyZXMgU3VhcmV6IEd1em1hbiIsIm9wYyI6ZmFsc2UsInN1Yl9tYXBwaW5nYXR0ciI6InVzZXJOYW1lIiwicHJpbVRlbmFudCI6ZmFsc2UsInRva190eXBlIjoiQVQiLCJhdWQiOiJhcGktZ2F0ZXdheSIsImNhX25hbWUiOiJpZHNvcG9ydGUiLCJ1c2VyX2lkIjoiYWViY2E0MWE4ZTRkNGNkNTgyNjI1OTYzZTIzM2RmNDciLCJydF9qdGkiOiIzYjYwZDg5NzFhYWI0OWFhYWRiYTYxZWZjNTJjNjEzZCIsImRvbWFpbiI6IlNHREVBX0RPTUFJTiIsInRlbmFudF9pc3MiOiJodHRwczovL2lkY3MtYWUwNGM2YzMzODVhNGQ0Mzk1MjdiZmZlYzVmZjg3MzcuaWRlbnRpdHkub3JhY2xlY2xvdWQuY29tOjQ0MyIsInJlc291cmNlX2FwcF9pZCI6ImM1M2Y0NmMyOWQyNTQyMzNhOWM4NmFhOGRhZGVkMDkwIn0.WNY8a1KJZAABm8vFItfTuGZfC43j4yZCtzdKMGyqZRFIpaCu8bd-kdPHTp4_P9iXUJO2uH89VaVBFu1kHN9Q02FGlMwA6FPnS9x7D4APx442uwTLyAp-sBv4spJMRAfFGfo3JRjLU3MHlB2PXvx4qwYq4UtLeiujqdqMke9ge0g9dj3bith5ohYwzUqeOW5XDbutyrSa7M7MHz8YVEBjbkOoniiyA9cNpz0Am8k0rxVBD5K8wYz8JPrGosmqbnD1X89ydJaPX9zU0x9_d8VgkZXoMyJ00jXsDSMECLg9kImwjJlRLFtWgtKC5azugZ4_79mtrxRvov_yeiiQogvjdA';
export const initialResolver = () => {
  const userService = inject(UserService);
  const userTokenService = inject(UserTokenService);
  const roleService = inject(RolesService);
  const applicationService = inject(ApplicationService);
  const eventBus = inject(EventBusService)
//  userTokenService.setToken(token);
//applicationService.loadAllData();

// decencriptar token
// buscar los datos del usuario
// buscar los roles del usuario
// cargar los permisos a los microfrontend
 

return of()
/*return of(tokenSignal()).pipe(
  switchMap((info) => {
    if (info?.user_id) {
      console.log("iniciando el resolver")

      return userService.getUserById("20eebcaf-7efb-4ef7-9f0e-7eaf66e2ce03").pipe(
        switchMap((user) => {
          if (user && user.roles && user.roles.length > 0) {

            const roleDetails$ = user.roles.map((role) =>
              roleService.getRoleById("93264215-9e3c-4917-8dd6-061d9ddccd03")
            );
            return forkJoin(roleDetails$).pipe(
              map((roleDetails) => {
                // Extraer todas las actions de todos los roles
                const allActions: Action[] = [];
                roleDetails.forEach((role: any) => {
                  if (role && role.permissions) {
                    role.permissions.forEach((perm: any) => {
                      if (
                        perm.aplications ===
                        PermissionConstant.APPLICATION_ID
                      ) {
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
                permissionsActionsSignal.set(allActions);
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
    */

};
