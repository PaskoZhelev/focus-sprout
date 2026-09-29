import { useTheme, type ThemePreference } from '../hooks/useTheme'
import { playChime } from '../lib/chime'
import { setSoundEnabled, useSoundEnabled } from '../lib/sound'
import { ChoiceGroup } from './ChoiceGroup'

const THEME_OPTIONS = [
  { value: 'system', label: 'Auto' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const satisfies readonly { value: ThemePreference; label: string }[]

const SOUND_OPTIONS = [
  { value: 'on', label: 'On' },
  { value: 'off', label: 'Off' },
] as const

export function Preferences() {
  const [theme, setTheme] = useTheme()
  const soundOn = useSoundEnabled()

  const changeSound = (value: 'on' | 'off') => {
    setSoundEnabled(value === 'on')
    // Preview so the user knows what they turned on.
    if (value === 'on') playChime()
  }

  return (
    <>
      <ChoiceGroup legend="Theme" options={THEME_OPTIONS} value={theme} onChange={setTheme} />
      <ChoiceGroup legend="Sound" options={SOUND_OPTIONS} value={soundOn ? 'on' : 'off'} onChange={changeSound} />
    </>
  )
}
