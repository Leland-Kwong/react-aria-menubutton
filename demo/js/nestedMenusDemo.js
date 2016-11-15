import React from 'react';
import ReactDOM from 'react-dom';
import { Wrapper, Button, Menu, MenuItem, openMenu, closeMenu } from '../..';

const words = ['pectinate', 'borborygmus', 'anisodactylous', 'barbar', 'pilcrow', 'destroy'];
/**
 * returns a unique identifier by incrementing the internal state each time its called
 * @return {Number}          [description]
 */
const generateScope = (function() {
  let scopeGenerated = 0;
  return () => scopeGenerated++;
})();

const noop = () => {};
const SubMenu = ({ id, text }, context) => {
  return (
    <Wrapper
      id={id}
      onSelection={noop}
      className='AriaMenuButton__SubMenu'
    >
      <Button tabIndex={null}>Open nested menu {text}</Button>
      <Menu>
        <MenuItem text='a'>Nested Menu Item 1</MenuItem>
        <MenuItem text='b'>Nested Menu Item 2</MenuItem>
      </Menu>
    </Wrapper>
  );
};

class MenuItemElements extends React.Component {
  componentWillMount() {
    // the scope is used for generating a unique id for each subMenu
    this.scope = generateScope();
    this.state = {
      subMenuOpen: false
    };
  }

  openMenu(menuId) {
    openMenu(menuId, { focusMenu: true });
    this.setState({ subMenuOpen: true });
  }

  render() {
    const { subMenuOpen } = this.state;
    const { selected, items } = this.props;
    const { ambManager } = this.context;
    const menuItemElements = items.map((value, i) => {
      let itemClass = 'AriaMenuButton-menuItem';
      if (selected === value) {
        itemClass += ' is-selected';
      }
      const display = (value === 'destroy') ? 'destroy this menu' : value;
      const menuId = `${this.scope}.${i}`;
      const text = String.fromCharCode(97 + i);
      return (
        <li className='AriaMenuButton-menuItemWrapper' key={i}>
          <MenuItem
            className={itemClass}
            value={value}
            id={menuId}
            text={text}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && subMenuOpen) {
                ambManager.focusItem(i);
                this.setState({ subMenuOpen: false });
                event.preventDefault();
                event.stopPropagation();
              } else if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
                this.openMenu(menuId);
              } else if (event.key === 'ArrowLeft') {
                closeMenu(menuId);
                ambManager.focusItem(i);
                this.setState({ subMenuOpen: false });
              }
            }}
          >
            <SubMenu text={text} id={menuId} />
          </MenuItem>
        </li>
      );
    });

    return (
      <ul className='AriaMenuButton-menu'>
        {menuItemElements}
      </ul>
    );
  }
}
MenuItemElements.contextTypes = {
  ambManager: React.PropTypes.object.isRequired,
}

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: '' };
  }

  handleSelection(value) {
    this.setState({ selected: value });
  }

  render() {
    const { selected } = this.state;

    return (
      <div>
        <Wrapper
          className='AriaMenuButton'
          closeOnSelection={false}
          onSelection={this.handleSelection.bind(this)}
        >
          <Button className='AriaMenuButton-trigger'>
            Select a word
          </Button>
          <Menu>
            <MenuItemElements items={words} selected={selected} />
          </Menu>
        </Wrapper>
        <span style={{ marginLeft: '1em' }}>
          Your last selection was: <strong>{selected}</strong>
        </span>
      </div>
    );
  }
}

ReactDOM.render(
  <Demo />,
  document.getElementById('demo-nested-menus')
);
