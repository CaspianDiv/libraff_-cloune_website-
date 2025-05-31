import { getAllBooks, getCategs } from "./service.js";

// Dəyişənlərin təyin olunması 
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sideBar = document.getElementById("sideBar");
const logDiv = document.getElementById("logDiv");
const basketDiv = document.getElementById("basketDiv");
const basketIcon = document.getElementById("basketIcon");
const closeBasket = document.getElementById("closeBasket");
const outset = document.getElementById("outset");
const popUp = document.getElementById("popUp");
const categSec = document.getElementById("categSec");
const subCatSec = document.getElementById("subCatSec");
const subSubCatSec = document.getElementById("subSubCatSec");
const userIcon = document.getElementById("userIcon");
const dropDownIcon = document.getElementById("dropDownIcon");
const leftCateg = document.querySelector("#leftCateg");
const classicsBooksContainer = document.querySelector("#classicsBooksContainer");
const filtersDİv = document.querySelector("#filtersDİv");
let isOpen = false;
let catData = [];
let booksData = [];

//// // // //  Side Barın çıxması
menuBtn.addEventListener("click", () => {
    sideBar.classList.remove("-translate-x-full");
});

///////////////////////  Side Barın bağlanması
closeBtn.addEventListener("click", () => {
    sideBar.classList.add("-translate-x-full");
});


//// // // // // // // // // // // User Iconun rəngin dəyişməsi

dropDownIcon.onclick = function () {
    isOpen = !isOpen;

    if (isOpen) {
        userIcon.classList.add("text-red-600");
        dropDownIcon.classList.remove("fa-caret-down");
        dropDownIcon.classList.add("fa-angle-up");
        logDiv.classList.remove("hidden");
    } else {
        userIcon.classList.remove("text-red-600");
        userIcon.classList.add("text-black");
        dropDownIcon.classList.remove("fa-angle-up");
        dropDownIcon.classList.add("fa-caret-down");
        logDiv.classList.add("hidden");
    }
};

//// // // // // // // // // // // Basketin göstərilməsi

basketIcon.onclick = () => {
    basketDiv.classList.remove("hidden");
};

////////////////////////////////// Basketin Bağlanılması
closeBasket.onclick = () => {
    basketDiv.classList.add("hidden");
};

////////////// Placeholder Animasiyası

document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll('input[placeholder*="Növbəti kitabınızı axtarın"]');
    const text = "Növbəti kitabınızı axtarın";

    inputs.forEach(input => {
        let i = text.length;
        let direction = -1;

        setInterval(() => {
            i += direction;

            if (i <= 0) direction = 1;
            if (i >= text.length) direction = -1;

            input.placeholder = text.substring(0, i);
        }, 150);
    });
});
async function printCateg() {

    // Əvvəlki məlumatların təmizlənməsi 

    categSec.innerHTML = "";
    catData = await getCategs()

    catData.forEach(book => {
        categSec.innerHTML += `
          <li onmouseover="printSub('${book.name}')"  class="category cursor-pointer">
              <p class="flex  justify-between items-center px-2 py-2 text-xs font-semibold">${book.name} <i class="fa-solid fa-angle-right"></i></p>
          </li>
        `
    });
};
printCateg();

window.printSub = function (sub) {

    // Əvvəlki məlumatların təmizlənməsi 

    subCatSec.innerHTML = "";
    subSubCatSec.innerHTML = "";

    const obj = catData.find(item => item.name == sub);
    console.log(obj);
    obj.subCateg.forEach(item => {
        subCatSec.innerHTML += `
            <li onmouseover="printSubSub('${sub}','${item.name}')" class="category cursor-pointer">
              <p class="flex  justify-between items-center px-2 py-2 text-xs font-semibold">${item.name}<i class="fa-solid fa-angle-right"></i></p>
          </li>
        `
    })
};

window.printSubSub = function (sub, subSub) {

    // Əvvəlki məlumatların təmizlənməsi 

    subSubCatSec.innerHTML = "";
    const obj = catData.find(item => item.name == sub);
    const subObj = obj.subCateg.find(item => item.name == subSub);

    subObj.subCateg.forEach(item => {
        subSubCatSec.innerHTML += `
            <li class="category cursor-pointer">
              <p class="flex  justify-between items-center px-2 py-2 text-xs font-semibold">${item}<i class="fa-solid fa-angle-right"></i></p>
          </li>
        `
    });
};

////////////////// Kateqoriya Div-nin açılıb bağlanması funksiyası 

