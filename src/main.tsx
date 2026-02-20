import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoadingFallback } from './components/LoadingFallback';
import './styles.css';

const App = lazy(() => import('./App'));

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
                    <Suspense fallback={<LoadingFallback/>}>
                        <App /> 
                    </Suspense>
                </ConfigProvider>
            </StyleProvider>
        </QueryClientProvider>
    </StrictMode>,
);
