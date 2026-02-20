import { Spin } from 'antd';
import type { SpinProps, SpinSize } from 'antd/es/spin';
import React, { type JSX, type ReactNode } from 'react';
import classNames from 'classnames';

type SpinIndicator = SpinProps['indicator'];
export interface LoadingComponentProps {
    pendingClassName?: string;
    pendingSize?: SpinSize;
    pendingTip?: string;
    pendingIndicator?: SpinIndicator;
    pendingSpinning?: boolean;
    pendingWrapperClassName?: string;
    isError?: boolean;
    isRender?: boolean;
    errorTip?: string;
    emptyImage?: ReactNode;
    emptyDescription?: ReactNode;
    children?: React.ReactNode;
    isLoading?: boolean;
    prefixCls?: string;
    style?: React.CSSProperties;
}

const spinClassName = '!block !text-center';

export const LoadingComponent = ({
    pendingClassName,
    pendingSize = 'large',
    pendingTip = 'Загрузка данных',
    pendingIndicator,
    pendingWrapperClassName,
    isError,
    errorTip = 'Ошибка загрузки данных',
    children,
    isLoading = false,
    prefixCls,
    style,
    isRender = true,
}: LoadingComponentProps): JSX.Element | null => {
    if (isError) {
        return (
            <div className="!block !text-center !text-3xl mt-14" style={style}>
                <p className="!text-red-500 !mt-xs">{errorTip}</p>
            </div>
        );
    }
    return (
        <div className={classNames(isLoading && spinClassName, pendingWrapperClassName)} style={style}>
            <Spin
                tip={pendingTip}
                spinning={isLoading}
                indicator={pendingIndicator}
                prefixCls={prefixCls}
                className={pendingClassName}
                size={pendingSize}
            >
                {isRender && <div className="!text-left">{children}</div>}
            </Spin>
        </div>
    );
};
