
document.addEventListener('DOMContentLoaded', function ()
{
    // Hero Slider Implementation
    const sliderTrack = document.querySelector('.slider-track-inner');
    const slides = document.querySelectorAll('.slider-track-inner .slide');
    const prevButton = document.querySelector('.slider-prev');
    const nextButton = document.querySelector('.slider-next');

    let currentIndex = 0;
    const slidesCount = slides.length;

    function updateSlider()
    {
        sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function nextSlide()
    {
        currentIndex = (currentIndex + 1) % slidesCount;
        updateSlider();
    }

    function prevSlide()
    {
        currentIndex = (currentIndex - 1 + slidesCount) % slidesCount;
        updateSlider();
    }

    if (prevButton && nextButton)
    {
        prevButton.addEventListener('click', prevSlide);
        nextButton.addEventListener('click', nextSlide);
        setInterval(nextSlide, 3000);
    }
    function initializeAllSliders()
    {
        document.querySelectorAll('.slide_product').forEach(slider =>
        {
            initializeProductSlider(slider);
        });
    }

    // Product Sliders Implementation
    function initializeProductSlider(slider)
    {
        const track = slider.querySelector('.products');
        const items = track.querySelectorAll('.product');
        const prevBtn = slider.querySelector('.slider-prev');
        const nextBtn = slider.querySelector('.slider-next');

        let currentPosition = 0;
        const itemCount = items.length;
        const itemsPerView = getItemsPerView(); // Dynamically get items per view based on screen size
        // Calculate max position to prevent white space at the end
        const maxPosition = Math.max(0, itemCount - itemsPerView);

        function getItemsPerView()
        {
            if (window.innerWidth <= 500) return 1;
            if (window.innerWidth <= 768) return 2;
            if (window.innerWidth <= 1024) return 3;
            return 4;
        }

        function updateSlider()
        {
            // Calculate the pixel amount to move based on card width
            // Using fixed width (220px) + gap (10px) for smooth movement
            const moveAmount = currentPosition * 230; // 220px card + 10px gap
            track.style.transform = `translateX(-${moveAmount}px)`;
        }

        function nextSlide()
        {
            currentPosition++;
            if (currentPosition >= maxPosition)
            {
                // Loop back to start with a smooth transition
                currentPosition = 0;
                track.style.transition = 'none';
                updateSlider();
                setTimeout(() =>
                {
                    track.style.transition = 'transform 0.5s ease-in-out';
                }, 10);
            } else
            {
                updateSlider();
            }
        }

        function prevSlide()
        {
            currentPosition--;
            if (currentPosition < 0)
            {
                // Loop to end with a smooth transition
                currentPosition = maxPosition - 1;
                track.style.transition = 'none';
                updateSlider();
                setTimeout(() =>
                {
                    track.style.transition = 'transform 0.5s ease-in-out';
                }, 10);
            } else
            {
                updateSlider();
            }
        }

        // Set initial styles
        track.style.display = 'flex';
        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.width = `${(itemCount * 100) / itemsPerView}%`;

        items.forEach(item =>
        {
            item.style.flex = '0 0 auto';
            item.style.width = '220px';
            item.style.minWidth = '220px';
            item.style.maxWidth = '260px';
        });

        // Add event listeners
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Add auto-sliding functionality
        let autoSlideInterval;

        function startAutoSlide()
        {
            autoSlideInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
        }

        function stopAutoSlide()
        {
            clearInterval(autoSlideInterval);
        }

        // Start auto-sliding
        startAutoSlide();

        // Pause auto-sliding when hovering over the slider
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);

        // Handle window resize
        window.addEventListener('resize', () =>
        {
            const newItemsPerView = getItemsPerView();
            if (newItemsPerView !== itemsPerView)
            {
                location.reload(); // Refresh the page to reinitialize sliders with new layout
            }
        });

        // Initial position
        updateSlider();
    }

    document.addEventListener('DOMContentLoaded', function ()
    {
        // Hero Slider Implementation
        const sliderTrack = document.querySelector('.slider-track-inner');
        const slides = document.querySelectorAll('.slider-track-inner .slide');
        const prevButton = document.querySelector('.slider-prev');
        const nextButton = document.querySelector('.slider-next');

        let currentIndex = 0;
        const slidesCount = slides.length;

        function updateSlider()
        {
            if (sliderTrack)
            {
                sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            }
        }

        function nextSlide()
        {
            currentIndex = (currentIndex + 1) % slidesCount;
            updateSlider();
        }

        function prevSlide()
        {
            currentIndex = (currentIndex - 1 + slidesCount) % slidesCount;
            updateSlider();
        }

        if (prevButton && nextButton)
        {
            prevButton.addEventListener('click', prevSlide);
            nextButton.addEventListener('click', nextSlide);
            setInterval(nextSlide, 3000);
        }

        // Note: We don't initialize product sliders here anymore
        // They will be initialized after products are loaded
    });

    // Modify your fetch code in the original file to call initializeAllSliders after all products are loaded
    fetch('../products.json')
        .then(response => response.json())
        .then(data =>
        {
            const products = data.products;
            const cart = JSON.parse(localStorage.getItem('cart')) || [];

            const swiper_items_sale = document.getElementById("swiper_items_sale");
            const swiper_elctronics = document.getElementById("swiper_elctronics");
            const swiper_appliances = document.getElementById("swiper_appliances");
            const swiper_mobiles = document.getElementById("swiper_mobiles");

            // Populate all product sections...

            // After all products are loaded and populated
            // Initialize all sliders only once
            initializeAllSliders();

            // Add click handlers after populating products
            // addDirectClickHandlers();

            // Initialize cart display
            updateCartDisplay();
        })
        .catch(error =>
        {
            console.error('Error loading products:', error);
        });

}); 