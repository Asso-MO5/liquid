import { darkModeCtrl } from "./dark-mode.ctrl"
import { Show } from "solid-js"

export const DarkMode = () => {
  const darkMode = darkModeCtrl()
  return (
    <div onClick={darkMode.toggleDarkMode} class="cursor-pointer">
      <div class="w-6 h-6 rounded-full" data-dark={darkMode.isDarkMode()}>
        <Show when={darkMode.isDarkMode() === 'light'}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-amber-600"><circle cx="12" cy="12" r="5" /><line x1="12" x2="12" y1="1" y2="3" /><line x1="12" x2="12" y1="21" y2="23" /><line x1="4.22" x2="5.64" y1="4.22" y2="5.64" /><line x1="18.36" x2="19.78" y1="18.36" y2="19.78" /><line x1="1" x2="3" y1="12" y2="12" /><line x1="21" x2="23" y1="12" y2="12" /><line x1="12" x2="14" y1="18" y2="18" /><line x1="12" x2="14" y1="6" y2="6" /></svg>
        </Show>
        <Show when={darkMode.isDarkMode() === 'dark'}>
          <svg xmlns="http://www.w3.org/2000/svg"

            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-amber-300"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
        </Show>
      </div>
    </div>
  )
}