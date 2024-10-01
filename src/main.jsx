import { createRoot } from 'react-dom/client'
import './index.css'
import Root from './router/index.jsx'
import './reset.css'
import '../src/i18n.js'
createRoot(document.getElementById('root')).render(
  <Root />
)