import React from 'react'
import { profileUrl } from '../../utils/profiles'
import './style.scss'
import '../../assets/fonts/fontello-771c82e0/css/fontello.css'

const NETWORKS = [
  {
    network: 'twitter',
    icon: 'icon-twitter',
    label: 'Twitter',
    external: true,
  },
  { network: 'github', icon: 'icon-github', label: 'GitHub', external: true },
  { network: 'vk', icon: 'icon-vkontakte', label: 'VK', external: true },
  { network: 'email', icon: 'icon-mail', label: 'Email' },
  {
    network: 'telegram',
    icon: 'icon-paper-plane',
    label: 'Telegram',
    external: true,
  },
]

const Links = ({ data }) => {
  const links = NETWORKS.map((entry) => ({
    ...entry,
    url: profileUrl(entry.network, data.elements[entry.network].value),
  })).filter((entry) => entry.url)

  if (links.length === 0) return null

  return (
    <div className="links">
      <ul className="links__list">
        {links.map(({ network, icon, label, url, external }) => (
          <li
            className="links__list-item"
            key={network}
            data-kontent-element-codename={network}
          >
            <a
              href={url}
              aria-label={label}
              {...(external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              <i className={icon} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Links
