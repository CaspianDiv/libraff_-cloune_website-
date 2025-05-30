import { getAllBooks } from "./service.js";

// Dəyişənlərin təyin olunması 
let booksData = [];
const bookDetCard = document.querySelector("#bookDetCard");
const detCardBottom = document.querySelector("#detCardBottom");
const detCardContent = document.querySelector("#detCardContent");
const logDiv = document.querySelector("#logDiv");
let isOpen = false;
const basketDiv = document.querySelector("#basketDiv");
const closeBasket = document.querySelector("#closeBasket");
const detCardProperties = document.querySelector("#detCardProperties");
const commentSec = document.querySelector("#commentSec");
const breadCrumbs = document.querySelector("#breadCrumbs");
const breadCrumbs2 = document.querySelector("#breadCrumbs2");

const queryString = location.search;
const id = new URLSearchParams(queryString).get("id");
console.log(id);



// Bütün Kitab Məlumatların Alınması 

async function getBooksData() {
    try {
        booksData = await getAllBooks();
        console.log(booksData);
        printDetCard()
    } catch (error) {
        console.error(error.message);
    }
};
getBooksData();


function printDetCard() {
    const book = booksData.find(item => item.id == id);
    let originalPrice = parseFloat(book.price);
    let discountPercentage = 20;


    // Qiymət dəyəri mövcud və düzgündürsə , endirim tətbiq ediləcək


    let discountPrice = "N/A";
    if (!isNaN(originalPrice)) {
        discountPrice = (originalPrice - (originalPrice * discountPercentage / 100)).toFixed(2);
    };
    breadCrumbs.innerHTML = `
        <span> / ${book.category}</span>
    `
    breadCrumbs2.innerHTML = `
        <span> / ${book.subcategory}</span>
    `
    bookDetCard.innerHTML = `
            <div class="bg-[#F6F6F8] px-10 w-[60vw] rounded-xl">
                <img src="${book.img}" class="m-auto" />
            </div>
            <div class="w-[40vw]">
                <h3 class="p-[20px_0_0_0] text-[2rem]">${book.name}</h3>
                <p class="text-gray-400 py-3 font-semibold">${book.author}</p>
                <p class="text-[1.8rem] font-semibold">${!isNaN(parseFloat(discountPrice)) ? discountPrice + "₼" : "N/A"}</p>
                <div class="flex gap-x-2 p-[10px_0]">
                    <p class="line-through text-gray-400 font-semibold text-lg">${!isNaN(originalPrice) ? originalPrice + "₼" : "N/A"}</p>
                    <p class="text-white font-semibold bg-[#ef3340] w-[10%] text-center rounded-lg">-20%</p>
                </div>
                <div class="text-center text-white font-semibold p-[40px_0]">
                    <button class="bg-[#ef3340] hover:bg-[rgba(255,0,0,0.7)] w-full py-2 px-2 rounded-full">
                        <i class="fa-solid fa-bag-shopping"></i>
                        <span class="px-2 text-lg">Səbətə əlavə et</span>
                    </button>
                </div>
                <div class="flex justify-between gap-x-5">
                    <div class="flex items-center gap-x-3 text-gray-400 font-semibold hover:text-[#ef3340] cursor-pointer">
                        <i class="fa-regular fa-heart" title="Seçilmiş məhsulların siyahısına əlavə edin"></i>
                        <p>Seçilmiş</p>
                    </div>
                    <div class="flex gap-x-3 items-center text-gray-400 font-semibold hover:text-[#ef3340] cursor-pointer">
                        <i class="fa-regular fa-message"></i>
                        <p>Sizə necə kömək edə bilərik?</p>
                    </div>
                </div>
                <h5 class="py-5 text-xl font-semibold">Çatdırılma haqqında</h5>
                <p class="text-[#738196]">Bakı şəhər üçün təxmini müddət və qiymətlər.</p>
                <p class="py-5 text-[#738196]">
                    <i class="fa-solid fa-shop text-[#475569]"></i>
                    Mağazadan təhvil alma  — <span class="font-bold">pulsuz.</span>
                </p>
                <p class="text-[#738196]">
                    <i class="fa-solid fa-truck text-[#738196]"></i>
                    Kuryer ilə — operator təsdiqindən sonra <span class="font-bold">24 saat ərzində </span> .
                    30 AZN  və yuxarı sifarişlərdə — <span  class="font-bold"> pusluz </span> .
                </p>
                <hr class="m-[10px_0] border-dashed bg-[#738196]" />
                <p class="text-[#738196]">Bölgələrə çatdırılma <span class="font-semibold">3-5 iş günü </span>ərzində</p>
            </div>
    `

    detCardBottom.innerHTML = `
        <div class="text-xl font-semibold">
            <p class="border-b-4 border-b-[#ef3340] py-2 cursor-pointer" onclick="showContent()" id="border_bottom">Təsvir</p>
        </div>
        <div class="text-xl font-semibold text-[#738196]">
            <p class="cursor-pointer hover:text-black py-2" onclick="showProperty()" id="detProp">Xüsusiyyət</p>
        </div>
        <div class="text-xl font-semibold text-[#738196]">
            <p class="cursor-pointer hover:text-black" onclick="showComments()" id="commentBlock">İstifadəçi rəyləri</p>
        </div>
    `;
    showContent();
};


