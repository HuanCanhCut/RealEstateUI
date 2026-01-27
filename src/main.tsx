import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import App from './App.tsx'
import GlobalStyles from './components/GlobalStyles/GlobalStyles.tsx'
import { persistor, store } from './redux/store.ts'

createRoot(document.getElementById('root')!).render(
    <GlobalStyles>
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </GlobalStyles>,
)
