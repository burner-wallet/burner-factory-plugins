import { BurnerPluginContext, Plugin } from '@burner-wallet/ui';
import registerServiceWorker, { ServiceWorkerNoSupportError } from 'service-worker-loader!./push-worker';

export default class PushNotificationsPlugin {
  constructor() {}

  initializePlugin(pluginContext: BurnerPluginContext) {
    registerServiceWorker({ scope: '/' }).then((registration: any) => {
      console.log('Success!');
      console.log(registration);
    }).catch((err: Error) => {
      if (err instanceof ServiceWorkerNoSupportError) {
          console.log('Service worker is not supported.');
      } else {
          console.log('Error!');
      }
    });
  }
}
