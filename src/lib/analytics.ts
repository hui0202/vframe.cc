"use client";

import * as amplitude from '@amplitude/analytics-browser';

// 定义事件类型 - 只保留核心事件
export interface AnalyticsEvent {
  // 页面相关事件
  page_viewed: {
    page_name: string;
    page_path: string;
  };
  
  // 用户交互事件
  button_clicked: {
    button_name: string;
    page_name: string;
    location: string;
  };
  
  // 视频处理事件
  video_uploaded: {
    file_name: string;
  };
  
  video_upload_failed: {
    error_message: string;
  };
  
  // 帧提取事件
  frame_extraction_started: {
    extraction_strategy: string;
  };
  
  frame_extraction_completed: {
    extraction_strategy: string;
    frames_extracted: number;
  };
  
  frame_extraction_failed: {
    extraction_strategy: string;
    error_message: string;
  };
  
  frames_downloaded: {
    frames_count: number;
    extraction_strategy: string;
  };
  
  // 插帧事件
  interpolation_started: {
    is_demo: boolean;
  };
  
  interpolation_completed: {
    is_demo: boolean;
  };
  
  interpolation_failed: {
    error_message: string;
    is_demo: boolean;
  };
  
  interpolated_video_downloaded: {
    is_demo: boolean;
  };
}

// 类型安全的事件追踪函数
export function trackEvent<T extends keyof AnalyticsEvent>(
  eventName: T,
  properties: AnalyticsEvent[T]
): void {
  try {
    // 添加通用属性
    const eventProperties = {
      ...properties,
      timestamp: new Date().toISOString(),
    };
    
    amplitude.track(eventName, eventProperties);
    
    // 开发环境下打印事件日志
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Analytics Event: ${eventName}`, eventProperties);
    }
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

// 页面浏览追踪
export function trackPageView(pageName: string, pagePath: string): void {
  trackEvent('page_viewed', {
    page_name: pageName,
    page_path: pagePath,
  });
}

// 按钮点击追踪
export function trackButtonClick(buttonName: string, pageName: string, location: string): void {
  trackEvent('button_clicked', {
    button_name: buttonName,
    page_name: pageName,
    location: location,
  });
}