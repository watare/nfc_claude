import { useEffect, useState } from 'react';
import { useNFC } from '../../hooks/useNFC';

interface NFCSupportProps {
  onSupportChange?: (isSupported: boolean) => void;
  showDetails?: boolean;
  className?: string;
}

interface BrowserInfo {
  name: string;
  version: string;
  isSupported: boolean;
}

/**
 * Component to detect and display NFC support information
 * Shows compatibility status and requirements for Web NFC API
 */
export function NFCSupport({ onSupportChange, showDetails = true, className = '' }: NFCSupportProps) {
  const { isSupported, permissions, error } = useNFC();
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [isSecureContext, setIsSecureContext] = useState(false);
  const [platform, setPlatform] = useState<string>('unknown');

  // Detect browser and platform information
  useEffect(() => {
    const detectBrowser = (): BrowserInfo => {
      const userAgent = navigator.userAgent;
      const isChrome = /Chrome/.test(userAgent);
      const isAndroid = /Android/.test(userAgent);

      let name = 'Unknown';
      let version = '';
      let supported = false;

      if (isChrome && isAndroid) {
        name = 'Chrome for Android';
        const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
        version = chromeMatch ? chromeMatch[1] : '';
        supported = parseInt(version) >= 89;
      } else if (isChrome) {
        name = 'Chrome';
        const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
        version = chromeMatch ? chromeMatch[1] : '';
        supported = false; // Chrome on desktop doesn't support Web NFC
      } else {
        supported = false;
      }

      return { name, version, isSupported: supported };
    };

    const detectPlatform = (): string => {
      const userAgent = navigator.userAgent;
      if (/Android/.test(userAgent)) return 'Android';
      if (/iPhone|iPad|iPod/.test(userAgent)) return 'iOS';
      if (/Windows/.test(userAgent)) return 'Windows';
      if (/Mac/.test(userAgent)) return 'macOS';
      if (/Linux/.test(userAgent)) return 'Linux';
      return 'Unknown';
    };

    setBrowserInfo(detectBrowser());
    setPlatform(detectPlatform());
    setIsSecureContext(window.isSecureContext);
  }, []);

  // Notify parent component of support changes
  useEffect(() => {
    if (onSupportChange) {
      onSupportChange(isSupported);
    }
  }, [isSupported, onSupportChange]);

  const getStatusIcon = (supported: boolean) => {
    return supported ? (
      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    );
  };

  const getPermissionStatus = () => {
    if (!permissions) return 'Unknown';
    switch (permissions) {
      case 'granted':
        return 'Granted';
      case 'denied':
        return 'Denied';
      case 'prompt':
        return 'Will prompt';
      default:
        return 'Unknown';
    }
  };

  const getPermissionIcon = () => {
    if (!permissions) return null;
    switch (permissions) {
      case 'granted':
        return getStatusIcon(true);
      case 'denied':
        return getStatusIcon(false);
      case 'prompt':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (!showDetails) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {getStatusIcon(isSupported)}
        <span className={`text-sm ${isSupported ? 'text-green-700' : 'text-red-700'}`}>
          NFC {isSupported ? 'Supported' : 'Not Supported'}
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        {getStatusIcon(isSupported)}
        <h3 className="text-lg font-semibold text-gray-900">
          NFC Support Status
        </h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              {getStatusIcon(false)}
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-red-800">Error</h4>
              <p className="text-sm text-red-700">{error.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <span className="text-sm font-medium text-gray-700">Overall Status</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(isSupported)}
            <span className={`text-sm font-medium ${isSupported ? 'text-green-700' : 'text-red-700'}`}>
              {isSupported ? 'Supported' : 'Not Supported'}
            </span>
          </div>
        </div>

        {/* Browser Information */}
        {browserInfo && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <span className="text-sm font-medium text-gray-700">Browser</span>
            <div className="flex items-center space-x-2">
              {getStatusIcon(browserInfo.isSupported)}
              <span className="text-sm text-gray-600">
                {browserInfo.name} {browserInfo.version}
              </span>
            </div>
          </div>
        )}

        {/* Platform */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <span className="text-sm font-medium text-gray-700">Platform</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(platform === 'Android')}
            <span className="text-sm text-gray-600">{platform}</span>
          </div>
        </div>

        {/* Secure Context (HTTPS) */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <span className="text-sm font-medium text-gray-700">Secure Context (HTTPS)</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(isSecureContext)}
            <span className="text-sm text-gray-600">
              {isSecureContext ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        {/* Permissions */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <span className="text-sm font-medium text-gray-700">NFC Permission</span>
          <div className="flex items-center space-x-2">
            {getPermissionIcon()}
            <span className="text-sm text-gray-600">
              {getPermissionStatus()}
            </span>
          </div>
        </div>
      </div>

      {/* Requirements */}
      {!isSupported && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Requirements for NFC Support:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li className="flex items-center space-x-2">
              {getStatusIcon(platform === 'Android')}
              <span>Android device</span>
            </li>
            <li className="flex items-center space-x-2">
              {getStatusIcon(browserInfo?.name === 'Chrome for Android')}
              <span>Chrome for Android version 89 or later</span>
            </li>
            <li className="flex items-center space-x-2">
              {getStatusIcon(isSecureContext)}
              <span>HTTPS connection (secure context)</span>
            </li>
            <li className="flex items-center space-x-2">
              {getStatusIcon(permissions === 'granted')}
              <span>NFC permission granted by user</span>
            </li>
          </ul>
        </div>
      )}

      {/* Success Message */}
      {isSupported && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              {getStatusIcon(true)}
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-green-800">NFC Ready!</h4>
              <p className="text-sm text-green-700">
                Your device supports Web NFC API. You can now scan and write NFC tags.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}