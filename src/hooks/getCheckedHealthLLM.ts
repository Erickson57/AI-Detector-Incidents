import { useQuery, type UseQueryResult } from '@tanstack/react-query';

type GetCheckedHealthLLM = {
    status: string;
    vllm: string;
};

const fetchHealth = async () => {
    const response = await fetch('http://45.80.129.209:9011/health');

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};

export const useGetCheckedHealthLLM = (): UseQueryResult<GetCheckedHealthLLM> => {
    return useQuery({
        queryKey: ['health'],
        queryFn: fetchHealth,
    });
};
