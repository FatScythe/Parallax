import './style.css';

// IMAGE SLIDER
const slideBtns = document.querySelectorAll('[data-SlideBtn]');
const sliderContainer = document.querySelector('[data-SlideContainer]');
const slides = [...document.querySelectorAll('[data-Slide]')];
let currentIndex = 0;
let isMoving = false;
const lastSlide = slides.length - 1;
const sliderImages = document.querySelectorAll('[data-Slide] img');

const handleSlideBtnClick = (e) => {
    if(isMoving) return;
    isMoving = true;
    e.target.id === "prev" ? currentIndex-- : currentIndex++;
    sliderContainer.dispatchEvent(new Event("Slidermove"));
}

const removeDisabledAttribute = (els) => els.forEach(el => {
    el.removeAttribute("disabled");
});

const addDisabledAttribute = (els) => els.forEach(el => {
    el.setAttribute("disabled", "true");
});


slideBtns.forEach(btn => btn.addEventListener('click', handleSlideBtnClick));

sliderContainer.addEventListener("Slidermove", () => {
    sliderContainer.style.transform = `translateX(-${currentIndex * slides[0].clientWidth}px)`;
    removeDisabledAttribute(slideBtns);
    currentIndex === 0 && addDisabledAttribute([slideBtns[0]]);
    // Easy fix but not good on all screen size
    // currentIndex === lastSlide && addDisabledAttribute([slideBtns[1]]);
    // sliderImages[currentIndex].classList.toggle("animate");
});

// makes slide transition smooth
sliderContainer.addEventListener("transitionend", () =>  isMoving = false);

// makes images undragabble
sliderImages.forEach(img => img.ondragstart = () => false);

const slideObserver = new IntersectionObserver((slide) => {
    // console.log(slide[0])
    if(slide[0].isIntersecting) {
        addDisabledAttribute([slideBtns[1]]);
    }
}, {threshold : .75});

slideObserver.observe(slides[lastSlide]);

// FORM HANDLE
const contactForm = document.querySelector('#contact-form');
const contactBtn = document.querySelector('#contact-btn');
const contactInput = document.querySelector('#email');

const postInfo = (email) => {
    console.info(email);
    return new Promise(resolve => setTimeout(resolve, 2500));
}

const contactBtnOptions = {
    pending: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 animate-spin">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>


    <span class="uppercase tracking-wide animate-pulse">Sending...</span>
    `,
    success: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
    </svg>
    <span class="uppercase tracking-wide">thank you!</span>`
}

const handleFormSubmit = async (e) => {
    e.preventDefault();
    addDisabledAttribute([contactBtn, contactForm]);
    contactBtn.innerHTML = contactBtnOptions.pending;
    contactInput.style.display = "none";
    const userEmail = contactInput.value;
    await postInfo(userEmail);
    contactBtn.innerHTML = contactBtnOptions.success;
}

contactForm.addEventListener('submit', handleFormSubmit);

// FADE IN SECTION
const fadeUpObserverCallback = (elstowatch) => {
    elstowatch.forEach(el => {
        if(el.isIntersecting) {
            el.target.classList.add('faded');
            fadeUpObserver.unobserve(el.target);
            el.target.addEventListener('transitionend', () => {
                el.target.classList.remove('fade-up', 'faded');
            }, { once: true })
        }
    });
}

const fadeUpObserverOptions = (elstowatch) => {
    threshold: .10;
}

const fadeUpObserver = new IntersectionObserver(fadeUpObserverCallback, fadeUpObserverOptions);

document.querySelectorAll('.fade-up').forEach((item) => {
    fadeUpObserver.observe(item);
});