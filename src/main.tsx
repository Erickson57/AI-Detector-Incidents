import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import App from './App';
import './styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 0,
            staleTime: 0,
        },
    },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <StyleProvider layer>
                <ConfigProvider theme={{ zeroRuntime: true }}>
                    <App />
                </ConfigProvider>
            </StyleProvider>
        </QueryClientProvider>
    </StrictMode>,
);
