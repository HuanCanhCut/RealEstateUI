import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import 'moment/dist/locale/vi'
import 'tippy.js/dist/tippy.css'
import App from './App.tsx'
import GlobalStyles from './components/GlobalStyles/GlobalStyles.tsx'
import Toaster from './components/Sonner/Sonner.tsx'
import { persistor, store } from './redux/store.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 1000 * 60, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: false,
        },
    },
})

createRoot(document.getElementById('root')!).render(
    <GlobalStyles>
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <QueryClientProvider client={queryClient}>
                    <App />
                    <Toaster position="top-center" richColors duration={3000} />
                </QueryClientProvider>
            </PersistGate>
        </Provider>
    </GlobalStyles>,
)
