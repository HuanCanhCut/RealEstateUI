import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import GlobalStyles from './components/GlobalStyles/GlobalStyles.tsx'

createRoot(document.getElementById('root')!).render(
    <GlobalStyles>
        <App />
    </GlobalStyles>,
)
