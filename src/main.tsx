import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import GlobalStyles from './components/GlobalStyles/GlobalStyles.tsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'

createRoot(document.getElementById('root')!).render(
    <GlobalStyles>
        <Provider store={store}>
            <App />
        </Provider>
    </GlobalStyles>,
)
