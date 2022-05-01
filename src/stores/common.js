export const axiosError = (error) => {
  console.error(error.response || error.message || error);
  alert(error.response || error.message || error);
};
