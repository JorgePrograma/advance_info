import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { HostService } from '../../services/host.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
 const token = true;
  const hostService = inject(HostService);

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer eyJ4NXQjUzI1NiI6InBHbGg3RTdpSndmRGhNbnJDU3RNV0ZpelZkNTBXcTFwZFBZdVNzcWhvM1EiLCJ4NXQiOiI0MEIxWUhCc1dJOVhBZmhaSDNrcEtNQ2lveEEiLCJraWQiOiJTSUdOSU5HX0tFWSIsImFsZyI6IlJTMjU2In0.eyJjbGllbnRfb2NpZCI6Im9jaWQxLmRvbWFpbmFwcC5vYzEuc2EtYm9nb3RhLTEuYW1hYWFhYWFoZ3BvaHNxYXlqZ2ZnNGliZ3NmbGJtcWptbmFkYjdqaW41Yms3bnEzdno1ZzV1bjYyNXRhIiwidXNlcl90eiI6IkFtZXJpY2EvQ2hpY2FnbyIsInN1YiI6InNzdWFyZXpAaW5mb2RvYy5jb20uY28iLCJ1c2VyX2xvY2FsZSI6ImVuIiwic2lkbGUiOjQ4MCwidXNlci50ZW5hbnQubmFtZSI6ImlkY3MtYWUwNGM2YzMzODVhNGQ0Mzk1MjdiZmZlYzVmZjg3MzciLCJpc3MiOiJodHRwczovL2lkZW50aXR5Lm9yYWNsZWNsb3VkLmNvbS8iLCJkb21haW5faG9tZSI6InNhLWJvZ290YS0xIiwiY2Ffb2NpZCI6Im9jaWQxLnRlbmFuY3kub2MxLi5hYWFhYWFhYXE1cW9kZDZ1NXhhdDZodDZ6cjU0M2UyN2U3aHhncjUyZTZkbTRpZWFvMnRxNnQzMnRuZGEiLCJ1c2VyX3RlbmFudG5hbWUiOiJpZGNzLWFlMDRjNmMzMzg1YTRkNDM5NTI3YmZmZWM1ZmY4NzM3IiwiY2xpZW50X2lkIjoiZDQ1YzQyMDJlYTViNGE4ZDg1ZmU2OWUzNTIwMzI2N2UiLCJkb21haW5faWQiOiJvY2lkMS5kb21haW4ub2MxLi5hYWFhYWFhYTUydGJ4ZnVrNTZiZHVnYWxqNmdxNmRxY3diYXZxbXpkZnJzaGJ5emlhbzUyb3hrcGpsNXEiLCJzdWJfdHlwZSI6InVzZXIiLCJzY29wZSI6ImdhdGV3YXkuYWNjZXNzZnVsbCBvZmZsaW5lX2FjY2VzcyIsInVzZXJfb2NpZCI6Im9jaWQxLnVzZXIub2MxLi5hYWFhYWFhYWNrdHJtbzY1M3Y3c3liY3J6b295aHFpbXk1NWJpYnJqcXlhdGVveW11am9iZGh2eDR3Z3EiLCJjbGllbnRfdGVuYW50bmFtZSI6ImlkY3MtYWUwNGM2YzMzODVhNGQ0Mzk1MjdiZmZlYzVmZjg3MzciLCJyZWdpb25fbmFtZSI6InNhLWJvZ290YS1pZGNzLTEiLCJ1c2VyX2xhbmciOiJlbiIsImV4cCI6MTc0NjIyNTkyNiwiaWF0IjoxNzQ2MjIyMzI2LCJjbGllbnRfZ3VpZCI6IjU0MGJhZTIzN2Y0MTQxYTE4MDMxZmRhMDMzY2ExZDEzIiwiY2xpZW50X25hbWUiOiJhcGlnYXRld2F5X3Jlc291cmNlX2NsaWVudCIsInRlbmFudCI6ImlkY3MtYWUwNGM2YzMzODVhNGQ0Mzk1MjdiZmZlYzVmZjg3MzciLCJqdGkiOiJmM2ExNzE4YjA1ZGE0Y2M3YjBhZTY5ZDliYmVlZjYyZiIsImd0cCI6InJvIiwidXNlcl9kaXNwbGF5bmFtZSI6IlNlYmFzdGlhbiBBbmRyZXMgU3VhcmV6IEd1em1hbiIsIm9wYyI6ZmFsc2UsInN1Yl9tYXBwaW5nYXR0ciI6InVzZXJOYW1lIiwicHJpbVRlbmFudCI6ZmFsc2UsInRva190eXBlIjoiQVQiLCJhdWQiOiJhcGktZ2F0ZXdheSIsImNhX25hbWUiOiJpZHNvcG9ydGUiLCJ1c2VyX2lkIjoiYWViY2E0MWE4ZTRkNGNkNTgyNjI1OTYzZTIzM2RmNDciLCJydF9qdGkiOiI3YTNjYTI1ODA0NGE0NmU2YTUzMDQ3Y2U2MTQwMjI0NSIsImRvbWFpbiI6IlNHREVBX0RPTUFJTiIsInRlbmFudF9pc3MiOiJodHRwczovL2lkY3MtYWUwNGM2YzMzODVhNGQ0Mzk1MjdiZmZlYzVmZjg3MzcuaWRlbnRpdHkub3JhY2xlY2xvdWQuY29tOjQ0MyIsInJlc291cmNlX2FwcF9pZCI6ImM1M2Y0NmMyOWQyNTQyMzNhOWM4NmFhOGRhZGVkMDkwIn0.XC825gxnIj9pPmI5uopMksxf5yaU-3epXFISYeGFe8CHtACeoWbvhh2TFdpIZPH6zBKl_DwtmEjnpgpa9RbrCwrBf6rOiFKMNlTouO12RG0ERcbP9HAQc2FtQZskU0bVHpCkJuC362GuCWaeZIt76mwTKeVu30WyvYWmj3dekcnMq444dzLqt7yFC1T-EKvf2j7p1IYPwYrvFlS3WgkaKiAmR331aHjTWz7Lllzg6ET848DYAQCpN0UTqJADR2TwLY90dbjAbX9IrU1quCsOKcTRTnUXojCDYfre3wugjRjVUZazJY8ne07-Jjw3ZQcMmuxakg5CwgwRwcQkmkyoEA`
      }
    });
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          hostService.logout();
        }
        return throwError(() => error)
      })
    );
  }
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        hostService.logout();
      }
      return throwError(() => error)
    })
  );
};
