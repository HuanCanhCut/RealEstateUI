import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import 'moment/dist/locale/vi'
import 'tippy.js/dist/tippy.css'
import App from './App.tsx'
import GlobalStyles from './components/GlobalStyles/GlobalStyles.tsx'
import Toaster from './components/Sonner/Sonner.tsx'
import { queryClient } from './lib/queryClient.tsx'
import { persistor, store } from './redux/store.ts'
import { QueryClientProvider } from '@tanstack/react-query'

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
