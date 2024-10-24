export const refresh = (className) => {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(element => {
      element.addEventListener('click', () => {
        window.location.reload();
      });
    });
  };