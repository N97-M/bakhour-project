import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import OnboardingPopup from '@/components/ui/OnboardingPopup';
import './globals.css';

export const metadata = {
    title: 'Al Dalal Bakhour – Premium Sudanese Incense',
    description: 'Experience the pinnacle of Sudanese luxury incense. Al Dalal Bakhour – where heritage meets modern elegance.',
    keywords: 'premium sudanese bakhour, luxury arabian incense, traditional incense online, authentic sudanese fragrance',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* eslint-disable-next-line @next/next/no-page-custom-font */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <LanguageProvider>
                    <CartProvider>
                        {children}
                        <OnboardingPopup />
                    </CartProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}
