import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import App from './App.tsx'
import GlobalStyles from './components/GlobalStyles/GlobalStyles.tsx'
import Toaster from './components/Sonner/Sonner.tsx'
import { persistor, store } from './redux/store.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

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
