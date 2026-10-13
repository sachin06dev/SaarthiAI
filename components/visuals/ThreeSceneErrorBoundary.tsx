'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { SaarthiHeroFallback } from './SaarthiHeroFallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage?: string;
}

export class ThreeSceneErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('SaarthiAI 3D Scene safely caught and degraded to CSS fallback:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <SaarthiHeroFallback />;
    }

    return this.props.children;
  }
}
