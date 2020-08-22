import $ from 'jquery';
import cuid from 'cuid';
import bookmarkStore from './bookmark-store';
import api from './api';



// HTML Templates

/**
 * Bookmarks List Template
 * Returns a HTML snippet for the main bookmarks view
 * @returns {string} HTML snippet main
 */
const generateBookmarksList = () => {
  let bookmarks = [];
  for(let bookmark of bookmarkStore.LIST.bookmarks){
    if(bookmark.rating >= bookmarkStore.LIST.filterRating || bookmark.rating === null){
      bookmarks.push(generateBookmark(bookmark));
    }
  }

  return `
  <div class="bookmarks-list">
    <h1>My Bookmarks</h1>
    <button class="add-bookmark">Add Bookmark</button>
    <select name="minimum-rating" id="minimum-rating">
      <option>Minimum Rating</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
    <hr>
    ${bookmarks.join('')}
    <p id="filter-by">Filtering by ${bookmarkStore.LIST.filterRating} star(s) and up.</p>
  </div>
  `;
};

/**
 * Bookmarks Template
 * Returns a HTML snippet of a bookmark default view is condensed
 * @param {object} bookmark
 * @returns {string} HTML snippet
 */
const generateBookmark = (bookmark) => {
  const checkedRating = '<span class="rating-checked">&#9733</span>';
  const uncheckedRating = '<span class="rating-unchecked">&#9734</span>';

  let newRatings = [];

  for(let i = 0; i < bookmark.rating; i++){
    newRatings.push(checkedRating);
  }

  for(let i = 0; i < 5 - bookmark.rating; i++){
    newRatings.push(uncheckedRating);
  }

  return `
  <div class="bookmark" data-item-id="${bookmark.id}">
    <h3 class="bookmark-title">${bookmark.title}</h3>
    <p class="bookmark-description ${!bookmark.expanded ? 'bookmark-condensed':''}">${bookmark.desc === '' ? 'No description': bookmark.desc}</p>
    <a href="${bookmark.url}" target="_blank" class="bookmark-link ${!bookmark.expanded ? 'bookmark-condensed':''}">Visit Site</a>
    <div class="bookmark-rating">
    ${newRatings.join('')}
    </div>
    <button class="bookmark-delete ${!bookmark.expanded ? 'bookmark-condensed':''}">Delete</button>
  </div>
  `;
};

/**
 * Add Bookmark Form Template
 * Returns a HTML snippet for adding a bookmark via form
 * @return {string} HTML snippet 
 */
const addBookmarkForm = () => {
  return `
  <div class="add-bookmark-form-container">
    <h2>Create a bookmark: </h2>
    <form action="" class="add-bookmark-form">
      <label for="bookmark-title">*Title:</label>
      <input type="text" name="bookmark-title" id="bookmark-title" class="data-bookmark-title" placeholder="title">
      <br>
      <label for="bookmark-url">*URL:</label>
      <input type="text" name="bookmark-url" id="bookmark-url" class="data-bookmark-url" placeholder="http://example.com">
      <br>
      <label for="bookmark-url">Description:</label>
      <input type="text" name="bookmark-description" id="bookmark-description" class="data-bookmark-description" placeholder="bookmark description">
      <br>
      <p>Rating:</p>
      <label for="rating1">
        <input type="radio" name="rating" id="rating1" value="1" class="data-bookmark-rating">
        1 Star
      </label>
      <br>
      <label for="rating2">
        <input type="radio" name="rating" id="rating2" value="2" class="data-bookmark-rating">
        2 Stars
      </label>
      <br>
      <label for="rating3">
        <input type="radio" name="rating" id="rating3" value="3" class="data-bookmark-rating">
        3 Stars
      </label>
      <br>
      <label for="rating4">
        <input type="radio" name="rating" id="rating4" value="4" class="data-bookmark-rating">
        4 Stars
      </label>
      <br>
      <label for="rating5">
        <input type="radio" name="rating" id="rating5" value="5" class="data-bookmark-rating">
        5 Stars
      </label>
      <br>
      <input type="submit" value="Add Bookmark" class="add-bookmark-submit" id="add-bookmark-submit">
    </form>
    <p>* <i>required</i></p>
  </div>
  `;
};

// Render Function
/**
 * Sets the HTML contents of body to Bookmarks HTML Template
 */
const render = () => {
  $('.container').html(generateBookmarksList());
  if(bookmarkStore.LIST.addBookmark){
    $('button.add-bookmark').replaceWith(addBookmarkForm());
  }
};


const getBookmarkIdFromElement = (bookmark) => {
  return $(bookmark).closest('.bookmark').data('item-id');
};

// Event Handlers
const handleAddBookmarks = () => {
  // listens for click event on button add-bookmark child inside the body tag
  $(document).on('click', '.add-bookmark', (event) => {
    event.preventDefault();
    bookmarkStore.LIST.addBookmark = !bookmarkStore.LIST.addBookmark;
    //alert('add bookmark clicked');
    render();
  });
};

const handleFilterChange = () => {
  $(document).on('change', '#minimum-rating', (event) => {
    event.preventDefault();
    bookmarkStore.LIST.filterRating = $('#minimum-rating').val();
    console.log(bookmarkStore.LIST.filterRating);
    render();
  });
};

const handleAddBookmarksSubmit = () => {
  $(document).on('click submit', '.add-bookmark-submit', (event) => {
    event.preventDefault();
    bookmarkStore.LIST.addBookmark = !bookmarkStore.LIST.addBookmark;

    let newBookmark = {
      id: cuid(),
      title: $('#bookmark-title').val(),
      url: $('#bookmark-url').val(),
      desc: $('#bookmark-description').val(),
      rating: $('input[name=rating]:checked').val(),
      expanded: false
    };

    api.createBookmark(newBookmark).then((newBookmark) => {
      bookmarkStore.LIST.bookmarks.push(newBookmark);
      render();
    }).catch((error) => {
      alert(`${error.message}. Unable to add bookmark. Please try again.`);
    });
    render();
  });
};

const handleBookmarkToggle = () => {
  $(document).on('click', '.bookmark-title', (event) => {
    event.preventDefault();
    const id = getBookmarkIdFromElement(event.currentTarget);
    bookmarkStore.findAddUpdateBookmarkView(id);
    render();
  });
};

const handleBookmarkDelete = () => {
  $(document).on('click', '.bookmark-delete', (event) => {
    event.preventDefault();
    const id = getBookmarkIdFromElement(event.currentTarget);
    api.deleteBookmark(id).then(() => {
      bookmarkStore.deleteBookmark(id);
      render();
    }).catch((error) => {
      alert(`${error.message}. Unable to delete bookmark entry. Please try again.`);
    });
    render();
  });
};

const bindEventListeners = () => {
  handleAddBookmarks();
  handleFilterChange();
  handleBookmarkToggle();
  handleAddBookmarksSubmit();
  handleBookmarkDelete();
};


export default {
  render,
  bindEventListeners
};