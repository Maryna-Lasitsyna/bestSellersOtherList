import { topBooks, selectedCategory } from './api.js';

const booksSection = document.querySelector('.best-sellers-books');
const booksList = booksSection.querySelector('.best-books');
const seeMoreBtn = booksSection.querySelector('.see-more');

// Разметка книги


function createBookMarkup(book) {
  return `
    <div class="book">
      <div class="wrapper">
        <img src="${book.image}" alt="Book cover" />
        <p class="cards-category">${book.category}</p>
        <p class="cards-author">${book.author}</p>
      </div>
    </div>
  `;
}

// Заглушка
function showPlaceholder() {
  const placeholderImgUrl = '/src/img/bookcover-min.png';
  booksList.innerHTML = `<img class="placeholder" src="${placeholderImgUrl}" alt="Book cover" />`;
}

async function fetchPopularBooks() {
  try {
    const response = await topBooks();
    const popularBooks = response.data;
    console.log('Popular books:', popularBooks);
  } catch (error) {
    console.error('Error fetching popular books:', error);
  }
}

fetchPopularBooks();

async function fetchBooksByCategory(categoryName) {
  try {
    const response = await selectedCategory(categoryName);
    const booksInCategory = response.data;

    if (booksInCategory.length > 0) {
      booksInCategory.forEach(book => {
        const bookMarkup = createBookMarkup(book);
        booksList.insertAdjacentHTML('beforeend', bookMarkup);
      });
    } else {
      console.log(`Category "${categoryName}" has no books.`);
    }
  } catch (error) {
    console.error('Error fetching books by category:', error);
  }
}

seeMoreBtn.addEventListener('click', () => {
  booksList.classList.remove('visually-hidden');
  seeMoreBtn.style.display = 'none';
});

async function fetchBooks() {
  try {
    const response = await fetch(`${bazUrl}top-books`);
    const data = await response.json();

    if (response.ok) {
      const booksData = data.books;

      if (booksData.length > 0) {
        booksData.forEach(book => {
          const bookMarkup = createBookMarkup(book);
          booksList.insertAdjacentHTML('beforeend', bookMarkup);
        });
      } else {
        showPlaceholder();
      }
    } else {
      console.error('Error getting list of books:', data.message);
      showPlaceholder();
    }
  } catch (error) {
    console.error('Error while executing request:', error);
    showPlaceholder();
  }
}

fetchBooks();

// Список всех категорий
async function fetchAllCategoriesAndBooks() {
  try {
    const allCategories = await fetchAllCategories();
    console.log('All categories:', allCategories);

    if (allCategories.length > 0) {
      allCategories.forEach(category => {
        const categoryBtn = document.querySelector('.see-more');
        categoryBtn.addEventListener('click', () => {
          const categoryName = categoryBtn.dataset.category;
          fetchBooksByCategory(categoryName);
        });
      });
    }
  } catch (error) {
    console.error('Error fetching all categories:', error);
  }
}

fetchAllCategoriesAndBooks();

// Список книг из заданной категории
// async function fetchBooksByCategory(categoryName) {
//   try {
//     const response = await selectedCategory(categoryName);
//     const booksInCategory = response.data;

//     if (booksInCategory.length > 0) {
//       booksInCategory.forEach(book => {
//         const bookMarkup = createBookMarkup(book);
//         booksList.insertAdjacentHTML('beforeend', bookMarkup);
//       });
//     } else {
//       console.log(`Category "${categoryName}" no books.`);
//     }
//   } catch (error) {
//     console.error('Error fetching books by category:', error);
//   }
// }
