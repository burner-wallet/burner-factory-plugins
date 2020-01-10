const _self = self as unknown as ServiceWorkerGlobalScope;


_self.addEventListener('push', (e: ExtendableEvent) => {
  const data = (e as PushEvent).data.json();

  const options = {
    body: data.message,
    icon: 'images/example.png',
    vibrate: [100, 50, 100],
  };
  e.waitUntil(
    _self.registration.showNotification('Burner Wallet', options)
  );
});

_self.addEventListener('notificationclick', (e: ExtendableEvent) => {
  (e as NotificationEvent).notification.close();

  e.waitUntil(_self.clients.openWindow((e as any).target.origin));
});
