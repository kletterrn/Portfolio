/* CV export uses the browser's real print dialog. There is no missing PDF asset. */
document.querySelectorAll('[data-print]').forEach(button => {
 button.addEventListener('click', () => window.print());
});
