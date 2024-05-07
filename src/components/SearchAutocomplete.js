import React, { useState, useEffect } from 'react';

const SearchAutocomplete = ({ items, onSelect, placeholder = 'Search...' }) => {
  const [userInput, setUserInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const MAX_SUGGESTIONS = 7; // Maximum number of suggestions to display

  // Handle user input changes and filter suggestions efficiently
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (userInput.length > 2) { // Adjust minimum search length as needed
        setIsLoading(true);
        const filteredSuggestions = items.filter((item) =>
          item.toLowerCase().startsWith(userInput.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
        setIsLoading(false);
      } else {
        setSuggestions([]);
      }
    }, 200); // Adjust debounce time for performance if needed

    return () => clearTimeout(timeoutId);
  }, [userInput, items]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    onSelect(suggestion);
    setUserInput(suggestion);
    setSuggestions([]); // Clear suggestions on selection
  };

  const handleViewMoreClick = () => {
    // Handle view more action (e.g., navigate to a full results page)
    console.log('View More clicked');
  };

  return (
    <div className="search-autocomplete">
      <div className="input-group">
        <span className="input-group-prepend text-dark">
          <button
            className="btn btn-outline-secondary bg-white border-end-0 border ms-n5 border-dark rounded-0"
            type="button"
          >
            <i className="fa fa-search"></i>
          </button>
        </span>
        <input
          className="form-control border-start-0 border border-dark rounded-0 shadow-none text-dark outline-none"
          style={{ width: '260px' }}
          type="search"
          id="example-search-input"
          placeholder={placeholder}
          value={userInput}
          onChange={handleInputChange}
        />
      </div>

      {suggestions.length > 0 && (
        <ul
          className="suggestions list-group border border-dark rounded-0 border-top-0"
          style={{ width: '300px', position: 'absolute', zIndex: 10 }}
        >
          {suggestions.slice(0, MAX_SUGGESTIONS).map((suggestion, index) => (
            <li
            role='button'
              key={index}
              className="list-group-item action border-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
          {suggestions.length > MAX_SUGGESTIONS && (
            <li className="list-group-item d-flex justify-content-between align-items-center border-0">
              <span style={{textDecoration:"underline",cursor:"pointer"}}>View More</span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchAutocomplete;
