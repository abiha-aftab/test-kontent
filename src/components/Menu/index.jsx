import React from 'react'
import { Link } from 'gatsby'
import { menuItemPath } from '../../utils/paths'

class Menu extends React.Component {
  render() {
    const menu = this.props.data

    const menuBlock = (
      <ul className="menu__list">
        {menu.elements.menu_items.value.map((item) => (
          <li className="menu__list-item" key={item.id}>
            <Link
              to={menuItemPath(item.elements.slug.value)}
              className="menu__list-item-link"
              activeClassName="menu__list-item-link--active"
            >
              {item.elements.label.value}
            </Link>
          </li>
        ))}
      </ul>
    )

    return (
      <nav className="menu" aria-label="Main">
        {menuBlock}
      </nav>
    )
  }
}

export default Menu
