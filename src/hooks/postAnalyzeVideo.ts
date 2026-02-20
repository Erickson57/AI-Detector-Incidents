import { useMutation, type UseMutationResult } from '@tanstack/react-query';

type Event = {
    description: string;
    event_type: string;
    has_event: boolean;
    interval_start_sec: number;
    interval_end_sec: number;
    highlight_start_sec: number;
    highlight_end_sec: number;
};

type TimeLine = {
    caption: string;
    event_type: string;
    has_event: boolean;
    interval_end_sec: number;
    label: string;
    risk_score: number;
    timestamp_sec: number;
    window_idx: number;
};

type Metadata = {
    duration_sec: number;
    num_frames: number;
    num_windows: number;
};

type VideoWindowData = {
    events: Event[];
    has_event: boolean;
    inferred_domain: string;
    metadata: Metadata;
    status: string;
    timeline: TimeLine[];
};

type mutationValue = string | Blob;

const uploadVideo = async (file: string | Blob) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://45.80.129.209:9011/analyze_video', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка при загрузке видео');
    }

    return response.json();
};

export const usePostAnalyzeVideo = (): UseMutationResult<VideoWindowData, unknown, mutationValue, () => unknown> =>
    useMutation({
        mutationFn: uploadVideo,
        onSuccess: (data) => {
            console.log('Видео успешно загружено:', data);
        },
        onError: (error) => {
            console.error('Ошибка загрузки:', error);
        },
    });
