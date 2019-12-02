import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import registerServiceWorker, { ServiceWorkerNoSupportError } from 'service-worker-loader!./push-worker';
import HomePanel from './ui/HomePanel';
import { urlB64ToUint8Array } from './lib';

type RegistrationListener = (isRegistered: boolean) => void;

export default class PushNotificationsPlugin implements Plugin {
  public isRegistered: boolean;
  private vapidKey: string;
  private walletId: string;
  private registrationPromise: Promise<any>;
  private registrationListeners: RegistrationListener[];
  private factory: string;

  constructor(vapidKey: string, walletId: string, factory: string = 'https://burnerfactory.com') {
    this.isRegistered = false;
    this.vapidKey = vapidKey;
    this.walletId = walletId;
    this.factory = factory;
    this.registrationListeners = [];
    this.registrationPromise = Promise.resolve(null);
  }

  addRegistrationListener(cb: RegistrationListener) {
    this.registrationListeners.push(cb);
  }

  removeRegistrationListener(cb: RegistrationListener) {
    this.registrationListeners = this.registrationListeners.filter(
      (listener: RegistrationListener) => listener !== cb);
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addElement('home-middle', HomePanel);

    this.registrationPromise = registerServiceWorker({ scope: '/' });

    this.registrationPromise.then(async (registration: any) => {
      console.log('Success!');
      console.log(registration);
      this.setRegistered(await this.isSubscribed());
    }).catch((err: Error) => {
      if (err instanceof ServiceWorkerNoSupportError) {
          console.log('Service worker is not supported.');
      } else {
          console.log('Error!');
      }
    });
  }

  async isSubscribed() {
    const registration = await this.registrationPromise;
    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  }

  async subscribe() {
    try {
      const reg = await navigator.serviceWorker.ready;

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(this.vapidKey),
      });

      const subscriptionString = JSON.stringify(sub);

      const response = await fetch(`${this.factory}/push-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: this.walletId,
          subscription: subscriptionString,
        }),
      });
    } catch (e) {
      if (Notification.permission === 'denied') {
        console.warn('Permission for notifications was denied');
      } else {
        console.error('Unable to subscribe to push', e);
      }
    }
  }

  async unsubscribe() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const pushSub = await reg.pushManager.getSubscription();

      if (!pushSub) {
        this.setRegistered(false);
        return;
      }

      await pushSub.unsubscribe();
      this.setRegistered(false);
    } catch (e) {
      console.error(e);
    }
  }

  setRegistered(isRegistered: boolean) {
    this.isRegistered = isRegistered;
    this.registrationListeners.forEach((cb: RegistrationListener) => cb(isRegistered));
  }
}
