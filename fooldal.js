const eldenCarousel = document.getElementById('eldenRingCarousel');

    eldenCarousel.addEventListener('slid.bs.carousel', function (event) {
        const activeIndex = event.to;

        document.querySelectorAll('.build-content').forEach(build => {
            build.classList.add('d-none');
        });

        const activeBuild = document.getElementById(`build-${activeIndex}`);
        if (activeBuild) {
            activeBuild.classList.remove('d-none');
        }
    });