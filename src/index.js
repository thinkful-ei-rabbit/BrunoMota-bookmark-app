import $ from 'jquery';
import bookmarkStore from './bookmark-store';
import bookmarkList from './bookmark-list';
import api from './api';

// css imports
import 'normalize.css';
import './index.css';

// Main
const main = () => {
  api.getBookmarks().then((bookmarks) => {
    bookmarks.forEach((bookmark) => bookmarkStore.addBookmark(bookmark));
    bookmarkList.render();
  });

  bookmarkList.bindEventListeners();
  bookmarkList.render();
};


$(main);