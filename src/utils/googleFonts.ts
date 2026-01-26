// Popular Google Fonts to preload
export const POPULAR_FONTS = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Montserrat',
    'Poppins',
    'Lato',
    'Raleway',
    'Outfit',
    'Nunito',
    'Work Sans',
];

// Load Google Font dynamically
export const loadGoogleFont = (fontFamily: string, weights: number[] = [400, 700]) => {
    const weightsStr = weights.join(';');
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@${weightsStr}&display=swap`;
    link.rel = 'stylesheet';

    // Check if already loaded
    const existing = document.querySelector(`link[href*="${fontFamily.replace(' ', '+')}"]`);
    if (!existing) {
        document.head.appendChild(link);
    }
};

// Preload popular fonts
export const preloadPopularFonts = () => {
    POPULAR_FONTS.forEach(font => loadGoogleFont(font));
};
