import {  useRef, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { VideoPlayer } from '@zezosoft/react-player';
import { Card, Flex, message, Upload } from 'antd';
import Title from 'antd/es/typography/Title';
import type { RcFile } from 'antd/es/upload';
import { LoadingComponent } from './LoadingComponent';
import { useGetCheckedHealthLLM } from '../hooks/getCheckedHealthLLM';
import { usePostAnalyzeVideo } from '../hooks/postAnalyzeVideo';
import classNames from 'classnames';

const { Dragger } = Upload;
const availableFormats = ['video/mp4', 'video/webm', 'video/quicktime'];

export const FileUploadMainPage = () => {
    const [URLVideo, setURLVideo] = useState<string | undefined>(undefined);
    const refEnd = useRef(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const { isLoading, isError } = useGetCheckedHealthLLM();
    const {
        mutate: postAnalyzeVideo,
        data: dataAnalyze,
        isPending: isloadPostAnalyze,
        isError: isErrorPostAnalyze,
    } = usePostAnalyzeVideo();

    const timeLinesMns = dataAnalyze?.timeline.map((timeItem, index) => {
        if (index === dataAnalyze.timeline.length - 1 && timeItem.timestamp_sec >= dataAnalyze.metadata.duration_sec) {
            return {
                fromMs: Math.round(dataAnalyze.metadata.duration_sec * 1000),
                description: timeItem.caption,
            };
        }

        return {
            fromMs: Math.round(timeItem.timestamp_sec * 1000),
            description: timeItem.caption,
        };
    });

    return (
        <Flex className="!p-[16px] !max-w-6xl !mx-auto" gap={32} vertical>
            <Flex align="center" vertical>
                <Title className="!text-[#f8fafc] !text-[60px]">AI Video Detector</Title>
                <Title className="!m-0 !text-mauve-300" level={2}>
                    Умный поиск инцидентов и хайлайтов в видео
                </Title>
            </Flex>
            <LoadingComponent isLoading={isLoading} isError={isError}>
                <Card className="!bg-[#1e1e2ebb] !rounded-2xl !backdrop-blur-lg !shadow-[0_20px_50px_rgba(0,0,0,0.5)] !border !border-[#33334d]">
                    <LoadingComponent
                        pendingTip="Загрузка и анализ видеоролика"
                        isLoading={isloadPostAnalyze}
                        isError={isErrorPostAnalyze}
                    >
                        <Flex gap={16} vertical>
                            <Dragger
                                maxCount={1}
                                showUploadList={false}
                                beforeUpload={() => false}
                                onChange={(info) => {
                                    const { file } = info;
                                    const { status } = file;

                                    const isVideo = availableFormats.includes(file.type || '');

                                    if (!isVideo) {
                                        message.error(`${file.name} is not a video file`);
                                        return;
                                    }

                                    if (status === 'done') {
                                        message.success(`${info.file.name} file uploaded successfully.`);
                                    } else if (status === 'error') {
                                        message.error(`${info.file.name} file upload failed.`);
                                    }

                                    postAnalyzeVideo(file as RcFile);
                                    setURLVideo(URL.createObjectURL(file as RcFile));
                                }}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined className="!text-white/70" />
                                </p>
                                <p className="text-white text-2xl">
                                    Щелкните или перетащите файл в эту область для загрузки
                                </p>
                                <p className="text-white text-base">Поддерживается однократная загрузка</p>
                                <p className="text-white text-base">
                                    Прикрепить можно только одно видео формата MP4, WebM, MOV
                                </p>
                            </Dragger>
                            {URLVideo && (
                                <Flex gap={16} vertical>
                                    <div
                                        className={classNames('[&_.video-player]:relative')}
                                    >
                                        <VideoPlayer
                                            video={{
                                                src: URLVideo,

                                                showControls: true,
                                            }}
                                            style={{
                                                width: '800px',
                                                height: '800px',
                                            }}
                                            features={{
                                                timeCodes: timeLinesMns
                                                    ? [{ fromMs: 0, description: 'Нет событий' }].concat(timeLinesMns)
                                                    : [],
                                            }}
                                            events={{
                                                onClose: () => {
                                                    if (refEnd.current) {
                                                        refEnd.current = false;
                                                    } else {
                                                        setURLVideo(undefined);
                                                    }
                                                },
                                                onEnded: () => (refEnd.current = true),
                                            }}
                                        />
                                    </div>
                                    {dataAnalyze?.events && (
                                        <Flex gap={16} vertical>
                                            <Title className="!text-[#f8fafc] " level={3}>
                                                События (хайлайты):
                                            </Title>
                                            <Flex gap={8}>
                                                {dataAnalyze.events.map((event) => (
                                                    <Card
                                                        className="!w-[200px] !cursor-pointer"
                                                        key={event.description}
                                                        onClick={() => {
                                                            videoRef.current = document.querySelector('video');
                                                            if (videoRef.current) {
                                                                videoRef.current.currentTime =
                                                                    event.highlight_start_sec;
                                                            }
                                                        }}
                                                    >
                                                        {event.description.slice(0, 100)}...
                                                    </Card>
                                                ))}
                                            </Flex>
                                        </Flex>
                                    )}
                                </Flex>
                            )}
                        </Flex>
                    </LoadingComponent>
                </Card>
            </LoadingComponent>
        </Flex>
    );
};
