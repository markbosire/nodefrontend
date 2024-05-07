import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './FilterSection.css';

const FilterSection = ({ onFilterChange }) => {
  const genres = [
    "Action", "Adventure", "RPG", "Strategy", "Simulation",
    "Puzzle", "Platformer", "Racing", "Sports", "Fighting",
    "Survival", "Horror", "Mystery", "Fantasy", "Sci-Fi",
    "Sandbox", "Stealth", "Educational", "Music", "Party"
  ];

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const getPriceRangeLabel = (range) => {
    switch (range) {
      case '0-10':
        return '$0 - $10';
      case '10-20':
        return '$10 - $20';
      case '20-30':
        return '$20 - $30';
      case '30-40':
        return '$30 - $40';
      case '40+':
        return '$40+';
      default:
        return 'Free';
    }
  };

  const getDateRangeLabel = (range) => {
    switch (range) {
      case 'thisMonth':
        return `This Month (${currentMonth}/${currentYear})`;
      case 'thisYear':
        return `This Year (${currentYear})`;
      case '2020s':
        return '2020s';
      case '2010s':
        return '2010s';
      case '2000s':
        return '2000s';
      default:
        return 'All Time';
    }
  };

  const [openSection, setOpenSection] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleOptionClick = (type, option) => {
    onFilterChange(type, option);
    if (selectedOptions.includes(`${type}:${option}`)) {
      setSelectedOptions(selectedOptions.filter(opt => opt !== `${type}:${option}`));
    } else {
      setSelectedOptions([...selectedOptions, `${type}:${option}`]);
    }
  };

  const handleKeywordSearch = (e) => {
    setKeyword(e.target.value);
    onFilterChange('keyword', e.target.value);
  };

  const resetFilters = () => {
    setKeyword('');
    setSelectedOptions([]);
    onFilterChange('reset', true);
  };

  return (
    <div>
      <h3 style={{ fontSize: '1.25rem' }}>Filter (options) <span>{selectedOptions.join(', ')}</span> <span onClick={resetFilters} className="reset-filters">Reset</span></h3>
      <Form.Control type="text" placeholder="Search by keyword" value={keyword} onChange={handleKeywordSearch} />
      <br />
      <div className="filter-section" onClick={() => toggleSection('genre')}>
        <h3 style={{ fontSize: '1.25rem' }}>Genre <i className="dropdown-icon fa fa-chevron-down"></i></h3>
        <hr />
        {openSection === 'genre' && (<div className="filter-options" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {genres.map((genre) => (
            <div
              key={genre}
              onClick={() => handleOptionClick('genre', genre)}
              className="filter-option"
              style={{ fontSize: '1rem' }}
            >
              {genre} <i className={`check-icon fa ${selectedOptions.includes(`genre:${genre}`) ? 'fa-check-square-o' : 'fa-square-o'}`}></i>
            </div>
          ))}
        </div>)}
      </div>

      <div className="filter-section" onClick={() => toggleSection('priceRange')}>
        <h3 style={{ fontSize: '1.25rem' }}>Price Range <i className="dropdown-icon fa fa-chevron-down"></i></h3>
        <hr />
        {openSection === 'priceRange' && (<div className="filter-options" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <div onClick={() => handleOptionClick('priceRange', 'free')} className="filter-option" style={{ fontSize: '1rem' }}>
            Free <i className={`check-icon fa ${selectedOptions.includes('priceRange:free') ? 'fa-check-square-o' : 'fa-square-o'}`}></i>
          </div>
          <div onClick={() => handleOptionClick('priceRange', '0-10')} className="filter-option" style={{ fontSize: '1rem' }}>
            {getPriceRangeLabel('0-10')} <i className={`check-icon fa ${selectedOptions.includes('priceRange:0-10') ? 'fa-check-square-o' : 'fa-square-o'}`}></i>
          </div>
          <div onClick={() => onFilterChange('priceRange', '10-20')} className="filter-option">
              {getPriceRangeLabel('10-20')}
            </div>
            <div onClick={() => onFilterChange('priceRange', '20-30')} className="filter-option">
              {getPriceRangeLabel('20-30')}
            </div>
            <div onClick={() => onFilterChange('priceRange', '30-40')} className="filter-option">
              {getPriceRangeLabel('30-40')}
            </div>
            <div onClick={() => onFilterChange('priceRange', '40+')} className="filter-option">
              {getPriceRangeLabel('40+')}
            </div>
        </div>)}
      </div>

      <div className="filter-section" onClick={() => toggleSection('releasedate')}>
        <h3 style={{ fontSize: '1.25rem' }}>Release Date <i className="dropdown-icon fa fa-chevron-down"></i></h3>
        <hr />
        {openSection === 'releaseDate' && ( <div className="filter-options" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <div
            onClick={() => handleOptionClick('releaseDate', 'thisMonth')}
            className="filter-option"
            style={{ fontSize: '1rem' }}
          >
            {getDateRangeLabel('thisMonth')} <i className={`check-icon fa ${selectedOptions.includes('releaseDate:thisMonth') ? 'fa-check-square-o' : 'fa-square-o'}`}></i>
          </div>
          <div
              onClick={() => onFilterChange('releaseDate', 'thisYear')}
              className="filter-option"
            >
              {getDateRangeLabel('thisYear')}
            </div>
            <div
              onClick={() => onFilterChange('releaseDate', '2020s')}
              className="filter-option"
            >
              {getDateRangeLabel('2020s')}
            </div>
            <div
              onClick={() => onFilterChange('releaseDate', '2010s')}
              className="filter-option"
            >
              {getDateRangeLabel('2010s')}
            </div>
            <div
              onClick={() => onFilterChange('releaseDate', '2000s')}
              className="filter-option"
            >
              {getDateRangeLabel('2000s')}
            </div>
        </div>)}
      </div>
    </div>
  );
};

export default FilterSection;