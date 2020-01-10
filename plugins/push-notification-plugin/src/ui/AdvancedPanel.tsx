import React, { Fragment, useEffect, useState } from 'react';
import { PluginElementContext } from '@burner-wallet/types';
import PushNotificationsPlugin from '../PushNotificationsPlugin';

const AdvancedPanel: React.FC<PluginElementContext> = ({ plugin, burnerComponents }) => {
  const _plugin = plugin as PushNotificationsPlugin;
  const [subscribed, setSubscribed] = useState(_plugin.isRegistered);

  useEffect(() => {
    const listener = (isSubscribed: boolean) => setSubscribed(isSubscribed);
    _plugin.addRegistrationListener(listener);

    return () => _plugin.removeRegistrationListener(listener);
  }, []);

  const toggle = () => {
    if (subscribed) {
      _plugin.unsubscribe();
    } else {
      _plugin.subscribe();
    }
  }

  const { Button } = burnerComponents;

  if (!('Notification' in window)) {
    return (
      <div>
        <h2>Push Notifications</h2>
        <div>Push notifications are not supported on your device</div>
      </div>
    );
  }

  return (
    <div>
      <h2>Push Notifications</h2>
      <div>Receive push notifications for incoming transactions and event alerts</div>
      <Button onClick={toggle}>{subscribed ? 'Disable' : 'Enable'}</Button>
    </div>
  );
}

export default AdvancedPanel;
