declare module 'service-worker-loader!*' {
  type ServiceWorkerRegister = (options?: any) => Promise<any>;

  class ServiceWorkerNoSupportError extends Error {
    new(): ServiceWorkerNoSupportError;
    prototype: ServiceWorkerNoSupportError;
  }

  const register: ServiceWorkerRegister;
  const scriptUrl: string;
  // const ServiceWorkerNoSupportError: ServiceWorkerNoSupportError;

  export default register;
  export {
      ServiceWorkerNoSupportError,
      scriptUrl,
  };
}