window.handlePopup = function (status) {
    outset.style.display = status ? "block" : "none";
};

outset.addEventListener("click", (e) => {
    if (!popUp.contains(e.target)) {
        outset.style.display = "none";
    };
});

// Kitabların datadan götürülməsi 

async function getAllClassicsBooks() {
    try {
        booksData = await getAllBooks();
        printClassicBooks()
    } catch (error) {
        classicsBooksContainer.innerHTML = `<div class="text-center text-red-600">Xəta baş verdi</div>`
    };
};
getAllClassicsBooks();

const basketList = [];
window.addBasket = function(id) {
    const basketElement = booksData.find(item => item.id == id);
    basketList.push(basketElement);
    localStorage.setItem('basketList', JSON.stringify(basketList));
};


window.addFav = function(id) {
  const favList = JSON.parse(localStorage.getItem('favList')) || [];
  const favElement = booksData.find(item => item.id == id);
  const heartIcon = document.querySelector(`[onclick="addFav('${id}')"] img`);

  // Favorilərdə olduğunu yoxlamaq 

  const existingIndex = favList.findIndex(item => item.id == id);

  if (existingIndex !== -1) {
      // Artıq var silinsin 

      favList.splice(existingIndex, 1);
      heartIcon.style.filter = 'none'; // Normal ürək 
  } else {
    // Yoxdusa əlavə olunsun 

      favList.push(favElement);
      heartIcon.style.filter = 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)'; // Qırmızı ürək 
  };

  localStorage.setItem('favList', JSON.stringify(favList));
};

// Səhifə yüklənəndə heart Iconların yenilənməsi  

function updateHeartIcons() {
  const favList = JSON.parse(localStorage.getItem('favList')) || [];

  favList.forEach(favBook => {
  const heartIcon = document.querySelector(`[onclick="addFav('${favBook.id}')"] img`);
      if (heartIcon) {
          heartIcon.style.filter = 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)'; /// Qırmızı ürək 
      };
  });
};


function printClassicBooks() {
    booksData.forEach(book => {

        let originalPrice = parseFloat(book.price);
      let discountPercentage = 20;

      // Qiymət dəyəri mövcud və düzgündürsə , endirim tətbiq ediləcək

      let discountPrice = "N/A";
      if (!isNaN(originalPrice)) {
          discountPrice = (originalPrice - (originalPrice * discountPercentage / 100)).toFixed(2);
      };

        classicsBooksContainer.innerHTML += `
        <div class="w-56 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer book-card">
            <div class="relative">
            <div onclick="addFav('${book.id}')" class="absolute right-5 top-5 hidden heart-icon">
                    <img src="../assets/img/heart.png" class="w-5" />
                </div>
            </div>
                <div class="p-2">
                    <img src="${book.img}" alt=""  class="object-cover w-full rounded-t-md"/>
                </div>
            <div class="flex flex-col justify-between  space-y-5 py-5 px-5">
                <div class="space-y-2">
                <a href="../details.htm?id=${book.id}"  class="text-lg font-semibold hover:underline">${book.name}</a>
                </div>
                <button onclick="addBasket('${book.id}')" class="bg-[#ef3340] w-32 text-white px-3 py-1 rounded-full  text-sm hover:bg-red-700 transition-colors">Səbətə at</button>
                <div class="py-5">
                    <span class="font-semibold text-black px-2">${!isNaN(parseFloat(discountPrice)) ? discountPrice + "₼" : "N/A"}</span>
                    <span class="text-gray-400 line-through">${!isNaN(originalPrice) ? originalPrice + "₼" : "N/A"}</span>
                </div>
            </div>
        </div>
        `

    const bookCards = document.querySelectorAll('.book-card');

    bookCards.forEach(card => {
        // Hover zamanı heart ikonunu göstərmək
        card.addEventListener('mouseover', function() {
            const heartIcon = this.querySelector('.heart-icon');
            if (heartIcon) {
                heartIcon.classList.remove('hidden');
            };
        });
        
        // Mouse çıxdıqda heart ikonunu gizlətmək
        card.addEventListener('mouseleave', function() {
            const heartIcon = this.querySelector('.heart-icon');
            if (heartIcon) {
                heartIcon.classList.add('hidden');
            }
        });
    });
});

 updateHeartIcons()
};

// Sol Kateqoriya Div-inin doldurulması 

