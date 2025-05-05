import { initFederation } from '@angular-architects/native-federation';

 initFederation('federation.manifest.json')
//initFederation('https://axzcnvxafjzw.objectstorage.sa-bogota-1.oci.customer-oci.com/n/axzcnvxafjzw/b/bucket-public-resources/o/public_sourcefederation.manifest.json')
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
