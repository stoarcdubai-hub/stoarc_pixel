/* THEME INIT: runs before the page paints so there is no flash of the wrong colour.
   Default = 'dark' (black). Change both 'dark' to 'light' for a white default.
   The same saved key ('stoarc-theme') is written by src/js/theme.js.
   Kept as a separate plain file (not inline) so the Content-Security-Policy can
   block all inline scripts. */
try{document.documentElement.dataset.theme=localStorage.getItem('stoarc-theme')||'dark'}
catch(e){document.documentElement.dataset.theme='dark'}