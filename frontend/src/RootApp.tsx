import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import App from '@/App.tsx';
import { UserProvider } from '@/Context/UserContext.tsx';
import i18n from './I18N/i18n';

const RootApp = () => {
    const [isI18nInitialized, setIsI18nInitialized] = useState(i18n.isInitialized);

    useEffect(() => {
        if (!isI18nInitialized) {
            const onInitialized = () => {
                setIsI18nInitialized(true);
            };

            i18n.on('initialized', onInitialized);

            return () => {
                i18n.off('initialized', onInitialized);
            };
        }
    }, [isI18nInitialized]);

    if (!isI18nInitialized) {
        return (
            <div className="flex justify-center items-center h-screen text-lg text-neutral-800 dark:text-neutral-100">
                Loading translations...
            </div>
        );
    }

    return (
        <I18nextProvider i18n={i18n}>
            <UserProvider>
                <App />
            </UserProvider>
        </I18nextProvider>
    );
};

export default RootApp;