async function getLeftCategs() {
    try {
        catData = await getCategs()
        printLeftCateg()
    } catch (error) {
        leftCateg.innerHTML = `<div class="text-red-600 text-center">Xəta baş verdi </div>`;
    }
};
getLeftCategs();
function printLeftCateg() {
    catData.forEach(book => {
        leftCateg.innerHTML += `
            <p>${book.name}</p>
        `
    });
};

// Sol menyu birinci qutu 
async function createLeftCategoryMenu() {
    const div = document.getElementById("leftCateg");
    try {
        const cats = await (await fetch('https://libraff-db.onrender.com/Category')).json();
        div.innerHTML = `<h4 class="text-lg font-semibold py-4">Kateqoriyalar</h4>` + 
        cats.map(c => `
            <div onclick="toggle('${c.name}')" class="cursor-pointer p-2 hover:bg-gray-100">
                 ${c.name} <i class="fa fa-angle-right" id="i${c.name}"></i>
            </div>
            <div class="hidden ml-4" id="s${c.name}">
                  ${c.subCateg?.map(s => `
            <div onclick="toggleSub('${c.name}','${s.name}')" class="cursor-pointer p-1 text-sm hover:bg-gray-50">
                  ${s.name} ${s.subCateg ? `<i class="fa fa-angle-right" id="ii${c.name}${s.name}"></i>` : ''}
            </div>
                ${s.subCateg ? `<div class="hidden ml-4" id="ss${c.name}${s.name}">
                ${s.subCateg.map(ss => `<div class="p-1 text-xs text-gray-500 cursor-pointer">${ss}</div>`).join('')}
            </div>` : ''}
               `).join('') || ''}
            </div>
             `).join('');
    } catch{div.innerHTML = '<div class="text-red-500">Xəta</div>';}
};

window.toggle = (n) => {
    const s = document.getElementById(`s${n}`);
    const i = document.getElementById(`i${n}`);
    s.classList.toggle('hidden');
    i.className = s.classList.contains('hidden') ? 'fa fa-angle-right' : 'fa fa-angle-down';
};

window.toggleSub = (p,n) => {
    const ss = document.getElementById(`ss${p}${n}`);
    const ii = document.getElementById(`ii${p}${n}`);
    if(ss && ii) {
        ss.classList.toggle('hidden');
        ii.className = ss.classList.contains('hidden') ? 'fa fa-angle-right' : 'fa fa-angle-down';
    }
};
createLeftCategoryMenu();

async function getLanguagesData() {
    try {
        const langData = await getAllBooks();

    } catch (error) {
        filtersDİv.innerHTML = `<div class="text-center text-red-600">Xəta baş verdi</div>`;
    };
};
getLanguagesData()

// Sol Menyu Filterasiya Range Funskiyası 

// Elementlərin seçilməsi 
 const minRange = document.querySelector("#minRange");
 const maxRange = document.querySelector("#maxRange");
 const minPrice = document.querySelector("#minPrice");
 const maxPrice = document.querySelector("#maxPrice");
 const track = document.querySelector("#track");

 function updateTrack() {
    const min = parseInt(minRange.value);
    const max = parseInt(maxRange.value);

    // Min max dan böyük ola bilməz 

    if (min >= max) {
        if (minRange === document.activeElement) {
            minRange.value = max - 1;  
        }else {
            maxRange.value = min + 1;
        };
    };

    const minPercent = (minRange.value / minRange.max) * 100;
    const maxPercent = (maxRange.value / maxRange.max) * 100;
    
    track.style.left = minPercent + '%';
    track.style.width = (maxPercent - minPercent) + '%';

    minPrice.value = minRange.value;
    maxPrice.value = maxRange.value;
 };

 function updateRangeFromInput() {
        const min = parseInt(minPrice.value) || 0;
        const max = parseInt(maxPrice.value) || 130;

        // Həddlərin yoxlanması 
        if (min >= 0 && min <= 130 ) minRange.value = min;
        if (max >= 0 && max <= 130 ) maxRange.value = max;

        updateTrack();
 };

//  Event Listenerlərin əlavə olunması 

minRange.addEventListener('input', updateTrack);
maxRange.addEventListener('input', updateTrack);
minPrice.addEventListener('input', updateRangeFromInput);
maxPrice.addEventListener('input', updateRangeFromInput);

// İlk yükləmədə track-i təyin et

updateTrack();

// Ana ekrana qayıtmaq funksiyası 

window.goMainPage = function () {
    location.href = "../index.htm"
};


////////////////////// Page Up Funksiyası 

window.pagUp = function () {
    window.scrollTo({
        behavior: "smooth",
        top: 0
    });
};
