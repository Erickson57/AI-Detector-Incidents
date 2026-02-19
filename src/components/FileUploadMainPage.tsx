import { InboxOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { VideoPlayer } from '@zezosoft/react-player';
import { Button, Card, Flex, message, Upload } from 'antd';
import Title from 'antd/es/typography/Title';
import type { RcFile } from 'antd/es/upload';
import { useRef, useState } from 'react';

const { Dragger } = Upload;
const availableFormats = ['video/mp4', 'video/webm', 'video/quicktime'];

export const FileUploadMainPage = () => {
    const [URLVideo, setURLVideo] = useState<string | undefined>(undefined);
    const refEnd = useRef(false);

    return (
        <Flex className="!p-[16px] !max-w-6xl !mx-auto" gap={32} vertical>
            <Flex align="center" vertical>
                <Title className="!text-[#f8fafc] !text-[60px]">AI Video Detector</Title>
                <Title className="!m-0 !text-mauve-300" level={2}>
                    Умный поиск инцидентов и хайлайтов в видео
                </Title>
            </Flex>
            <Card className="!bg-[#1e1e2ebb] !rounded-2xl !backdrop-blur-lg !shadow-[0_20px_50px_rgba(0,0,0,0.5)] !border !border-[#33334d]">
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

                            setURLVideo(URL.createObjectURL(file as RcFile));
                        }}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined className="!text-white/70" />
                        </p>
                        <p className="text-white text-2xl">Щелкните или перетащите файл в эту область для загрузки</p>
                        <p className="text-white text-base">Поддерживается однократная загрузка</p>
                        <p className="text-white text-base">
                            Прикрепить можно только одно видео формата MP4, WebM, MOV
                        </p>
                    </Dragger>
                    {URLVideo && (
                        <Flex gap={16} vertical>
                            <div className="[&_.with-gap]:bg-amber-900 [&_.video-player]:relative">
                                <VideoPlayer
                                    video={{
                                        src: URLVideo,
                                        startFrom: 0,
                                        showControls: true,
                                    }}
                                    style={{
                                        width: '800px',
                                        height: '800px',
                                    }}
                                    // features={{
                                    //     timeCodes: [
                                    //         { fromMs: 0, description: 'Introduction' },
                                    //         { fromMs: 130000, description: 'Exciting Scene' },
                                    //         { fromMs: 270000, description: 'Climax' },
                                    //     ],
                                    // }}
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
                            <Button
                                className="!bg-gradient-to-r from-[#965eff] to-[#cdadeb] 
                                !text-white !text-lg !font-bold !rounded-xl !border-[#33334d] 
                                !shadow-md  !transition-all !duration-200 !hover:shadow-[0_8px_25px_rgba(150,94,255,0.4)] !hover:scale-[1.02]"
                                size="large"
                                icon={<ThunderboltOutlined />}
                            >
                                Старт анализа видеоролика
                            </Button>
                        </Flex>
                    )}
                </Flex>
            </Card>
        </Flex>
    );
};
