import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import GlobalStyles from './components/GlobalStyles/GlobalStyles.tsx'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.ts'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')!).render(
    <GlobalStyles>
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </GlobalStyles>,
)
