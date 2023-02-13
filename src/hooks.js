export const handle = async ({ event, resolve }) => {
    const response = await resolve(event, {
      ssr: false
    });
    return response;
};