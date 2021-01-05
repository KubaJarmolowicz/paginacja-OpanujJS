// Import stylesheets
import "./style.css";

// REFFERENCE

const daisplayListContainer = document.querySelector(".list-container");
const paginationContainer = document.querySelector(".pagination");

//DATABASE

const tailwindStyles = {
  pagination_ul: "flex pl-0 list-none rounded my-2",
  previous_btn:
    "relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 ml-0 rounded-l hover:bg-gray-200",
  next_btn:
    "relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 rounded-r hover:bg-gray-200",
  page_number_btn:
    "relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 hover:bg-gray-200"
};

//STATE LOGIC

const listToDisplay = [
  "Peter Petrelli",
  "Claire Bennet",
  "Hiro Nakamura",
  "Peter Petrelli",
  "Claire Bennet",
  "Hiro Nakamura"
];

const appConfig = {
  currentPage: 1,
  itemsPerPage: 2,
  totalPages() {
    return Math.ceil(listToDisplay.length / this.itemsPerPage);
  }
};

// DISPLAYED LIST VIEW

const createListItem = name => {
  return `<div class="flex cursor-pointer my-1 hover:bg-blue-lightest rounded">
									<div class="w-4/5 h-10 py-3 px-1">
										<p class="hover:text-blue-dark">${name}</p>
									</div>
								</div>`;
};

const getDataForSinglePage = (allDataArray, { currentPage, itemsPerPage }) => {
  const requiredData = allDataArray.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return requiredData;
};

const composeDisplayList = (dataToRenderArray, listItemconstructor) => {
  return dataToRenderArray
    .map(singleDataItem => {
      return listItemconstructor(singleDataItem);
    })
    .join("");
};

// PAGINATION VIEW

const shouldDisplayPrevious = () => appConfig.currentPage !== 1;
const shouldDisplayNext = () =>
  appConfig.currentPage !== appConfig.totalPages();

const createPaginationBtn = (styling, innerText) => {
  let btn = document.createElement("li");
  btn.setAttribute("class", styling);
  btn.classList.add("page-nav");
  btn.innerHTML = `<a class="page-link" href="#">${innerText}</a>`;

  return btn;
};

const createPaginationList = () => {
  const listStyle = tailwindStyles.pagination_ul;
  let list = document.createElement("ul");
  list.setAttribute("class", listStyle);
  return list;
};

const composePaginationList = (
  numberedBtnsQuantity,
  listConstructor,
  btnConstructor
) => {
  const list = listConstructor();

  if (numberedBtnsQuantity === 1) return list;

  const previous_Btn = btnConstructor(tailwindStyles.previous_btn, "Previous");
  previous_Btn.classList.add("prev");
  const next_Btn = btnConstructor(tailwindStyles.next_btn, "Next");
  next_Btn.classList.add("next");

  list.appendChild(previous_Btn);

  for (let i = 1; i <= numberedBtnsQuantity; i++) {
    const pageBtn = btnConstructor(tailwindStyles.page_number_btn, `${i}`);
    list.appendChild(pageBtn);
  }

  list.appendChild(next_Btn);

  return list;
};

const highlightCurrentPageNumber = ({ currentPage }) => {
  const allPageButtons = Array.from(document.querySelectorAll(".page-nav"));
  allPageButtons.forEach(button => {
    button.classList.remove("font-black");
  });
  allPageButtons.filter(button => {
    if (button.innerText === currentPage.toString())
      button.classList.add("font-black");
  });
};

const evaluatePrevNextDisplay = () => {
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  if (!(prevBtn || nextBtn)) return null;

  shouldDisplayPrevious()
    ? prevBtn.classList.remove("hidden")
    : prevBtn.classList.add("hidden");

  shouldDisplayNext()
    ? nextBtn.classList.remove("hidden")
    : nextBtn.classList.add("hidden");
};

//HIGHER ABSTRACTION

const renderPage = appConfig => {
  renderCurrentList(appConfig);
  highlightCurrentPageNumber(appConfig);
  evaluatePrevNextDisplay();
};

const navigatePages = event => {
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  if (event.currentTarget === prevBtn) {
    appConfig.currentPage--;

    renderPage(appConfig);
    return;
  }
  if (event.currentTarget === nextBtn) {
    appConfig.currentPage++;

    renderPage(appConfig);
    return;
  }
  appConfig.currentPage = parseInt(event.target.innerText);

  renderPage(appConfig);
};

const renderCurrentList = appConfig => {
  const currentPageData = getDataForSinglePage(listToDisplay, appConfig);
  const currentPageList = composeDisplayList(currentPageData, createListItem);

  daisplayListContainer.innerHTML = currentPageList;
};

// ENTRY POINT

const paginationList = composePaginationList(
  appConfig.totalPages(),
  createPaginationList,
  createPaginationBtn
);

paginationContainer.appendChild(paginationList);

renderPage(appConfig);

document.querySelectorAll(".page-nav").forEach(button => {
  button.addEventListener("click", navigatePages);
});
