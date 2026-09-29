/** System notifications for when a countdown ends while the user is in another window or app. */

function supported(): boolean {
  return typeof Notification !== 'undefined'
}

/** Call from a user gesture (e.g. the Start button). Only asks while the user hasn't answered yet. */
export function requestNotificationPermission(): void {
  if (!supported() || Notification.permission !== 'default') return
  try {
    void Notification.requestPermission().catch(() => {})
  } catch {
    // Old Safari only supports the callback form; skip rather than special-case it.
  }
}

export function notify(title: string, body: string): void {
  if (!supported() || Notification.permission !== 'granted') return
  try {
    const notification = new Notification(title, {
      body,
      // Replaces the previous notification instead of stacking them.
      tag: 'focus-sprout',
      icon: new URL('favicon.svg', document.baseURI).href,
    })
    notification.onclick = () => {
      window.focus()
      notification.close()
    }
  } catch {
    // Some browsers (e.g. Chrome on Android) only allow notifications from a service worker.
  }
}
