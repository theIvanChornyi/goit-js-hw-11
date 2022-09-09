import './css/styles.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import  Newitems  from './js/RequestClass';

const searchingForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const showMoreBtn = document.querySelector('.load-more');
const CARDS_ON_PAGE = 40;

const getItems = new Newitems();
const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionType: 'attr',
  captionsData:	'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  docClose: true,
});

searchingForm.addEventListener('submit', initialGalleryEl);
showMoreBtn.addEventListener('click', addGalleryEl);
gallery.addEventListener('click', (e) => e.preventDefault());

async function initialGalleryEl(event) {
  event.preventDefault();
  getItems.search = event.target.searchQuery.value.trim();
  getItems.resetPage();
  const {totalCards} = await createElems(parseHtml);
  if (totalCards > CARDS_ON_PAGE) {
    await apearBtn(showMoreBtn);
  }
  await Notify.info(`Hooray! We found ${totalCards} images.`);

}

async function addGalleryEl() {
  const {amountCards,} = await createElems(insertHtml); 
  await slowScroll(gallery);
  if (amountCards < CARDS_ON_PAGE) {
    await disappearBtn(showMoreBtn);
    await Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

function getGalleryHtml(Array) {
  return Array.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `<div class="photo-card post">
              <a href="${largeImageURL}">
                <img
                  class="gallery-image"
                  src="${webformatURL}"
                  alt="${tags}"
                  loading="lazy"
                />
              </a>
              <div class="info">
                <p class="info-item">
                  <b>Likes</b>
                  ${likes}
                </p>
                <p class="info-item">
                  <b>Views</b>
                  ${views}
                </p>
                <p class="info-item">
                  <b>Comments</b>
                  ${comments}
                </p>
                <p class="info-item">
                  <b>Downloads</b>
                  ${downloads}
                </p>
              </div>
            </div>`;
   }).join('');
}

async function createElems(callback) {
  try {
    const { hits: dataCard, total: totalCards } = await (await getItems.request()).data;
    const amountCards = dataCard.length;
    if (amountCards < 1) { 
      destroyHtml(gallery);
      disappearBtn(showMoreBtn);
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }
    const Htmlstring = await getGalleryHtml(dataCard);
    await callback(Htmlstring);
    getItems.updatePage();
    lightbox.refresh();
    return ({totalCards, amountCards});
  } catch (error) {
    Notify.failure(error.mesage);
  }
}

function parseHtml(htmlstring) {
  gallery.innerHTML = htmlstring;
}

function insertHtml(htmlstring) {
  gallery.insertAdjacentHTML("beforeend",htmlstring);
}

function destroyHtml(where) {
  where.innerHTML = '';
}

function slowScroll(where) {
  const { height } = where.getBoundingClientRect();
  let scrollValue = 0;
  window.scrollBy({
    top: scrollValue +=height,
    behavior: "smooth"
  });
}

function apearBtn(where) {
  where.classList.remove('visually-hidden');
}

function disappearBtn(where) {
  where.classList.add('visually-hidden');
}