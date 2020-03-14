import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Header,
  Menu,
  Search,
  Segment,
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
    menuComponent,
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
        <Header as="h4">
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
      {menuComponent}
      <Segment
        style={{
          borderRadius: 0,
          position: 'absolute',
          bottom: '55px',
          width: '260px',
          backgroundColor: 'transparent',
        }}
        padded
        inverted
      >
        {translate('contact')}
        <Icon color="green" name="whatsapp" />
      </Segment>
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
    menuComponent,
  } = props;

  return (
    <div id="sidebar">
      <LeftMenu
        smallMenu={smallMenu}
        onSearchChange={onSearchChange}
        onSearchFocus={onSearchFocus}
        onResultSelect={onResultSelect}
        resultRenderer={resultRenderer}
        results={results}
        isFetching={isFetching}
        searchValue={searchValue}
        translate={translate}
        menuComponent={menuComponent}
      />
      <div className={`container-content ${smallMenu ? 'small-menu-content' : ''}`}>
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
};

Sidebar.propTypes = {
  translate: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  smallMenu: PropTypes.bool.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onSearchFocus: PropTypes.func.isRequired,
  onResultSelect: PropTypes.func.isRequired,
  resultRenderer: PropTypes.func.isRequired,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
  searchValue: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default Sidebar;
