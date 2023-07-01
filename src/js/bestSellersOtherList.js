import { topBooks, selectedCategory } from './api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import { modalOpen } from './popUp';

const booksList = document.querySelector('.js-gallery-books');
const galleryTitle = document.querySelector('.gallery-heading');

getTopBooks().then(data => {
  if (data.length === 0) {
    Notify.failure(
      'Sorry, there are no best sellers books. '
    );
    return;
  }
  galleryTitle.insertAdjacentHTML('beforeend', createTitleMarcup());
  booksList.insertAdjacentHTML('beforeend', createBooklistMarcup(data));

  const galeryList = document.querySelectorAll('.gallery-book-cards');
  galeryList.forEach(element => {
    element.addEventListener('click', onBtnOpen);
  });
});

function createTitleMarcup() {
  return 'Best Sellers <span class="gallery-heading-span">Books</span>';
}

function createBooklistMarcup(data) {
  const marcup = [];

 

  data.forEach((element, i) => {
    const booksArr = data[i].books;
    const bookCards = [];

    booksArr.forEach(({ _id, book_image, title, author }) => {
    
      if (!book_image) {
        book_image = '../img/bestsellers/book-cover-min.png';
      }

      const bookCardsMarcup = `<li id="${_id}" class = "gallery-book-cards">
              <div class = "card-container">
                <img class="gallery-books-img" src="${book_image}" alt="${title}" loading="lazy">
                  <div class="port-overlay">
                    <p>quick view</p>
                  </div>
              </div>
                <h2 class="gallery-books-title">${title}</h2>
                <p class="gallery-books-author">${author}</p>
                </li>`;

      bookCards.push(bookCardsMarcup);
    });

    const btnSeeMore = `<button type="button" id="${data[i].list_name}" class="see-more">
        see more
      </button>`;

    marcup.push(`<li class = "category-page">
            <p class = "gallery-category-heading">${data[i].list_name}</p>
            <ul class = "category-page-list">${bookCards.join('')}</ul>
            ${btnSeeMore}
            </li>`);
  });

  return marcup.join('');
}
function onBtnOpen(evt) {
  const bookId = evt.currentTarget.id;
  modalOpen(bookId);
}



const eventLister = document.querySelector('.gallery-books');
let categoryValue = 'ALL CATEGORIES';


eventLister.addEventListener('click', onMoreBtnClick);
function onMoreBtnClick(e) {
  if (e.target.localName === 'button') {
    categoryValue = e.target.getAttribute('id');

    addCardsByCategory();
    changeColorTitle(categoryValue);
  }
}


function addCardsByCategory() {
  selectedCategory(categoryValue).then(booksArr => {
    if (!booksArr.length) {
      Notify.failure(
        `Sorry, there are no ${categoryValue} books. Please choose another category.`
      );
      return;
    }

    galleryTitle.innerHTML = categoryValue;
    booksList.innerHTML = createMoreBooks(booksArr);

    addColorToTitle();
    addModal();
  });
}


function addColorToTitle() {
  const textGalleryTitle = galleryTitle.innerHTML;

  let wordsArray = categoryValue.split(' ');
  let lastWord = wordsArray.pop();
  let firstPart = wordsArray.join(' ');

  galleryTitle.innerHTML = `${firstPart} <span class="gallery-heading-span-accent">${lastWord}</span>`;
}


function addModal() {
  const booksGalleryCards = document.querySelectorAll('.gallery-book-cards');

  booksGalleryCards.forEach(card => {
    card.addEventListener('click', onBtnOpen);
  });
}


const btnUp = {
  el: document.querySelector('.btn-up'),
  show() {
    // удалим у кнопки класс btn-up_hide
    this.el.classList.remove('btn-up_hide');
  },
  hide() {
    // добавим к кнопке класс btn-up_hide
    this.el.classList.add('btn-up_hide');
  },
  addEventListener() {
    // при прокрутке содержимого страницы
    window.addEventListener('scroll', () => {
      // определяем величину прокрутки
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      // если страница прокручена больше чем на 400px, то делаем кнопку видимой, иначе скрываем
      scrollY > 400 ? this.show() : this.hide();
    });
    // при нажатии на кнопку .btn-up
    document.querySelector('.btn-up').onclick = () => {
      // переместим в начало страницы
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }
}

btnUp.addEventListener();