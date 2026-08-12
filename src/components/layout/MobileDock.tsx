import { NavLink } from 'react-router-dom'
import { navigation } from './navigation'

const dockPaths = ['/', '/save', '/people', '/decision', '/quest']

export function MobileDock() {
  return <nav className="mobile-dock" aria-label="手机主导航">{navigation.filter((item) => dockPaths.includes(item.path)).map(({ path, short, icon: Icon }) => <NavLink key={path} to={path} end={path === '/'}><Icon size={19} /><span>{short}</span></NavLink>)}</nav>
}
