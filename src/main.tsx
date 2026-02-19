import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <StyleProvider layer>
            <ConfigProvider theme={{ zeroRuntime: true }}>
                <App />
            </ConfigProvider>
        </StyleProvider>
    </StrictMode>,
);
