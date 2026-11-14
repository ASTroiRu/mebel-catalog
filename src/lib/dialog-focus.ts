/** Keep keyboard traversal inside the native modal, including browser-chrome boundaries. */
export function containDialogTab(event: Pick<KeyboardEvent, 'key' | 'shiftKey' | 'preventDefault'>, dialog: HTMLDialogElement | null) {
  if (event.key !== 'Tab' || !dialog?.open) return;
  const controls = Array.from(dialog.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]'))
    .filter(element => element.tabIndex >= 0 && !element.matches(':disabled') && !element.closest('[hidden], [inert]'));
  const first = controls[0];
  const last = controls.at(-1);
  if (!first || !last) { event.preventDefault(); dialog.focus(); return; }
  const active = dialog.ownerDocument.activeElement;
  if (event.shiftKey && (active === first || !controls.includes(active as HTMLElement))) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault(); first.focus();
  }
}