// Xüsusiyyətlər bölməsinin görsənməsi işləməsi funksiyası 

window.showProperty = function() {
    detCardContent.innerHTML = "";
    commentSec.innerHTML = ""
    const border_bottom = document.querySelector("#border_bottom");
    border_bottom.style.borderBottom = "none"
    border_bottom.style.color = "gray"
    const detProp = document.querySelector("#detProp");
    detProp.style.borderBottom = "4px solid #ef3340";
    detProp.style.color = "black";
    const commentBlock = document.querySelector("#commentBlock");
    commentBlock.style.borderBottom = "none"
    commentBlock.style.color = "gray";
    const book = booksData.find(item => item.id == id);
    console.log(book);
    detCardProperties.innerHTML = `
        <div class="container flex xl:flex-row lg:flex-row md:flex-col sm:flex-col nm:flex-col ex-sm:flex-col ts:flex-col dl:flex-col gap-y-5  justify-around items-center mx-auto">
            <div class="space-y-3">
                <p> <span class="text-gray-400 font-semibold">Cild</span><span class="text-gray-300">.....................................</span> ${book.feature.cild}</p>
                <p><span class="text-gray-400 font-semibold">Dil</span> <span class="text-gray-300">.....................................</span> ${book.feature.dil}</p>
                <p><span class="text-gray-400 font-semibold">Müəllif</span><span class="text-gray-300">.....................................</span> ${book.feature.müəllif}</p>
            </div>
            <div class="space-y-3">
                <p><span class="text-gray-400 font-semibold">Nəşriyyat</span><span class="text-gray-300">.....................................</span> ${book.feature.nəşriyyat}</p>
                <p><span class="text-gray-400 font-semibold">Səhifə sayı</span><span class="text-gray-300">.....................................</span> ${book.feature.səhifə}</p>
            </div>
        </div>
    `
};

// Təsvir bölməsinin işləmə görsənməsi funksiyası 

window.showContent = function() {
        detCardProperties.innerHTML = "";
        commentSec.innerHTML = "";
        const border_bottom = document.querySelector("#border_bottom");
        border_bottom.style.borderBottom = "4px solid #ef3340 "
        border_bottom.style.color = "black"
        const detProp = document.querySelector("#detProp");
        detProp.style.borderBottom = "none";
        detProp.style.color = "gray";
        const commentBlock = document.querySelector("#commentBlock");
        commentBlock.style.borderBottom = "none"
        commentBlock.style.color = "gray";
        const book = booksData.find(item => item.id == id);
        detCardContent.innerHTML = `
        <div class="w-[80%] mx-auto">
            <p>
                ${book.content}
            </p>
        </div>
    `
};

// Şərhlər bölməsinin görsənməsi işləməsi funksiyası 

window.showComments = function() {
    detCardProperties.innerHTML = "";
    detCardContent.innerHTML = "";
    const book = booksData.find(item => item.id == id);
    const commentBlock = document.querySelector("#commentBlock");
    commentBlock.style.borderBottom = "4px solid #ef3340"
    commentBlock.style.color = "black";
    const detProp = document.querySelector("#detProp");
    detProp.style.borderBottom = "none";
    detProp.style.color = "gray";
    commentSec.innerHTML = `
        <div class="bg-[#f5f5f7] p-5 rounded-xl">
            <div class="text-center">
                <h4 class="font-semibold text-lg">Məhsul haqqında rəy yazın</h4>
                <p class="py-1 my-2">Fikirlərinizi digər istifdəçilərlə bölüşün</p>
                <button class="text-white font-semibold text-lg px-2 py-2 rounded-full bg-[#000]">Rəy yaz</button>
            </div>
        </div>
    `
};
////////////////////// Page Up Funksiyası 

window.pagUp = function () {
    window.scrollTo({
        behavior: "smooth",
        top: 0
    });
};


// Go Home
window.homePage = function() {
    window.location.href = "index.htm";
};
// Ana ekrana qayıtmaq funksiyası logoya basanda !!

window.goMainPage = function() {
    location.href = "../index.htm"
}

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