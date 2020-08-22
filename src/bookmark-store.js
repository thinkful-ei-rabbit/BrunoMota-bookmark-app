/**
 * @type {object}
 * @const
 * @prop {array} bookmarks - an array of bookmark objects
 * @prop {boolean} addBookmark - boolean to toggle between displaying the add bookmarks view
 */
const LIST = {
  bookmarks: [],
  addBookmark: false,
  filterRating: 1
};

/**
 * 
 * @param {number} id
 * @param {string} title 
 * @param {string} url 
 * @param {string} desc 
 * @param {number} rating 
 */
const addBookmark = (bookmark) => {
  let newBookmark = {
    id: bookmark.id,
    title: bookmark.title,
    url: bookmark.url,
    desc: bookmark.desc,
    rating: bookmark.rating,
    expanded: false
  };

  LIST.bookmarks.push(newBookmark);
};

const findAddUpdateBookmarkView = (id) => {
  let bookmark = LIST.bookmarks.find(bookmark => bookmark.id === id);
  bookmark.expanded = !bookmark.expanded;
  Object.assign(LIST, bookmark);
};

const deleteBookmark = (id) => {
  let newBookmarks = LIST.bookmarks.filter(bookmark => bookmark.id !== id);
  LIST.bookmarks = newBookmarks;
};


export default {
  LIST,
  addBookmark,
  findAddUpdateBookmarkView,
  deleteBookmark
};