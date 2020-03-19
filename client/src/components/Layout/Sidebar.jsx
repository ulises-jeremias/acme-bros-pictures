import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Icon,
  Header,
  Menu,
  Search,
} from 'semantic-ui-react';

const LeftMenu = (props) => {
  const {
    searchbox,
    smallMenu,
    translate,
    onSearchChange,
    onSearchFocus,
    onResultSelect,
    resultRenderer,
    results,
    searchValue,
    isFetching,
  } = props;

  return (
    <Menu
      className={`left-menu ${smallMenu ? 'small-menu' : ''}`}
      fixed="left"
      borderless
      vertical
      size="large"
    >
      <Menu.Item className="section">
        <Header as="h4" style={{ opacity: 0.65 }}>
          Menu
        </Header>
        {
          searchbox && (
            <Search
              icon={<Icon name="search" color="red" />}
              fluid
              value={searchValue}
              results={results}
              onResultSelect={onResultSelect}
              onSearchChange={onSearchChange}
              onFocus={onSearchFocus}
              resultRenderer={resultRenderer}
              loading={isFetching}
              noResultsMessage={translate('search.notFound')}
              placeholder={translate('search.message')}
              size="small"
            />
          )
        }
      </Menu.Item>
      <Menu.Item as={Link} to="/">
        {translate('projects')}
      </Menu.Item>
      <Menu.Item as={Link} to="/projects/create">
        {translate('createProject')}
      </Menu.Item>
    </Menu>
  );
};

const Sidebar = (props) => {
  const {
    smallMenu,
    children,
    onSearchChange,
    onSearchFocus,
    onResultSelect,
    resultRenderer,
    results,
    searchValue,
    isFetching,
    translate,
    searchbox,
  } = props;

  return (
    <div id="sidebar">
      <LeftMenu
        searchbox={searchbox}
        smallMenu={smallMenu}
        onSearchChange={onSearchChange}
        onSearchFocus={onSearchFocus}
        onResultSelect={onResultSelect}
        resultRenderer={resultRenderer}
        results={results}
        isFetching={isFetching}
        searchValue={searchValue}
        translate={translate}
      />
      <div className={`container-content ${smallMenu ? 'small-menu-content' : 'menu-content'}`}>
        {children}
      </div>
    </div>
  );
};

LeftMenu.propTypes = {
  translate: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onSearchFocus: PropTypes.func.isRequired,
  onResultSelect: PropTypes.func.isRequired,
  resultRenderer: PropTypes.func.isRequired,
  smallMenu: PropTypes.bool.isRequired,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
  searchValue: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  searchbox: PropTypes.bool.isRequired,
};

Sidebar.defaultProps = {
  children: null,
  smallMenu: false,
  onSearchChange: () => null,
  onSearchFocus: () => null,
  onResultSelect: () => null,
  resultRenderer: () => null,
  results: [],
  searchValue: '',
  isFetching: false,
  searchbox: false,
};

Sidebar.propTypes = {
  translate: PropTypes.func.isRequired,
  children: PropTypes.node,
  smallMenu: PropTypes.bool,
  onSearchChange: PropTypes.func,
  onSearchFocus: PropTypes.func,
  onResultSelect: PropTypes.func,
  resultRenderer: PropTypes.func,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ),
  searchValue: PropTypes.string,
  isFetching: PropTypes.bool,
  searchbox: PropTypes.bool,
};

export default Sidebar;
