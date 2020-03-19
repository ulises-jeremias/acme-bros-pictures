import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'underscore';
import {
  Breadcrumb,
  Dropdown,
  Icon,
  Image,
  Menu,
  Responsive,
} from 'semantic-ui-react';

class Navbar extends Component {
  renderDesktopNavbar() {
    const {
      onChangeSizeButtonClick,
      sidebar,
      smallMenu,
      color,
      inverted,
      translate,
      options,
      optionsPosition,
      active,
      logo,
      version,
      showProfilePath,
    } = this.props;

    void translate;

    return (
      <Menu id="navbar" color={color || 'orange'} inverted={inverted} fixed="top" borderless>
        <Menu.Item>
          <Breadcrumb className="navbar-title" size="large">
            {sidebar && (
              <Breadcrumb.Section>
                <Icon
                  link
                  style={{ marginRight: '17px' }}
                  color={color || 'orange'}
                  inverted={inverted}
                  name={smallMenu ? 'indent' : 'outdent'}
                  onClick={onChangeSizeButtonClick}
                />
              </Breadcrumb.Section>
            )}
            <Breadcrumb.Section active as={Link} to="/">
              <Image src={logo} size="small" spaced="left" style={{ marginRight: '0.3em' }} />
              <span className="white-link">
                {' '}
                <span style={{ marginLeft: '0.3em' }}>{version}</span>
              </span>
            </Breadcrumb.Section>
          </Breadcrumb>
        </Menu.Item>
        {
          optionsPosition === 'left' && (
            <Menu.Menu>
              {
                Array.from(options || []).map(({ name, icon, to }, key) => (
                  <Menu.Item
                    key={`${key + 1}${name}`}
                    as={Link}
                    to={to}
                    name={name}
                    active={active === name}
                  >
                    {_.isString(icon) ? (
                      <Icon name={icon} inverted={inverted} color={color || 'orange'} size="large" />
                    ) : icon}
                  </Menu.Item>
                ))
              }
            </Menu.Menu>
          )
        }
        <Menu.Menu position="right">
          {
            optionsPosition === 'right' && (
              Array.from(options || []).map(({ name, icon, to }, key) => (
                <Menu.Item
                  key={`${key + 1}${name}`}
                  as={Link}
                  to={to}
                  name={name}
                  active={active === name}
                >
                  {_.isString(icon) ? (
                    <Icon name={icon} inverted={inverted} color={color || 'orange'} size="large" />
                  ) : icon}
                </Menu.Item>
              ))
            )
          }
          {showProfilePath && (
            <Menu.Item as={Link} to="/profile">
              <Icon name="user" inverted={inverted} color={color || 'orange'} size="large" />
            </Menu.Item>
          )}
          <Menu.Item as={Link} to="/logout">
            <Icon name="log out" inverted={inverted} color={color || 'orange'} size="large" />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }

  renderMobileNavbar() {
    const {
      onChangeSizeButtonClick,
      sidebar,
      smallMenu,
      color,
      inverted,
      translate,
      options,
      active,
      logo,
      logoMobile,
      version,
      showProfilePath,
    } = this.props;

    return (
      <Menu id="navbar" color={color || 'orange'} inverted={inverted} fixed="top" fluid widths={3} borderless>
        <Menu.Item>
          {sidebar && (
            <Icon
              link
              color={color || 'orange'}
              inverted={inverted}
              name={smallMenu ? 'indent' : 'outdent'}
              style={{ zIndex: 2001 }}
              onClick={onChangeSizeButtonClick}
            />
          )}
        </Menu.Item>
        <Menu.Item as={Link} to="/">
          <Image src={logoMobile || logo} verticalAlign="middle" className="mobile" size="small" style={{ marginRight: '0.5em' }} />
          <span className="white-link"><span style={{ marginLeft: '0.3em' }}>{version}</span></span>
        </Menu.Item>
        <Menu.Item position="right">
          <Dropdown color={color} icon="bars">
            <Dropdown.Menu style={{ marginTop: '20px', marginRight: '-200%' }}>
              {
                Array.from(options || []).map(({
                  name, description, icon, to,
                }, key) => (
                  <Dropdown.Item
                    key={`${key + 1}${name}`}
                    as={Link}
                    to={to}
                    active={active === name}
                  >
                    {_.isString(icon) ? (
                      <Icon name={icon} color={color || 'orange'} inverted={inverted} size="large" />
                    ) : icon}
                    { description }
                  </Dropdown.Item>
                ))
              }
              <Dropdown.Divider />
              {showProfilePath && (
                <Dropdown.Item as={Link} to="/profile">
                  <span>
                    <Icon name="user" size="large" color={color || 'orange'} inverted={inverted} />
                    { translate('profile') }
                  </span>
                </Dropdown.Item>
              )}
              <Dropdown.Item as={Link} to="/logout">
                <span>
                  <Icon name="log out" color={color || 'orange'} inverted={inverted} />
                  { translate('logout') }
                </span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    return (
      <>
        <Responsive {...Responsive.onlyMobile}>
          { this.renderMobileNavbar() }
        </Responsive>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          { this.renderDesktopNavbar() }
        </Responsive>
      </>
    );
  }
}

Navbar.defaultProps = {
  onChangeSizeButtonClick: null,
  color: 'orange',
  sidebar: false,
  smallMenu: true,
  options: [],
  optionsPosition: 'right',
  active: '',
  logo: '',
  logoMobile: '',
  showProfilePath: true,
  version: '',
  inverted: false,
};

Navbar.propTypes = {
  onChangeSizeButtonClick: PropTypes.func,
  translate: PropTypes.func.isRequired,
  color: PropTypes.string,
  sidebar: PropTypes.bool,
  smallMenu: PropTypes.bool,
  active: PropTypes.string,
  logo: PropTypes.string,
  logoMobile: PropTypes.string,
  version: PropTypes.string,
  showProfilePath: PropTypes.bool,
  inverted: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      icon: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string,
      ]).isRequired,
      to: PropTypes.string.isRequired,
    }),
  ),
  optionsPosition: PropTypes.oneOf(['left', 'right']),
};

export default Navbar;
